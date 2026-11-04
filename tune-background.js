// Suspend the soundtrack without changing the player's saved music preference.
export function tuneBackground({pause,resume,canResume}){
 let held=false;
 return {
  hold(){held=true;pause();},
  release(){if(!held)return;held=false;if(canResume())resume();},
  get held(){return held;}
 };
}
