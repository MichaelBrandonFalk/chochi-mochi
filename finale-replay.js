// An encore has its own work space. Earned completion and the original boards stay intact.
export function cleanEncore(raw,finished){return finished&&raw&&Array.isArray(raw.ideas)?{ideas:[...new Set(raw.ideas.filter(n=>Number.isInteger(n)&&n>=0&&n<19))]}:null;}
export function startEncore(state){state.encore={ideas:[]};for(let i=0;i<5;i++)delete state.boards['encore-party-'+i];}
export function finishPartyAct(state,ideas){const visited=state.encore?state.encore.ideas:state.gifts;for(const i of ideas)if(!visited.includes(i))visited.push(i);}
