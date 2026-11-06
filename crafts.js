import {giftSrc} from './object-art.js';
import {inkPainting} from './storybook.js';
// Small, original paper crafts that fill as players build each project.
const line='fill="none" stroke="#9a9e85" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
const note=(x,y,w=70,h=75)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="#fff7dd" stroke="#cec1a3"/><path d="M${x+12} ${y+20}h${w-24}m-${w-24} 15h${w-30}m-${w-30} 15h${w-25}" ${line}/>`;
const bloom=(x,y)=>`<path d="M${x} ${y+30}v-30" ${line}/><g fill="#dfb4ca"><ellipse cx="${x}" cy="${y-9}" rx="8" ry="12"/><ellipse cx="${x-9}" cy="${y}" rx="12" ry="8"/><ellipse cx="${x+9}" cy="${y}" rx="12" ry="8"/><ellipse cx="${x}" cy="${y+9}" rx="8" ry="12"/></g><circle cx="${x}" cy="${y}" r="6" fill="#f1dfa4"/>`;
const cup=(x,y)=>`<path d="M${x} ${y}h45v29q-22 28-45 0z" fill="#e4cddd" stroke="#b7a6b9"/><path d="M${x+45} ${y+5}q30-6 17 18l-17 4" ${line}/>`;
const lamp=(x)=>`<path d="M${x} 45v23" ${line}/><rect x="${x-24}" y="68" width="48" height="74" rx="13" fill="#f1dfad" stroke="#c0ad84"/><path d="m${x} 88 5 12 13 4-13 4-5 12-5-12-13-4 13-4z" fill="#fff7d3"/>`;
const musical=(x,y)=>`<path d="M${x} ${y}v-39l29-8v36m-29-20 29-8" ${line}/><ellipse cx="${x-7}" cy="${y}" rx="9" ry="6" fill="#a7b6b5"/><ellipse cx="${x+22}" cy="${y-11}" rx="9" ry="6" fill="#c3b2cc"/>`;
const motifs=[
['<path d="M45 75q130 40 270 0" '+line+'/>','<path d="m70 83 50 10-31 48z" fill="#d7bfdc"/>','<path d="m156 96 47 0-23 48z" fill="#e9cca9"/>','<path d="m239 91 49-10-18 59z" fill="#b5cebb"/>'],
['<path d="m78 65 180-12 29 99-183 17z" fill="#efe2bb" stroke="#c3b99c"/>','<path d="m78 65 60-4 8 34-60 5zm69 65 59-4 10 34-60 4" fill="#c8b8d5"/>','<path d="m138 61 60-4 9 34-61 4zm78 65 60-4 11 30-61 5" fill="#b9cdb7"/>','<path d="m86 100 60-5 10 35-60 4zm112-43 60-4 10 34-61 4" fill="#e7c6b5"/>'],
['<path d="M65 129q100-55 230 0" '+line+'/>',musical(100,110),musical(175,95),musical(250,113)],
['<ellipse cx="180" cy="158" rx="100" ry="12" fill="#dddac8"/>',cup(100,98),note(188,68,77,79),'<path d="m205 107 12 10 27-27" '+line+'/>'],
['<path d="m119 122 122 0-17 48h-88z" fill="#cca58e"/><path d="M111 121h138" '+line+'/>','<path d="M164 124V89q-36-24-37-5 3 22 37 18" fill="#adc7a3"/>',bloom(179,85),bloom(209,76)],
['<path d="M81 160V43h198v117" '+line+'/>',lamp(123),lamp(238),'<ellipse cx="180" cy="169" rx="109" ry="7" fill="#dfd6bf"/>'],
['<path d="M72 154h223" '+line+'/>',note(89,58,87,91),note(185,71,83,82),'<path d="m103 116 9 9 24-23m64 23 8 8 24-23" '+line+'/>'],
['<path d="M47 136q120-43 267-2" stroke="#dacbb0" stroke-width="21" fill="none"/>','<path d="M75 122q20-76 43-9t47-4" stroke="#cbb7d9" stroke-width="8" fill="none"/>','<path d="M159 113q29-67 47 4t49 11" stroke="#e4b9c9" stroke-width="8" fill="none"/>','<path d="M243 121q17-58 43-1" stroke="#b4ccb3" stroke-width="8" fill="none"/>'],
['<path d="m90 55 81 7 13 102-81-7z" fill="#b6c8b0"/>',note(111,64,141,93),'<path d="M174 70v80" '+line+'/>','<path d="m230 126 42-62 8 6-42 62-12 8z" fill="#bc9d89"/>'],
['<ellipse cx="180" cy="141" rx="102" ry="22" fill="#e1dcc7"/>','<ellipse cx="180" cy="109" rx="62" ry="41" fill="#c8ccc1"/>','<circle cx="180" cy="106" r="21" fill="#eddba8"/><path d="M180 77v-8m0 75v-8m-29-30h-9m75 0h-9" '+line+'/>','<path d="M174 109q6 7 12 0" '+line+'/>'],
['<path d="m68 70 68-17 72 17 77-19v98l-77 17-72-17-68 17z" fill="#f2e5bf" stroke="#c6b994"/>','<path d="M136 53v96m72-79v96" '+line+'/>','<path d="m95 132 39-42 45 39 66-44" stroke="#b09bbc" stroke-width="4" stroke-dasharray="5 5" fill="none"/>','<circle cx="245" cy="85" r="9" fill="#d9b3c6"/>'],
['<path d="m85 83 90-40 92 40v70H85z" fill="#b9ceaf"/>','<path d="m85 83 90 48 92-48" fill="#dbe1bf" stroke="#b3ba9b"/>','<path d="m85 153 66-46m116 46-65-46" '+line+'/>','<path d="m171 111 9-9 10 9-10 9z" fill="#cbb1d0"/>'],
['<path d="M35 157q83-31 145 0t145-2" fill="none" stroke="#c5dce0" stroke-width="22"/>','<circle cx="181" cy="110" r="53" fill="#d1ba9b" stroke="#ab9d83" stroke-width="4"/>','<path d="M181 58v104m-52-52h104m-89-37 74 74m0-74-74 74" '+line+'/>','<circle cx="181" cy="110" r="12" fill="#efe4c5"/>'],
['<path d="M50 166q130-60 260 0" fill="#c5d7ba"/>','<g fill="#f9f4e9"><ellipse cx="220" cy="64" rx="58" ry="20"/><ellipse cx="204" cy="48" rx="24" ry="22"/></g>',bloom(144,117),'<circle cx="92" cy="64" r="23" fill="#f2dfa8"/>'],
['<ellipse cx="180" cy="156" rx="118" ry="12" fill="#d6c7b0"/>',cup(100,101),note(198,75,64,67),'<path d="M118 82q-12-17 1-31m20 31q-12-17 1-31" '+line+'/>'],
['<path d="m73 53 90 8 90-8v113l-90-8-90 8z" fill="#f6e9c8" stroke="#c3b79b"/>','<path d="M163 61v97" '+line+'/>',musical(119,125),musical(216,117)],
['<ellipse cx="180" cy="139" rx="109" ry="35" fill="#d7c0da"/>','<path d="M92 125V78h45v47m-45-13h45m-45 0v48m45-48v48" '+line+'/>','<path d="M223 125V78h45v47m-45-13h45m-45 0v48m45-48v48" '+line+'/>','<circle cx="180" cy="126" r="12" fill="#f0ddb1"/>'],
['<path d="M180 163V60m0 55-43-27m43 51 43-34" '+line+'/>','<path d="M138 89q-47-35-35-1 12 24 35 1" fill="#adc9a4"/>','<path d="M222 105q47-35 35-1-12 24-35 1" fill="#bad5ad"/>','<path d="M180 63q-34-46-3-47 31 4 3 47" fill="#d3dcaf"/>'],
['<path d="m75 61 88 10 96-10v103l-96-9-88 9z" fill="#f7ebcf" stroke="#c8ba9b"/>','<path d="M163 71v84m-68-58h48m-48 19h42m40-19h60m-60 19h54" '+line+'/>','<path d="m223 60 17 2v74l-9-8-8 7z" fill="#c8b1d0"/>','<path d="M181 136h56" '+line+'/>']
];
export function craftPainting(index,count,total,label,choices={}){const mapped=index<19?index:[0,5,8,14,18][index-19],progress=Math.max(0,Math.min(1,total>0?count/total:0)),src=giftSrc(mapped,choices);return `<div class="craft-art painted-project" role="img" aria-label="${label||`Our project: ${count} of ${total} pieces placed`}"><div class="painted-project-image"><img class="project-sketch" src="${src}" alt="" width="360" height="220"><img class="project-paint" src="${src}" alt="" width="360" height="220" style="clip-path:inset(0 ${Math.round((1-progress)*100)}% 0 0)"></div><span>${label?'Packed for Glaloula':count===0?'Our picture will fill with color.':`${count} of ${total} pieces placed`}</span></div>`;}

export function craftMotif(index){return (motifs[index]||motifs[18]).join('');}
