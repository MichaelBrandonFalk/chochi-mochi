import {readFile,writeFile} from 'node:fs/promises';
import {Resvg} from '@resvg/resvg-js';
const svg=await readFile('build/icon.svg','utf8');
await writeFile('build/icon.png',new Resvg(svg,{fitTo:{mode:'width',value:1024}}).render().asPng());
