// Inline SVGs can use regular image URLs. SVGs displayed in <img> need embedded
// images. Fetch only the paintings used by visible postcards, then embed the
// original bytes without re-encoding or changing their quality.
const images=new Map();
export function embeddedImage(url){
 if(url.startsWith('data:'))return Promise.resolve(url);
 if(!images.has(url))images.set(url,fetch(url).then(async response=>{
  if(!response.ok)throw new Error('Picture unavailable');
  const bytes=new Uint8Array(await response.arrayBuffer());let binary='';
  for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
  return `data:${response.headers.get('content-type')||'image/webp'};base64,${btoa(binary)}`;
 }).catch(error=>{images.delete(url);throw error;}));
 return images.get(url);
}
export async function selfContainedSVG(svg){
 const urls=[...new Set([...svg.matchAll(/<image\b[^>]*\bhref="([^"]+)"/g)].map(m=>m[1]))];
 for(const [url,data] of await Promise.all(urls.map(async url=>[url,await embeddedImage(url)])))svg=svg.split(`href="${url}"`).join(`href="${data}"`);
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
export function hydratePostcards(root){
 const load=async img=>{
  if(img.dataset.pictureLoading)return;img.dataset.pictureLoading='true';
  const encoded=img.dataset.postcardSvg;
  try{const source=await selfContainedSVG(decodeURIComponent(encoded));if(img.dataset.postcardSvg!==encoded)return;img.src=source;delete img.dataset.postcardSvg;}
  catch{delete img.dataset.pictureLoading;img.alt+=' The picture could not load. You can revisit this page to try again.';}
 };
 const targets=[...root.querySelectorAll('img[data-postcard-svg]')];
 if(!targets.length)return;
 if(!('IntersectionObserver'in globalThis)){targets.forEach(load);return;}
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){observer.unobserve(entry.target);load(entry.target);}},{rootMargin:'240px'});
 targets.forEach(img=>observer.observe(img));
 // Do not leave observers holding detached postcard nodes after navigation.
 const cleanup=()=>{observer.disconnect();window.removeEventListener('hashchange',cleanup);};
 window.addEventListener('hashchange',cleanup,{once:true});
}
