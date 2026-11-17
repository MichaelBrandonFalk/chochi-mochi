"""Four original scores and synthesized recordings, dedicated to CC0 1.0.
No samples or borrowed melodies. Developer tools only: numpy and ffmpeg.
Each score has its own melody, harmony, meter, phrasing, and instrumentation.
"""
from pathlib import Path
import hashlib, json, math, subprocess, tempfile, wave
import numpy as np

RATE = 24000
# Melodies use MIDI notes, None for a breath. Chords are independently voiced.
PIECES = [
 dict(slug='garden-window', title='Garden Window', description='Soft piano · a quiet six-beat daydream',
      tempo=66, meter=6, unit=.5, bars=72, voice='piano', backing='piano',
      a=[64,67,69,67,64,62,60,None,62,64,67,64,62,59,60,None],
      b=[69,72,71,67,69,65,64,None,65,69,67,64,62,64,60,None],
      chords=[(48,55,64),(45,52,60),(53,60,65),(55,62,67),(48,55,64),(50,57,65),(55,59,62),(48,55,60)]),
 dict(slug='mossy-steps', title='Mossy Steps', description='Warm wooden keys · a playful, unhurried walk',
      tempo=72, meter=4, unit=1, bars=64, voice='wood', backing='guitar',
      a=[67,69,74,None,71,67,64,None,69,67,62,None,64,66,67,None],
      b=[74,76,74,71,69,None,67,None,71,69,66,64,62,None,67,None],
      chords=[(43,50,59),(48,55,64),(45,52,60),(50,57,66),(43,50,59),(40,47,55),(50,57,60),(43,50,59)]),
 dict(slug='little-leaf-minuet', title='Little Leaf Minuet', description='Soft reeds and strings · a tiny garden dance',
      tempo=62, meter=3, unit=1, bars=72, voice='reed', backing='strings',
      a=[65,69,67,65,64,62,60,None,62,65,69,67,65,64,65,None],
      b=[72,69,70,67,69,65,64,None,67,64,65,62,64,60,65,None],
      chords=[(41,48,57),(46,53,62),(48,55,64),(41,48,57),(38,45,53),(43,50,58),(48,55,64),(41,48,57)]),
 dict(slug='starlit-postcards', title='Starlit Postcards', description='Harp and light bells · a spacious evening song',
      tempo=60, meter=4, unit=1, bars=48, voice='bell', backing='harp',
      a=[69,None,73,76,74,None,73,None,71,None,69,66,68,None,69,None],
      b=[76,None,78,76,73,None,71,None,74,None,73,71,68,None,69,None],
      chords=[(45,52,61),(50,57,66),(47,54,62),(52,59,68),(45,52,61),(42,49,57),(52,56,59),(45,52,61)])
]

