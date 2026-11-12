import {readingBookmark} from './reading-route.js';
// A preferred starting page, not an age record. Both paths stay available.
export function cleanStartPath(value,hasStory=false){if(value==='story'||value==='fern')return value;if(value===null)return null;return hasStory?'story':null;}
export function cleanFernPage(value){return Number.isInteger(value)&&value>=1&&value<=19?value:0;}
export function parentReadingPage(route){const match=/^parents-(\d{1,2})$/.exec(route);return match?cleanFernPage(Number(match[1])):0;}
export function startPathRoute(path,state={}){if(path==='fern')return cleanFernPage(state.fernPage)?'#parents-'+state.fernPage:'#parents';return '#'+(state.introRead?readingBookmark(state.bookmark,state.done)||'story-1':'story-1');}
