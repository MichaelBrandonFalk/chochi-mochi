import {playerStore,maxPlayers} from './player-store.js';
import {stopReader} from './access.js';
import {silenceAudio,stopTune} from './audio.js';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function initPlayers(saveCurrent){
 const opener=document.querySelector('#open-players');
 const dialog=document.createElement('dialog');
 dialog.id='players-dialog';dialog.setAttribute('aria-labelledby','players-title');
 document.body.append(dialog);
 let stage='list',restartId=null;
 const paintName=()=>{const name=playerStore.active().name;opener.setAttribute('aria-label','Players. Playing as '+name);document.querySelector('#player-name').textContent='Player: '+name;};
 const error=err=>{const status=dialog.querySelector('[data-player-status]');status.textContent=err.message?.startsWith('Please ')||err.message?.startsWith('That ')||err.message?.startsWith('All five')?err.message:'This browser could not save that change. Your current game is still here. Check that browser storage is allowed.';status.focus();};
 const saveBeforeLeaving=()=>{if(saveCurrent()===false)throw new Error('Storage could not save the current game');};
 const reloadAt=hash=>{silenceAudio();stopReader();history.replaceState(null,'',hash);location.reload();};
 function paint(){
  const current=playerStore.active(),players=playerStore.list();
  dialog.innerHTML=`<div class="access-dialog-head"><h2 id="players-title">${stage==='list'?'Players':stage==='first'?'Start again?':'One last check'}</h2><button class="secondary" data-player-close>Done</button></div>${stage==='list'?`
   <p>Each player has their own story and comfort settings. No password is needed. Names and progress stay in this browser.</p>
   <p class="access-note">Playing as <strong>${esc(current.name)}</strong> · ${players.length} of ${maxPlayers} player spaces</p>
   <div class="player-list" aria-label="Choose a player">${players.map(p=>`<button class="player-card secondary" data-switch-player="${p.id}" ${p.id===playerStore.activeId?'aria-current="true"':''}><strong>${esc(p.name)}</strong><span>${playerStore.summary(p.id)} of 20 places shining${p.id===playerStore.activeId?' · Playing now':' · Switch to this player'}</span></button>`).join('')}</div>
   <form data-add-player><h3>Add a player</h3><label for="new-player-name">Name (you can leave this blank)</label><input id="new-player-name" name="name" maxlength="24" autocomplete="off" ${players.length>=maxPlayers?'disabled':''}><button class="primary" type="submit" ${players.length>=maxPlayers?'disabled':''}>Add player</button>${players.length>=maxPlayers?'<p class="access-note">All five spaces are in use. You can rename a player or restart their adventure below.</p>':''}</form>
   <details><summary>Change this player’s name</summary><form data-rename-player><label for="rename-player-name">Name for ${esc(current.name)}</label><input id="rename-player-name" name="name" maxlength="24" value="${esc(current.name)}" autocomplete="off"><button class="secondary" type="submit">Save name</button></form></details>
   <details class="restart-options"><summary>Restart from scratch</summary><p>Start <strong>${esc(current.name)}</strong> again from the opening story. This clears their lessons, gifts, choices, toys, and postcards. Their comfort settings and the other players stay.</p><button class="secondary" data-start-restart>Restart from scratch</button></details>
  `:stage==='first'?`
   <p class="access-note">Check 1 of 2</p><p>Start <strong>${esc(current.name)}</strong> from the very beginning?</p><p>All of this player’s lessons, gifts, story choices, toys, postcards, and reading position will be erased. Other players and comfort settings stay.</p><div class="actions"><button class="primary" data-player-cancel>Keep my progress</button><button class="secondary" data-confirm-first>Yes, start over</button></div>
  `:`
   <p class="access-note">Check 2 of 2</p><p>This will erase <strong>${esc(current.name)}</strong>’s adventure. It cannot be undone.</p><label class="access-check"><input type="checkbox" data-confirm-erase> I want to erase ${esc(current.name)}’s progress.</label><div class="actions"><button class="primary" data-player-cancel>Keep my progress</button><button class="secondary" data-confirm-final disabled>Erase progress and restart</button></div>
  `}<p data-player-status role="status" tabindex="-1"></p>`;
  dialog.querySelector('[data-player-close]').onclick=()=>dialog.close();
  dialog.querySelector('[data-add-player]')?.addEventListener('submit',e=>{e.preventDefault();try{saveBeforeLeaving();playerStore.create(new FormData(e.currentTarget).get('name'));reloadAt('#home');}catch(err){error(err);}});
  dialog.querySelector('[data-rename-player]')?.addEventListener('submit',e=>{e.preventDefault();try{playerStore.rename(new FormData(e.currentTarget).get('name'));paintName();paint();dialog.querySelector('[data-player-status]').textContent='Name saved.';}catch(err){error(err);}});
  for(const b of dialog.querySelectorAll('[data-switch-player]'))b.onclick=()=>{if(b.dataset.switchPlayer===playerStore.activeId){dialog.close();return;}try{saveBeforeLeaving();playerStore.switchTo(b.dataset.switchPlayer);reloadAt('#home');}catch(err){error(err);}};
  dialog.querySelector('[data-start-restart]')?.addEventListener('click',()=>{restartId=playerStore.activeId;stage='first';paint();dialog.querySelector('[data-player-cancel]').focus();});
  dialog.querySelector('[data-player-cancel]')?.addEventListener('click',()=>{stage='list';restartId=null;paint();dialog.querySelector('[data-player-close]').focus();});
  dialog.querySelector('[data-confirm-first]')?.addEventListener('click',()=>{stage='last';paint();dialog.querySelector('[data-player-cancel]').focus();});
  dialog.querySelector('[data-confirm-erase]')?.addEventListener('change',e=>{dialog.querySelector('[data-confirm-final]').disabled=!e.target.checked;});
  dialog.querySelector('[data-confirm-final]')?.addEventListener('click',()=>{if(stage!=='last'||restartId!==playerStore.activeId||!dialog.querySelector('[data-confirm-erase]').checked)return;try{playerStore.restart();reloadAt('#story-1');}catch(err){error(err);}});
 }
 opener.onclick=()=>{stopReader();stopTune();stage='list';restartId=null;paint();dialog.showModal();dialog.querySelector('[data-player-close]').focus();};
 dialog.addEventListener('close',()=>{stage='list';restartId=null;opener.focus({preventScroll:true});});
 paintName();
}
