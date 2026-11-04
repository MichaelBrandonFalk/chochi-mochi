"""Prepare generated chapter paintings for the static game, preserving originals locally."""
from PIL import Image,ImageOps
from pathlib import Path
import json,hashlib
root=Path('assets/storybook');manifest=[];count=0
for path in sorted(root.glob('*-original.png')):
 im=Image.open(path).convert('RGB')
 if path.name=='valley-map-original.png':
  dest=root/'valley-map.webp';im.save(dest,'WEBP',quality=88,method=6)
  manifest.append(dict(file=str(dest),width=im.width,height=im.height,sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
  continue
 stem=path.stem.removesuffix('-original');dest=root/(stem+'.webp')
 im.save(dest,'WEBP',quality=86,method=6)
 small=ImageOps.contain(im,(768,512));small.save(root/(stem+'-small.webp'),'WEBP',quality=82,method=6)
 index=int(stem[:2])-1;count+=1
 manifest.append(dict(level=index+1,file=str(dest),width=im.width,height=im.height,sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
# Postcards embed these WebP files on demand in the browser.
(root/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Prepared',count,'chapter paintings and',len(manifest)-count,'map')
