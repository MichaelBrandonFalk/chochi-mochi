import {tuneBackground} from './tune-background.js';
import {tuneScore,notePaint,beatSeconds} from './music-box.js';
import { playerStorage } from './player-store.js';
import {playlist,audioPreferences,nextTrack} from './audio-settings.js';
// Browsers unlock audio after the first gesture. Explicit quiet choices persist per player.
let saved={};try{saved=JSON.parse(playerStorage.getItem('little-lights-audio')||'{}')||{};}catch{}
const initial=audioPreferences(saved);
let music,effect,musicOn=initial.musicOn,effectsOn=initial.effectsOn,narrating=false,fadeFrame,lastEffect=0,playGeneration=0;
let musicVolume=initial.musicVolume,effectsVolume=initial.effectsVolume,track=0,unlocked=false,startMusic=()=>{};
const background=tuneBackground({pause:()=>{playGeneration++;cancelAnimationFrame(fadeFrame);if(music)music.pause();},resume:()=>startMusic(),canResume:()=>musicOn&&unlocked&&!document.hidden});
const source=name=>new URL(`./assets/audio/${name}`,import.meta.url).href;
const status=text=>{document.querySelector('#audio-status').textContent=text;};
function persist(){try{playerStorage.setItem('little-lights-audio',JSON.stringify({musicOn,effectsOn,musicVolume,effectsVolume}));}catch{}}
function paint(){const button=document.querySelector('#music-toggle');button.textContent=musicOn?'Pause music':'Play music';button.setAttribute('aria-pressed',String(musicOn));document.querySelector('#effects-toggle').checked=effectsOn;window.dispatchEvent(new Event('audio-settings-changed'));}
function gain(){if(!music)return;cancelAnimationFrame(fadeFrame);const from=music.volume,to=musicVolume*(narrating ? 0.18 : 1),start=performance.now();function step(now){const t=Math.min(1,(now-start)/200);music.volume=from+(to-from)*t;if(t<1)fadeFrame=requestAnimationFrame(step);}fadeFrame=requestAnimationFrame(step);}
export function setNarrating(value){narrating=value;if(value)stopTune();gain();}
export function playEffect(kind='touch'){
 if(!effectsOn||narrating||document.hidden)return;
 const now=performance.now();if(now-lastEffect<140)return;lastEffect=now;
 if(effect){effect.pause();effect.remove();}
 effect=document.createElement('audio');effect.dataset.gameEffect=kind;effect.preload='none';effect.src=source(kind==='touch'?'page-touch.mp3':'keepsake.mp3');effect.volume=effectsVolume;document.querySelector('#audio-engine').append(effect);effect.play().catch(()=>status('This browser could not play the sound. The story still works.'));
}
function pauseMusic(remember=true){playGeneration++;musicOn=false;if(music)music.pause();paint();if(remember)persist();}
export function initAudio(){
 document.querySelector('#music-volume').value=Math.round(musicVolume*100);
 document.querySelector('#effects-volume').value=Math.round(effectsVolume*100);
 startMusic=async()=>{
  if(background.held||!musicOn||document.hidden)return;
  if(!music){music=document.createElement('audio');music.id='garden-music';music.preload='none';music.src=source(playlist[track].file);document.querySelector('#audio-engine').append(music);
   music.addEventListener('ended',()=>{track=nextTrack(track);music.src=source(playlist[track].file);if(musicOn)startMusic();});
   music.addEventListener('error',()=>{pauseMusic(false);status('The music could not load. You can keep playing quietly.');});}
  music.volume=musicVolume*(narrating?.18:1);const generation=++playGeneration;
  try{await music.play();if(generation!==playGeneration||background.held){if(background.held||!musicOn||document.hidden)music.pause();return;}status('Playing '+playlist[track].title+'.');}catch{if(generation!==playGeneration)return;status('Tap Play music to start the music.');musicOn=false;paint();}
 };
 document.querySelector('#music-toggle').onclick=()=>{unlocked=true;if(musicOn){pauseMusic();status('Music paused.');}else{musicOn=true;paint();persist();startMusic();}};
 const unlock=e=>{if(unlocked||e.target.closest('.audio-settings,#comfort-dialog,#players-dialog'))return;unlocked=true;if(musicOn)startMusic();};
 document.addEventListener('pointerdown',unlock);document.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key))unlock(e);});
 document.querySelector('#effects-toggle').onchange=e=>{effectsOn=e.target.checked;persist();if(!effectsOn)stopTune();status(effectsOn?'Soft sound effects are on.':'Sound effects are off.');};
 document.querySelector('#sound-preview').onclick=()=>{if(!effectsOn){status('Turn on sound effects to hear a preview.');return;}playEffect('note');status('Playing a soft sound preview.');};
 document.querySelector('#music-volume').oninput=e=>{musicVolume=Number(e.target.value)/100;persist();gain();window.dispatchEvent(new Event('audio-settings-changed'));};
 document.querySelector('#effects-volume').oninput=e=>{effectsVolume=Number(e.target.value)/100;persist();window.dispatchEvent(new Event('audio-settings-changed'));};
 document.querySelector('#mute-all').onclick=silenceAudio;
 document.addEventListener('visibilitychange',()=>{if(document.hidden){stopTune();playGeneration++;if(music)music.pause();if(effect)effect.pause();status('Music paused while you were away.');}else if(unlocked&&musicOn)startMusic();});
 window.addEventListener('pagehide',()=>{stopTune();if(music)music.pause();if(effect)effect.pause();});
 document.addEventListener('click',e=>{const t=e.target.closest('a[href^="#"],[data-view],[data-level],summary');if(t&&!t.closest('.audio-settings'))playEffect('touch');});
 document.addEventListener('click',e=>{if(!e.target.closest('.audio-settings'))document.querySelector('.audio-settings').open=false;});
 document.querySelector('.audio-settings').addEventListener('keydown',e=>{if(e.key==='Escape'){e.currentTarget.open=false;e.currentTarget.querySelector('summary').focus();}});
 paint();status(musicOn?'Music starts with your first tap.':'Music is paused.');
}
// Original, softly synthesized pentatonic notes for the user-operated music box.
let tuneContext=null,tuneNodes=[],tuneFrame=0,tuneToken=0,tuneFinished=null;
export function stopTune(){background.release();tuneToken++;cancelAnimationFrame(tuneFrame);tuneFrame=0;for(const node of tuneNodes){try{node.stop();}catch{}try{node.disconnect();}catch{}}tuneNodes=[];const finish=tuneFinished;tuneFinished=null;finish?.(false);}
export function playTune(notes,variant=0,options={}){
 const score=tuneScore(notes),silent=options.silent===true;
 if(narrating||document.hidden||!score.length||(!silent&&(!effectsOn||effectsVolume===0)))return false;
 const Audio=window.AudioContext||window.webkitAudioContext;
 if(!silent&&!Audio)return false;
 stopTune();const token=tuneToken;tuneFinished=options.onEnd||null;
 const start=(audible)=>{
  if(token!==tuneToken)return;
  background.hold();const at=audible?tuneContext.currentTime+.03:performance.now()/1000;
  if(audible)for(const beat of score){const oscillator=tuneContext.createOscillator(),envelope=tuneContext.createGain(),time=at+beat.at;oscillator.type=variant?'triangle':'sine';oscillator.frequency.value=notePaint[beat.note].frequency*(variant?.75:1);envelope.gain.setValueAtTime(0,time);envelope.gain.linearRampToValueAtTime(effectsVolume*.12,time+.04);envelope.gain.exponentialRampToValueAtTime(.0001,time+beat.duration);oscillator.connect(envelope);envelope.connect(tuneContext.destination);oscillator.start(time);oscillator.stop(time+beat.duration+.02);tuneNodes.push(oscillator,envelope);oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect();tuneNodes=tuneNodes.filter(n=>n!==oscillator&&n!==envelope);};}
  let last=-1;
  const tick=()=>{if(token!==tuneToken)return;const elapsed=(audible?tuneContext.currentTime:performance.now()/1000)-at;if(elapsed>=score.length*beatSeconds){tuneFrame=0;background.release();const finish=tuneFinished;tuneFinished=null;finish?.(true);return;}const i=Math.floor(elapsed/beatSeconds);if(i>=0&&i!==last){last=i;options.onBeat?.(score[i],score.length);}tuneFrame=requestAnimationFrame(tick);};
  tuneFrame=requestAnimationFrame(tick);
 };
 try{if(silent)start(false);else{tuneContext ||=new Audio();tuneContext.resume().then(()=>{if(token!==tuneToken)return;if(tuneContext.state!=='running'){options.onError?.();start(false);}else start(true);}).catch(()=>{if(token!==tuneToken)return;options.onError?.();start(false);});}return true;}catch{stopTune();return false;}
}
export function getAudioState(){return {musicOn,effectsOn,musicVolume,effectsVolume};}
export function setAudioSettings(value={}){if(Number.isFinite(value.musicVolume))musicVolume=Math.max(0,Math.min(1,value.musicVolume));if(Number.isFinite(value.effectsVolume))effectsVolume=Math.max(0,Math.min(1,value.effectsVolume));if(typeof value.effectsOn==='boolean'){effectsOn=value.effectsOn;if(!effectsOn){stopTune();if(effect)effect.pause();}}persist();document.querySelector('#music-volume').value=Math.round(musicVolume*100);document.querySelector('#effects-volume').value=Math.round(effectsVolume*100);paint();gain();window.dispatchEvent(new Event('audio-settings-changed'));}
export function silenceAudio(){pauseMusic();effectsOn=false;persist();stopTune();if(effect)effect.pause();window.dispatchEvent(new Event('stop-all-audio'));paint();status('All sound is off.');window.dispatchEvent(new Event('audio-settings-changed'));}
