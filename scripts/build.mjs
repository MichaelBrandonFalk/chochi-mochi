import { mkdir, copyFile, rm, readFile, writeFile } from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/docs',{recursive:true});
for(const file of ['index.html','style.css','app.js','art.js','content.js','chapters.js','activities.js','world.js'])await copyFile(file,`dist/${file}`);
await copyFile('docs/RESEARCH.md','dist/docs/RESEARCH.md');
// Content fingerprints refresh cached assets after each release.
const { createHash } = await import('node:crypto');
for (const dependency of ['content.js', 'art.js', 'chapters.js','activities.js','world.js']) {
  const hash = createHash('sha256').update(await readFile(`dist/${dependency}`)).digest('hex').slice(0,12);
  const app = await readFile('dist/app.js','utf8');
  await writeFile('dist/app.js',app.replace(`'./${dependency}'`,`'./${dependency}?v=${hash}'`));
}
let html = await readFile('dist/index.html','utf8');
for (const asset of ['app.js','style.css']) {
  const hash = createHash('sha256').update(await readFile(`dist/${asset}`)).digest('hex').slice(0,12);
  html = html.replace(`"${asset}"`,`"${asset}?v=${hash}"`);
}
await writeFile('dist/index.html',html);
console.log('Static game ready in dist/');
