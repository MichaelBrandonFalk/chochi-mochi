// Names and saves live only in this browser. The original slot keeps legacy keys.
export const playerRegistryKey='little-lights-players-v1';
export const maxPlayers=5;
const initial=()=>({version:1,active:'original',players:[{id:'original',name:'My adventure'}]});
const nameText=value=>String(value||'').replace(/[\u0000-\u001f\u007f]/g,'').trim().slice(0,24);
export function cleanPlayers(value){
 const base=initial();
 if(!value||!Array.isArray(value.players))return base;
 const seen=new Set();
 const players=value.players.filter(p=>p&&typeof p.id==='string'&&/^(original|p-[a-z0-9-]{8,64})$/.test(p.id)&&!seen.has(p.id)&&seen.add(p.id)).slice(0,maxPlayers).map(p=>({id:p.id,name:nameText(p.name)||'My adventure'}));
 if(!players.some(p=>p.id==='original'))players.unshift(base.players[0]);
 players.splice(maxPlayers);
 return {version:1,active:players.some(p=>p.id===value.active)?value.active:'original',players};
}
export function createPlayerStore(storage,makeId=()=> 'p-'+crypto.randomUUID()){
 const readRegistry=()=>{let raw;try{raw=JSON.parse(storage.getItem(playerRegistryKey)||'null');}catch{return initial();}return cleanPlayers(raw);};
 // This page always writes to the player it opened with, even if another tab switches.
 const activeId=readRegistry().active;
 const storageKey=(key,id=activeId)=>id==='original'?key:'little-lights-player-'+id+':'+key;
 const writeRegistry=value=>storage.setItem(playerRegistryKey,JSON.stringify(value));
 const active=()=>readRegistry().players.find(p=>p.id===activeId)||initial().players[0];
 const checkName=(name,registry,exclude)=>{
  if(!name)throw new Error('Please choose a short name.');
  if(registry.players.some(p=>p.id!==exclude&&p.name.toLocaleLowerCase()===name.toLocaleLowerCase()))throw new Error('That name is already here. Try another name.');
 };
 return {
  activeId,active,list:()=>readRegistry().players,
  getItem:key=>storage.getItem(storageKey(key)),
  setItem:(key,value)=>storage.setItem(storageKey(key),value),
  removeItem:key=>storage.removeItem(storageKey(key)),
  create(value){const registry=readRegistry();if(registry.players.length>=maxPlayers)throw new Error('All five player spaces are in use.');let name=nameText(value);if(!name){let n=2;do{name='Player '+n++;}while(registry.players.some(p=>p.name.toLocaleLowerCase()===name.toLocaleLowerCase()));}checkName(name,registry);const id=makeId();if(!/^p-[a-z0-9-]{8,64}$/.test(id)||registry.players.some(p=>p.id===id))throw new Error('Could not make a player space. Please try again.');registry.players.push({id,name});registry.active=id;writeRegistry(registry);return id;},
  rename(value){const registry=readRegistry(),name=nameText(value);checkName(name,registry,activeId);const player=registry.players.find(p=>p.id===activeId);if(!player)throw new Error('Please reload before changing this player.');player.name=name;writeRegistry(registry);},
  switchTo(id){const registry=readRegistry();if(!registry.players.some(p=>p.id===id))throw new Error('That player is not here. Please choose again.');registry.active=id;writeRegistry(registry);},
  summary(id){try{const saved=JSON.parse(storage.getItem(storageKey('little-lights-v1',id))||'null');const done=Array.isArray(saved?.done)?new Set(saved.done.filter(n=>Number.isInteger(n)&&n>=0&&n<19)).size:0;return done+(done===19&&saved.finished===true?1:0);}catch{return 0;}},
  restart(){
   // Do not clear localStorage: other players and comfort choices must survive.
   storage.setItem(storageKey('little-lights-reading-positions'),'{}');
   storage.setItem(storageKey('little-lights-break'),'null');
   storage.setItem(storageKey('little-lights-v1'),'{}');
  }
 };
}
let storage;
try{storage=window.localStorage;}catch{storage={getItem(){throw new Error('Storage unavailable');},setItem(){throw new Error('Storage unavailable');},removeItem(){throw new Error('Storage unavailable');}};}
export const playerStore=createPlayerStore(storage);
export const playerStorage=playerStore;
