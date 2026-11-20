/* 400 deterministic treatment-application cases against live lab.html apply(). */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('lab.html','utf8');
const start=html.indexOf('function apply(s,t,name){');
const end=html.indexOf('function snapshotV18(s)',start);
assert(start>=0&&end>start,'live apply function must exist');
const source=html.slice(start,end);
const materials=['compost','aerate','irrigate','biochar','mineralN','highN','clippings','dethatch','lime','sulfur','seaweed102','seaweed0014','kelpmeal','humic','molasses','fish','alfalfa','wormcast','microbeinoc','slowN','urea','ammsulf','potassium','phosphate','wetting'];
const keys=['labileC','om','organicN','k','p','bulk','oxygenReserve','moist','waterInput','nh4','ec','thatch','ph','cec','microbialC','rootMass','seaweedSignal','bad','comp','carbon','salts'];
const cl=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
function base(seed){return {labileC:20+seed%20,om:2.5,organicN:200,k:100,p:25,bulk:1.35,oxygenReserve:60,moist:30+seed%40,waterInput:0,nh4:5,ec:.4,thatch:1.2,ph:5.8,cec:12,microbialC:30,rootMass:30,seaweedSignal:0,bad:[20,30,40],effects:[],comp:40,carbon:25,salts:9.6};}
let passed=0,failed=[],examples=[];
for(let i=0;i<400;i++){
 const type=materials[i%materials.length],lawn=i%2?'B':'A',seed=Math.floor(i/materials.length);
 const A=base(seed),B=base(seed);const target=lawn==='A'?A:B,other=lawn==='A'?B:A;
 const untouched=JSON.stringify(other),before={...target,bad:target.bad.slice(),effects:[]};
 const records={A:[],B:[]},logs=[];
 const ctx={cl,day:seed*7,log:logs,render:()=>{},treatmentRecords:records,treatments:Object.fromEntries(materials.map(x=>[x,x])),months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],monthIndex:()=>seed%12,climates:{test:{label:'Test site'}},$:id=>id==='region'?{value:'test'}:{selectedOptions:[{text:'Normal'}]}};
 try{
  vm.runInNewContext(source+';apply(site,type,name)',{...ctx,site:target,type,name:'Lawn '+lawn});
  assert.equal(JSON.stringify(other),untouched,'cross-lawn mutation');
  assert.equal(records[lawn].length,1,'treatment recorded');
  assert.equal(records[lawn==='A'?'B':'A'].length,0,'cross-lawn treatment recorded');
  assert.equal(target.effects.length,1,'effect added');
  for(const k of keys){if(typeof target[k]==='number')assert(Number.isFinite(target[k]),'non-finite '+k);}
  for(const v of target.bad)assert(Number.isFinite(v)&&v>=0&&v<=100,'pathogen index bounded');
  const direction={compost:['labileC',1],aerate:['bulk',-1],irrigate:['moist',1],biochar:['cec',1],mineralN:['nh4',1],highN:['nh4',1],clippings:['labileC',1],dethatch:['thatch',-1],lime:['ph',1],sulfur:['ph',-1],seaweed102:['k',1],seaweed0014:['k',1],kelpmeal:['labileC',1],humic:['cec',1],molasses:['labileC',1],fish:['organicN',1],alfalfa:['organicN',1],wormcast:['organicN',1],microbeinoc:['microbialC',1],slowN:['nh4',1],urea:['nh4',1],ammsulf:['nh4',1],potassium:['k',1],phosphate:['p',1],wetting:['moist',1]};
  const [field,sign]=direction[type];assert(sign*(target[field]-before[field])>0,'incorrect response direction '+type+' '+field);
  passed++;
  if(examples.length<25)examples.push({material:type,lawn,field,before:before[field],after:target[field]});
 }catch(e){failed.push({case:i+1,material:type,lawn,error:e.message});}
}
const result={cases:400,passed,failed:failed.length,uniqueMaterials:materials.length,checks:['live apply function','treatment record','independent A/B','finite state','response direction'],failures:failed.slice(0,30),examples};
fs.mkdirSync('audit',{recursive:true});fs.writeFileSync('audit/material-application-400-results.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result));
if(failed.length)process.exitCode=1;
