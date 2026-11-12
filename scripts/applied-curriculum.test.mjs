import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {learning} from '../learning.js';
import {chapters} from '../chapters.js';
import {parentNotes} from '../curriculum.js';
import {childPractice,parentPractice,fernDiary} from '../curriculum-practice.js';
import {parentGuide,bindParentPractice,reviewMarkup,bindReview,nextPracticeIndex} from '../curriculum-view.js';
import {partyActs,partyProject} from '../party.js';
import {freshProject,placeCard,activeProjectRound,isProjectComplete} from '../adventure.js';
test('all nineteen previously unused transfer stories are available with an explanation for every option',()=>{
 for(let i=0;i<19;i++){
  const cases=childPractice(i),first=cases[0];assert.ok(first.story.includes(learning[i].transfer.story));assert.deepEqual(first.options,learning[i].transfer.choices);
  for(const c of cases){assert.ok(c.options[c.answer]);assert.equal(c.feedback.length,c.options.length);assert.equal(new Set(c.feedback).size,c.feedback.length);for(const f of c.feedback)assert.ok(f?.length>25);}
  const html=reviewMarkup(i);assert.equal((html.match(/data-review-story="\d+" hidden/g)||[]).length,cases.length-1);assert.equal((html.match(/<details/g)||[]).length,1);
 }
});
test('parent decisions replace passive prompts and do not gate note navigation',()=>{
 assert.equal(parentPractice.length,19);assert.deepEqual([...new Set(parentPractice.map(c=>c.answer))].sort(),[0,1]);
 for(let i=0;i<19;i++){const c=parentPractice[i],html=parentGuide(i);assert.equal(c.options.length,2);assert.equal(c.feedback.length,2);assert.notEqual(c.feedback[0],c.feedback[1]);assert.ok(html.includes(c.story));assert.ok(html.includes('No score and nothing recorded'));assert.ok(html.includes(i<18?'Next:':'Back to all notes'));assert.ok(!html.includes('Think about Fern’s story'));}
});
test('parent decisions allow either answer and replace feedback without changing progress',()=>{
 const attrs=[{},{}],feedback={textContent:''},buttons=attrs.map((a,j)=>({dataset:{parentAnswer:String(j)},setAttribute:(k,v)=>a[k]=v}));let changes=0;
 const root={querySelectorAll:()=>buttons,querySelector:()=>feedback};bindParentPractice(root,18,()=>changes++);
 buttons[1].onclick();assert.equal(feedback.textContent,parentPractice[18].feedback[1]);buttons[0].onclick();assert.equal(feedback.textContent,parentPractice[18].feedback[0]);assert.equal(attrs[1]['aria-pressed'],'false');assert.equal(changes,2);
});
test('story paging retains feedback, hides other cases, and focuses the revealed heading',()=>{
 const stories=childPractice(7),sections=stories.map((_,i)=>({dataset:{reviewStory:String(i)},hidden:i>0})),feedback=stories.map(()=>({textContent:''})),headings=stories.map(()=>({focus:()=>{focused++},scrollIntoView:options=>{assert.equal(options.behavior,'instant');scrolled++}}));let focused=0,scrolled=0;
 const arrows=[-1,1].map(n=>({dataset:{reviewStep:String(n)},hidden:n<0})),position={textContent:''},buttons=stories.flatMap((s,i)=>s.options.map((_,j)=>({dataset:{review:i+':'+j},setAttribute(){}})));
 const root={querySelectorAll:s=>s==='[data-review]'?buttons:s==='[data-review-step]'?arrows:s==='[data-review-story]'?sections:buttons.filter(b=>s==='[data-review^="'+b.dataset.review.split(':')[0]+':"]'),querySelector:s=>{if(s.includes('feedback'))return feedback[Number(s.match(/"(\d+)"/)[1])];if(s.includes('step'))return s.includes('-1')?arrows[0]:arrows[1];if(s==='.review-position')return position;return headings[Number(s.match(/"(\d+)"/)[1])];}};
 bindReview(root,7);buttons[0].onclick();const first=feedback[0].textContent;arrows[1].onclick();assert.deepEqual(sections.map(s=>s.hidden),[true,false,true]);assert.equal(position.textContent,'Story 2 of 3');arrows[0].onclick();assert.equal(feedback[0].textContent,first);assert.equal(focused,2);assert.equal(scrolled,2);
 assert.equal(nextPracticeIndex(0,-1,3),0);assert.equal(nextPracticeIndex(2,1,3),2);
});
test('preparation occurs in planning before implementation and the review includes the missed response',()=>{
 assert.match(parentNotes[10].story.join(' '),/Before telling Glaloula/);assert.match(chapters[10].teach.join(' '),/Before the change starts/);
 assert.equal(fernDiary.length,3);assert.match(fernDiary[1].action,/picked blue/);assert.ok(parentGuide(18).includes(fernDiary[1].action));assert.match(parentPractice[18].feedback[0],/missed response/);
 const broad=JSON.stringify([childPractice(8),childPractice(9),childPractice(15),parentPractice[7]]);assert.match(broad,/cancels/);assert.match(broad,/picnic bag/);
});
test('the revised finale uses concrete decisions with unchanged card targets and resumable rounds',()=>{
 const expected=[[0,1,2,3,-1],[0,1,-1,-1],[0,1,2,3,4,5,6,-1,-1],[0,1,2,3,-1,-1],[0,1,-1,-1]];
 partyActs.forEach((a,i)=>assert.deepEqual(a.cards.map(c=>c[1]),expected[i]));
 for(const a of partyActs.filter(a=>a.rounds)){const p=partyProject(a),correct=p.cards.flatMap((c,i)=>c.target>=0?[i]:[]);assert.deepEqual(p.rounds.flatMap(r=>r.cardIds.filter(i=>p.cards[i].target>=0)).sort((a,b)=>a-b),correct);assert.ok(p.rounds.every(r=>r.story&&r.cardIds.some(i=>p.cards[i].target<0)));let board=freshProject();for(const n of correct){board=placeCard(p,board,n,p.cards[n].target).state;assert.ok(activeProjectRound(p,board)||isProjectComplete(p,board));}assert.ok(isProjectComplete(p,board));}
 assert.match(partyActs[4].intro.join(' '),/picked blue by habit/);assert.match(partyActs[4].cards[1][0],/all three notes/);
});
test('new educational prose has no em dashes or personal response fields',async()=>{
 for(const file of ['curriculum-practice.js','curriculum-view.js','party.js'])assert.ok(!(await readFile(new URL('../'+file,import.meta.url),'utf8')).includes('—'),file);
 assert.ok(!parentGuide(18).match(/<(input|textarea)\b/));
});
