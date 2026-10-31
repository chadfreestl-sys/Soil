/* Run: node thermal-dynamics.test.js */
const assert=require('node:assert/strict');
const thermal=require('./thermal-dynamics.js');
let s=thermal.initialState({initialSoilF:50});
s=thermal.step(s,{highF:25,lowF:15,solarIndex:0},{moisture:0.3});
assert.equal(s.day,1);
assert(s.soilF[12]>s.soilF[2],'deep soil should lag cold air');
assert(s.soilF[2]>s.surfaceF,'shallow soil should lag cold surface');
const cold=s;
s=thermal.advance(s,15,()=>({highF:25,lowF:15,solarIndex:0}));
assert(s.soilF[12]<cold.soilF[12],'prolonged cold cools deep soil');
const prev=s.freezeThawCycles;
s=thermal.step(s,{highF:65,lowF:50,solarIndex:0.8});
assert(s.freezeThawCycles>=prev);
assert.throws(()=>thermal.step(s,{highF:10,lowF:20}),/highF/);
assert.equal(thermal.advance(s,0,()=>({})),s);
console.log('Thermal dynamics smoke tests passed');
