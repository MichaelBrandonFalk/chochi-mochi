import {readdir} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import path from 'node:path';
const run=promisify(execFile),root=path.resolve('desktop-release');
let executable;
if(process.argv[2])executable=path.resolve(process.argv[2]);
else if(process.platform==='win32')executable=path.join(root,'win-unpacked','Chochi Mochi.exe');
else if(process.platform==='linux')executable=path.join(root,'linux-unpacked','chochi-mochi');
else{const dir=(await readdir(root)).find(n=>n==='mac-universal')||(await readdir(root)).find(n=>n.startsWith('mac'));if(!dir)throw Error('No packaged Mac app');executable=path.join(root,dir,'Chochi Mochi.app','Contents','MacOS','Chochi Mochi');}
const env={...process.env};delete env.ELECTRON_RUN_AS_NODE;
const result=await run(executable,['--self-test'],{timeout:45000,maxBuffer:4*1024*1024,env});
if(!result.stdout.includes('CHOCHI_DESKTOP_OK'))throw Error('Desktop startup check did not report success.\n'+result.stdout+'\n'+result.stderr);
console.log(result.stdout.trim());
