import {trailScene} from '../trail-art.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons} from '../content.js';
test('19 complete lessons plus the app’s final review',()=>{assert.equal(lessons.length,19);assert.equal(new Set(lessons.map(l=>l.place)).size,19);for(const l of lessons){for(const k of ['place','title','story','learn','question','why','keepsake','adult'])assert.ok(l[k]?.length,k);assert.equal(l.choices.length,3);assert.ok(Number.isInteger(l.answer)&&l.answer>=0&&l.answer<3);assert.equal(new Set(l.choices).size,3);}});
test('all answer positions are used',()=>assert.deepEqual([...new Set(lessons.map(l=>l.answer))].sort(),[0,1,2]));
import {opening,chapters} from '../chapters.js';
test('every chapter teaches through a worked scene before practice',()=>{assert.equal(opening.length,3);assert.equal(chapters.length,lessons.length);for(const c of chapters){assert.ok(c.arrival.length>=2);assert.ok(c.explore.length>80);assert.ok(c.teach.length>=3);assert.ok(c.practice.length>=2);assert.ok(c.ending.length>80);const words=[...c.arrival,c.explore,...c.teach,...c.practice,c.ending].join(' ').split(/\s+/).length;assert.ok(words>=190,`Chapter too brief: ${words}`);}});
import { activities,finalChallenges } from '../activities.js';
test('practice and final review cover every lesson with valid choices',()=>{assert.equal(activities.length,19);assert.equal(finalChallenges.length,19);for(const a of activities){assert.ok(['pick','both','order'].includes(a.kind));assert.ok(a.prompt&&a.reply);if(a.kind==='pick')assert.ok(a.options[a.answer]);else assert.ok(a.options.length>=2);}for(const c of finalChallenges){assert.ok(c.story&&c.why);assert.ok(c.choices[c.answer]);assert.ok(!lessons.some(l=>l.question===c.question));}});
import {treasures,gatherings,practicePicture,trailMap,giftGarden} from '../world.js';
test('world content covers each place and the final story scenes in order',()=>{assert.equal(treasures.length,lessons.length);assert.deepEqual(gatherings.map(g=>g.at),[0,6,13,17]);for(const g of gatherings)assert.ok(g.text.length>=3&&g.next);const map=trailMap(lessons,[],false);assert.equal((map.match(/class="trail-stop /g)||[]).length,20);assert.ok(practicePicture(5,0,2).includes('0 of 2 lanterns lit'));assert.ok(practicePicture(5,2,2).includes('2 of 2 lanterns lit'));});
import {learning,letters} from '../learning.js';
test('every chapter has worked reply outcomes, a reason to explain, and a distinct transfer situation',()=>{assert.equal(learning.length,19);assert.deepEqual(Object.keys(letters).map(Number),[0,4,9,14,18]);for(const d of learning){assert.ok(d.stake&&d.because&&d.scene&&d.model);assert.equal(d.replies.length,2);for(const r of d.replies)assert.ok(r.say&&r.result&&r.reason);assert.ok(d.reasons[d.right]);assert.ok(d.transfer.choices[d.transfer.answer]);assert.ok(!lessons.some(l=>l.story===d.transfer.story));}});
import {readFile} from 'node:fs/promises';
test('the map begins with the opening before its 20 numbered places',()=>{const map=trailMap(lessons,[],false);assert.ok(map.indexOf('href="#story-1"')<map.indexOf('href="#level-1"'));assert.ok(map.includes('BEFORE LEVEL 1'));});
test('bundled audio has complete CC0 source records and intact files',async()=>{const entries=JSON.parse(await readFile(new URL('../assets/audio/manifest.json',import.meta.url),'utf8'));assert.equal(entries.length,14);for(const entry of entries){assert.equal(entry.license,'CC0-1.0');assert.equal(entry.attribution_required,false);const bytes=await readFile(new URL('../'+entry.file,import.meta.url));const {createHash}=await import('node:crypto');assert.equal(createHash('sha256').update(bytes).digest('hex'),entry.sha256);}});
import {adventures,normalizeChoices,selectedChoice,storyEchoes,freshProject,placeCard,isProjectComplete,partyStyle} from '../adventure.js';
import {partyActs,partyProject} from '../party.js';
import {mapStops} from '../atlas.js';
import {picnicPainting,ridePainting} from '../painting.js';
test('every place has a creative fork with a later story consequence',()=>{assert.equal(adventures.length,19);for(let i=0;i<19;i++){const a=adventures[i];assert.equal(a.choices.length,2);assert.notEqual(a.choices[0].outcome,a.choices[1].outcome);for(let j=0;j<2;j++){const c=selectedChoice(i,{[i]:j});assert.ok(c.label&&c.item&&c.outcome&&c.echo);assert.ok(storyEchoes(18,{[i]:j}).length>0||storyEchoes(i+3,{[i]:j}).length>0);}}assert.deepEqual(normalizeChoices({'0':1,'1':0,'19':1,'-1':0,'3':'1','4':99}),{0:1,1:0});});
const allProjects=[...adventures.map(a=>a.project),...partyActs.map(partyProject)];
test('all 24 playable projects can be completed with persistent useful work',()=>{for(const p of allProjects){assert.ok(['collect','compose','sequence','sort'].includes(p.mode));let current=freshProject();assert.ok(p.prompt&&p.hint&&p.success);for(let n=0;n<p.cards.length;n++){const c=p.cards[n];if(c.target<0)continue;assert.ok(p.slots[c.target]);const result=placeCard(p,current,n,c.target);assert.equal(result.ok,true,p.title);current=result.state;const again=placeCard(p,current,n,c.target);assert.deepEqual(again.state,current);}assert.ok(isProjectComplete(p,current),p.title);}});
test('wrong picks, wrong sorting, and wrong order leave earlier work intact',()=>{for(const p of allProjects){let current=freshProject();current=placeCard(p,current,0,p.cards[0].target).state;for(let n=0;n<p.cards.length;n++)if(p.cards[n].target<0){const r=placeCard(p,current,n,0);assert.equal(r.ok,false);assert.deepEqual(r.state,current);}if(p.mode==='sort'){const r=placeCard(p,current,1,1-p.cards[1].target);assert.equal(r.ok,false);assert.deepEqual(r.state,current);}if(p.mode==='sequence'){const r=placeCard(p,current,2,2);assert.equal(r.ok,false);assert.deepEqual(r.state,current);}}});
test('the five-part garden finale applies every idea exactly once',()=>{assert.equal(partyActs.length,5);const ideas=partyActs.flatMap(a=>a.ideas);assert.equal(ideas.length,19);assert.deepEqual([...ideas].sort((a,b)=>a-b),Array.from({length:19},(_,i)=>i));});
test('creative choices change the picnic painting and ride',()=>{const a=partyStyle({}),b=partyStyle({0:1,1:1,5:1,10:1,16:1,18:1});for(const k of Object.keys(a))assert.notEqual(a[k],b[k]);assert.ok(picnicPainting({16:1}).includes('Two little tables'));assert.ok(picnicPainting({0:1}).includes('Pipkin the robin'));assert.ok(ridePainting({18:1}).includes('petal balloon'));});
test('the hex route ends above home and floats beside its starting point',()=>{assert.equal(mapStops.length,20);assert.ok(mapStops[0][0]<Math.min(...mapStops.slice(1,19).map(p=>p[0])));assert.ok(mapStops[18][1]<mapStops[19][1]-150);assert.equal(mapStops[19][0],mapStops[0][0]);assert.ok(mapStops[19][1]>mapStops[0][1]);});
test('published prose uses no em dashes',async()=>{for(const file of ['app.js','adventure.js','atlas.js','party.js','painting.js','chapters.js','content.js','learning.js','trail.js','trail-data.js','trail-view.js','trail-art.js','access.js','access-model.js','dom-update.js'])assert.ok(!(await readFile(new URL('../'+file,import.meta.url),'utf8')).includes('—'),file);});
import {craftPainting} from '../crafts.js';
test('each chapter has its own growing craft illustration',()=>{const pictures=adventures.map((a,i)=>craftPainting(i,0,a.project.cards.filter(c=>c.target>=0).length));assert.equal(new Set(pictures).size,19);for(let i=0;i<19;i++){const total=adventures[i].project.cards.filter(c=>c.target>=0).length;assert.notEqual(pictures[i],craftPainting(i,total,total));assert.ok(craftPainting(i,total,total).includes(`${total} of ${total} pieces placed`));}});

test('the numbered valley route goes clockwise and the story is its first link',()=>{const points=mapStops.slice(0,19);const area=points.reduce((sum,p,i)=>{const q=points[(i+1)%points.length];return sum+p[0]*q[1]-q[0]*p[1];},0);assert.ok(area>0,'Clockwise in screen coordinates');const map=trailMap(lessons);assert.ok(map.indexOf('class="hex-story-start"')<map.indexOf('href="#level-1"'));assert.ok(map.includes('follow the numbers clockwise'));});
import {outings,recipes} from '../trail-data.js';
import {trailKey,trailSeed,trailKit,nativeTool,gameConfig,newGame,actGame,solved,cleanTrails,cleanTrail,mixTools,carriedCharms,choicesFromKey,travelGreeting} from '../trail.js';
test('every creative choice changes its later branches and remains a usable tool',()=>{const all=Object.fromEntries(Array.from({length:19},(_,i)=>[i,0]));for(let i=0;i<19;i++){const other={...all,[i]:1};for(let level=i;level<20;level++){assert.notEqual(trailKey(level,all),trailKey(level,other));assert.notEqual(trailSeed(level,all),trailSeed(level,other));const a=trailKit(level,all).find(t=>t.index===i),b=trailKit(level,other).find(t=>t.index===i);assert.ok(a&&b);assert.notEqual(a.id,b.id);assert.notEqual(a.name,b.name);}}});
test('future choices cannot change an earlier toy or its kit',()=>{const early={0:0,1:1},later={...early,5:1,13:1,16:1,18:1};assert.equal(trailKey(1,early),trailKey(1,later));assert.deepEqual(trailKit(1,early),trailKit(1,later));assert.deepEqual(gameConfig(1,early,nativeTool(1,early)),gameConfig(1,later,nativeTool(1,later)));});
test('each place has two companion routes and all six toy mechanics can finish',()=>{assert.equal(outings.length,20);const all=Object.fromEntries(Array.from({length:19},(_,i)=>[i,1]));const seen=new Set();for(let level=0;level<20;level++){assert.notEqual(outings[level].modes[0],outings[level].modes[1]);for(const tool of [nativeTool(level,all),...trailKit(level,all)]){seen.add(tool.mode);const c=gameConfig(level,all,tool);let g=newGame(c);for(let n=0;n<12&&!solved(tool.mode,g,c);n++)g=actGame(tool.mode,g,c,'help');assert.ok(solved(tool.mode,g,c),tool.name+' at '+level);}}assert.deepEqual([...seen].sort(),['boat','garden','seek','tune','weave','wheels']);});
test('boat variants offer different ponds and every dock can be visited',()=>{for(const v of [0,1]){const choices={8:v},t=trailKit(8,choices)[0],c=gameConfig(8,choices,t);assert.equal(c.width,v?5:3);for(let dock=0;dock<c.width;dock++){let g=newGame(c);for(let turn=0;turn<3;turn++)g=actGame('boat',g,c,'paddle',Math.sign(dock-g.boat.col));assert.equal(g.boat.col,dock);assert.ok(solved('boat',g,c));assert.ok(g.boat.visits.includes(dock));}}});
test('garden, loom, and music box are editable without a wrong answer',()=>{const c=gameConfig(4,{},nativeTool(4,{}));let g=newGame(c);for(let i=0;i<3;i++)g=actGame('garden',g,c,'plant',i);assert.ok(solved('garden',g,c));for(let n=0;n<3;n++)g=actGame('garden',g,c,'plant',0);assert.equal(g.cells[0],-1);for(let i=0;i<3;i++)g=actGame('weave',g,c,'weave',i);assert.ok(solved('weave',g,c));for(const n of [4,0,4,1])g=actGame('tune',g,c,'note',n);assert.deepEqual(g.notes,[4,0,4,1]);assert.ok(solved('tune',g,c));g=actGame('tune',g,c,'undo');assert.equal(g.notes.length,3);});
test('tool combinations unlock charms at later places on the same branch',()=>{const choices={4:1,5:0,7:1,8:0};const kit=trailKit(8,choices);const flower=mixTools(['4:1','5:0'],kit);assert.equal(flower.id,'glow');assert.equal(mixTools(['7:1','8:0'],kit).id,'sail');assert.equal(mixTools(['4:1','8:0'],kit),null);const records={[trailKey(8,choices)]:{mixes:['glow','sail']}};assert.equal(carriedCharms(12,choices,records).length,2);assert.equal(carriedCharms(12,{...choices,4:0},records).length,0);});
test('separate replay branches and toy saves survive sanitation',()=>{const choices={0:1,1:0,2:1},key=trailKey(2,choices);const r=cleanTrail(null,2,choices),t=nativeTool(2,choices),c=gameConfig(2,choices,t);r.games.native=actGame(t.mode,newGame(c),c,'help');r.mix=['0:1','1:0'];const other=trailKey(2,{...choices,0:0});const records=cleanTrails({[key]:r,[other]:cleanTrail(null,2,{...choices,0:0}),'__proto__':{},'19:0':{}});assert.equal(Object.keys(records).length,2);assert.deepEqual(records[key].games.native,r.games.native);assert.deepEqual(choicesFromKey(key),choices);assert.notEqual(key,other);});
test('a postcard from the previous outing returns in the next chapter story',()=>{const choices={0:1,1:0};const records={[trailKey(0,choices)]:{cards:['native']}};assert.ok(travelGreeting(1,choices,records).includes('song from Tuck'));});
import {carriedTune,carriedDesign} from '../trail.js';
test('kept tunes and patterns travel to later places on the same branch',()=>{const choices={0:1,1:0,2:1},r=cleanTrail(null,2,choices);r.cards=['2:1','1:0'];r.games['2:1']={...newGame(gameConfig(2,choices,trailKit(2,choices)[2])),notes:[4,1,0,3],kept:true};r.games['1:0']={rows:[2,0,1],kept:true};const records={[trailKey(2,choices)]:r};assert.deepEqual(carriedTune(5,choices,records).notes,[4,1,0,3]);assert.deepEqual(carriedDesign(5,choices,records).values,[2,0,1]);assert.equal(carriedTune(5,{...choices,0:0},records),null);});
import {accessDefaults,cleanAccess,accessPreset,effectiveAccess,safePosition} from '../access-model.js';
test('comfort preferences sanitize stored values and never collect diagnosis data',()=>{const p=cleanAccess({textSize:99,font:'invalid',contrast:true,rate:20,speechVolume:-1,voice:'a'.repeat(500),support:'headphones',diagnosis:'ignore'});assert.equal(p.textSize,1);assert.equal(p.font,'serif');assert.equal(p.contrast,true);assert.equal(p.rate,1.3);assert.equal(p.speechVolume,0);assert.equal(p.voice.length,200);assert.equal(p.support,'headphones');assert.ok(!Object.hasOwn(p,'diagnosis'));assert.deepEqual(cleanAccess(null),accessDefaults);});
test('comfort presets preserve independent choices and text-only mode retains controls',()=>{const initial={...accessDefaults,contrast:true,font:'sans'};const quiet=accessPreset('quiet',initial);assert.equal(quiet.contrast,true);assert.equal(quiet.font,'sans');assert.equal(quiet.plain,true);assert.equal(quiet.labelSpeech,false);const p=effectiveAccess({...accessDefaults,hideArt:true});assert.equal(p.largeControls,true);assert.equal(p.mapList,true);assert.equal(effectiveAccess({...accessDefaults,simple:true}).largeControls,false);assert.equal(safePosition(20,3),2);assert.equal(safePosition(-1,3),0);assert.equal(safePosition(NaN,3),0);});
test('direct toy controls reach the same goals without repeated cycling',()=>{const choices={0:0,5:1},tool=trailKit(5,choices).find(t=>t.index===5),c=gameConfig(5,choices,tool);let g=newGame(c);for(let i=0;i<3;i++)g=actGame('wheels',g,c,'set-wheel',{slot:i,n:c.targets[i]});assert.ok(solved('wheels',g,c));for(let i=0;i<3;i++)g=actGame('garden',g,c,'set-plot',{slot:i,n:2});assert.ok(solved('garden',g,c));g=actGame('garden',g,c,'set-plot',{slot:0,n:-1});assert.equal(g.cells[0],-1);for(let i=0;i<3;i++)g=actGame('weave',g,c,'set-row',{slot:i,n:1});assert.ok(solved('weave',g,c));const original=structuredClone(g);g=actGame('garden',g,c,'set-plot',{slot:99,n:2});assert.deepEqual(g,original);});
test('boat steering can be undone without losing discovered dock visits',()=>{const c=gameConfig(8,{8:1},trailKit(8,{8:1})[0]);let g=newGame(c);const start=g.boat.col;g=actGame('boat',g,c,'paddle',1);g=actGame('boat',g,c,'undo-boat');assert.equal(g.boat.row,0);assert.equal(g.boat.col,start);for(let n=0;n<3;n++)g=actGame('boat',g,c,'paddle',-1);const dock=g.boat.col;assert.ok(g.boat.visits.includes(dock));g=actGame('boat',g,c,'undo-boat');assert.equal(g.boat.row,2);assert.ok(g.boat.visits.includes(dock));});

test('the first choice grows out of the arrival and leads into its outing',()=>{const scene=chapters[0].arrival.join(' ');for(const name of ['Tuck','Button','Pipkin'])assert.ok(scene.includes(name));assert.ok(!/\bPip\b/.test(JSON.stringify([chapters,adventures,learning,outings])));assert.equal(travelGreeting(0,{},{}),'');assert.match(adventures[0].choices[0].outcome,/treasures/);assert.match(adventures[0].choices[1].outcome,/song/);});

import {createPlayerStore,cleanPlayers,playerRegistryKey,maxPlayers} from '../player-store.js';
const memoryStorage=initial=>{const data=new Map(Object.entries(initial||{}));return {data,getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,String(value)),removeItem:key=>data.delete(key)};};
test('optional players keep the original game and comfort keys without migration loss',()=>{const game=JSON.stringify({done:[0,1],trails:{kept:true}}),storage=memoryStorage({'little-lights-v1':game,'little-lights-access-v1':'original comfort','little-lights-audio':'original volume'}),p=createPlayerStore(storage);assert.equal(p.activeId,'original');assert.equal(p.getItem('little-lights-v1'),game);assert.equal(p.getItem('little-lights-access-v1'),'original comfort');assert.equal(p.getItem('little-lights-audio'),'original volume');assert.equal(storage.getItem(playerRegistryKey),null);assert.equal(p.summary('original'),2);});
test('switching players separates game, comfort, reading, and sound saves',()=>{const storage=memoryStorage({'little-lights-v1':'original game'}),first=createPlayerStore(storage,()=> 'p-test00001');const id=first.create('River'),second=createPlayerStore(storage);assert.equal(second.activeId,id);for(const key of ['little-lights-v1','little-lights-access-v1','little-lights-reading-positions','little-lights-audio','little-lights-break']){assert.equal(second.getItem(key),null);second.setItem(key,'River '+key);}second.switchTo('original');const original=createPlayerStore(storage);assert.equal(original.getItem('little-lights-v1'),'original game');assert.equal(original.getItem('little-lights-access-v1'),null);assert.equal(second.getItem('little-lights-v1'),'River little-lights-v1');});
test('five spaces include the original player and duplicate names cannot confuse switching',()=>{const storage=memoryStorage();let n=0;const p=createPlayerStore(storage,()=> 'p-test0000'+ ++n);for(let i=0;i<4;i++)p.create('');assert.equal(p.list().length,maxPlayers);assert.deepEqual(p.list().map(x=>x.name),['My adventure','Player 2','Player 3','Player 4','Player 5']);assert.throws(()=>p.create('Extra'),/five/);assert.throws(()=>p.switchTo('not-here'),/not here/);assert.throws(()=>p.rename('player 2'),/already here/);p.rename('Garden reader');assert.equal(p.active().name,'Garden reader');assert.equal(p.list().length,5);});
test('restarting clears only the current adventure and reading position',()=>{const storage=memoryStorage({'little-lights-v1':'old original','little-lights-access-v1':'keep original comfort'});const first=createPlayerStore(storage,()=> 'p-test00001');first.create('River');const p=createPlayerStore(storage);for(const key of ['little-lights-v1','little-lights-reading-positions','little-lights-break','little-lights-access-v1','little-lights-audio'])p.setItem(key,'saved '+key);p.restart();assert.equal(p.getItem('little-lights-v1'),'{}');assert.equal(p.getItem('little-lights-reading-positions'),'{}');assert.equal(p.getItem('little-lights-break'),'null');assert.equal(p.getItem('little-lights-access-v1'),'saved little-lights-access-v1');assert.equal(p.getItem('little-lights-audio'),'saved little-lights-audio');assert.equal(first.getItem('little-lights-v1'),'old original');assert.equal(p.active().name,'River');});
test('older tabs keep writing to their own player after another tab switches',()=>{const storage=memoryStorage();const old=createPlayerStore(storage,()=> 'p-test00001');old.create('River');const second=createPlayerStore(storage);old.setItem('little-lights-v1','original tab');second.setItem('little-lights-v1','River tab');second.switchTo('original');assert.equal(old.getItem('little-lights-v1'),'original tab');assert.equal(second.getItem('little-lights-v1'),'River tab');});
test('profile metadata is bounded and a failed registry write leaves the current game intact',()=>{assert.equal(cleanPlayers(null).active,'original');const clean=cleanPlayers({active:'bad',players:[{id:'../bad',name:'Bad'},{id:'original',name:'\u0000'+ 'a'.repeat(50)},{id:'original',name:'duplicate'}]});assert.equal(clean.players.length,1);assert.equal(clean.players[0].name.length,24);const storage=memoryStorage({'little-lights-v1':'keep'});storage.setItem=()=>{throw Error('Quota');};const p=createPlayerStore(storage,()=> 'p-test00001');assert.throws(()=>p.create('River'),/Quota/);assert.equal(p.active().id,'original');assert.equal(p.getItem('little-lights-v1'),'keep');});

import {tuneScore,beatSeconds,notePaint} from '../music-box.js';
import {cleanSnapshot} from '../trail.js';
test('sound and quiet playback share an ordered score with a steady gentle beat',()=>{const score=tuneScore([0,1,2,0]);assert.deepEqual(score.map(b=>b.note),[0,1,2,0]);assert.deepEqual(score.map(b=>b.index),[0,1,2,3]);for(let i=0;i<score.length;i++){assert.equal(score[i].at,i*beatSeconds);assert.ok(score[i].duration<beatSeconds);assert.ok(score[i].duration>0);}assert.equal(new Set(notePaint.map(n=>n.fill)).size,5);assert.deepEqual(tuneScore([99,-1,'2',3,4,0,1,2]).map(b=>b.note),[3,4,0,1]);assert.deepEqual(tuneScore(null),[]);});
test('saved postcard scenes remain frozen when a toy or carried pattern is edited',()=>{const choices={0:1},c=gameConfig(0,choices,nativeTool(0,choices)),g=newGame(c);g.notes=[0,1,2,3];const design={mode:'weave',values:[0,1,2]},snap=cleanSnapshot({game:g,charm:'glow',design},c);g.notes[0]=4;design.values[0]=2;assert.deepEqual(snap.game.notes,[0,1,2,3]);assert.deepEqual(snap.design.values,[0,1,2]);const r=cleanTrail({cards:['native'],games:{native:g},snapshots:{native:snap}},0,choices);assert.equal(r.games.native.notes[0],4);assert.equal(r.snapshots.native.game.notes[0],0);const carried=carriedTune(1,choices,{[trailKey(0,choices)]:r});assert.deepEqual(carried.notes,[0,1,2,3]);});
test('legacy postcards gain bounded snapshots without losing their saved toys',()=>{const choices={0:1},c=gameConfig(0,choices,nativeTool(0,choices)),g=newGame(c);g.notes=[4,3,2,1];const r=cleanTrail({cards:['native'],games:{native:g}},0,choices);assert.deepEqual(r.snapshots.native.game.notes,g.notes);assert.equal(r.snapshots.native.charm,null);assert.equal(r.snapshots.native.design,null);const malformed=cleanSnapshot({game:{notes:[99,2]},charm:'bad',design:{mode:'weave',values:[1,99]}},c);assert.deepEqual(malformed.game.notes,[2]);assert.deepEqual(malformed.design.values,[1,-1,-1]);});
import {outingMemory} from '../trail.js';
test('chapter memories recall a finished outing without inviting the same task again',()=>{const choices={0:1},key=trailKey(0,choices);assert.equal(outingMemory(0,choices,{}),'');const records={[key]:{games:{native:{notes:[0,1,2,3]}}}};assert.match(outingMemory(0,choices,records),/welcome song is ready/);records[key].snapshots={native:{game:{notes:[0,1,2,3]}}};records[key].games.native.notes=[];assert.match(outingMemory(0,choices,records),/welcome song is ready/);assert.equal(outingMemory(1,choices,records),'');assert.equal(outingMemory(0,{0:0},records),'');});
import {basketPainting,basketGiftName,letterPocket} from '../basket-art.js';
import {receivedLetterIds} from '../learning.js';
test('the travelling basket displays only packed gifts and received letters',()=>{const empty=basketPainting([],{},-1,[]);assert.equal((empty.match(/data-packed-gift=/g)||[]).length,0);assert.equal((empty.match(/data-packed-letter=/g)||[]).length,0);const packed=basketPainting([0,5,5,99],{5:1},5,[0,9,99]);assert.equal((packed.match(/data-packed-gift=/g)||[]).length,2);assert.equal((packed.match(/data-packed-letter=/g)||[]).length,0);const mail=letterPocket([0,9,99],lessons,letters);assert.equal((mail.match(/data-received-letter=/g)||[]).length,2);assert.ok(!mail.includes(letters[14].title));assert.ok(packed.includes('data-packed-gift="5"'));assert.ok(!packed.includes('data-packed-gift="1"'));assert.equal(basketGiftName(5,{5:1}),'Leaf lanterns');assert.equal(basketGiftName(9,{9:1}),'Dragon pebble');});
test('letter lists preserve deliveries without revealing future letters',()=>{assert.deepEqual(receivedLetterIds([],[]),[]);assert.deepEqual(receivedLetterIds([0,1,2],[]),[0]);assert.deepEqual(receivedLetterIds([],[4]),[4]);assert.deepEqual(receivedLetterIds([0,4],[0,99]),[0,4]);assert.deepEqual(receivedLetterIds([3],[99]),[]);});
import {availableMixes} from '../trail.js';
import {isFlightTool,tripStory,flightPlace} from '../trip-story.js';
test('mixing becomes available only with a complete usable recipe',()=>{assert.equal(availableMixes(trailKit(1,{0:1,1:1})).length,0);const kit=trailKit(5,{0:1,1:1,4:0,5:1});assert.deepEqual(availableMixes(kit).map(r=>r.id),['glow']);const pair=kit.filter(t=>[4,5].includes(t.index));assert.equal(mixTools(pair.map(t=>t.id),kit).id,'glow');assert.equal(mixTools(['0:1','1:1'],kit),null);});
test('Pipkin’s flight has three welcoming story endings rather than dock counters',()=>{assert.equal(isFlightTool({index:0,variant:1}),true);assert.equal(isFlightTool({index:8,variant:1}),false);for(let goalDock=0;goalDock<3;goalDock++){const c={goalDock},titles=[];for(let col=0;col<3;col++){const story=tripStory(0,{boat:{row:3,col}},c,true);titles.push(story.title);assert.ok(story.text.length>90);assert.ok(!/dock|lane/i.test(story.text));assert.ok(flightPlace(0,col,c));}assert.equal(new Set(titles).size,3);}});

import {audioPreferences,playlist,nextTrack} from '../audio-settings.js';
import {companionPattern,patternReply} from '../companion-game.js';
test('new players have sound on while explicit quiet preferences survive',()=>{assert.equal(audioPreferences().musicOn,true);assert.equal(audioPreferences().effectsOn,true);assert.equal(audioPreferences({musicOn:false,effectsOn:false}).musicOn,false);assert.equal(audioPreferences({musicOn:false,effectsOn:false}).effectsOn,false);assert.equal(audioPreferences({musicVolume:0}).musicVolume,0);assert.equal(playlist.length,12);assert.deepEqual(Array.from({length:playlist.length},(_,i)=>nextTrack(i)),[1,2,3,4,5,6,7,8,9,10,11,0]);assert.equal(audioPreferences({position:75}).position,75);assert.equal(audioPreferences({position:-1}).position,0);assert.equal(audioPreferences({position:Infinity}).position,0);});
test('each companion keeps a distinct outing through all twenty places',()=>{for(let level=0;level<20;level++)for(const choice of [0,1]){assert.equal(nativeTool(level,{0:choice}).mode,choice===1?'tune':'seek');const pattern=companionPattern(gameConfig(level,{0:choice},nativeTool(level,{0:choice})).seed);assert.equal(pattern.length,4);assert.ok(pattern.every(n=>Number.isInteger(n)&&n>=0&&n<5));assert.match(patternReply(pattern,gameConfig(level,{0:choice},nativeTool(level,{0:choice})).seed,choice===1,'Our host'),/learned this place/);}});
test('story character mentions carry their species and each chapter adds at most one name',()=>{const seen=new Set(['Chochi','Mochi','Glaloula','Fern','Button','Pipkin']);const names=['Tuck','Rue','Olive','Moss','Sol','Luma','Ada','Kit','Bea','Tansy','Mira','Wren','Ori','Alba','Brin','Nell','Fenn','Linn'];for(const chapter of chapters){const text=JSON.stringify(chapter);assert.ok(!/\bChochi\b(?! the Dinosaur)/.test(text));assert.ok(!/\bMochi\b(?! the Unicorn)/.test(text));const fresh=names.filter(n=>new RegExp('\\b'+n+'\\b').test(text)&&!seen.has(n));assert.ok(fresh.length<=1,'Too many new names: '+fresh.join(', '));for(const n of fresh)seen.add(n);}});

import {tuneBackground} from '../tune-background.js';
test('tunes pause the soundtrack and resume only when music is allowed',()=>{
 let enabled=true,visible=true,paused=false,position=42,resumes=0;
 const bg=tuneBackground({pause:()=>{paused=true;},resume:()=>{paused=false;resumes++;},canResume:()=>enabled&&visible});
 bg.hold();assert.equal(paused,true);assert.equal(position,42);bg.release();assert.equal(paused,false);assert.equal(resumes,1);
 bg.release();assert.equal(resumes,1);
 bg.hold();enabled=false;bg.release();assert.equal(paused,true);assert.equal(resumes,1);
 enabled=true;bg.hold();visible=false;bg.release();assert.equal(resumes,1);
});

import {chapterArt,storybookFigure,storybookBackdrop} from '../storybook.js';
test('every chapter has a distinct prepared painting and an accessible opening figure',async()=>{
 assert.equal(chapterArt.length,20);assert.equal(new Set(chapterArt.map(a=>a.src)).size,20);
 const manifest=JSON.parse(await readFile(new URL('../assets/storybook/manifest.json',import.meta.url),'utf8'));
 assert.equal(manifest.filter(x=>x.level).length,20);assert.equal(manifest.length,21);
 const {createHash}=await import('node:crypto');
 for(let i=0;i<20;i++){const art=chapterArt[i],entry=manifest.find(x=>x.level===i+1);assert.ok(art.alt.length>35);assert.ok(entry.width/entry.height>1.4&&entry.width/entry.height<1.6);assert.ok(storybookFigure(i).includes('alt="'+art.alt+'"'));assert.match(storybookFigure(i),/srcset=/);assert.equal(createHash('sha256').update(await readFile(new URL('../'+entry.file,import.meta.url))).digest('hex'),entry.sha256);await readFile(new URL(art.src.replace('.webp','-small.webp')));}
});
test('toy scenes load paintings on demand and keep live note markers',()=>{
 for(let i=0;i<20;i++){assert.match(storybookBackdrop(i),/href="[^"<>]+-small\.webp"/);}
 const choices={0:1},tool=nativeTool(0,choices),c=gameConfig(0,choices,tool),g=newGame(c);g.notes=[0,1,2,3];
 const svg=trailScene(0,choices,c,tool,g,'tune');assert.match(svg,/music-case\.webp/);assert.equal((svg.match(/data-song-scene=/g)||[]).length,4);assert.ok(!svg.includes('data:image/webp;base64,'));assert.match(svg,/<filter/);
});
test('chapter art stays before the story and comfort styles follow the new palette',async()=>{
 const app=await readFile(new URL('../app.js',import.meta.url),'utf8'),html=await readFile(new URL('../index.html',import.meta.url),'utf8');
 assert.ok(app.includes("storybookFigure(i,{className:'chapter-opening-art',eager:true})+paragraphs(c.arrival)"));
 assert.ok(app.includes("storybookFigure(19,{className:'chapter-opening-art',eager:true})"));
 assert.ok(html.indexOf('storybook.css')<html.indexOf('access.css'));
 const css=await readFile(new URL('../storybook.css',import.meta.url),'utf8');assert.ok(css.includes('body[data-hide-art=true]'));assert.ok(css.includes('body[data-contrast=true]'));
});

import {giftSlugs,giftSrc,giftSlots} from '../object-art.js';
test('watercolor gift slots fit inside the basket lining at every collection size',()=>{
 for(let n=1;n<=19;n++){const slots=giftSlots(n);assert.equal(slots.length,n);for(const s of slots)for(const dx of [-1,1])for(const dy of [-1,1]){const x=s.x+dx*(s.w/2+2),y=s.y+dy*(s.h/2+2);assert.ok(((x-470)/318)**2+((y-365)/148)**2<=1,'Item touches the rim at count '+n);}}
});
test('painted gifts have distinct art and preserve the five visual story choices',()=>{
 assert.equal(giftSlugs.length,19);assert.equal(new Set(giftSlugs).size,19);for(const i of [1,4,5,7,9])assert.notEqual(giftSrc(i,{[i]:0}),giftSrc(i,{[i]:1}));
 const art=basketPainting([0,1,11],{1:1},0,[0]);assert.match(art,/basket\.webp/);assert.match(art,/gift-12-invitation/);assert.ok(!art.includes('letter-envelope'));assert.ok(!art.includes('data-packed-letter'));assert.equal((art.match(/data-packed-gift=/g)||[]).length,3);
});
test('map title sits outside the level artwork and saved track choices remain valid',()=>{
 const map=trailMap(lessons,[],false);assert.ok(map.indexOf('atlas-book-title')<map.indexOf('atlas-viewport'));const svg=map.slice(map.indexOf('<svg'),map.indexOf('</svg>'));assert.ok(!svg.includes('The Valley of Little Lights'));
 assert.equal(playlist[audioPreferences({track:'willow-flute.mp3',musicOn:false}).track].file,'willow-flute.mp3');assert.equal(audioPreferences({track:'missing.mp3'}).track,0);assert.equal(audioPreferences({musicOn:false}).musicOn,false);
});
test('all object cutouts are prepared with alpha and recorded checksums',async()=>{
 const entries=JSON.parse(await readFile(new URL('../assets/objects/manifest.json',import.meta.url),'utf8'));assert.equal(entries.length,31);const {createHash}=await import('node:crypto');for(const e of entries){assert.equal(e.alpha[0],0);assert.ok(e.alpha[1]>200);assert.equal(createHash('sha256').update(await readFile(new URL('../'+e.file,import.meta.url))).digest('hex'),e.sha256);}
});

import {selfContainedSVG} from '../postcard-images.js';
test('postcard embedding preserves exact image bytes and caches shared art',async()=>{
 const original=globalThis.fetch;let requests=0;const bytes=new Uint8Array([0,255,123,45,8]);
 globalThis.fetch=async()=>{requests++;return new Response(bytes,{headers:{'content-type':'image/webp'}});};
 try{const input='<svg><image href="https://example.test/test-paint.webp"/><image href="https://example.test/test-paint.webp"/></svg>';
 const result=decodeURIComponent((await selfContainedSVG(input)).split(',').slice(1).join(','));
 assert.ok(!result.includes('https://'));assert.equal((result.match(/data:image\/webp;base64,AP97LQg=/g)||[]).length,2);
 await selfContainedSVG(input);assert.equal(requests,1);
 }finally{globalThis.fetch=original;}
});

import {hunts,huntObjects,huntSVG} from '../hidden-garden.js';
test('all twenty finding walks have painted targets, safe hit areas, and new replay positions',()=>{
 assert.equal(hunts.length,20);assert.equal(new Set(hunts.map(h=>h.title)).size,20);
 for(let level=0;level<20;level++){const c=gameConfig(level,{0:0},nativeTool(level,{0:0})),g=newGame(c),objects=huntObjects(level,c,g);
 assert.equal(objects.length,6);assert.equal(new Set(objects.map(o=>o.slug)).size,6);assert.equal(objects.filter(o=>o.target).length,3);assert.equal(new Set(objects.filter(o=>o.target).map(o=>o.slug)).size,3);
 for(const o of objects){assert.ok(o.x>65&&o.x<655);assert.ok(o.y>65&&o.y<415);assert.ok(o.reply.length>30);}
 assert.notDeepEqual(objects.map(o=>[o.x,o.y]),huntObjects(level,c,{...g,huntRound:1}).map(o=>[o.x,o.y]));
 let finished=g;for(const slot of c.findSlots)finished=actGame('seek',finished,c,'find',slot);assert.ok(solved('seek',finished,c));
 assert.match(huntSVG(level,c,finished),/assets\/objects/);
 }
});
test('finding replays and old musical postcards survive save cleaning',()=>{
 const choices={0:0},c=gameConfig(0,choices,nativeTool(0,choices)),g={...newGame(c),huntVersion:0,found:[0,1,2,3,4,5],huntRound:12,notes:[0,1,2,3]};
 const old=cleanTrail({games:{native:g},cards:['native'],snapshots:{native:{mode:'tune',game:g}}},0,choices);
 assert.equal(old.snapshots.native.mode,'tune');const legacy=cleanTrail({games:{native:g},cards:['native']},0,choices);assert.equal(legacy.snapshots.native.mode,'tune');assert.deepEqual(old.snapshots.native.game.notes,g.notes);assert.equal(old.games.native.huntRound,12);assert.deepEqual(old.games.native.found,[]);assert.equal(old.games.native.huntVersion,1);
 const snap=cleanSnapshot({huntVersion:1,mode:'seek',game:g},c);assert.equal(snap.huntVersion,1);assert.equal(snap.game.huntRound,12);
});

test('finding art and labels follow the same saved choices as basket gifts',()=>{
 for(let level=0;level<20;level++)for(const choice of [0,1]){
  const choices=Object.fromEntries(Array.from({length:19},(_,i)=>[i,choice]));choices[0]=0;
  const c=gameConfig(level,choices,nativeTool(level,choices)),g=newGame(c),objects=huntObjects(level,c,g);
  assert.equal(new Set(objects.map(o=>o.src)).size,6);
  for(const o of objects.filter(o=>o.target)){const i=hunts[level].gifts[c.findSlots.indexOf(o.slot)];assert.equal(o.src,giftSrc(i,c.storyChoices));assert.equal(o.name,basketGiftName(i,c.storyChoices).toLowerCase());}
 }
});

test('every soundtrack selection has a bundled CC0 record',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../assets/audio/manifest.json',import.meta.url),'utf8'));
 for(const track of playlist){const item=manifest.find(m=>m.file==='assets/audio/'+track.file);assert.ok(item,track.file);assert.equal(item.license,'CC0-1.0');assert.equal(item.attribution_required,false);}
 assert.equal(new Set(playlist.map(t=>t.file)).size,playlist.length);
});

test('compact map starts with the story, then suggests the next unfinished place',()=>{
 const initial=trailMap(lessons,[],false,false,{});assert.match(initial,/class="atlas-preview" data-selected="-1"/);assert.match(initial,/data-map-visit href="#story-1"/);
 const next=trailMap(lessons,[0,1],false,true,{});assert.match(next,/class="atlas-preview" data-selected="2"/);assert.match(next,/data-map-visit href="#level-3"/);
 const finished=trailMap(lessons,Array.from({length:19},(_,i)=>i),true,true,{});assert.match(finished,/class="atlas-preview" data-selected="19"/);
 for(let i=0;i<20;i++)assert.ok(next.includes('data-atlas-place="'+i+'"'));
});
test('wide project pictures reveal a visible slice with the first placed piece',()=>{
 const first=craftPainting(0,1,3);assert.match(first,/clip-path:inset\(0 67% 0 0\)/);
 assert.match(craftPainting(0,3,3),/clip-path:inset\(0 0% 0 0\)/);
 assert.ok(craftPainting(0,0,3).includes('Our picture will fill with color.'));
});

import {packedGiftIds,madeGiftMessage} from '../basket-art.js';
test('finished projects enter the basket before chapter completion without delivering future letters',()=>{
 const done=[],projects=[0];assert.deepEqual(packedGiftIds(done,projects),[0]);assert.deepEqual(done,[]);assert.deepEqual(receivedLetterIds(done,[]),[]);
 assert.deepEqual(packedGiftIds([0,2],[2,1,19,-1,'3']),[0,1,2]);
 assert.match(madeGiftMessage(0),/You made welcome flags\. They are now in your basket\./);assert.match(madeGiftMessage(18),/made a storybook\. It is now/);
});


test('generated finding replies keep possessive gift names without doubled articles',()=>{
 for(let level=0;level<20;level++)for(const variant of [0,1]){
  const choices=Object.fromEntries(Array.from({length:19},(_,i)=>[i,variant]));choices[0]=0;
  const config=gameConfig(level,choices,nativeTool(level,choices));
  for(const object of huntObjects(level,config,newGame(config)))assert.doesNotMatch(object.reply,/\b(?:the our|our our|a our)\b/i);
 }
});


test('garden gift labels follow the player’s chosen art rather than old keepsake names',()=>{
 const garden=giftGarden([0,5,9],9,{5:1,9:1});
 for(const name of ['Welcome flags','Leaf lanterns','Dragon pebble'])assert.ok(garden.includes('Read about '+name));
 assert.ok(!garden.includes('Read about Sun pebble'));
});
test('garden plans leave the companion undecided until the player chooses',()=>{
 const waiting=picnicPainting({});assert.ok(waiting.includes('A place for a travelling friend'));assert.ok(!waiting.includes('Button the snail'));
 assert.ok(picnicPainting({0:0}).includes('Button the snail'));assert.ok(picnicPainting({0:1}).includes('Pipkin the robin'));
});


import {readingBookmark} from '../reading-route.js';
test('unavailable ending previews cannot replace a resumable reading page',()=>{
 let bookmark=readingBookmark('level-3-scene-3',[]);
 for(const preview of ['level-20','level-20-scene-1','homeward'])bookmark=readingBookmark(preview,[])||bookmark;
 assert.equal(bookmark,'level-3-scene-3');
 const complete=Array.from({length:19},(_,i)=>i);
 assert.equal(readingBookmark('level-20',complete),'level-20');assert.equal(readingBookmark('homeward',complete),'homeward');
 assert.equal(readingBookmark('homeward',Array(19).fill(0)),null);
 for(const route of ['level-0','level-21','outing-21','outing-2-scene-3','story-4',null])assert.equal(readingBookmark(route,complete),null);
 for(const route of ['story-1','level-1','level-19-scene-7','outing-20'])assert.equal(readingBookmark(route,[]),route);
});
