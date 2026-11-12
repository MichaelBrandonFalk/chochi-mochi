import {parentPractice,childPractice} from '../curriculum-practice.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parentNotes,reviewStories,fernPlan,accommodationCycle,supportPairs} from '../curriculum.js';
import {parentGuide,teachingExtra,reviewMarkup,bindReview} from '../curriculum-view.js';
import {partyActs,partyProject} from '../party.js';
import {adventures,freshProject,placeCard,isProjectComplete,activeProjectRound} from '../adventure.js';
import {readingBookmark} from '../reading-route.js';
test('nineteen independent parent notes explain the sequence without child progress',()=>{
 assert.equal(parentNotes.length,19);assert.equal(new Set(parentNotes.map(n=>n.title)).size,19);
 for(let i=0;i<19;i++){const n=parentNotes[i];assert.ok(n.idea&&n.question);assert.equal(n.story.length,2);assert.ok(parentGuide(i).includes(parentPractice[i].story));assert.ok(parentGuide().includes('#parents-'+(i+1)));assert.equal(readingBookmark('parents-'+(i+1),[]),null);}
 assert.match(parentGuide(),/without playing/);assert.match(parentGuide(),/not an official or clinically validated/);
 assert.match(parentGuide(11),/spacetreatment.net/);
});
test('the child and adult clear-plan examples retain all three observable parts',()=>{
 const p=adventures[10].project;assert.deepEqual(p.cards.filter(c=>c.target>=0).map(c=>c.text),[fernPlan.when,fernPlan.change,fernPlan.support]);
 for(const text of [fernPlan.when,fernPlan.change,fernPlan.support])assert.ok(parentNotes[10].story.join(' ').includes(text));
 assert.equal(accommodationCycle.length,4);assert.equal(supportPairs.length,2);assert.ok(teachingExtra(7).includes('low table'));assert.equal(teachingExtra(8),'');
});
test('mixed practice revisits concepts with distinct explanations and both answer positions',()=>{
 assert.deepEqual(Object.keys(reviewStories).map(Number),[5,7,9,10,12,13,15,18]);
 const positions=new Set();for(const [i,cases]of Object.entries(reviewStories)){assert.ok(reviewMarkup(+i).includes('There is no score'));for(const c of cases){assert.ok(c.options[c.answer]);positions.add(c.answer);assert.equal(c.feedback.length,2);assert.notEqual(c.feedback[0],c.feedback[1]);}}
 assert.deepEqual([...positions].sort(),[0,1]);assert.ok(reviewMarkup(0).includes('A new little story'));assert.equal(reviewMarkup(-1),'');
});
test('practice feedback updates only the chosen story and allows both answers',()=>{
 const attrs=[{},{}],buttons=attrs.map((a,j)=>({dataset:{review:'0:'+j},setAttribute:(k,v)=>a[k]=v})),feedback={textContent:''};
 const root={querySelectorAll:s=>s==='[data-review]'||s==='[data-review^="0:"]'?buttons:[],querySelector:()=>feedback};
 bindReview(root,5);buttons[1].onclick();assert.equal(feedback.textContent,childPractice(5)[0].feedback[1]);assert.equal(attrs[1]['aria-pressed'],'true');buttons[0].onclick();assert.equal(feedback.textContent,childPractice(5)[0].feedback[0]);assert.equal(attrs[1]['aria-pressed'],'false');
});
test('three finale groups cover all seven notes once and resume old partial boards',()=>{
 const p=partyProject(partyActs[2]),valid=p.cards.flatMap((c,i)=>c.target>=0?[i]:[]);
 assert.equal(p.rounds.length,3);const covered=[];
 for(const r of p.rounds){assert.ok(r.cardIds.every(i=>p.cards[i]));const ids=r.cardIds.filter(i=>p.cards[i].target>=0);assert.ok(ids.length<=3);assert.ok(r.cardIds.some(i=>p.cards[i].target<0));covered.push(...ids);}
 assert.deepEqual(covered.sort((a,b)=>a-b),valid);
 let board=freshProject();assert.equal(activeProjectRound(p,board),p.rounds[0]);
 for(const n of [0,1,2])board=placeCard(p,board,n,p.cards[n].target).state;
 assert.equal(activeProjectRound(p,board),p.rounds[1]);
 // An older board may contain later notes before earlier ones.
 board=placeCard(p,board,6,p.cards[6].target).state;assert.equal(activeProjectRound(p,board),p.rounds[1]);
 for(const n of valid)if(!Object.hasOwn(board.placed,n))board=placeCard(p,board,n,p.cards[n].target).state;
 assert.equal(activeProjectRound(p,board),null);assert.ok(isProjectComplete(p,board));
});
test('new prose avoids em dashes and only valid parent routes are handled',async()=>{
 for(const file of ['curriculum.js','curriculum-view.js'])assert.ok(!(await readFile(new URL('../'+file,import.meta.url),'utf8')).includes('—'));
 const app=await readFile(new URL('../app.js',import.meta.url),'utf8');assert.ok(app.includes('bindReview(root,i,stopVoice)'));assert.ok(app.includes('parentGuide(n,state.tripChoices)'));
});
