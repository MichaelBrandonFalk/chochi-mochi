import { mkdir, copyFile, rm, readFile, writeFile, cp } from 'node:fs/promises';
import { createHash } from 'node:crypto';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('docs','dist/docs',{recursive:true});
await cp('assets','dist/assets',{recursive:true});
const hashes=new Map(),visiting=new Set();
const hash=text=>createHash('sha256').update(text).digest('hex').slice(0,12);
// Fingerprint the entire import tree so a release refreshes nested modules too.
async function emit(file){
 if(hashes.has(file))return hashes.get(file);
 if(visiting.has(file))throw new Error('Import cycle: '+file);
 visiting.add(file);
 let source=await readFile(file,'utf8');
 const imports=[...source.matchAll(/from\s+['"]\.\/([^'"?]+\.js)['"]/g)];
 for(const match of imports){const fingerprint=await emit(match[1]);source=source.replace(match[0],match[0].replace(match[1],match[1]+'?v='+fingerprint));}
 await writeFile('dist/'+file,source);visiting.delete(file);hashes.set(file,hash(source));return hashes.get(file);
}
await emit('app.js');
let html=await readFile('index.html','utf8');
for(const asset of ['style.css','pastel.css','access.css']){await copyFile(asset,'dist/'+asset);hashes.set(asset,hash(await readFile(asset)));}
for(const asset of ['app.js','style.css','pastel.css','access.css'])html=html.replace('"'+asset+'"','"'+asset+'?v='+hashes.get(asset)+'"');
await writeFile('dist/index.html',html);
console.log('Static game ready in dist/');
