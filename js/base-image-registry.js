/* Turfarium BASE image registry v1.
 * All 88 existing image paths are registered (BASE64 is PNG; others WebP). Image condition tags are intentionally
 * absent until visually reviewed: numbering is NOT scientific metadata.
 */
(()=>{'use strict';
const assets=Object.freeze(Array.from({length:88},(_,i)=>{
 const id='BASE'+String(i+1).padStart(2,'0');
 return Object.freeze({id,src:'assets/turfarium/'+id+'/'+id+(id==='BASE64'?'.png':'.webp'),tags:[]});
}));
const reviewed=Object.freeze([]); // Add {id,season,state} ONLY after scientific image review.
const allowedSeasons=new Set(['winter','spring','summer','fall']);
const allowedStates=new Set(['stressed','poor','fair','recovering','healthy','very-healthy','lush','elite']);
function lookup(season,state){
 const row=reviewed.find(x=>x.season===season&&x.state===state&&allowedSeasons.has(x.season)&&allowedStates.has(x.state));
 return row?assets.find(x=>x.id===row.id)?.src||null:null;
}
window.TurfariumBaseLibrary=Object.freeze({version:'1.0.0',assets,reviewed,lookup,reviewedCount:reviewed.length});
})();
