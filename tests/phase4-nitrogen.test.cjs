// Phase 4 source invariants and nitrogen-pool unit checks.
// Run: node tests/phase4-nitrogen.test.cjs
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const src=fs.readFileSync('lab.html','utf8');
assert.match(src,/s\.nStatus=cl\(/);
assert.match(src,/const nitrogenSufficiency=cl\(Number\.isFinite\(s\.nStatus\)/);
assert.doesNotMatch(src,/s\.n\*\.14\+phFit/);
const match=src.match(/function turfariumNitrogenUptake\(no3,nh4,demand\)\{[\s\S]*?\n\}/);
assert.ok(match,'uptake function exists');
const uptake=vm.runInNewContext(match[0]+'; turfariumNitrogenUptake');
for(const [no3,nh4,demand] of [[0,0,1],[1,0,3],[0,2,1],[2,3,4],[12,5,.075]]){
 const out=uptake(no3,nh4,demand);
 assert.ok(Math.abs((no3+nh4)-(out.no3+out.nh4)-out.uptake)<1e-9,'N mass conserved during uptake');
 assert.ok(out.no3>=0&&out.nh4>=0);
 assert.ok(out.uptake<=demand+1e-9);
}
const grade=[24,0,12],rate=1;
assert.equal(rate*grade[0]/100,.24);
assert.equal(rate*grade[2]/100,.12);
console.log('Phase 4 static and uptake-unit checks passed. Day 30/60/90/120 browser integration and field calibration still required.');
