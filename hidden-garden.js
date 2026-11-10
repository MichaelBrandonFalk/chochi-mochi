import {basketGiftName} from './basket-art.js';
import {chapterArt} from './storybook.js';
import {objectSrc,giftSrc} from './object-art.js';
// Each place has a small story and three painted treasures, rather than six
// identical covered spots. Choices and return visits change their hiding places.
export const hunts=[
 ['Tuck’s welcome corner','Tuck has set out a few small things for the welcome corner. Button follows a trail of clover. “Let’s look close to the ground.”',[0,1,4]],
 ['The tiny dress-up shop','Rue is making a dress-up shop for the meadow mice. Button spots a scrap trail in the grass.',[1,7,9]],
 ['A band for the trees','Olive is setting up a little leaf band. Button looks for the things that will make the stage feel special.',[2,5,17]],
 ['The pond tea party','Moss has saved a place for a pond tea party. Button peeks between the reeds for three small party things.',[3,4,14]],
 ['A bee’s small garden','Sol is making a garden just the right size for a bee. Button follows a petal trail.',[4,9,12]],
 ['The lantern workshop','Luma has made a cozy corner for the new lanterns. Button spots some things tucked around the workshop.',[5,7,18]],
 ['An orchard picnic','Ada is getting ready for a picnic under the apple trees. Button looks for the little picnic things.',[1,3,6]],
 ['The ribbon parade','Kit is making a tiny parade by the bridge. Button looks for the things that will dress it up.',[0,7,9]],
 ['A day at the pond','Bea has made a little reading spot by the pond. Button looks between the reeds for three small things.',[8,14,18]],
 ['The pebble club','Tansy has made a tiny pebble club. Button looks for the things that will make it feel like home.',[9,11,17]],
 ['A map for a mouse','Mira is making a map for a very small friend. Button follows the little marks along its edge.',[10,12,16]],
 ['The leaf post','Wren has set up a leaf post. Button looks for the things that will help the first letter reach a friend.',[8,11,17]],
 ['A stream-side show','Ori is planning a small show by the stream. Button follows the path beside the water.',[2,12,15]],
 ['The cloud art shop','Alba is setting out pictures in the cloud art shop. Button looks for the little things tucked among the pots.',[4,13,18]],
 ['The tea-tray town','Brin is making a tiny town on the tea tray. Button looks for the things its tiny guests might like.',[3,9,14]],
 ['The little leaf band','Nell is getting the leaf band ready. Button follows the fern path to find three things for the show.',[0,2,15]],
 ['A village under the oaks','Fenn is making a small village under the trees. Button looks close to the roots for things to put in it.',[5,11,16]],
 ['A page full of flowers','The badger is making a flower page for the book. Button follows a trail of small leaves.',[4,7,17]],
 ['The mountain book nook','Linn is setting out a book nook above the valley. Button finds a quiet path between the books.',[10,13,18]],
 ['A game for our fairy friend','Glaloula the fairy has made a tiny finding game in her garden. Button invites everyone to look together.',[0,5,18]]
].map(([title,story,gifts])=>({title,story,gifts}));
const bonus=[['garden-bloom','a tiny flower','A tiny flower leans toward the light. Button leaves it growing right here.'],['gift-14-cloud','a cloud picture','“That cloud looks like a sleeping sheep,” says Mochi the Unicorn.'],['letter-envelope','a little envelope','Chochi the Dinosaur spots a tiny envelope. It is just the right size for a mouse.'],['gift-10-pebble-dragon','a pebble dragon','A pebble dragon rests in a patch of sun. “A very small dragon,” says Button.'],['music-case','a tiny music box','A tiny music box sits in a cozy nook. Chochi the Dinosaur draws it in the book.']];
const anchors=[{x:107,y:101,place:'at the top left'},{x:520,y:85,place:'near the top right'},{x:616,y:230,place:'by the right edge'},{x:510,y:385,place:'at the bottom right'},{x:196,y:377,place:'at the bottom left'},{x:93,y:258,place:'by the left edge'}];
export function huntObjects(level,c,g){
 const hunt=hunts[level]||hunts[0],round=g.huntRound||0,shift=(c.seed+round)%6;
 return Array.from({length:6},(_,slot)=>{
  const target=c.findSlots.indexOf(slot),bonusIndex=[0,1,2,3,4,5].filter(i=>!c.findSlots.includes(i)).indexOf(slot),gift=target>=0?hunt.gifts[(target+round)%3]:null;
  const extras=bonus.filter(([slug])=>!hunt.gifts.some(i=>giftSrc(i,c.storyChoices)===objectSrc(slug)));
  const src=gift===null?objectSrc(extras[bonusIndex][0]):giftSrc(gift,c.storyChoices),name=gift===null?extras[bonusIndex][1]:basketGiftName(gift,c.storyChoices).toLowerCase();
  const a=anchors[(slot+shift)%6],dx=((c.seed+slot*7+round*11)%19)-9,dy=((level*3+slot*5)%15)-7;
  return {slot,target:target>=0,src,slug:src.split('/').pop().replace('.webp',''),name,reply:gift===null?extras[bonusIndex][2]:`“${name.startsWith('our ')?'Our '+name.slice(4):'The '+name}!” says Button. “That will be lovely for ${level===19?'our garden afternoon':'our little picture'}.”`,x:a.x+dx,y:a.y+dy,place:a.place,turn:(slot*7+level*3)%17-8};
 });
}
export function huntChecklist(level,c,g){const objects=huntObjects(level,c,g);return `<ul class="hunt-list" aria-label="Three treasures to find">${objects.filter(o=>o.target).map(o=>`<li class="${g.found.includes(o.slot)?'found':''}"><img src="${o.src}" alt="" width="58" height="48"><span>${o.name}</span><strong>${g.found.includes(o.slot)?'✓ Found':'To find'}</strong></li>`).join('')}</ul>`;}
export function huntSVG(level,c,g,{hint=-1,closer=false}={}){const objects=huntObjects(level,c,g),art=chapterArt[level]||chapterArt[0];return `<svg viewBox="0 0 720 480" aria-hidden="true"><image href="${art.src.replace('.webp','-small.webp')}" width="720" height="480"/>${objects.map(o=>{const found=g.found.includes(o.slot),size=closer?94:70;return `<g transform="translate(${o.x} ${o.y})">${hint===o.slot||found?`<ellipse rx="${size*.6}" ry="${size*.52}" fill="${found?'#fbf7df':'#fff9ed'}" fill-opacity=".75" stroke="${found?'#69836a':'#836a8b'}" stroke-width="2" ${found?'':'stroke-dasharray="4 4"'}/>`:''}<image href="${o.src}" x="${-size/2}" y="${-size/2}" width="${size}" height="${size}" transform="rotate(${o.turn})"/>${found?`<text x="${size*.4}" y="${-size*.35}" font-size="18" fill="#355740" stroke="#fff9ed" stroke-width=".5">✓</text>`:''}</g>`;}).join('')}</svg>`;}
export function huntButtons(level,c,g,{hint=-1,closer=false}={}){return `<div class="hunt-touch-layer">${huntObjects(level,c,g).map(o=>`<button class="hunt-object ${g.found.includes(o.slot)?'found':''}" data-toy="find" data-value="${o.slot}" style="left:${o.x/7.2}%;top:${o.y/4.8}%;width:${closer?15:11}%;height:${closer?22:17}%" aria-label="${g.found.includes(o.slot)?'Found: ':'Look at '}${o.name}, ${o.place}" aria-pressed="${g.found.includes(o.slot)}"><span class="sr-only">${o.name}</span></button>`).join('')}</div>`;}
export function huntControls(level,c,g,{closer=false}={}){const found=c.findSlots.filter(i=>g.found.includes(i)).length;return `<div class="hunt-controls"><p class="hunt-progress">${found} of 3 treasures found${g.found.length>found?' · '+(g.found.length-found)+(g.found.length-found===1?' tiny wonder spotted':' tiny wonders spotted'):''}.</p><div class="actions"><button class="secondary" data-hunt-hint ${found===3?'disabled':''}>A hint from Button</button><button class="secondary" data-hunt-size aria-pressed="${closer}">${closer?'Use the small view':'Make things bigger'}</button>${found===3?'<button class="secondary" data-hunt-again>Hide them in new places →</button>':''}</div></div><details class="hunt-word-controls"><summary>Find things with words</summary><p>Choose a place to look. Button will tell us what is there.</p><div class="hunt-word-list">${huntObjects(level,c,g).map(o=>`<button class="secondary" data-toy="find" data-value="${o.slot}" aria-pressed="${g.found.includes(o.slot)}">${g.found.includes(o.slot)?'✓ ':''}${o.name}, ${o.place}</button>`).join('')}</div></details>`;}
export function huntWords(level,c,g){return huntObjects(level,c,g).map(o=>`${o.name} ${o.place}${g.found.includes(o.slot)?', found':''}.`).join(' ');}
