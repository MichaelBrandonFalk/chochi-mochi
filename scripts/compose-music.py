"""Render four original gentle chamber miniatures. Scores and recordings: CC0-1.0.
No samples or borrowed melodies. Requires Python and ffmpeg, no Python packages.
"""
import math, array, wave, subprocess, tempfile, hashlib, json
from pathlib import Path
RATE=24000
# Three-beat phrases, a soft plucked keyboard with a quiet lower accompaniment.
PIECES=[('clover-waltz','Clover Waltz',60,[72,76,79,77,76,74,72,71,69,71,74,76,74,72,71,69,67,72,76,74,72,69,71,72]),('pear-blossom','Pear Blossom',64,[76,79,81,79,76,74,72,74,76,77,76,72,74,77,79,77,74,71,72,76,74,72,71,72]),('cloud-carousel','Cloud Carousel',58,[79,76,74,72,74,76,77,74,72,71,72,74,76,72,69,67,69,72,74,71,67,69,71,72]),('bluebell-tea','Bluebell Tea',62,[72,74,76,79,76,74,77,76,74,72,71,69,76,74,72,69,71,74,72,67,69,71,74,72])]
manifest=json.loads(Path('assets/audio/manifest.json').read_text())
manifest=[x for x in manifest if x['file']!='assets/audio/calm-garden.mp3' and 'original miniature' not in x.get('creator','')]
for slug,title,tempo,melody in PIECES:
 beat=60/tempo; bars=48; duration=bars*3*beat+5
 buf=array.array('f',[0.0])*int(duration*RATE)
 def note(at,midi,length,vol):
  f=440*2**((midi-69)/12);start=int(at*RATE);n=min(int(length*RATE),len(buf)-start)
  for j in range(n):
   t=j/RATE;env=min(1,t/.035)*math.exp(-t/1.0)*min(1,(length-t)/.18)
   tone=math.sin(math.tau*f*t)+.15*math.sin(math.tau*f*2*t)*math.exp(-t*2)+.035*math.sin(math.tau*f*3*t)*math.exp(-t*3)
   buf[start+j]+=vol*env*tone
 chords=[(48,55,60),(53,57,60),(55,59,62),(48,55,60),(57,60,64),(53,57,60),(55,59,62),(48,55,60)]
 for bar in range(bars):
  at=bar*3*beat;chord=chords[(bar//2)%8]
  for k,m in enumerate(chord):note(at+k*beat,m,2.4*beat,.045 if k==0 else .025)
  # Three related verses with breathing room and a higher middle phrase.
  for k in range(2):
   step=(bar*2+k)%len(melody);m=melody[step]+(0 if bar<16 or bar>=32 else 0)
   if (bar+k)%7!=5:note(at+(k*1.5+.15)*beat,m,1.5*beat,.095 if bar<32 else .075)
 # Gentle ending and start. Peak kept well below full scale.
 pcm=array.array('h')
 for i,v in enumerate(buf):
  t=i/RATE;fade=min(1,t/2,(duration-t)/4);pcm.append(round(max(-.8,min(.8,v*fade))*32767))
 with tempfile.NamedTemporaryFile(suffix='.wav') as f:
  with wave.open(f.name,'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(RATE);w.writeframes(pcm.tobytes())
  dest=Path('assets/audio/'+slug+'.mp3');subprocess.run(['ffmpeg','-y','-v','error','-i',f.name,'-codec:a','libmp3lame','-q:a','5',str(dest)],check=True)
 manifest.append(dict(file=str(dest),title=title,creator='Chochi Mochi original miniature',source='scripts/compose-music.py',license='CC0-1.0',attribution_required=False,sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
 print(title,round(duration),'seconds')
Path('assets/audio/manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
