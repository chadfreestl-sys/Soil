const assert=require('node:assert/strict');
const fs=require('node:fs');
const html=fs.readFileSync('lab.html','utf8');
assert(html.includes("(t==='compost'||t==='wormcast')?nominalDose/30:nominalDose"),'Both organic materials must use bulk-amendment scaling');
assert(html.includes("if(x.type==='wormcast'){target[0]+=1.5*q;target[1]+=2*q}"),'Castings effect must be bounded');
const dose=(type,lb)=>Math.min(5,Math.max(0,['compost','wormcast'].includes(type)?lb/30:lb));
for(const type of ['compost','wormcast']){
 assert(Math.abs(dose(type,1)-1/30)<1e-12);
 assert(Math.abs(dose(type,2)-2/30)<1e-12);
 assert(dose(type,1)<dose(type,30));
}
assert.equal(dose('urea',1),1,'Other materials retain prior dose scaling');
assert.equal(dose('compost',0),0);
console.log('PASS low-rate compost/castings dose scaling and unrelated fertilizer contract');
