// Alternate instruments and rhythms so a full trip has a varied soundtrack.
export const playlist=[
 {file:'clover-waltz.mp3',title:'Clover Waltz',description:'Soft keys · a gentle waltz'},
 {file:'paper-boats.mp3',title:'Paper Boats',description:'Warm clarinet and harp · a rocking boat song'},
 {file:'meadow-guitar.mp3',title:'Meadow Guitar',description:'Soft guitar · a gentle walk'},
 {file:'pebble-waltz.mp3',title:'Pebble Waltz',description:'Harp and plucked strings · a woodland waltz'},
 {file:'willow-flute.mp3',title:'Willow Flute',description:'Flute and strings · slow and airy'},
 {file:'teacup-two-step.mp3',title:'Teacup Two-Step',description:'Soft piano · a small, cheerful dance'},
 {file:'orchard-marimba.mp3',title:'Orchard Marimba',description:'Marimba and bass · a light dance'},
 {file:'cloud-picnic.mp3',title:'Cloud Picnic',description:'Soft reeds and guitar · a swaying picnic song'},
 {file:'cloud-bells.mp3',title:'Cloud Bells',description:'Music box bells · quiet and light'},
 {file:'fern-and-feather.mp3',title:'Fern and Feather',description:'Wooden flute and guitar · a sunny walking song'},
 {file:'bluebell-strings.mp3',title:'Bluebell Strings',description:'Warm strings · a soft bedtime song'},
 {file:'homeward-lanterns.mp3',title:'Homeward Lanterns',description:'Cello and soft piano · a warm homecoming'}
];
export function audioPreferences(saved={}){
 const volume=(v,fallback)=>Number.isFinite(v)?Math.max(0,Math.min(1,v)):fallback;
 return {musicOn:typeof saved.musicOn==='boolean'?saved.musicOn:true,effectsOn:typeof saved.effectsOn==='boolean'?saved.effectsOn:true,musicVolume:volume(saved.musicVolume,.24),effectsVolume:volume(saved.effectsVolume,.25),position:Number.isFinite(saved.position)?Math.max(0,Math.min(3600,saved.position)):0,track:Math.max(0,playlist.findIndex(t=>t.file===saved.track))};
}
export function nextTrack(current,count=playlist.length){return (current+1)%count;}
