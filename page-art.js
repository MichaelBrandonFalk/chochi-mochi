import {giftSrc} from './object-art.js';
// Small, decorative visual anchors. All instructions remain in the surrounding text.
export function smallStoryArt(index,choices={},kind='gift'){
 const gift=kind==='book'?18:Math.max(0,Math.min(18,index));
 return `<figure class="quiet-illustration" aria-hidden="true"><img src="${giftSrc(gift,choices)}" alt="" width="176" height="132" loading="lazy" decoding="async"></figure>`;
}
