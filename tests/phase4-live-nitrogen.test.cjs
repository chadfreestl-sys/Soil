/* Tests the nitrogen uptake function used by the live lab.html model. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync('lab.html','utf8');
const match=html.match(/function turfariumNitrogenUptake\(no3,nh4,demand\)\{[\s\S]*?\n\}/);
assert(match,'Live nitrogen uptake helper must exist');
const uptake=vm.runInNewContext('('+match[0]+')');
const near=(a,b)=>assert(Math.abs(a-b)<1e-9, a+' != '+b);
for(const nitrate of [0,.001,1,2,10,100]){
 for(const ammonium of [0,.001,1,2,10,100]){
  for(const demand of [0,.001,.1,1,2,5,10,200]){
   const r=uptake(nitrate,ammonium,demand);
   assert(r.no3>=0&&r.nh4>=0&&r.uptake>=0);
   near(r.no3+r.nh4+r.uptake,nitrate+ammonium);
   near(r.uptake,Math.min(demand,nitrate+ammonium));
  }
 }
}
const noNh4=uptake(10,0,5);
near(noNh4.uptake,5);near(noNh4.no3,5);
const noNo3=uptake(0,10,5);
near(noNo3.uptake,5);near(noNo3.nh4,5);
assert(html.includes('s.cycle.uptake+=nitrogenUptake.uptake;'),'Cycle must report actual uptake');
assert(html.includes('window.TurfariumScienceSnapshot=function()'),'Science snapshot bridge must remain');
assert(html.includes('function advance(n){'),'Timeline must remain');
assert(html.includes('function record(){'),'Replay history must remain');
console.log('PASS live model nitrogen uptake: 288 mass-balance cases and integration contracts');
