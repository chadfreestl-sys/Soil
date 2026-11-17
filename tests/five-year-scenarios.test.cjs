/* Deterministic five-year scenario regression (illustrative scenario engine). */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function build(){
 const window={};
 for(const p of ['js/food-web.js','js/five-year-scenarios.js']){
  vm.runInNewContext(fs.readFileSync(p,'utf8'),{window});
 }
 return window.TurfariumFiveYearScenarios;
}
const first=build().compare();
const second=build().compare();
const normalize=v=>JSON.parse(JSON.stringify(v));
assert.deepEqual(normalize(first),normalize(second),'same scenario must reproduce exactly');
const expected=[0,30,90,180,365,730,1825];
assert.deepEqual(Array.from(first.checkpoints),expected,'five-year checkpoints');
for(const label of ['conventional','biological','stressed']){
 const series=first[label];
 assert.equal(series.length,expected.length,label+' checkpoint count');
 for(let i=0;i<series.length;i++){
  const row=series[i];
  assert.equal(row.day,expected[i],label+' day');
  for(const k of ['canopy','roots']){
   assert(Number.isFinite(row[k])&&row[k]>=0&&row[k]<=100,label+' '+k+' bounded');
  }
  for(const [k,v] of Object.entries(row.food)){
   assert(Number.isFinite(v)&&v>=0&&v<=100,label+' food '+k+' bounded');
  }
 }
}
for(const label of ['biological','stressed']){
 assert.equal(first.conventional[0].canopy,first[label][0].canopy,'shared initial canopy');
 assert.equal(first.conventional[0].roots,first[label][0].roots,'shared initial roots');
}
assert(first.biological.at(-1).food.carbon>first.conventional.at(-1).food.carbon,'organic management carbon direction');
assert(first.stressed.at(-1).canopy<first.conventional.at(-1).canopy,'stressed canopy direction');
assert(first.stressed.at(-1).roots<first.conventional.at(-1).roots,'stressed root direction');
assert(/not calibrated/i.test(first.assumptions),'scenario must disclose calibration limitation');
console.log('PASS: deterministic five-year scenarios, three management pathways, common baseline, bounded soil guilds and expected stress directions');
