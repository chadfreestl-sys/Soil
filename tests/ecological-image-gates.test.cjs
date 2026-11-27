const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const engine=fs.readFileSync('turfarium-visual-state-v3-2.js','utf8');
const block=engine.match(/const BASE88=(\[.*?\]);\nfunction verifiedBase\(score,season,snapshot,key\)\{[\s\S]*?\n\}\nasync function imageFor/)[0].replace(/\nasync function imageFor$/,'');
const ctx={};vm.createContext(ctx);vm.runInContext(block+'\nthis.pick=verifiedBase;',ctx);
const hits=new Set();let checks=0;
for(const season of ['spring','summer'])for(const score of [15,27,42,50,58,72,86])for(const moisture of [20,37,43,60,90])for(const soilTempF of [65,82,90])for(const nStatus of [.3,.8])for(const rootMass of [20,70])for(let day=0;day<=1825;day+=21)for(const key of ['A','B']){
 const id=Number(ctx.pick(score,season,{day,moisture,soilTempF,nStatus,rootMass,oxygen:60,canopyCover:score,tillerDensity:score,weedPressure:12},key)?.match(/BASE(\d+)/)?.[1]);hits.add(id);checks++;
 if([76,80,81].includes(id))assert(moisture<38);
 if(id===79)assert(soilTempF>=82);
 if(id===93)assert(nStatus<.55);
 if(id===95)assert(soilTempF>=82&&moisture>=43&&moisture<88);
}
for(const id of [76,79,80,81,93,95])assert(hits.has(id),'unreachable gated asset '+id);
assert(fs.readFileSync('lab.html','utf8').includes('nStatus:site.nStatus'));
console.log('PASS: '+checks+' actual selector evaluations; six gated assets reachable with appropriate model evidence.');

// Frost-only artwork must never stand in for snow or a clear lawn.
const frosted = new Set([18, 19, 47, 54, 55]);
const snowCovered = new Set([20, 21, 35, 48, 49, 50, 56, 57, 58]);
const winterHits = new Set();
let winterChecks = 0;
for (const season of ['fall', 'winter', 'spring']) {
 for (const frostActive of [false, true]) {
  for (const snowDepth of [0, 1]) {
   for (const score of [18, 27, 43, 58, 72, 86, 95]) {
    for (const weedPressure of [12, 65]) {
     for (let day = 0; day <= 420; day += 21) {
      for (const key of ['A', 'B']) {
       const snapshot = {day, frostActive, snowDepth, weedPressure, rootMass: 60};
       const id = Number(ctx.pick(score, season, snapshot, key)?.match(/BASE(\d+)/)?.[1]);
       if (frosted.has(id)) assert(frostActive && !snowDepth, 'frost asset BASE' + id);
       if (snowCovered.has(id)) assert(snowDepth > 0, 'snow asset BASE' + id);
       if (snowDepth && Number.isFinite(id)) assert(snowCovered.has(id), 'non-snow asset BASE' + id);
       winterHits.add(id);
       winterChecks++;
      }
     }
    }
   }
  }
 }
}
for (const id of [...frosted, ...snowCovered]) assert(winterHits.has(id), 'unreachable winter-event asset BASE' + id);
console.log('PASS: ' + winterChecks + ' frost and snow selector evaluations.');
