export const giftSlugs=['gift-01-flags','gift-02-cloth','gift-03-song','gift-04-cup-card','gift-05-flowers','gift-06-lanterns','gift-07-list','gift-08-ribbons','gift-09-note','gift-10-pebble','gift-11-plan','gift-12-invitation','gift-13-marker','gift-14-cloud','gift-15-pause','gift-16-song','gift-17-helper','gift-18-leaf','gift-19-book'];
export const objectSrc=slug=>new URL(`./assets/objects/${slug}.webp`,import.meta.url).href;
export function giftSrc(i,choices={}){let slug=giftSlugs[i]||giftSlugs[18];if(choices[i]===1)slug=({1:'gift-02-cloth-mint',4:'gift-05-flowers-clover',5:'gift-06-lanterns-leaf',7:'gift-08-ribbons-bows',9:'gift-10-pebble-dragon'})[i]||slug;return objectSrc(slug);}
export function giftSlots(count){
 const n=Math.max(0,Math.min(19,count));
 if(n<=3)return Array.from({length:n},(_,i)=>({x:470+(i-(n-1)/2)*150,y:380,w:n===1?200:140,h:n===1?150:110}));
 if(n<=8)return Array.from({length:n},(_,i)=>{const row=Math.floor(i/4),size=Math.min(4,n-row*4);return {x:470+(i%4-(size-1)/2)*130,y:325+row*85,w:105,h:85};});
 if(n<=14)return Array.from({length:n},(_,i)=>{const row=Math.floor(i/5),size=Math.min(5,n-row*5);return {x:470+(i%5-(size-1)/2)*90,y:310+row*60,w:90,h:75};});
 return Array.from({length:n},(_,i)=>{const row=i<6?0:i<13?1:2,start=row===0?0:row===1?6:13,size=Math.min(row===1?7:6,n-start);return {x:470+(i-start-(size-1)/2)*80,y:[310,375,425][row],w:76,h:64};});
}
