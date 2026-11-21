const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('lab.html','utf8');
const match=html.match(/const pSufficiency=cl\(\(s\.p-3\)\/12,0,1\);[\s\S]*?const growthOpportunity=cl\(stressFit\*carbonFactor\*nitrogenGrowthFactor\*nutrientGrowthFactor,0,1\);/);
assert(match,'live P/K/pH growth coupling missing');
const cl=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
function growth(p,k,ph){return vm.runInNewContext('(()=>{const s={p,k,ph},stressFit=.8,carbonFactor=.9,nitrogenGrowthFactor=1;'+match[0]+';return growthOpportunity})()', {cl,p,k,ph});}
assert(growth(4,120,6.3)<growth(20,120,6.3),'P-deficient soil should limit growth');
assert(growth(20,25,6.3)<growth(20,120,6.3),'K-deficient soil should limit growth');
assert(growth(20,120,5)<growth(20,120,6.3),'acidic soil should limit growth');
assert(growth(20,120,8)<growth(20,120,6.3),'alkaline soil should limit growth');
assert.equal(growth(20,120,6.3),growth(100,500,6.3),'sufficient nutrients should not create luxury growth');
assert(Math.abs(growth(20,120,6.3)-.72)<1e-12,'sufficient soil should preserve baseline growth');
console.log('PASS nutrient limitation: deficient P/K and off-range pH limit growth; sufficient soil remains unchanged');

// Post-merge production regression verification.
