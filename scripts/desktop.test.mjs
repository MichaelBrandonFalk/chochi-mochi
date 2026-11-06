import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createRequire} from 'node:module';
import {desktopVersion,desktopFiles,assetURL} from '../downloads.js';
const require=createRequire(import.meta.url);
const {SaveStore}=require('../desktop/save-store.cjs');
const {assetPath,isGameURL,isExternalLink,saveLocation}=require('../desktop/policy.cjs');
const temporary=fn=>{const root=fs.mkdtempSync(path.join(os.tmpdir(),'chochi-save-test-'));try{return fn(root);}finally{fs.rmSync(root,{recursive:true,force:true});}};
test('portable saves keep all player namespaces across restarts',()=>temporary(root=>{
 const a=new SaveStore(root);a.setItem('little-lights-v1','{"done":[0]}');a.setItem('little-lights-player-p-abcdefgh:little-lights-v1','{"done":[1,2]}');a.setItem('little-lights-access-v1','{"hideArt":true}');
 const b=new SaveStore(root);assert.equal(b.getItem('little-lights-v1'),'{"done":[0]}');assert.equal(b.getItem('little-lights-player-p-abcdefgh:little-lights-v1'),'{"done":[1,2]}');assert.equal(b.getItem('little-lights-access-v1'),'{"hideArt":true}');b.removeItem('little-lights-access-v1');assert.equal(new SaveStore(root).getItem('little-lights-access-v1'),null);
}));
test('failed desktop writes keep both saved bytes and current values',()=>temporary(root=>{
 const store=new SaveStore(root);store.setItem('little-lights-v1','old');const before=fs.readFileSync(store.file,'utf8'),rename=fs.renameSync;
 try{fs.renameSync=()=>{throw new Error('drive is read-only');};assert.throws(()=>store.setItem('little-lights-v1','new'),/read-only/);}finally{fs.renameSync=rename;}
 assert.equal(store.getItem('little-lights-v1'),'old');assert.equal(fs.readFileSync(store.file,'utf8'),before);assert.equal(fs.readdirSync(root).length,1);
}));
test('invalid keys and corrupt saves cannot overwrite existing progress',()=>temporary(root=>{
 const store=new SaveStore(root);assert.throws(()=>store.setItem('../file','bad'));assert.throws(()=>store.setItem('little-lights-v1',{}));fs.writeFileSync(store.file,'broken');assert.throws(()=>new SaveStore(root));assert.equal(fs.readFileSync(store.file,'utf8'),'broken');
}));
test('offline asset addresses cannot escape the packaged game',()=>{
 const root=path.resolve('dist');assert.equal(assetPath(root,'chochi://game/index.html'),path.join(root,'index.html'));assert.equal(assetPath(root,'chochi://game/'),path.join(root,'index.html'));
 for(const value of ['file:///etc/passwd','chochi://evil/index.html','chochi://game/%2e%2e%2fsecret','chochi://game/%00','chochi://user@game/index.html'])assert.throws(()=>assetPath(root,value));
 assert.equal(isGameURL('chochi://game/index.html#level-1'),true);assert.equal(isGameURL('chochi://game.evil/index.html'),false);
});
test('only known HTTPS reference sites open outside the game',()=>{
 assert.equal(isExternalLink('https://www.spacetreatment.net/'),true);assert.equal(isExternalLink('https://github.com/MichaelBrandonFalk/chochi-mochi/releases'),true);
 for(const value of ['javascript:alert(1)','file:///private/file','https://github.com.evil/','https://user@github.com/','http://github.com/'])assert.equal(isExternalLink(value),false);
});
test('portable editions select the USB folder while installed copies use user saves',()=>{
 const base={userData:'/user/data',packaged:true};
 assert.equal(saveLocation({...base,platform:'win32',executable:'E:/game/app.exe',portableDirectory:'E:/USB'}).directory,path.win32.join('E:/USB','Chochi Mochi Data'));
 assert.equal(saveLocation({...base,platform:'linux',executable:'/tmp/mount/chochi-mochi',appImage:'/usb/Chochi.AppImage'}).directory,path.posix.join('/usb','Chochi Mochi Data'));
 assert.equal(saveLocation({...base,platform:'linux',executable:'/media/usb/game/chochi-mochi'}).portable,true);
 assert.equal(saveLocation({...base,platform:'linux',executable:'/opt/Chochi Mochi/chochi-mochi'}).portable,false);
 assert.equal(saveLocation({...base,platform:'darwin',executable:'/Volumes/USB/Chochi Mochi.app/Contents/MacOS/Chochi Mochi'}).directory,path.posix.join('/Volumes/USB','Chochi Mochi Data'));
 assert.equal(saveLocation({...base,platform:'darwin',executable:'/Applications/Chochi Mochi.app/Contents/MacOS/Chochi Mochi'}).portable,false);
});
test('download links are versioned and cover every produced desktop artifact',()=>{
 const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url)));assert.equal(desktopVersion,pkg.version);assert.equal(Object.keys(desktopFiles).length,7);assert.equal(new Set(Object.values(desktopFiles)).size,7);
 for(const name of Object.values(desktopFiles)){assert.ok(name.includes(desktopVersion));assert.ok(assetURL(name).startsWith('https://github.com/MichaelBrandonFalk/chochi-mochi/releases/download/v'+pkg.version+'/'));}
});
test('Mac disk images keep portable saves beside the original DMG, not on its read-only mount',()=>{
 const {diskImageSource}=require('../desktop/policy.cjs');
 const info={images:[{'image-path':'/Volumes/USB/Games/Chochi.dmg','system-entities':[{'mount-point':'/Volumes/Chochi Mochi'}]}]};
 assert.equal(diskImageSource(info,'/Volumes/Chochi Mochi'),'/Volumes/USB/Games');assert.equal(diskImageSource(info,'/Volumes/Another disk'),null);assert.equal(diskImageSource({},'/Volumes/Chochi Mochi'),null);
});
