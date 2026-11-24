// Contract checks for model → event → image selection. Run with node.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const engine=fs.readFileSync('turfarium-visual-state-v3-2.js','utf8');
const lab=fs.readFileSync('lab.html','utf8');
const match=engine.match(/const BASE89=(\[.*?\]);\nfunction verifiedBase\(score,season,snapshot,key\)\{[\s\S]*?\n\}\nasync function imageFor/);
assert(match,'selector block');
const js=match[0].replace(/\nasync function imageFor$/,'');
const ctx={Number,Math,String};vm.createContext(ctx);
vm.runInContext(js+'\nthis.pick=verifiedBase;this.entries=BASE89;',ctx);
assert.equal(ctx.entries.length,89);
assert.equal(numberWinter(),89,'winter low-vigor asset registered');
function numberWinter(){const entry=ctx.entries.find(x=>x.n===89);return entry?.season==='winter'&&entry?.vigor==='low'&&entry?.event==='none'?entry.n:0;}
const equalState={day:0,canopyCover:54,tillerDensity:48,rootMass:40,weedPressure:35,moisture:50,oxygen:60};
const a0=ctx.pick(55,'spring',equalState,'A'),b0=ctx.pick(55,'spring',equalState,'B');
assert.notEqual(a0,b0,'equal modeled starting states should have distinct equivalent illustrations');
const pick=(score,season,s,key='A')=>ctx.pick(score,season,s||{},key);
const number=url=>Number(url?.match(/BASE(\d\d)/)?.[1]);

// Treatment-response imaging: application labels alone must not fabricate growth.
// A real plant response may change the photograph; season and events remain gated.
const baseline={day:30,canopyCover:48,tillerDensity:45,rootMass:38,weedPressure:35,moisture:55,oxygen:65};
const labelOnly={...baseline,treatment:'highN',fertilizerApplied:true};
assert.equal(pick(50,'spring',baseline,'A'),pick(50,'spring',labelOnly,'A'),
 'fertilizer label alone must not change the image');
const recovered={...baseline,day:90,canopyCover:83,tillerDensity:78,rootMass:75,weedPressure:8};
const stressed={...baseline,day:90,canopyCover:18,tillerDensity:22,rootMass:18,weedPressure:75};
const recoveredImage=pick(86,'spring',recovered,'A');
const stressedImage=pick(22,'spring',stressed,'A');
assert.notEqual(recoveredImage,stressedImage,'meaningful plant-condition separation must change imagery');
for(const d of [0,7,14,30,60,90]){
 const state={...baseline,day:d};
 assert.equal(pick(50,'spring',state,'A'),pick(50,'spring',state,'A'),
  'same modeled state must render deterministically at day '+d);
}

const forbidden=new Set([6,7,9,10,51,63,70,75]);
for(const season of ['spring','summer','fall','winter'])for(const score of [5,25,50,75,95]){
 const id=number(pick(score,season,{moisture:50,oxygen:60,rootMass:40}));
 assert(!forbidden.has(id),'event illustration without event '+id);
}
assert(![6,7].includes(number(pick(35,'spring',{moisture:50,oxygen:70}))));
assert([6,7].includes(number(pick(35,'spring',{moisture:95,oxygen:12}))), 'waterlogging must be eligible and prioritized');
assert([9,10].includes(number(pick(45,'spring',{recentCoreAeration:true,moisture:55,oxygen:60}))), 'aeration event');
assert([63,70,75].includes(number(pick(70,'summer',{irrigationActive:true,moisture:55,oxygen:60}))), 'irrigation event');
assert(lab.includes("r.type==='irrigate'&&day-r.day>=0&&day-r.day<=1"),'irrigation tied to application record');
assert(lab.includes("r.type==='aerate'&&day-r.day>=0&&day-r.day<=7"),'aeration tied to application record');
assert(lab.includes('soilGood:site.good.slice()'),'canonical microbial guilds available');
assert(lab.includes('soilWorms:site.worms.slice()'),'canonical earthworms available');
console.log('PASS: BASE89 seasonal, event, treatment history and canonical microbial bridge contracts');
