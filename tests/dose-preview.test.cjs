const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('lab.html','utf8');
const start=html.indexOf('function doseInfo(key)'),end=html.indexOf('function applyDose(',start);
assert(start>=0&&end>start);
const source=html.slice(start,end);
function preview({unit='lb',rate=1,area=1000,grade=[24,0,12],density}){
 const nodes={treatA:{value:'fert24012'},rateA:{value:String(rate)},areaA:{value:String(area)},sprayA:{value:'1'},unitA:{value:unit},rateInfoA:{innerHTML:''}};
 const $=id=>nodes[id]||{value:''};
 const rateSpec=key=>{const value=rate,lbPerK=unit==='lb'?value:null,liquidPerK=unit==='floz'?value:null;return {value,area,spray:1,unit,lbPerK,liquidPerK}};
 const customProfiles=density?{fert24012:{form:'liquid',density,n:24,p:0,k:12}}:{};
 vm.runInNewContext(source+';doseInfo("A")',{$,rateSpec,customProfiles,productGrades:{fert24012:grade}});
 return nodes.rateInfoA.innerHTML;
}
assert.match(preview({}),/0\.240 lb N/);
assert.match(preview({}),/0\.120 lb K₂O/);
assert.match(preview({unit:'floz'}),/Nutrient mass unavailable/);
assert.match(preview({unit:'floz',density:10,rate:128}),/2\.400 lb N/);
assert.match(preview({area:2000}),/2\.000 lb total product/);
console.log('PASS dose preview unit handling and 24-0-12 nutrient math');
