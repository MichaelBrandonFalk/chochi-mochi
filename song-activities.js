import {companionPattern} from './companion-game.js';
// Familiar controls, different musical jobs. No timer or required answer.
const places=[
 ['The gate’s hello','echo','Copy Pipkin’s hello, or make a hello of your own.',[1,1,.5,1.5],'harp'],
 ['A song for tiny capes','finish','Rue has two notes. Add two more for the mice to march to.',[.5,.5,1,2],'wood'],
 ['The owl’s answer','answer','Listen to Pipkin’s call. Make four notes that could answer it.',[1.5,.5,1,1],'flute'],
 ['The pond sings back','reverse','The pool sends sounds back the other way. Try Pipkin’s notes backward.',[1,.5,.5,2],'bell'],
 ['A little growing song','rise','Start low. Let each note grow a little higher, like Sol’s beans.',[.5,1,1,1.5],'wood'],
 ['Two lanterns talking','pairs','Give one lantern two notes. Give the other lantern two notes back.',[.5,1.5,.5,1.5],'bell'],
 ['The orchard’s last note','finish','Ada has three notes for the picnic. Choose the last note.',[1,.5,1,1.5],'harp'],
 ['Ribbon music','repeat','Make two notes, then play those two again. Our ribbon has a pattern!',[.5,.5,1.5,1.5],'flute'],
 ['Rocking leaf boats','answer','Pipkin sings to a little boat. Make an answer that rocks along.',[1.5,1,.5,1],'harp'],
 ['Three pebbles and a surprise','finish','Three pebbles sound the same. Choose a new sound for the last one.',[.5,.5,.5,2],'wood'],
 ['A path made of notes','fall','Start high. Step down through four notes to find the picnic.',[1,.5,1.5,1],'flute'],
 ['A letter in four sounds','echo','Pipkin sends a hello in four sounds. Send it back, or write your own.',[.5,1.5,1,.5],'bell'],
 ['The water wheel turns','repeat','Try two sounds, then let them come round again with the wheel.',[.5,1,.5,1],'wood'],
 ['A cloud with a song','finish','Alba has one soft note. Add three more to float beside it.',[1.5,1.5,1,2],'flute'],
 ['A small tea-time answer','answer','Pipkin offers a tiny tune. Make a quiet answer for Brin’s tea table.',[1,.5,1.5,1.5],'harp'],
 ['An echo on the way home','reverse','Hear the call. Play its notes from the end to the start.',[1.5,.5,1.5,.5],'flute'],
 ['A song for two friends','pairs','Let two notes ask a question. Let the next two answer.',[1,1,1.5,.5],'wood'],
 ['A song for one small leaf','rise','Start with a small low sound. Give the leaf a rising song.',[.5,1.5,1,2],'bell'],
 ['The book’s last line','finish','Linn starts the last line of our song book. Add its two closing notes.',[1.5,1,1,2],'harp'],
 ['Our garden band','answer','Pipkin calls the whole garden band. Make four notes for everyone to share.',[.5,.5,1,1.5],'bell']
];
export function songActivity(level,seed=0){
 const [title,kind,prompt,rhythm,voice]=places[Math.max(0,Math.min(19,level))];
 const call=companionPattern(seed),target=kind==='reverse'?[...call].reverse():kind==='rise'?[0,1,2,4]:kind==='fall'?[4,3,2,0]:kind==='repeat'?[call[0],call[1],call[0],call[1]]:call;
 const prefix=kind==='finish'?(level===6||level===9?3:level===13?1:2):0;
 if(level===9)target.splice(0,3,call[0],call[0],call[0]);
 return {title,kind,prompt,rhythm,voice,call:kind==='answer'||kind==='pairs'?call.slice(0,2):kind==='reverse'?call:target,target,preset:target.slice(0,prefix)};
}
export function songResponse(notes,task,host){
 if(notes.length!==4)return '';
 const matched=notes.every((n,i)=>n===task.target[i]);
 return matched?`${host} joins in. “That is our ${task.kind==='reverse'?'backward song':task.kind==='repeat'?'round-and-round song':'little song'}!” Pipkin gives a happy bow.`:`${host} sways to the tune. “You made that one your own!” Pipkin sings it back. Both songs can belong here.`;
}
