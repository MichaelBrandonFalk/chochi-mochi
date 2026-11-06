"""Six original storybook chamber pieces. Scores, synthesis and recordings: CC0 1.0.
No sampled instruments or borrowed compositions. Developer tools: numpy and ffmpeg.
Run from the repository root. Existing recordings are preserved.
"""
from pathlib import Path
import hashlib, json, math, subprocess, tempfile, wave
import numpy as np
RATE = 24000
# slug, title, description, tonic, tempo, meter, melody voice, accompaniment voice
PIECES = [
 ('teacup-two-step','Teacup Two-Step','Soft piano · a small, cheerful dance',48,76,2,'piano','piano'),
 ('paper-boats','Paper Boats','Warm clarinet and harp · a rocking boat song',53,66,4,'clarinet','harp'),
 ('pebble-waltz','Pebble Waltz','Harp and plucked strings · a light woodland waltz',50,68,3,'harp','pizzicato'),
 ('fern-and-feather','Fern and Feather','Wooden flute and guitar · a sunny walking song',55,74,4,'recorder','guitar'),
 ('cloud-picnic','Cloud Picnic','Soft reeds and guitar · a swaying picnic song',46,64,3,'reeds','guitar'),
 ('homeward-lanterns','Homeward Lanterns','Cello and soft piano · a warm homecoming',48,60,4,'cello','piano')
]
SCALE = [0,2,4,5,7,9,11]
A = [[4,2,0],[3,4,5],[4,2,0],[1,2,4],[5,4,2],[3,2,1],[1,2,6],[7,4,0]]
B = [[7,8,9],[8,7,5],[7,6,4],[6,5,4],[5,7,9],[8,5,3],[6,4,1],[4,2,0]]
C = [[2,4,7],[5,4,3],[4,7,9],[8,6,4],[5,4,2],[3,5,7],[6,4,1],[2,1,0]]
CHORDS = [0,3,0,4,5,3,4,0]
# Each piece has returning themes, a different middle, and a resolving coda.
FORM = [A,B,A,C,B,A,C,A]

