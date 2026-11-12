export const chapterArt=[
 ['clover-gate','Clover Gate','Chochi the Dinosaur and Mochi the Unicorn meet Tuck the snail at a flower-covered wooden gate.'],
 ['dewdrop-meadow','Dewdrop Meadow','Rue the rabbit shares baskets of cloth in a soft green meadow.'],
 ['listening-grove','Listening Grove','Olive the owl welcomes the friends to a listening bench beneath tall trees.'],
 ['mirror-pool','Mirror Pool','Moss the frog holds a clay cup beside a quiet pool and reeds.'],
 ['sunseed-field','Sunseed Field','Sol, a mother hare, plants beans with small pots and useful scoops.'],
 ['twin-lanterns','Twin Lanterns','Luma the moth tends two paper lanterns outside a little workshop.'],
 ['choice-orchard','Choice Orchard','Ada the deer waters an apple tree in an orchard full of soft light.'],
 ['ribbon-bridge','Ribbon Bridge','Kit the sprite sets out ribbons at a low table beside a little bridge.'],
 ['pattern-pond','Pattern Pond','Bea the beaver writes by a pond where small leaf boats float.'],
 ['one-pebble-path','One Pebble Path','Tansy the tortoise shows the friends one painted pebble on a winding path.'],
 ['mapmakers-nook','Mapmaker’s Nook','Mira the mole unrolls a map in a sunlit woodland room.'],
 ['letter-tree','Letter Tree','Wren the robin writes leaf letters beneath a broad tree.'],
 ['steady-stream','Steady Stream','Ori the otter tends a wooden water wheel at a gentle stream.'],
 ['cloud-garden','Cloud Garden','Alba the sheep tends white flower pots beneath soft cloud shapes.'],
 ['warm-tea-cottage','Warm Tea Cottage','Brin the bear pours tea beside cushions and an open cottage window.'],
 ['echo-glade','Echo Glade','Nell the bird hums by a smooth echo stone among ferns and trees.'],
 ['circle-of-oaks','Circle of Oaks','Fenn the fox sets out little table models beneath a circle of oak trees.'],
 ['little-bloom-hill','Little Bloom Hill','A badger notices a tiny new leaf on a flower-covered hill.'],
 ['starlight-library','Starlight Library','Linn the lynx opens a book at a mountaintop library, with a gentle ride waiting nearby.'],
 ['glaloulas-garden','Glaloula’s Garden','Chochi the Dinosaur, Mochi the Unicorn, and Glaloula the fairy share their book in her bluebell garden.']
].map(([slug,title,alt],i)=>({slug,title,alt,src:new URL(`./assets/storybook/${String(i+1).padStart(2,'0')}-${slug}.webp`,import.meta.url).href}));
export function storybookFigure(index,{className='',caption='',eager=false}={}){
 const art=chapterArt[index]||chapterArt[19];
 return `<figure class="storybook-plate ${className}"><img src="${art.src}" srcset="${art.src.replace('.webp','-small.webp')} 768w, ${art.src} 1536w" sizes="(max-width:750px) 92vw, 760px" alt="${art.alt}" width="1536" height="1024" loading="${eager?'eager':'lazy'}" decoding="async">${caption?`<figcaption>${caption}</figcaption>`:''}</figure>`;
}
export function storybookBackdrop(index,w=720,h=360){const art=chapterArt[index]||chapterArt[19],src=art.src.replace('.webp','-small.webp');return `<image href="${src}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice"/>`;}
let paintId=0;
export function inkPainting(svg){const id='book-ink-'+paintId++;return svg.replace(/<svg\b/,'<svg class="storybook-vector"').replace(/(<svg[^>]*>)/,`$1<style>.storybook-ink :is(path,ellipse,circle,rect):not([stroke]){stroke:#7d6b573b;stroke-width:.65;stroke-linejoin:round}</style><defs><filter id="${id}" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="3" seed="17" result="paper"/><feDisplacementMap in="SourceGraphic" in2="paper" scale=".7"/><feColorMatrix type="saturate" values=".8"/></filter></defs><g class="storybook-ink" filter="url(#${id})">`).replace('</svg>','</g></svg>');}
