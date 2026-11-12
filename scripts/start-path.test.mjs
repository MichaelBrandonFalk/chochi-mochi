import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanStartPath,cleanFernPage,parentReadingPage,startPathRoute} from '../start-path.js';
import {createPlayerStore} from '../player-store.js';
test('starting preferences preserve existing story players without asking for an age',()=>{
 assert.equal(cleanStartPath(undefined,true),'story');assert.equal(cleanStartPath(undefined,false),null);assert.equal(cleanStartPath(null,true),null);
 assert.equal(cleanStartPath('fern',true),'fern');assert.equal(cleanStartPath('story',false),'story');assert.equal(cleanStartPath('unexpected',false),null);
});
test('each starting path resumes only a valid page and keeps the child prologue first',()=>{
 assert.equal(startPathRoute('story',{introRead:false,bookmark:'level-12'}),'#story-1');
 assert.equal(startPathRoute('story',{introRead:true,bookmark:'level-3-scene-5'}),'#level-3-scene-5');
 assert.equal(startPathRoute('story',{introRead:true,bookmark:'level-20',done:[]}),'#story-1');
 assert.equal(startPathRoute('fern',{fernPage:11}),'#parents-11');assert.equal(startPathRoute('fern',{fernPage:99}),'#parents');
 for(const v of [0,-1,20,'11',null])assert.equal(cleanFernPage(v),0);
 assert.equal(parentReadingPage('parents-19'),19);assert.equal(parentReadingPage('parents-20'),0);assert.equal(parentReadingPage('level-3'),0);
});
test('the preferred path and Fern reading page remain separate for each optional player',()=>{
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
 const first=createPlayerStore(storage,()=> 'p-path00001');first.setItem('little-lights-v1',JSON.stringify({startPath:'story',bookmark:'level-4'}));
 const secondId=first.create('Fern reader'),second=createPlayerStore(storage);second.setItem('little-lights-v1',JSON.stringify({startPath:'fern',fernPage:8}));
 assert.equal(JSON.parse(first.getItem('little-lights-v1')).startPath,'story');assert.equal(JSON.parse(second.getItem('little-lights-v1')).fernPage,8);assert.equal(second.activeId,secondId);
});
