const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const window={};for(const p of ['js/food-web.js','js/five-year-scenarios.js'])vm.runInNewContext(fs.readFileSync(p,'utf8'),{window});const data=window.TurfariumFiveYearScenarios.compare();assert.equal(data.conventional.length,7);assert.equal(data.biological.length,7);for(let i=0;i<7;i++){const a=data.conventional[i],b=data.biological[i];assert.equal(a.day,data.checkpoints[i]);assert.equal(b.day,a.day);for(const s of [a,b])for(const k of ['canopy','roots'])assert(Number.isFinite(s[k])&&s[k]>=0&&s[k]<=100)}assert.equal(data.conventional[0].canopy,data.biological[0].canopy);assert.equal(data.conventional[0].roots,data.biological[0].roots);assert(data.biological[6].food.carbon>data.conventional[6].food.carbon);console.log('PASS five-year comparative scenario checkpoints, shared baseline, bounded values, carbon response');


assert.deepEqual(Array.from(data.checkpoints),[0,30,90,180,365,730,1825],'visual acceptance timeline must cover 0/30/90/180/365/1825');
assert.equal(data.stressed.length,7,'stressed lawn must cover every checkpoint');
for(let i=0;i<data.checkpoints.length;i++){
 const day=data.checkpoints[i];
 const conventional=data.conventional[i],biological=data.biological[i],stressed=data.stressed[i];
 assert.equal(stressed.day,day,'stressed scenario clock '+day);
 for(const state of [conventional,biological,stressed]){
  for(const k of ['canopy','roots'])assert(Number.isFinite(state[k])&&state[k]>=0&&state[k]<=100,k+' invalid at day '+day);
 }
}
assert(data.stressed[6].canopy<data.biological[6].canopy,'long-term stress should not yield healthier canopy than biological management');
assert(data.stressed[6].roots<data.biological[6].roots,'long-term stress should not yield stronger roots than biological management');
console.log('PASS phase 3: six requested visual checkpoints plus day 730, synchronized A/B clocks and contrasting stressed trajectory');
