// Contract checks for model → event → image selection. Run with node.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const engine=fs.readFileSync('turfarium-visual-state-v3-2.js','utf8');
const lab=fs.readFileSync('lab.html','utf8');
const match=engine.match(/const BASE88=(\[.*?\]);\nfunction verifiedBase\(score,season,snapshot\)\{[\s\S]*?\n\}\nasync function imageFor/);
assert(match,'selector block');
const js=match[0].replace(/\nasync function imageFor$/,'');
const ctx={Number,Math,String};vm.createContext(ctx);
vm.runInContext(js+'\nthis.pick=verifiedBase;this.entries=BASE88;',ctx);
assert.equal(ctx.entries.length,88);
const pick=(score,season,s)=>ctx.pick(score,season,s||{});
const number=url=>Number(url?.match(/BASE(\d\d)/)?.[1]);
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
console.log('PASS: BASE88 seasonal, event, treatment history and canonical microbial bridge contracts');
