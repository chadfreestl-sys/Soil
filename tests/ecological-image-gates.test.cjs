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
