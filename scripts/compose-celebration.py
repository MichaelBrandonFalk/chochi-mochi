"""A Garden Full of Friends: original score, synthesizer and recording, CC0 1.0.
Developer renderer: numpy and ffmpeg. No samples or borrowed composition.
"""
from pathlib import Path
import math, json, hashlib, tempfile, subprocess, wave
import numpy as np
rate=24000; beat=60/84; bars=32; duration=bars*3*beat+8
audio=np.zeros((int(duration*rate),2),dtype=np.float32)
def note(at,midi,length,gain,kind='piano',pan=0):
 start=int(at*rate);count=min(int(length*rate),len(audio)-start)
 if count<=0:return
 t=np.arange(count)/rate;phase=math.tau*440*2**((midi-69)/12)*t
 if kind=='strings':
  env=np.minimum(1,t/.4)*np.clip((length-t)/.5,0,1)
  sound=np.sin(phase)+.1*np.sin(phase*2)+.035*np.sin(phase*3)
 else:
  env=np.minimum(1,t/.04)*np.exp(-t/(1.7 if kind=='harp' else 1.2))*np.clip((length-t)/.22,0,1)
  sound=np.sin(phase)+(.13 if kind=='piano' else .07)*np.sin(phase*2)+.025*np.sin(phase*3)
 v=(sound*env*gain).astype(np.float32)
 audio[start:start+count,0]+=v*math.sqrt((1-pan)/2)
 audio[start:start+count,1]+=v*math.sqrt((1+pan)/2)
theme=[[67,72,76],[74,72,69],[65,69,72],[71,67,64],[69,72,76],[74,71,67],[65,64,62],[64,67,72]]
middle=[[76,79,77],[76,74,72],[74,77,76],[74,71,67],[72,76,74],[72,69,65],[67,71,74],[72,67,64]]
roots=[48,45,53,55,45,50,55,48]
for bar in range(bars):
 at=1+bar*3*beat;cell=bar%8;root=roots[cell];minor=root in (45,50)
 chord=[root,root+(3 if minor else 4),root+7]
 strength=.8 if bar>=24 else 1
 note(at,root,3*beat,.055*strength,'strings',-.16)
 for j,m in enumerate(chord):note(at+(j*.6)*beat,m+12,2*beat,.034*strength,'harp',-.22)
 melody=(middle if 8<=bar<16 else theme)[cell]
 rhythm=[(0,0,.8),(1,1,.8),(2,2,.8)] if bar<16 else [(0,0,1.3),(1.5,1,.6),(2.25,2,.55)]
 if cell==7:rhythm=[(0,2,2.7)]
 for offset,k,length in rhythm:note(at+offset*beat,melody[k],length*beat,.105*strength,'piano',.12)
 if bar>=16 and cell in (0,4):note(at+2.2*beat,melody[2]+12,1.8*beat,.026,'harp',.2)
 if bar==bars-1:
  for m in (48,55,60,64,67,72):note(at+3*beat,m,5,.026,'harp')
dry=audio.copy()
for delay,gain in ((.05,.05),(.12,.025)):
 shift=int(delay*rate);audio[shift:]+=dry[:-shift]*gain
t=np.arange(len(audio))/rate;audio*=np.minimum(np.minimum(t/2.5,(duration-t)/5),1).clip(0,1)[:,None]
audio*=min(1,.7/max(.001,float(np.max(np.abs(audio)))))
dest=Path('assets/audio/a-garden-full-of-friends.mp3')
with tempfile.NamedTemporaryFile(suffix='.wav') as tmp:
 with wave.open(tmp.name,'wb') as w:
  w.setnchannels(2);w.setsampwidth(2);w.setframerate(rate);w.writeframes((audio*32767).clip(-32767,32767).astype('<i2').tobytes())
 subprocess.run(['ffmpeg','-y','-v','error','-i',tmp.name,'-af','loudnorm=I=-28.5:TP=-9:LRA=7','-ar',str(rate),'-codec:a','libmp3lame','-q:a','4',str(dest)],check=True)
path=Path('assets/audio/manifest.json');items=json.loads(path.read_text());items=[i for i in items if i['file']!=str(dest)]
items.append(dict(file=str(dest),title='A Garden Full of Friends',description='A gentle finishing waltz for piano, harp and warm strings',creator='Chochi Mochi original arrangement',source='scripts/compose-celebration.py',license='CC0-1.0',attribution_required=False,sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
path.write_text(json.dumps(items,indent=2)+'\n');print('Celebration song:',round(duration),'seconds')