def pitch(tonic, degree):
 return tonic + SCALE[degree % 7] + 12 * (degree // 7)

manifest_path = Path('assets/audio/manifest.json')
manifest = json.loads(manifest_path.read_text())
for number,(slug,title,description,tonic,tempo,meter,voice,accompaniment) in enumerate(PIECES):
 beat = 60 / tempo
 # Shorter two-beat bars get an extra verse; every recording exceeds 3 minutes.
 repeats = 2 if meter == 2 else 1
 bars = 80 if meter == 3 else 64 * repeats
 duration = bars * meter * beat + 8
 buf = np.zeros((int(duration * RATE),2), dtype=np.float32)
 def note(at, midi, length, volume, kind, pan=0):
  start = int(at * RATE)
  count = min(int(length * RATE),len(buf)-start)
  if count <= 0: return
  t = np.arange(count,dtype=np.float64) / RATE
  freq = 440 * 2 ** ((midi-69)/12)
  phase = math.tau * freq * t
  if kind in ('piano','harp','pizzicato','guitar'):
   decay = {'piano':1.2,'harp':1.65,'pizzicato':.5,'guitar':.95}[kind]
   env = np.minimum(1,t/.025) * np.exp(-t/decay) * np.clip((length-t)/.2,0,1)
   partials = {'piano':[(1,1),(2,.23),(3,.09),(4,.025)],'harp':[(1,1),(2,.15),(3,.035)],'pizzicato':[(1,1),(2,.2),(3,.055)],'guitar':[(1,1),(2,.27),(3,.075),(4,.02)]}[kind]
   tone = sum(amplitude*np.sin(phase*harmonic)*np.exp(-t*(harmonic-1)*.6) for harmonic,amplitude in partials)
  else:
   attack = {'clarinet':.18,'recorder':.14,'reeds':.28,'cello':.4}[kind]
   env = np.minimum(1,t/attack) * np.clip((length-t)/.35,0,1)
   vibrato = .05*np.sin(math.tau*4.2*t)*np.minimum(1,t/.7)
   partials = {'clarinet':[(1,1),(3,.18),(5,.035)],'recorder':[(1,1),(2,.055),(3,.045)],'reeds':[(1,1),(2,.19),(3,.065),(4,.02)],'cello':[(1,1),(2,.27),(3,.11),(4,.035)]}[kind]
   tone = sum(amplitude*np.sin(phase*harmonic+vibrato) for harmonic,amplitude in partials)
   env *= .94 + .06*np.sin(math.tau*.65*t)
  samples = (tone*env*volume).astype(np.float32)
  buf[start:start+count,0] += samples * math.sqrt((1-pan)/2)
  buf[start:start+count,1] += samples * math.sqrt((1+pan)/2)
 for bar in range(bars):
  phrase = (bar//8) % len(FORM)
  cell = bar%8
  at = 1 + bar*meter*beat
  degree = CHORDS[cell]
  chord = [pitch(tonic,degree+x) for x in (0,2,4)]
  final = bar >= bars-8
  # Air between phrases and a quieter closing verse keep the music out of the text.
  strength = .8 if final else (.9 if phrase in (2,5) else 1)
  note(at,pitch(tonic,degree)-12,meter*beat*.9,.065*strength,accompaniment,-.18)
  if number == 0: # A small two-step, with the melody answering its lower voice.
   for offset in (.55,1.5):
    for midi in chord[1:]: note(at+offset*beat,midi,beat*.85,.027*strength,'piano',.18)
  elif number == 1:
   for k in range(4):note(at+k*beat,chord[k%3],beat*1.7,.034*strength,'harp',-.22)
  elif number == 2:
   for k in (1,2):
    for midi in chord:note(at+k*beat,midi,beat*.85,.025*strength,'pizzicato',-.2)
  elif number == 3:
   for k in (0,.75,2,2.75):note(at+k*beat,chord[int(k*2)%3],beat*1.3,.033*strength,'guitar',-.22)
  elif number == 4:
   for k in (1,2):note(at+k*beat,chord[k],beat*1.6,.04*strength,'guitar',-.18)
  else:
   for k in (0,1.5,3):note(at+k*beat,chord[int(k)%3],beat*2.1,.03*strength,'piano',.22)
  motif = FORM[phrase][cell]
  # Each score has its own rhythm, register, rests, and phrase direction.
  if number == 0: rhythm = [(0,0,.7),(.8,1,.6),(1.5,2,.5)]
  elif number == 1: rhythm = [(.15,0,1.6),(2.1,1,1.5)] if cell%2==0 else [(.1,2,3.3)]
  elif number == 2: rhythm = [(0,0,1.7),(1.6,1,1),(2.5,2,.5)]
  elif number == 3: rhythm = [(.1,0,1.1),(1.5,1,.8),(2.5,2,1.3)]
  elif number == 4: rhythm = [(.1,0,1.7),(1.9,2,1)]
  else: rhythm = [(.15,0,3.4)] if cell%2==0 else [(.15,1,1.6),(2.1,2,1.6)]
  if cell==7: rhythm = [(.1,2,meter-.6)]
  if phrase==6 and cell in (3,7): rhythm=[]
  for offset,idx,length in rhythm:
   midi = pitch(tonic,motif[idx]) + (0 if voice=='cello' else 12)
   note(at+offset*beat,midi,length*beat,.12*strength,voice,.1)
  if bar==bars-1:
   for midi in [tonic,tonic+7,tonic+12]:note(at+meter*beat,midi,5,.033,accompaniment,0)
 # Restrained room reflections, no broad stereo movement or percussion.
 dry = buf.copy()
 for delay,gain in ((.037,.07),(.079,.04),(.151,.025)):
  shift = int(delay*RATE);buf[shift:] += dry[:-shift,::-1]*gain
 times = np.arange(len(buf))/RATE
 buf *= np.minimum(np.minimum(times/2.5,(duration-times)/4),1).clip(0,1)[:,None]
 peak = np.max(np.abs(buf));buf *= min(1,.75/max(.001,peak))
 pcm = (buf*32767).clip(-32767,32767).astype('<i2')
 dest = Path('assets/audio/'+slug+'.mp3')
 with tempfile.NamedTemporaryFile(suffix='.wav') as temp:
  with wave.open(temp.name,'wb') as w:
   w.setnchannels(2);w.setsampwidth(2);w.setframerate(RATE);w.writeframes(pcm.tobytes())
  subprocess.run(['ffmpeg','-y','-v','error','-i',temp.name,'-af','loudnorm=I=-29.5:TP=-9:LRA=8','-ar',str(RATE),'-codec:a','libmp3lame','-q:a','5',str(dest)],check=True)
 manifest = [item for item in manifest if item['file']!=str(dest)]
 manifest.append(dict(file=str(dest),title=title,description=description,creator='Chochi Mochi original arrangement',source='scripts/compose-storybook-music.py',license='CC0-1.0',attribution_required=False,sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),mastering='Approximately -29.5 LUFS, softened attacks and faded edges.'))
 print(title,round(duration),'seconds',flush=True)
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
