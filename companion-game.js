import {notePaint} from './music-box.js?v=d0eee573bfaa';
export function companionPattern(seed){return Array.from({length:4},(_,i)=>(Math.floor(seed/(i+1))+i*2)%5);}
export function patternReply(notes,seed,robin,host){
 if(notes.length!==4)return '';
 const matched=notes.every((n,i)=>n===companionPattern(seed)[i]);
 return matched?`${robin?'Pipkin sings':'Button taps'} back our four notes. ${host} joins the last one. Our little band has learned this place’s tune!`:`${host} listens. “That one is yours!” ${robin?'Pipkin sings':'Button taps'} our new tune back to us. We can keep it, or try the little pattern.`;
}
export function patternNames(seed){return companionPattern(seed).map(n=>notePaint[n].name).join(' · ');}
