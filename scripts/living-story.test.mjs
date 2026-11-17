import test from 'node:test';
import assert from 'node:assert/strict';
import {storyMoment,storyEventKey,cleanStoryEvents,storyMomentMarkup} from '../living-story.js';
import {songScenery,songSceneryTheme} from '../music-garden.js';
import {replyScene} from '../reply-scenes.js';
import {cleanEncore,startEncore,finishPartyAct} from '../finale-replay.js';
import {carriedTune,trailKey} from '../trail.js';
test('nineteen optional moments respond to the preceding choice and the travelling companion',()=>{
 const discoveries=[new Set(),new Set()];
 for(let level=1;level<=19;level++){
  const base=Object.fromEntries(Array.from({length:level},(_,i)=>[i,0]));
  const a=storyMoment(level,base),b=storyMoment(level,{...base,[level-1]:1});
  assert.notEqual(a.before,b.before);assert.ok(a.action&&a.after);assert.doesNotMatch(JSON.stringify(a),/undefined|—/);
  for(const companion of [0,1])discoveries[companion].add(storyMoment(level,{...base,0:companion}).discovery);
  assert.equal(storyMoment(level,{}),null);
 }
 assert.equal(discoveries[0].size,19);assert.equal(discoveries[1].size,19);
});
test('a current or future choice cannot erase an earlier arrival event; earlier branches stay separate',()=>{
 const choices={0:1,1:0},key=storyEventKey(2,choices);
 assert.equal(key,storyEventKey(2,{...choices,2:1,18:1}));
 assert.notEqual(key,storyEventKey(2,{...choices,1:1}));
 const clean=cleanStoryEvents(JSON.parse(JSON.stringify({[key]:true,'1:00':true,'20:0':true,'2:zz':true,'2:01':false})));
 assert.deepEqual(clean,{[key]:true});assert.match(storyMomentMarkup(2,choices,clean),/aria-expanded="true"/);
 assert.doesNotMatch(storyMomentMarkup(2,{...choices,1:1},clean),/aria-expanded="true"/);
});
test('twenty musical places keep five readable note targets and remember the notes already planted',()=>{
 assert.equal(new Set(Array.from({length:20},(_,i)=>songSceneryTheme(i))).size,20);
 for(let i=0;i<20;i++){
  const html=songScenery(i,[0,0,2,4]);assert.equal((html.match(/data-song-world-note=/g)||[]).length,5);
  assert.equal((html.match(/data-grown="true"/g)||[]).length,3);assert.doesNotMatch(html,/filter=|animate|undefined/);
 }
});
test('six conversation pictures explain both outcomes without relying on colour alone',()=>{
 for(const i of [0,1,5,7,13,16]){assert.notEqual(replyScene(i,0),replyScene(i,1));for(const n of [null,0,1])assert.match(replyScene(i,n),/<figcaption>[^<]+<\/figcaption>/);}
 assert.equal(replyScene(2,0),'');
});
test('an encore preserves earned gifts and finished status, and saves its own progress',()=>{
 const state={finished:true,gifts:[0,1,2],done:[0,1,2],boards:{'party-0':{placed:{0:0}},'encore-party-0':{old:true}}};
 startEncore(state);finishPartyAct(state,[0,1]);finishPartyAct(state,[1,2]);
 assert.deepEqual(state.gifts,[0,1,2]);assert.equal(state.finished,true);assert.deepEqual(state.boards['party-0'],{placed:{0:0}});
 assert.equal(state.boards['encore-party-0'],undefined);assert.deepEqual(cleanEncore(JSON.parse(JSON.stringify(state.encore)),true),{ideas:[0,1,2]});
 assert.equal(cleanEncore(state.encore,false),null);assert.deepEqual(cleanEncore({ideas:[0,0,-1,19,'2']},true),{ideas:[0]});
});
test('an automatically saved tune can travel without a postcard and stays isolated to its branch',()=>{
 const choices={0:1},records={[trailKey(0,choices)]:{games:{native:{notes:[0,2,3,4]}}}};
 assert.deepEqual(carriedTune(1,choices,records)?.notes,[0,2,3,4]);assert.equal(carriedTune(1,{0:0},records),null);
});
