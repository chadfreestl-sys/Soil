/* Turfarium BASE image registry v1.
 * All 88 existing image paths are registered (BASE64 is PNG; others WebP). Image condition tags are intentionally
 * absent until visually reviewed: numbering is NOT scientific metadata.
 */
(()=>{'use strict';
const assets=Object.freeze(Array.from({length:88},(_,i)=>{
 const id='BASE'+String(i+1).padStart(2,'0');
 return Object.freeze({id,src:'assets/turfarium/'+id+'/'+id+(id==='BASE64'?'.png':'.webp'),tags:[]});
}));
const rawManifest=window.TurfariumApprovedBaseMappings;
// Only a versioned, explicitly signed-off manifest can activate runtime mappings.
// Browser localStorage and review-candidate exports are NEVER runtime authority.
const reviewedRows=[];
const errors=[];
const allowedSeasons=new Set(['winter','spring','summer','fall']);
const allowedStates=new Set(['stressed','poor','fair','recovering','healthy','very-healthy','lush','elite']);
const allowedConditions=new Set(['drought-stress','waterlogging-stress','compaction-stress','recovery']);
const validIds=new Set(assets.map(x=>x.id));
const seen=new Set();
if(rawManifest!==undefined){
 if(!rawManifest||rawManifest.schema!=='turfarium-base-approved-v1'||!Array.isArray(rawManifest.entries))errors.push('Invalid approved manifest schema');
 else if(rawManifest.scientificSignoff!==true){if(rawManifest.entries.length)errors.push('Unsigned mappings cannot be activated');}
 else for(const row of rawManifest.entries){
  if(!row||!validIds.has(row.id)||!allowedSeasons.has(row.season)||!allowedStates.has(row.state)||(row.condition!==undefined&&!allowedConditions.has(row.condition))){errors.push('Invalid mapping row');continue}
  const key=[row.season,row.state,row.condition||'general'].join('|');
  if(seen.has(key)){errors.push('Duplicate mapping '+key);continue}
  seen.add(key);reviewedRows.push(Object.freeze({id:row.id,season:row.season,state:row.state,...(row.condition?{condition:row.condition}:{})}));
 }
}
// Fail closed: one invalid row prevents partial activation.
const reviewed=Object.freeze(errors.length?[]:reviewedRows);
function lookup(season,state,condition=null){
 if(!allowedSeasons.has(season)||!allowedStates.has(state))return null;
 // A condition-specific illustration must be explicitly reviewed for that condition.
 // Never silently substitute a drought image for waterlogging or vice versa.
 let row=null;
 if(condition&&allowedConditions.has(condition))row=reviewed.find(x=>x.season===season&&x.state===state&&x.condition===condition);
 if(!row)row=reviewed.find(x=>x.season===season&&x.state===state&&!x.condition);
 return row?assets.find(x=>x.id===row.id)?.src||null:null;
}
window.TurfariumBaseLibrary=Object.freeze({version:'1.1.0',assets,reviewed,lookup,reviewedCount:reviewed.length,mappingErrors:Object.freeze(errors),allowedConditions:Object.freeze([...allowedConditions])});
})();
