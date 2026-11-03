// Audio starts only after an explicit control is used in this visit.
let music, effect, musicOn=false, effectsOn=false, narrating=false, fadeFrame, lastEffect=0,playGeneration=0;
let musicVolume=.15, effectsVolume=.25;
try{const p=JSON.parse(localStorage.getItem('little-lights-audio')||'{}');if(Number.isFinite(p.musicVolume))musicVolume=Math.max(0,Math.min(1,p.musicVolume));if(Number.isFinite(p.effectsVolume))effectsVolume=Math.max(0,Math.min(1,p.effectsVolume));}catch{}
const source=name=>new URL(`./assets/audio/${name}`,import.meta.url).href;
const status=text=>{document.querySelector('#audio-status').textContent=text;};
function persist(){try{localStorage.setItem('little-lights-audio',JSON.stringify({musicVolume,effectsVolume}));}catch{}}
function paint(){const button=document.querySelector('#music-toggle');button.textContent=musicOn?'Pause music':'Play music';button.setAttribute('aria-pressed',String(musicOn));document.querySelector('#effects-toggle').checked=effectsOn;}
function gain(){if(!music)return;cancelAnimationFrame(fadeFrame);const from=music.volume,to=musicVolume*(narrating ? 0.18 : 1),start=performance.now();function step(now){const t=Math.min(1,(now-start)/200);music.volume=from+(to-from)*t;if(t<1)fadeFrame=requestAnimationFrame(step);}fadeFrame=requestAnimationFrame(step);}
export function setNarrating(value){narrating=value;if(value)stopTune();gain();}
export function playEffect(kind='touch'){
 if(!effectsOn||narrating||document.hidden)return;
 const now=performance.now();if(now-lastEffect<140)return;lastEffect=now;
 if(effect){effect.pause();effect.remove();}
 effect=document.createElement('audio');effect.dataset.gameEffect=kind;effect.preload='none';effect.src=source(kind==='touch'?'page-touch.mp3':'keepsake.mp3');effect.volume=effectsVolume;document.querySelector('#audio-engine').append(effect);effect.play().catch(()=>status('This browser could not play the sound. The story still works.'));
}
function pauseMusic(){playGeneration++;musicOn=false;if(music)music.pause();paint();}
export function initAudio(){
 document.querySelector('#music-volume').value=Math.round(musicVolume*100);
 document.querySelector('#effects-volume').value=Math.round(effectsVolume*100);
 document.querySelector('#music-toggle').onclick=async()=>{
  if(musicOn){pauseMusic();status('Music paused.');return;}
  if(!music){music=document.createElement('audio');music.id='garden-music';music.preload='none';music.loop=true;music.src=source('calm-garden.mp3');document.querySelector('#audio-engine').append(music);music.addEventListener('error',()=>{pauseMusic();status('The music could not load. You can keep playing quietly.');});}
  music.volume=musicVolume*(narrating ? 0.18 : 1);
  const generation=++playGeneration;musicOn=true;paint();status('Starting music…');try{await music.play();if(generation!==playGeneration){music.pause();return;}status('Music is playing.');}catch{if(generation!==playGeneration)return;musicOn=false;paint();status('Music could not start. Try Play music again.');}
 };
 document.querySelector('#effects-toggle').onchange=e=>{effectsOn=e.target.checked;if(!effectsOn)stopTune();status(effectsOn?'Soft sound effects are on.':'Sound effects are off.');};
 document.querySelector('#sound-preview').onclick=()=>{if(!effectsOn){status('Turn on sound effects to hear a preview.');return;}playEffect('note');status('Playing a soft sound preview.');};
 document.querySelector('#music-volume').oninput=e=>{musicVolume=Number(e.target.value)/100;persist();gain();};
 document.querySelector('#effects-volume').oninput=e=>{effectsVolume=Number(e.target.value)/100;persist();};
 document.querySelector('#mute-all').onclick=()=>{pauseMusic();effectsOn=false;stopTune();if(effect)effect.pause();window.dispatchEvent(new Event('stop-all-audio'));paint();status('All sound is off.');};
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stopTune();pauseMusic();if(effect)effect.pause();status('Music paused while you were away.');}});
 window.addEventListener('pagehide',()=>{stopTune();if(music)music.pause();if(effect)effect.pause();});
 document.addEventListener('click',e=>{const t=e.target.closest('a[href^="#"],[data-view],[data-level],summary');if(t&&!t.closest('.audio-settings'))playEffect('touch');});
 document.addEventListener('click',e=>{if(!e.target.closest('.audio-settings'))document.querySelector('.audio-settings').open=false;});
 document.querySelector('.audio-settings').addEventListener('keydown',e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary').focus();}});
 paint();
}
// Original, softly synthesized pentatonic notes for the user-operated music box.
let tuneContext=null,tuneNodes=[];
export function stopTune(){for(const node of tuneNodes){try{node.stop();}catch{}try{node.disconnect();}catch{}}tuneNodes=[];}
export function playTune(notes,variant=0){if(!effectsOn||narrating||document.hidden||!notes.length)return false;const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;try{stopTune();tuneContext ||=new Audio();tuneContext.resume().catch(()=>{});const tones=[261.63,293.66,329.63,392,440],start=tuneContext.currentTime+.025;notes.slice(0,4).forEach((n,i)=>{if(!Number.isInteger(n)||n<0||n>=tones.length)return;const oscillator=tuneContext.createOscillator(),envelope=tuneContext.createGain(),at=start+i*.4;oscillator.type=variant?'triangle':'sine';oscillator.frequency.value=tones[n]*(variant?.75:1);envelope.gain.setValueAtTime(0,at);envelope.gain.linearRampToValueAtTime(effectsVolume*.12,at+.04);envelope.gain.exponentialRampToValueAtTime(.0001,at+.34);oscillator.connect(envelope);envelope.connect(tuneContext.destination);oscillator.start(at);oscillator.stop(at+.37);oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect();tuneNodes=tuneNodes.filter(node=>node!==oscillator);};tuneNodes.push(oscillator);});return true;}catch{return false;}}
