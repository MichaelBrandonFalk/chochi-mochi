// A preview of an unavailable ending must not replace the player's reading page.
export function readingBookmark(route,completed=[]){
 if(typeof route!=='string')return null;
 if(/^story-[1-3]$/.test(route))return route;
 const count=new Set(completed.filter(i=>Number.isInteger(i)&&i>=0&&i<19)).size;
 if(route==='homeward')return count===19?route:null;
 const match=/^(level|outing)-(\d+)(?:-scene-([1-7]))?$/.exec(route);
 if(!match)return null;
 const level=Number(match[2]);
 if(level<1||level>20||match[1]==='outing'&&match[3])return null;
 if(match[1]==='level'&&level===20&&count<19)return null;
 return route;
}
