export const playlist=[
 {file:'clover-waltz.mp3',title:'Clover Waltz'},
 {file:'pear-blossom.mp3',title:'Pear Blossom'},
 {file:'cloud-carousel.mp3',title:'Cloud Carousel'},
 {file:'bluebell-tea.mp3',title:'Bluebell Tea'}
];
export function audioPreferences(saved={}){
 const volume=(v,fallback)=>Number.isFinite(v)?Math.max(0,Math.min(1,v)):fallback;
 return {musicOn:typeof saved.musicOn==='boolean'?saved.musicOn:true,effectsOn:typeof saved.effectsOn==='boolean'?saved.effectsOn:true,musicVolume:volume(saved.musicVolume,.24),effectsVolume:volume(saved.effectsVolume,.25)};
}
export function nextTrack(current,count=playlist.length){return (current+1)%count;}