manifest_path=Path('assets/audio/manifest.json')
manifest=json.loads(manifest_path.read_text())
measurements=[]
for number,p in enumerate(PIECES):
 tick=60/p['tempo']*p['unit']; bar_length=p['meter']*tick
 duration=p['bars']*bar_length+9
 buf=np.zeros((int(duration*RATE),2),dtype=np.float32)
 def note(at,midi,length,gain,voice,pan=0):
  start=int(at*RATE); count=min(int(length*RATE),len(buf)-start)
  if count<=0:return
  t=np.arange(count)/RATE; phase=math.tau*440*2**((midi-69)/12)*t
  if voice in ('piano','wood','guitar','harp','bell'):
   decay={'piano':1.5,'wood':.75,'guitar':1.2,'harp':1.9,'bell':2.1}[voice]
   attack=.045 if voice!='wood' else .028
   env=np.minimum(1,t/attack)*np.exp(-t/decay)*np.clip((length-t)/.3,0,1)
   partials={'piano':[(1,1),(2,.16),(3,.055)],'wood':[(1,1),(4,.055)],
             'guitar':[(1,1),(2,.22),(3,.065)],'harp':[(1,1),(2,.12),(3,.025)],
             'bell':[(1,1),(2,.035),(3,.012)]}[voice]
  else:
   env=np.minimum(1,t/.38)*np.clip((length-t)/.5,0,1)
   partials=[(1,1),(2,.11),(3,.035)] if voice=='strings' else [(1,1),(3,.095),(5,.012)]
  tone=sum(amp*np.sin(phase*harm)*np.exp(-t*.2*(harm-1)) for harm,amp in partials)
  v=(tone*env*gain).astype(np.float32)
  buf[start:start+count,0]+=v*math.sqrt((1-pan)/2)
  buf[start:start+count,1]+=v*math.sqrt((1+pan)/2)
 for bar in range(p['bars']):
  at=1+bar*bar_length; cell=bar%8; section=(bar//16)%4
  chord=p['chords'][cell]; melody=p['b'] if section in (1,3) else p['a']
  # Two bars per melodic cell. Return with a quieter, lower answer at the end.
  index=(bar*2)%len(melody); closing=bar>=p['bars']-8; strength=.72 if closing else 1
  note(at,chord[0],bar_length+.1,.055*strength,p['backing'],-.15)
  if number==0:
   for beat in (1,2,4,5):note(at+beat*tick,chord[1+beat%2],tick*2.1,.032*strength,'piano',.12)
   rhythm=[(.15,0,2.5),(3.1,1,2.4)]
  elif number==1:
   for beat in (.5,2.5):note(at+beat*tick,chord[1],tick*1.4,.034*strength,'guitar',-.18)
   rhythm=[(.2,0,1.15),(2,1,1.5)] if cell%2==0 else [(0,1,2.5)]
  elif number==2:
   for m in chord[1:]:note(at+.08,m,bar_length-.15,.025*strength,'strings',-.2)
   rhythm=[(.15,0,1.6),(2,1,.8)] if cell%2==0 else [(.1,1,2.5)]
  else:
   for beat in (0,1.5,3):note(at+beat*tick,chord[1+int(beat)%2],tick*2,.027*strength,'harp',-.2)
   rhythm=[(.3,0,3.3)] if cell%2==0 else [(1,1,2.4)]
  for offset,k,length in rhythm:
   pitch=melody[(index+k)%len(melody)]
   if pitch is not None and not (closing and cell in (3,6)):
    note(at+offset*tick,pitch,length*tick,.09*strength,p['voice'],.12)
  # Resolving tonic instead of an unresolved jump into the next recording.
  if bar==p['bars']-1:
   for midi in p['chords'][0]:note(at+bar_length,midi,5,.027,p['backing'])
 dry=buf.copy()
 for delay,gain in ((.043,.045),(.103,.025)):
  shift=int(delay*RATE);buf[shift:]+=dry[:-shift]*gain
 times=np.arange(len(buf))/RATE
 buf*=np.minimum(np.minimum(times/3,(duration-times)/5),1).clip(0,1)[:,None]
 buf*=min(1,.7/max(.001,float(np.max(np.abs(buf)))))
 dest=Path('assets/audio/'+p['slug']+'.mp3')
 with tempfile.NamedTemporaryFile(suffix='.wav') as temp:
  with wave.open(temp.name,'wb') as wav:
   wav.setnchannels(2);wav.setsampwidth(2);wav.setframerate(RATE)
   wav.writeframes((buf*32767).clip(-32767,32767).astype('<i2').tobytes())
  subprocess.run(['ffmpeg','-v','error','-y','-i',temp.name,'-af','loudnorm=I=-29.5:TP=-9:LRA=7',
                  '-ar',str(RATE),'-codec:a','libmp3lame','-q:a','4',str(dest)],check=True)
 manifest=[item for item in manifest if item['file']!=str(dest)]
 manifest.append(dict(file=str(dest),title=p['title'],description=p['description'],
   creator='Chochi Mochi original arrangement',source='scripts/compose-garden-music.py',
   license='CC0-1.0',attribution_required=False,sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
 print(p['title'],round(duration),'seconds',flush=True)
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
