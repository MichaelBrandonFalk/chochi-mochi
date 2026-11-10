import {giftSrc,objectSrc,giftSlots} from './object-art.js';
export const basketGifts=['Welcome flags','Picnic cloth','Song page','Cup card','Flower pot','Two lanterns','Helper’s list','Ribbon path','Plan note','Painted pebble','Plan card','Garden invitation','Path marker','Flower picture','Pause card','Garden song','Helper cards','Picture of small steps','Our storybook'];
export function basketGiftName(i,choices={}){if(i===1)return choices[1]===1?'Mint picnic cloth':choices[1]===0?'Lilac picnic cloth':basketGifts[i];if(i===4)return choices[4]===1?'Pink clover pot':choices[4]===0?'Moon daisy pot':basketGifts[i];if(i===5)return choices[5]===1?'Leaf lanterns':choices[5]===0?'Star lanterns':basketGifts[i];if(i===9)return choices[9]===1?'Dragon pebble':choices[9]===0?'Sun pebble':basketGifts[i];return basketGifts[i];}
export function basketPainting(done=[],choices={},selected=-1,received=[]){
 const packed=[...new Set(done.filter(n=>Number.isInteger(n)&&n>=0&&n<19))].sort((a,b)=>a-b),slots=giftSlots(packed.length);
 const label=packed.length?packed.length+(packed.length===1?' gift':' gifts')+' for Glaloula. '+packed.map(i=>basketGiftName(i,choices)).join(', ')+'.':'An empty watercolor picnic basket with a soft linen lining, ready for our first gift.';
 const gifts=packed.map((i,n)=>{const {x,y,w,h}=slots[n];return `<a class="basket-painted-gift" data-packed-gift="${i}" href="#basket-${i}" aria-label="Look at ${basketGiftName(i,choices)}" ${i===selected?'aria-current="true"':''}><title>${basketGiftName(i,choices)}</title><rect class="basket-gift-focus" x="${x-w/2-2}" y="${y-h/2-2}" width="${w+4}" height="${h+4}" rx="15" fill="${i===selected?'#fff8e9b8':'transparent'}" stroke="${i===selected?'#9a839e':'none'}"/><image href="${giftSrc(i,choices)}" x="${x-w/2}" y="${y-h/2}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/></a>`;}).join('');
 return `<figure class="basket-art painted-basket"><svg viewBox="0 0 1000 710" role="group" aria-label="${label}"><image class="basket-base" href="${objectSrc('basket')}" width="1000" height="710" preserveAspectRatio="xMidYMid meet"/>${gifts}</svg><figcaption><strong>Gifts for Glaloula</strong>${packed.length?'Choose a gift in the picture or below to take a closer look.':'Finish a project and its gift will appear here.'}</figcaption></figure>`;
}
export function letterPocket(received=[],places=[],letters={}){
 const ids=[0,4,9,14,18].filter(i=>received.includes(i)&&letters[i]);
 return `<section class="basket-letters" aria-labelledby="basket-letters-title"><div class="eyebrow">From Glaloula</div><h2 id="basket-letters-title">Letters for us</h2>${ids.length?`<div class="basket-letter-list">${ids.map(i=>`<details class="letter-page" data-received-letter="${i}"><summary><img class="letter-envelope-art" src="${objectSrc('letter-envelope')}" alt="" width="112" height="84" loading="lazy"><span><span class="eyebrow">After ${places[i].place}</span><strong>${letters[i].title}</strong><span class="letter-open-hint">Open this letter</span></span></summary><p>${letters[i].text}</p></details>`).join('')}</div>`:'<p>No letters yet. When Glaloula sends one, we will keep it here.</p>'}</section>`;
}
// A finished project is already a gift; finishing the chapter is a separate step.
export function packedGiftIds(done=[],projects=[]){return [...new Set([...done,...projects].filter(i=>Number.isInteger(i)&&i>=0&&i<19))].sort((a,b)=>a-b);}
export function madeGiftMessage(i,choices={}){
 const plural=[0,5,16].includes(i);
 let name=i===18?'storybook':i===17?'picture of small steps':basketGiftName(i,choices);
 name=name[0].toLowerCase()+name.slice(1);
 return `Yay! You made ${plural?'':/^[aeiou]/.test(name)?'an ':'a '}${name}. ${plural?'They are':'It is'} now in your basket.`;
}
