import {readFile,writeFile} from 'node:fs/promises';
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inline=s=>escape(s).replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2">$1</a>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
const id=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function blocks(markdown){
 const lines=markdown.trim().split('\n'),out=[];let i=0;
 while(i<lines.length){const line=lines[i];if(!line.trim()){i++;continue;}
  const heading=/^(#{1,3}) (.+)$/.exec(line);
  if(heading){out.push(`<h${heading[1].length} id="${id(heading[2])}">${inline(heading[2])}</h${heading[1].length}>`);i++;continue;}
  if(line.startsWith('|')){const rows=[];while(i<lines.length&&lines[i].startsWith('|'))rows.push(lines[i++].split('|').slice(1,-1).map(x=>x.trim()));const [head,separator,...body]=rows;if(!separator.every(c=>/^:?-+:?$/.test(c)))throw Error('A table needs its header separator.');out.push(`<table><caption>The twenty places and their teaching goals</caption><colgroup><col class="level-col"><col class="place-col"><col></colgroup><thead><tr>${head.map(c=>`<th scope="col">${inline(c)}</th>`).join('')}</tr></thead><tbody>${body.map(row=>`<tr><th scope="row">${inline(row[0])}</th>${row.slice(1).map(c=>`<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);continue;}
  if(/^(- |\d+\. )/.test(line)){const ordered=/^\d/.test(line),items=[];while(i<lines.length&&(ordered?/^\d+\. /:/^- /).test(lines[i]))items.push(lines[i++].replace(/^(- |\d+\. )/,''));const tag=ordered?'ol':'ul';out.push(`<${tag}>${items.map(x=>`<li>${inline(x)}</li>`).join('')}</${tag}>`);continue;}
  const paragraph=[];while(i<lines.length&&lines[i].trim()&&!/^(#{1,3} |\||- |\d+\. )/.test(lines[i]))paragraph.push(lines[i++]);out.push(`<p>${inline(paragraph.join(' '))}</p>`);
 }
 return out.join('\n');
}
export function researchPage(markdown){
 const introEnd=markdown.indexOf('## Primary'),historyStart=markdown.indexOf('## Expanded story edition');
 if(introEnd<0||historyStart<0)throw Error('Research notes need their source and adaptation sections.');
 const intro=markdown.slice(0,introEnd).replace(/^# .+\n/,''),main=markdown.slice(introEnd,historyStart),history=markdown.slice(historyStart).replace(/^### Version 2 game design/m,'## Version 2 game design').replace(/^## /gm,'### ');
 return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="description" content="Sources, lesson mapping, and adaptation boundaries for Chochi Mochi, with a clean print layout."><title>Curriculum sources and adaptation notes · Chochi Mochi</title><link rel="stylesheet" href="research.css"></head>
<body><a class="skip" href="#notes">Skip to the notes</a><header class="page-tools"><a href="../index.html#parents">← Fern’s notes</a><div><a href="chochi-mochi-curriculum-notes.pdf" download>Download PDF</a><a href="RESEARCH.md" download>Text version</a><button type="button" id="print-notes">Print or save as PDF</button></div></header>
<main id="notes"><article><header class="document-head"><p class="eyebrow">Chochi Mochi · Notes for grown-ups</p><h1>Curriculum sources and adaptation notes</h1><p class="lead">Where the ideas come from, how the game uses them, and what the game can and cannot teach.</p>${blocks(intro)}</header>
<nav class="contents" aria-label="On this page"><strong>On this page</strong><a href="#primary-and-authoritative-sources">Sources</a><a href="#lesson-map">Lesson map</a><a href="#adaptation-boundaries">Adaptation boundaries</a><a href="#adaptation-history">Edition history</a></nav>
${blocks(main)}
<section class="history" aria-labelledby="adaptation-history"><h2 id="adaptation-history">Adaptation history</h2><p>These entries record earlier editions. They describe how the educational story grew; they do not add treatment instructions.</p>${blocks(history)}</section>
<footer class="document-footer"><p>Chochi Mochi · Curriculum sources and adaptation notes</p><p class="print-address">Game: https://michaelbrandonfalk.github.io/chochi-mochi/</p><a href="../index.html#guide">About the game</a></footer></article></main><script src="research-print.js"></script></body></html>\n`;
}
export async function writeResearchPage(){const markdown=await readFile(new URL('../docs/RESEARCH.md',import.meta.url),'utf8');await writeFile(new URL('../docs/research.html',import.meta.url),researchPage(markdown));}
