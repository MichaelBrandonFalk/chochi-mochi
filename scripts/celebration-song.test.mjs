import test from 'node:test';
import assert from 'node:assert/strict';
import {songActivity} from '../song-activities.js';
import {gameConfig,nativeTool,newGame,actGame,cleanGame} from '../trail.js';
import {tuneScore} from '../music-box.js';
import {celebrationChoices,celebrationMarkup} from '../celebration.js';
import {choiceArt} from '../choice-art.js';
import {renderAtlas,mapStops} from '../atlas.js';
import {lessons} from '../content.js';
test('twenty musical jobs have distinct titles, phrasing, valid notes and playable rhythms',()=>{
 const tasks=Array.from({length:20},(_,i)=>songActivity(i,713+i));
 assert.equal(new Set(tasks.map(t=>t.title)).size,20);
 assert.ok(new Set(tasks.map(t=>t.kind)).size>=7);
 assert.equal(new Set(tasks.map(t=>JSON.stringify([t.kind,t.rhythm,t.voice]))).size,20);
 for(let i=0;i<20;i++){
  const t=tasks[i];assert.equal(t.target.length,4);assert.ok(t.target.every(n=>Number.isInteger(n)&&n>=0&&n<5));
  assert.ok(t.preset.length<4);assert.equal(t.rhythm.length,4);
  const score=tuneScore(t.target,{rhythm:t.rhythm});assert.equal(score.length,4);
  for(let j=0;j<4;j++){assert.ok(score[j].duration>0);assert.ok(score[j].duration<score[j].span);if(j)assert.equal(score[j].at,score[j-1].at+score[j-1].span);}
 }
});
test('new musical jobs prefill only their opening and preserve old tunes and editing',()=>{
 for(let level=0;level<20;level++){
  const choices={0:1},c=gameConfig(level,choices,nativeTool(level,choices));let g=newGame(c);
  assert.deepEqual(g.notes,c.songTask.preset);
  while(g.notes.length<4)g=actGame('tune',g,c,'help');
  assert.deepEqual(g.notes,c.songTask.target);
  const changed=(g.notes[1]+1)%5,edited=actGame('tune',g,c,'set-note',{slot:1,n:changed});
  assert.equal(edited.notes[1],changed);assert.equal(edited.notes.length,4);assert.equal(edited.notes[0],g.notes[0]);
  assert.deepEqual(cleanGame({notes:[4,3,2,1]},c).notes,[4,3,2,1]);
 }
});
test('the celebration shows every selected story choice and its correct artwork branch',()=>{
 for(const value of [0,1]){
  const choices=Object.fromEntries(Array.from({length:19},(_,i)=>[i,value]));
  const items=celebrationChoices(choices),html=celebrationMarkup(choices,false);
  assert.equal(items.length,19);assert.equal((html.match(/data-celebration-choice=/g)||[]).length,19);
  for(const item of items)assert.ok(html.includes(item.name));
  assert.match(html,/20 of 20 places/);assert.match(html,/Turn on celebration music/);
  assert.match(html,value?/ride-balloon/:/ride-cloud/);
 }
 assert.equal(celebrationChoices({}).length,0);
 for(let i=0;i<19;i++)assert.notEqual(choiceArt(i,0),choiceArt(i,1),'Story choice '+i+' needs distinct art');
});
test('the final hex moves toward the library and its slanted ride label is gone',()=>{
 assert.ok(mapStops[19][0]>145&&mapStops[19][1]<545);
 const html=renderAtlas(lessons);assert.doesNotMatch(html,/rotate\(65|cloud home<|balloon home<|garden is just below/);
});
