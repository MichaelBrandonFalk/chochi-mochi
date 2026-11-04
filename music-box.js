// One score drives both the sound clock and the quiet visual player.
export const beatSeconds=.6;
export const notePaint=[
 {name:'Do',frequency:261.63,fill:'#c1cfad',lit:'#dfedc9',edge:'#6d895c'},
 {name:'Re',frequency:293.66,fill:'#d9bfd6',lit:'#edd5f2',edge:'#8b6298'},
 {name:'Mi',frequency:329.63,fill:'#ebcea7',lit:'#ffe4c0',edge:'#a27642'},
 {name:'Sol',frequency:392,fill:'#b9cfd1',lit:'#d3ecf0',edge:'#597f88'},
 {name:'La',frequency:440,fill:'#dacda9',lit:'#f7ecb5',edge:'#8c793a'}
];
export function tuneScore(notes){return (Array.isArray(notes)?notes:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<notePaint.length).slice(0,4).map((note,index)=>({note,index,at:index*beatSeconds,duration:beatSeconds-.08}));}
export const noteStyle=n=>{const p=notePaint[n];return p?`--note-fill:${p.fill};--note-lit:${p.lit};--note-edge:${p.edge}`:'';};
