export const playlist=[
 {file:'clover-waltz.mp3',title:'Clover Waltz',description:'Soft keys · a gentle waltz'},
 {file:'meadow-guitar.mp3',title:'Meadow Guitar',description:'Soft guitar · a gentle walk'},
 {file:'willow-flute.mp3',title:'Willow Flute',description:'Flute and strings · slow and airy'},
 {file:'cloud-bells.mp3',title:'Cloud Bells',description:'Music box bells · quiet and light'},
 {file:'bluebell-strings.mp3',title:'Bluebell Strings',description:'Warm strings · a soft bedtime song'},
 {file:'orchard-marimba.mp3',title:'Orchard Marimba',description:'Marimba and bass · a light dance'}
];
export function audioPreferences(saved={}){
 const volume=(v,fallback)=>Number.isFinite(v)?Math.max(0,Math.min(1,v)):fallback;
 return {musicOn:typeof saved.musicOn==='boolean'?saved.musicOn:true,effectsOn:typeof saved.effectsOn==='boolean'?saved.effectsOn:true,musicVolume:volume(saved.musicVolume,.24),effectsVolume:volume(saved.effectsVolume,.25),track:Math.max(0,playlist.findIndex(t=>t.file===saved.track))};
}
export function nextTrack(current,count=playlist.length){return (current+1)%count;}
