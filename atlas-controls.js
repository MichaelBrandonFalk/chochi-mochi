let media,current;
export function bindAtlas(scope){
 const viewport=scope.querySelector('.atlas-viewport');if(!viewport)return;
 if(!media){media=window.matchMedia('(max-width:700px)');media.addEventListener('change',()=>current?.sync());}
 const button=scope.querySelector('[data-map-fit]'),preview=scope.querySelector('.atlas-preview'),links=[...viewport.querySelectorAll('[data-atlas-place]')];
 const overview=()=>viewport.classList.contains('fit-map')||(media.matches&&!viewport.classList.contains('big-map'));
 const choose=index=>{
  index=Math.max(-1,Math.min(19,index));const link=links.find(l=>Number(l.dataset.atlasPlace)===index);if(!link)return;
  preview.dataset.selected=index;preview.querySelector('[data-map-kicker]').textContent=index<0?'Before level 1':'Level '+(index+1)+' of 20';
  preview.querySelector('[data-map-title]').textContent=link.dataset.placeName;
  const visit=preview.querySelector('[data-map-visit]');visit.href=link.getAttribute('href');visit.textContent=(index<0?'Read our story':'Visit this place')+' →';
  preview.querySelector('[data-map-step="-1"]').disabled=index===-1;preview.querySelector('[data-map-step="1"]').disabled=index===19;
  for(const node of links)node.classList.toggle('atlas-selected',node===link);
 };
 const sync=()=>{if(!viewport.isConnected)return;const compact=overview();viewport.classList.toggle('atlas-overview',compact);button.textContent=compact?'Open large map':'See whole valley';button.setAttribute('aria-expanded',String(!compact));viewport.setAttribute('aria-label',compact?'Valley overview. Choose a number, then use Visit this place.':'Large valley map. Scroll to explore the places.');};
 button.onclick=()=>{if(overview()){viewport.classList.remove('fit-map');viewport.classList.add('big-map');}else{viewport.classList.remove('big-map');viewport.classList.add('fit-map');}sync();};
 viewport.onclick=e=>{const link=e.target.closest('[data-atlas-place]');if(link&&overview()){e.preventDefault();choose(Number(link.dataset.atlasPlace));}};
 preview.onclick=e=>{const step=e.target.closest('[data-map-step]');if(step)choose(Number(preview.dataset.selected)+Number(step.dataset.mapStep));};
 current={sync};choose(Number(preview.dataset.selected));sync();
}
