/* Turfarium image selection v4 (experimental, opt-in; no DOM side effects).
 * A deterministic, synchronous selector. The LLM is never called in a frame loop.
 * This module does not change the active v3 image engine until explicitly wired in.
 */
(function(global){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,Number.isFinite(+v)?+v:a));
const normalizeSeason=s=>['winter','spring','summer','fall'].includes(String(s).toLowerCase())?String(s).toLowerCase():'summer';
function normalizeState(s){
 s=s||{};
 return {
  season:normalizeSeason(s.season),
  canopy:clamp(s.canopyCover??s.canopy??50,0,100),
  moisture:clamp(s.soilMoisture??s.moisture??50,0,100),
  compaction:clamp(s.compaction??50,0,100),
  biology:clamp(s.biology??50,0,100),
  vigor:clamp(s.vigor??50,0,100)
 };
}
function distance(a,b){
 let d=0;
 for(const [field,weight] of [['canopy',4],['moisture',2],['compaction',1],['biology',1],['vigor',2]]){
  if(Number.isFinite(+b[field]))d+=weight*Math.abs(a[field]-clamp(b[field],0,100))/100;
 }
 return d;
}
function createSelector(manifest,options){
 const records=(Array.isArray(manifest)?manifest:manifest?.images||[])
  .filter(r=>r&&typeof r.src==='string'&&r.src.length&&r.approved!==false)
  .map((r,i)=>({...r,_index:i}));
 const opts=options||{};
 const cache=new Map();
 const limit=Math.max(8,Math.floor(opts.cacheSize||128));
 function select(raw,previous){
  const state=normalizeState(raw);
  const key=[state.season,...['canopy','moisture','compaction','biology','vigor'].map(k=>Math.round(state[k]/5))].join(':');
  let candidates=cache.get(key);
  if(!candidates){
   candidates=records.filter(r=>!r.season||r.season===state.season)
    .map(r=>({record:r,score:distance(state,r.conditions||{})}))
    .sort((a,b)=>a.score-b.score||a.record._index-b.record._index);
   cache.set(key,candidates);
   if(cache.size>limit)cache.delete(cache.keys().next().value);
  }
  if(!candidates.length)return null;
  const best=candidates[0];
  const prev=candidates.find(c=>c.record.id===previous?.id||c.record.src===previous?.src);
  const margin=clamp(opts.hysteresis??0.12,0,1);
  return (prev&&prev.score<=best.score+margin?prev:best).record;
 }
 return Object.freeze({select,count:records.length,clearCache:()=>cache.clear()});
}
global.TurfariumImageSelectorV4=Object.freeze({createSelector,normalizeState});
})(typeof window!=='undefined'?window:globalThis);
