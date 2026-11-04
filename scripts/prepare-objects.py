"""Prepare transparent watercolor objects; preserve the generated PNG originals."""
from pathlib import Path
from PIL import Image
import hashlib,json,base64
root=Path('assets/objects');manifest=[]
for p in sorted(root.glob('*-original.png')):
 im=Image.open(p).convert('RGBA');slug=p.stem.removesuffix('-original')
 if slug!='basket':
  bounds=im.getchannel('A').point(lambda a:255 if a>10 else 0).getbbox()
  if bounds:
   im=im.crop(bounds);pad=max(6,round(max(im.size)*.045));canvas=Image.new('RGBA',(im.width+2*pad,im.height+2*pad));canvas.alpha_composite(im,(pad,pad));im=canvas
 im.thumbnail((1400,1000) if slug=='basket' else (768,768))
 dest=root/(slug+'.webp');im.save(dest,'WEBP',quality=86,method=6)
 manifest.append(dict(file=str(dest),width=im.width,height=im.height,alpha=im.getchannel('A').getextrema(),sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
(root/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
case=root/'music-case.webp'
if case.exists():Path('object-art-data.js').write_text('export const musicCase="data:image/webp;base64,'+base64.b64encode(case.read_bytes()).decode()+'";\n')
print('Prepared',len(manifest),'transparent watercolor objects',flush=True)
