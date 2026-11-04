"""Five original chamber arrangements, dedicated with their recordings to CC0 1.0.
No samples or borrowed tunes. Developer renderer: Python and ffmpeg.
"""
import math,array,wave,tempfile,subprocess,json,hashlib
from pathlib import Path
RATE=24000
PIECES=[
 ('meadow-guitar','Meadow Guitar','Fingerpicked guitar · a lilting 6/8 walk',72,6,.5,32,[60,64,67,69,67,64,62,65,69,67,64,60,65,69,72,71,69,65,67,71,74,72,67,64],[48,57,53,55,50,55,48,48],'guitar'),
 ('willow-flute','Willow Flute','Flute and soft strings · a slow 4/4 song',64,4,1,24,[69,72,74,72,69,67,65,67,69,70,69,65,67,70,72,74,72,69,67,65,64,65,67,69],[53,58,60,53,50,55,60,53],'flute'),
 ('cloud-bells','Cloud Bells','Soft music-box bells · a spacious 4/4 lullaby',58,4,1,24,[72,79,76,74,72,67,69,76,74,72,69,67,74,79,77,76,74,71,72,76,79,76,74,72],[48,53,57,55,48,50,55,48],'bell'),
 ('bluebell-strings','Bluebell Strings','A gentle string trio · a flowing 3/4 lullaby',56,3,1,32,[62,66,69,71,69,66,64,67,71,69,67,64,66,69,74,73,71,69,67,66,64,62,64,62],[50,55,57,50,59,55,57,50],'strings'),
 ('orchard-marimba','Orchard Marimba','Soft marimba and bass · a light 4/4 dance',82,4,1,32,[67,71,74,76,74,71,69,72,76,74,72,69,71,74,79,76,74,72,69,67,69,71,74,67],[55,60,57,62,55,64,60,62],'marimba')
]
manifest=json.loads(Path('assets/audio/manifest.json').read_text())
keep=[x for x in manifest if x['file'].endswith(('page-touch.mp3','keepsake.mp3','clover-waltz.mp3'))]
for slug,title,description,tempo,meter,unit,bars,melody,roots,instrument in PIECES:
 tick=60/tempo*unit;duration=bars*meter*tick+5
 left=array.array('f',[0.0])*int(duration*RATE);right=array.array('f',[0.0])*len(left)
 def note(at,midi,length,vol,kind,pan=0):
  f=440*2**((midi-69)/12);start=int(at*RATE);n=min(int(length*RATE),len(left)-start)
  lg=math.sqrt((1-pan)/2);rg=math.sqrt((1+pan)/2)
  for j in range(n):
   t=j/RATE;phase=math.tau*f*t
   if kind=='guitar':
    env=min(1,t/.018)*math.exp(-t/1.15)*min(1,(length-t)/.12)
    tone=math.sin(phase)+.28*math.sin(phase*2)*math.exp(-t*1.7)+.12*math.sin(phase*3)*math.exp(-t*2.8)+.045*math.sin(phase*4)*math.exp(-t*4)
   elif kind=='flute':
    env=min(1,t/.22)*min(1,(length-t)/.28);v=.003*math.sin(math.tau*4.4*t)*min(1,t/.5)
    tone=math.sin(phase+v*math.sin(phase))+.075*math.sin(phase*2)+.025*math.sin(phase*3)
   elif kind=='strings':
    env=min(1,t/.45)*min(1,(length-t)/.45)
    tone=(math.sin(phase+.018*math.sin(math.tau*4.8*t))+.16*math.sin(phase*2)+.065*math.sin(phase*3))*.75
   elif kind=='bell':
    env=min(1,t/.035)*math.exp(-t/1.5)*min(1,(length-t)/.2)
    tone=math.sin(phase)+.09*math.sin(phase*2.76)*math.exp(-t*2.5)+.025*math.sin(phase*5.4)*math.exp(-t*4)
   elif kind=='marimba':
    env=min(1,t/.016)*math.exp(-t/.48)*min(1,(length-t)/.1)
    tone=math.sin(phase)+.12*math.sin(phase*4)*math.exp(-t*7)+.035*math.sin(phase*9)*math.exp(-t*14)
   else:
    env=min(1,t/.04)*math.exp(-t/.7)*min(1,(length-t)/.15);tone=math.sin(phase)+.07*math.sin(phase*2)
   v=vol*env*tone;left[start+j]+=v*lg;right[start+j]+=v*rg
 for bar in range(bars):
  at=bar*meter*tick;root=roots[(bar//2)%len(roots)];minor_roots={'guitar':{57,50},'flute':{50,55},'bell':{57,50},'strings':{59},'marimba':{57,64}};chord=[root+12,root+(15 if root in minor_roots[instrument] else 16),root+19]
  # Different phrases and accompaniment for each instrument, with real rests.
  if instrument=='guitar':
   note(at,root,2.8*tick,.10,'guitar',-.22);note(at+3*tick,root+7,2.5*tick,.075,'guitar',-.12)
   for k in [1,2,4,5]:note(at+k*tick,chord[k%3],1.8*tick,.065,'guitar',.23)
   for k in [0,3]:note(at+(k+.15)*tick,melody[(bar*2+k//3)%len(melody)],2.7*tick,.10,'guitar',.08)
  elif instrument=='flute':
   for k,m in enumerate(chord):note(at,m-12,meter*tick+.3,.032,'strings',[-.4,0,.4][k])
   if bar%4!=3:note(at+.35*tick,melody[bar%len(melody)],2.9*tick,.105,'flute',.1)
   elif bar%8==3:note(at+.4*tick,melody[bar%len(melody)],1.4*tick,.095,'flute',.1)
  elif instrument=='bell':
   note(at+.15*tick,melody[bar%len(melody)],3.6*tick,.12,'bell',-.12 if bar%2 else .12)
   if bar%3==0:note(at+2.6*tick,melody[(bar+5)%len(melody)],1.35*tick,.075,'bell',.2)
   if bar%2==0:note(at,root+12,3.5*tick,.055,'bell',-.25)
  elif instrument=='strings':
   note(at,root,meter*tick+.4,.065,'strings',-.35)
   note(at+.1,chord[1],meter*tick+.2,.045,'strings',.35)
   note(at+.15,melody[bar%len(melody)],meter*tick-.1,.12,'strings',0)
  else:
   for k in [0,2]:note(at+k*tick,root,1.5*tick,.10,'bass',-.2)
   for k in [0,1.5,2.5]:note(at+k*tick,melody[(bar*3+int(k))%len(melody)],1.3*tick,.16,'marimba',.2 if k==1.5 else -.1)
   if bar%2==0:note(at+3.5*tick,chord[1],.5*tick,.08,'marimba',.3)
 peak=max(max(abs(v) for v in left),max(abs(v) for v in right));scale=min(1,.65/max(.001,peak));pcm=array.array('h')
 for i,(l,r) in enumerate(zip(left,right)):
  fade=max(0,min(1,i/RATE/2,(duration-i/RATE)/3))*scale
  pcm.extend((round(l*fade*32767),round(r*fade*32767)))
 with tempfile.NamedTemporaryFile(suffix='.wav') as temp:
  with wave.open(temp.name,'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(RATE);w.writeframes(pcm.tobytes())
  dest=Path('assets/audio/'+slug+'.mp3');subprocess.run(['ffmpeg','-y','-v','error','-i',temp.name,'-af','loudnorm=I=-24:TP=-6:LRA=9,volume=-5.6dB','-ar','24000','-codec:a','libmp3lame','-q:a','5',str(dest)],check=True)
 keep.append(dict(file=str(dest),title=title,description=description,creator='Chochi Mochi original arrangement',source='scripts/compose-varied-music.py',license='CC0-1.0',attribution_required=False,sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
 print(title,round(duration),'seconds',flush=True)
Path('assets/audio/manifest.json').write_text(json.dumps(keep,indent=2)+'\n')
for old in ['pear-blossom.mp3','cloud-carousel.mp3','bluebell-tea.mp3']:Path('assets/audio/'+old).unlink(missing_ok=True)
