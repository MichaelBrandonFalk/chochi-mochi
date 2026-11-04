import { mkdir, copyFile, rm, readFile, writeFile, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import {build} from 'esbuild';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('docs','dist/docs',{recursive:true});
await cp('assets','dist/assets',{recursive:true,filter:source=>!source.endsWith('-original.png')});
// One bundled module removes the network waterfall through dozens of imports.
// Keep it at the root so existing import.meta.url asset paths remain correct.
const result=await build({entryPoints:['app.js'],bundle:true,minify:true,format:'esm',target:'es2020',write:false,metafile:true});
const hash=text=>createHash('sha256').update(text).digest('hex').slice(0,12);
const js=result.outputFiles[0].contents,entry=`game-${hash(js)}.js`;
await writeFile('dist/'+entry,js);
let html=await readFile('index.html','utf8');
html=html.replace('src="app.js"',`src="${entry}"`);
const sheets=['style.css','pastel.css','calm.css','storybook.css','access.css'];
// Preserve cascade order while replacing five blocking requests with one.
const css=(await Promise.all(sheets.map(file=>readFile(file,'utf8')))).join('\n');
const style=`game-${hash(css)}.css`;
await writeFile('dist/'+style,css);
html=html.replace(/<link rel="stylesheet" href="(?:style|pastel|calm|storybook|access)\.css">/g,'');
html=html.replace('</head>',`<link rel="stylesheet" href="${style}"></head>`);
await writeFile('dist/index.html',html);
await writeFile('dist/build-report.json',JSON.stringify({script:entry,scriptBytes:js.length,stylesheet:style,stylesheetBytes:Buffer.byteLength(css),modules:Object.keys(result.metafile.inputs)},null,2)+'\n');
console.log(`Static game ready in dist/: ${js.length.toLocaleString()} script bytes, one module request.`);
