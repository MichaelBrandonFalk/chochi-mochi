import {getAudioState,playTune,stopTune} from './audio.js';
import {notePaint,noteStyle,tuneScore} from './music-box.js';
export function songPanel(notes){const score=tuneScore(notes),sound=getAudioState();return `<div class="song-panel"><div class="song-sequence" data-song-sequence aria-label="Our song in order">${Array.from({length:4},(_,i)=>`<span class="song-step" data-song-step="${i}" style="${noteStyle(score[i]?.note)}"><small>${i+1}</small><b>${score[i]?notePaint[score[i].note].name:'·'}</b></span>`).join('')}</div><output data-song-position aria-live="off">${score.length?'Ready to play or watch.':'Choose a note to begin.'}</output><div class="song-sound-note" data-song-sound ${sound.effectsOn&&sound.effectsVolume>0?'hidden':''}><p>Song sound is off. Turn it on to listen, or watch quietly.</p><button class="secondary" data-song-enable>Turn on song sound</button></div><div class="song-actions"><button class="secondary" data-watch-song ${score.length?'':'disabled'}>Watch our tune</button><button class="text-button" data-stop-song disabled>Stop the tune</button></div></div>`;}
export function syncSongSound(){const sound=getAudioState();for(const el of document.querySelectorAll('[data-song-sound]'))el.hidden=sound.effectsOn&&sound.effectsVolume>0;}
window.addEventListener('audio-settings-changed',syncSongSound);
export function playSong(host,notes,variant=0,{silent=false,indexOffset=0}={}){
 const score=tuneScore(notes);if(!score.length)return false;
 stopTune();
 if(!host.querySelector('[data-song-sequence]')){const panel=document.createElement('div');panel.innerHTML=songPanel(notes);(host.querySelector('.travelling-memories')||host).append(panel);}
 const status=host.querySelector('.toy-status');
 const sound=getAudioState();
 if(!silent&&(!sound.effectsOn||sound.effectsVolume===0)){syncSongSound();if(status)status.textContent='Turn on song sound to listen, or choose Watch our tune.';return false;}
 const clear=()=>{for(const el of host.querySelectorAll('[data-playing]'))el.removeAttribute('data-playing');for(const el of host.querySelectorAll('[data-song-step]'))el.removeAttribute('aria-current');};
 const onEnd=finished=>{clear();const stop=host.querySelector('[data-stop-song]');if(stop)stop.disabled=true;const pos=host.querySelector('[data-song-position]');if(pos)pos.textContent=finished?'Our tune is finished.':'Tune stopped.';if(status&&host.isConnected)status.textContent=finished?'Our tune is finished. We can play or watch it again.':'Tune stopped.';};
 const onBeat=(beat,total)=>{if(!host.isConnected){stopTune();return;}clear();const index=beat.index+indexOffset;for(const el of host.querySelectorAll(`[data-song-step="${index}"],[data-song-scene="${index}"],.note-key[data-value="${beat.note}"]`))el.setAttribute('data-playing','true');host.querySelector(`[data-song-step="${index}"]`)?.setAttribute('aria-current','true');const pos=host.querySelector('[data-song-position]');if(pos)pos.textContent='Now: '+notePaint[beat.note].name+' · Beat '+(beat.index+1)+' of '+total;};
 const options={silent,onBeat,onEnd,onError:()=>{if(status)status.textContent='Sound could not start. You can watch the tune instead.';}};
 let started=playTune(notes,variant,options);
 if(!started&&!silent){started=playTune(notes,variant,{...options,silent:true});if(status)status.textContent='Sound could not start. We can watch our tune quietly.';}
 else if(started&&status)status.textContent=silent?'Watch the notes light up in time.':'Our tune is playing. Watch each note as it sounds.';
 if(started){const stop=host.querySelector('[data-stop-song]');if(stop)stop.disabled=false;}
 return started;
}
