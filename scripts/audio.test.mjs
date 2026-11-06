import test from 'node:test';
import assert from 'node:assert/strict';

// Test the real audio controller with a Web Audio/DOM adapter. This produces
// no sound and touches no browser or saved player data.
const nodes=[],effects=[];
const parameter=(value=1)=>({value,events:[],setValueAtTime(v,time){this.value=v;this.events.push({v,time});},linearRampToValueAtTime(v,time){this.value=v;this.events.push({v,time});},exponentialRampToValueAtTime(v,time){this.value=v;this.events.push({v,time});},at(time){return this.events.filter(e=>e.time<=time).sort((a,b)=>a.time-b.time).at(-1)?.v??this.value;}});
class FakeContext{
 currentTime=0;state='running';destination={kind:'destination'};
 resume(){return Promise.resolve();}
 createGain(){const node={kind:'gain',gain:parameter(),connect(to){this.to=to;},disconnect(){}};nodes.push(node);return node;}
 createOscillator(){const node={kind:'oscillator',frequency:parameter(),connect(to){this.to=to;},start(){},stop(at){if(at===undefined||at<=0)this.stopped=true;else this.scheduledEnd=at;},disconnect(){}};nodes.push(node);return node;}
}
const elements=new Map();
const element=id=>{if(!elements.has(id))elements.set(id,{value:'',textContent:'',checked:false,setAttribute(){},append(){},addEventListener(){}});return elements.get(id);};
const saves=new Map(),documentEvents=new Map();let clock=1000;
globalThis.window={localStorage:{getItem(k){return k==='little-lights-audio'?'{'+'"position":23}':null;},setItem(k,v){saves.set(k,v);},removeItem(){}},AudioContext:FakeContext,addEventListener(){},dispatchEvent(){}};
globalThis.document={hidden:false,querySelector:element,addEventListener(name,fn){documentEvents.set(name,fn);},createElement(){const audio={dataset:{},volume:1,readyState:0,currentTime:0,listeners:new Map(),addEventListener(name,fn){this.listeners.set(name,fn);},get src(){return this._src;},set src(v){this._src=v;this.currentTime=0;this.readyState=0;},play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;},remove(){}};effects.push(audio);return audio;}};
globalThis.requestAnimationFrame=()=>1;
globalThis.cancelAnimationFrame=()=>{};
Object.defineProperty(globalThis,'performance',{value:{now:()=>clock},configurable:true});
const {playTune,playEffect,setAudioSettings,stopTune,initAudio}=await import('../audio.js');
function level(voice,time){let result=1;for(let node=voice.to;node?.kind!=='destination';node=node.to){assert.ok(node);if(node.gain)result*=node.gain.at(time);}return result;}

test('effects volume changes affect scheduled notes without restarting the tune',async()=>{
 setAudioSettings({effectsOn:true,effectsVolume:.4});
 assert.equal(playTune([0,1,2,3]),true);await Promise.resolve();
 const voice=nodes.find(n=>n.kind==='oscillator');assert.ok(voice);
 const before=level(voice,.08);assert.ok(before>0);
 setAudioSettings({effectsVolume:0});assert.equal(level(voice,.08),0);
 assert.notEqual(voice.stopped,true,'Adjusting volume must preserve the playing tune');
 setAudioSettings({effectsVolume:.2});assert.ok(Math.abs(level(voice,.08)/before-.5)<1e-9);
 stopTune();
});
test('effects volume changes affect an already playing sound effect',()=>{
 setAudioSettings({effectsOn:true,effectsVolume:.4});playEffect('touch');
 const effect=effects.at(-1);assert.ok(effect);assert.equal(effect.volume,.4*.55);
 setAudioSettings({effectsVolume:0});assert.equal(effect.volume,0);
 setAudioSettings({effectsVolume:.2});assert.equal(effect.volume,.2*.55);
});
test('turning off effects stops active notes and sound effects',async()=>{
 setAudioSettings({effectsOn:true,effectsVolume:.4});playTune([0,1]);await Promise.resolve();
 const active=nodes.filter(n=>n.kind==='oscillator'&&!n.stopped);assert.ok(active.length>0);
 setAudioSettings({effectsOn:false});assert.ok(active.every(n=>n.stopped));assert.equal(effects.at(-1).paused,true);
});

test('routine sound effects do not overlap a player-made tune',async()=>{
 setAudioSettings({effectsOn:true,effectsVolume:.4});
 playTune([0,1,2,3]);await Promise.resolve();
 clock+=1000;const count=effects.length;playEffect('touch');assert.equal(effects.length,count);
 stopTune();
});

test('background position is saved while playing and changing tracks resets it',async()=>{
 initAudio();element('#music-toggle').onclick();element('#music-toggle').onclick();await Promise.resolve();
 const music=effects.find(e=>e.id==='garden-music');assert.ok(music);
 music.readyState=1;music.duration=Infinity;clock=20000;music.listeners.get('timeupdate')();assert.equal(JSON.parse(saves.get('little-lights-audio')).position,23);music.listeners.get('loadedmetadata')();music.duration=220;music.listeners.get('durationchange')();assert.equal(music.currentTime,23);music.currentTime=43;clock=40000;
 music.listeners.get('timeupdate')();
 assert.equal(JSON.parse(saves.get('little-lights-audio')).position,43);
 element('#music-next').onclick();
 assert.equal(JSON.parse(saves.get('little-lights-audio')).position,0);
 element('#music-toggle').onclick();
 assert.equal(JSON.parse(saves.get('little-lights-audio')).musicOn,false);
 element('#music-next').onclick();assert.equal(music.paused,true,'Skipping while quiet must not turn the music on');
});
