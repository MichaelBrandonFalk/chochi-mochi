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
globalThis.window={localStorage:{getItem(){return null;},setItem(){},removeItem(){}},AudioContext:FakeContext,addEventListener(){},dispatchEvent(){}};
globalThis.document={hidden:false,querySelector:element,addEventListener(){},createElement(){const audio={dataset:{},volume:1,play(){return Promise.resolve();},pause(){this.paused=true;},remove(){}};effects.push(audio);return audio;}};
globalThis.requestAnimationFrame=()=>1;
globalThis.cancelAnimationFrame=()=>{};
Object.defineProperty(globalThis,'performance',{value:{now:()=>1000},configurable:true});
const {playTune,playEffect,setAudioSettings,stopTune}=await import('../audio.js');
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
 const effect=effects.at(-1);assert.ok(effect);assert.equal(effect.volume,.4);
 setAudioSettings({effectsVolume:0});assert.equal(effect.volume,0);
 setAudioSettings({effectsVolume:.2});assert.equal(effect.volume,.2);
});
test('turning off effects stops active notes and sound effects',async()=>{
 setAudioSettings({effectsOn:true,effectsVolume:.4});playTune([0,1]);await Promise.resolve();
 const active=nodes.filter(n=>n.kind==='oscillator'&&!n.stopped);assert.ok(active.length>0);
 setAudioSettings({effectsOn:false});assert.ok(active.every(n=>n.stopped));assert.equal(effects.at(-1).paused,true);
});
