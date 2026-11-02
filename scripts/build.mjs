import { mkdir, copyFile, rm } from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/docs',{recursive:true});
for(const file of ['index.html','style.css','app.js','art.js','content.js'])await copyFile(file,`dist/${file}`);
await copyFile('docs/RESEARCH.md','dist/docs/RESEARCH.md');
console.log('Static game ready in dist/');
