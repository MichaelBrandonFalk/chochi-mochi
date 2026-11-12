import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {adventures} from '../adventure.js';
import {chapters} from '../chapters.js';
import {learning} from '../learning.js';
import {travelGreeting,trailKey,postcardLabel} from '../trail.js';
import {basketGiftName} from '../basket-art.js';
test('every previous story choice changes the next outing callback without requiring a postcard',()=>{
 for(let previous=0;previous<19;previous++){
  const messages=[0,1].map(variant=>travelGreeting(previous+1,{[previous]:variant},{},[]));
  assert.notEqual(messages[0],messages[1],`choice ${previous}`);
  for(const [variant,text]of messages.entries()){
   const label=adventures[previous].choices[variant].label;assert.ok(text.toLowerCase().includes(label.toLowerCase()));
   assert.ok(!text.includes('in the basket'));assert.ok(!text.includes('from the last stop'));
  }
 }
 assert.equal(travelGreeting(0,{},{}),'');assert.equal(travelGreeting(7,{},{}),'');
});
test('basket callbacks require an earned gift and use its current choice-dependent name',()=>{
 for(const previous of [1,4,5,9])for(const variant of [0,1]){
  const choices={[previous]:variant},text=travelGreeting(previous+1,choices,{},[previous]);
  assert.ok(text.toLowerCase().includes(basketGiftName(previous,choices).toLowerCase()));assert.match(text,/in the basket/);
 }
});
test('postcard callbacks name the saved mode and respect the branch rather than an old outing souvenir',()=>{
 const choices={0:1,5:1},key=trailKey(5,choices),record={cards:['native'],snapshots:{native:{mode:'tune'}}},records={[key]:record};
 assert.equal(postcardLabel(5,choices,record),'song from Luma');
 const greeting=travelGreeting(6,choices,records);assert.ok(greeting.includes('song from Luma'));assert.ok(!greeting.includes('paper town'));
 const legacy={cards:['native'],snapshots:{native:{mode:'wheels'}}};assert.equal(postcardLabel(5,choices,legacy),'paper-wheel picture from Luma');
 assert.ok(!travelGreeting(6,{0:1,5:0},records).includes('postcard album'));
});
test('Sol is consistently a mother and the lantern description matches the two stands',()=>{
 const sol=JSON.stringify([chapters[4],learning[4],adventures[4]]);
 assert.ok(sol.includes('a mom'));for(const old of [/\bhis son/i,/\bhe says\b/,/\bHe cannot\b/])assert.ok(!old.test(sol),String(old));
 assert.ok(chapters[5].explore.includes('two stands'));assert.ok(!chapters[5].explore.includes('same post'));
});
test('retired memory and charm controls are absent while saved-picture support remains',async()=>{
 const source=await readFile(new URL('../trail-view.js',import.meta.url),'utf8');
 for(const retired of ['Something we brought from an earlier stop','Things we made together. Pick one','data-memory-tune','data-memory-design','data-charm='])assert.ok(!source.includes(retired),retired);
 assert.ok(source.includes('snapshot.charm'));assert.ok(source.includes('data-keep'));
});
