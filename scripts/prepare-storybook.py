"""Prepare generated chapter paintings for the static game, preserving originals locally."""
from PIL import Image,ImageOps
from pathlib import Path
import json,base64,hashlib
root=Path('assets/storybook');manifest=[];thumbs={}
for path in sorted(root.glob('*-original.png')):
 im=Image.open(path).convert('RGB')
 if path.name=='valley-map-original.png':
  dest=root/'valley-map.webp';im.save(dest,'WEBP',quality=88,method=6)
  manifest.append(dict(file=str(dest),width=im.width,height=im.height,sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
  continue
 stem=path.stem.removesuffix('-original');dest=root/(stem+'.webp')
 im.save(dest,'WEBP',quality=86,method=6)
 small=ImageOps.contain(im,(768,512));small.save(root/(stem+'-small.webp'),'WEBP',quality=82,method=6)
 tiny=ImageOps.fit(im,(480,320));from io import BytesIO
 buf=BytesIO();tiny.save(buf,'WEBP',quality=50,method=6)
 index=int(stem[:2])-1;thumbs[index]='data:image/webp;base64,'+base64.b64encode(buf.getvalue()).decode()
 manifest.append(dict(level=index+1,file=str(dest),width=im.width,height=im.height,sha256=hashlib.sha256(dest.read_bytes()).hexdigest()))
Path('storybook-data.js').write_text('// Small embedded paintings keep saved SVG postcards self-contained.\nexport const storybookPaint='+json.dumps([thumbs.get(i,'') for i in range(20)],separators=(',',':'))+';\n')
(root/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Prepared',len(thumbs),'chapter paintings and',len(manifest)-len(thumbs),'map; embedded preview bytes',Path('storybook-data.js').stat().st_size)
