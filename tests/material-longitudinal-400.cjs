/* Browser-based longitudinal integration: 400 independent material scenarios. */
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path');
const materials=['compost','aerate','irrigate','biochar','mineralN','highN','clippings','dethatch','lime','sulfur','seaweed102','seaweed0014','kelpmeal','humic','molasses','fish','alfalfa','wormcast','microbeinoc','slowN','urea','ammsulf','potassium','phosphate','wetting'];
(async()=>{
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const page=await browser.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('file://'+path.resolve('lab.html'),{waitUntil:'domcontentloaded',timeout:60000});
const outcome=await page.evaluate(({materials})=>{
 const failures=[],samples=[],days=[30,90,180],keys=['vigor','biology','worms','moisture','oxygen','structure','rootMass','canopyCover','tillerDensity','leafArea','soilNH4','soilEC'];
 const finite=(s)=>keys.every(k=>Number.isFinite(Number(s[k])));
 const score=(s)=>{const c=Math.max(0,Math.min(100,Number(s.canopyCover)||0)),t=Math.max(0,Math.min(100,Number(s.tillerDensity)||0)),l=Math.max(0,Math.min(100,Number(s.leafArea)||0)),v=Math.max(0,Math.min(100,Number(s.vigor)||0)),moist=Number(s.moisture),heat=Number(s.soilTempF);const dry=Number.isFinite(moist)?Math.max(0,Math.min(16,(38-moist)*.7)):0;const hot=Number.isFinite(heat)&&moist<38?Math.max(0,Math.min(3,(heat-85)*.12)):0;return Math.round(Math.max(0,Math.min(100,c*.52+t*.24+l*.12+v*.12-dry-hot)))};
 const records=[],initial=make(),baseline=JSON.stringify(initial);
 for(let i=0;i<400;i++){
  const type=materials[i%materials.length],variation=Math.floor(i/materials.length),lawn=i%2?'B':'A';
  try{
   day=0;A=JSON.parse(baseline);B=JSON.parse(baseline);history=[];log=[];treatmentRecords={A:[],B:[]};
   for(const site of [A,B]){
    site.moist=Math.max(10,Math.min(90,site.moist+(variation%4-1.5)*10));
    site.om=Math.max(.5,Math.min(10,site.om+(Math.floor(variation/4)-1.5)*.6));
    site.texture=['clay','loam','sand','clay'][variation%4];
    site.oxygenReserve=Math.max(10,Math.min(90,site.oxygenReserve+(variation%4-1.5)*8));
   }
   const active=lawn==='A'?A:B,control=lawn==='A'?B:A;
   const before=window.TurfariumVisualSnapshot(lawn);
   apply(active,type,'Lawn '+lawn);
   if(treatmentRecords[lawn].length!==1||treatmentRecords[lawn==='A'?'B':'A'].length!==0)throw Error('treatment recording/isolation');
   const points=[];
   for(let d=1;d<=180;d++){
    daily(A);daily(B);day++;
    if(days.includes(d)){
     const treated=window.TurfariumVisualSnapshot(lawn),untreated=window.TurfariumVisualSnapshot(lawn==='A'?'B':'A');
     if(!finite(treated)||!finite(untreated))throw Error('non-finite model output day '+d);
     for(const s of [treated,untreated]){
      for(const k of ['vigor','biology','worms','moisture','oxygen','structure','rootMass','canopyCover','tillerDensity','leafArea'])if(Number(s[k])<0||Number(s[k])>100)throw Error('out-of-range '+k+' day '+d);
     }
     const visualT=score(treated),visualC=score(untreated);
     if(visualT<0||visualT>100||visualC<0||visualC>100)throw Error('visual score out of range');
     points.push({day:d,vigorDelta:+(treated.vigor-untreated.vigor).toFixed(3),canopyDelta:+(treated.canopyCover-untreated.canopyCover).toFixed(3),rootDelta:+(treated.rootMass-untreated.rootMass).toFixed(3),biologyDelta:+(treated.biology-untreated.biology).toFixed(3),visualScoreDelta:visualT-visualC,treatedScore:visualT,controlScore:visualC});
    }
   }
   records.push({case:i+1,material:type,variation,lawn,points});
  }catch(e){failures.push({case:i+1,material:type,variation,lawn,error:String(e.message||e)});}
 }
 return {cases:400,passed:records.length,failed:failures.length,materials:materials.length,checkpoints:days,checks:['live daily model','live treatment application','independent A/B','30/90/180-day vigor/biology/roots/canopy','visual score contract','finite bounded model output'],failures:failures.slice(0,50),samples:records.filter((_,i)=>i%25===0).slice(0,16),allResults:records};
},{materials});
await browser.close();
fs.mkdirSync('audit',{recursive:true});fs.writeFileSync('audit/material-longitudinal-400-results.json',JSON.stringify({...outcome,browserErrors:errors.slice(0,20)},null,2)+'\n');
console.log(JSON.stringify({cases:outcome.cases,passed:outcome.passed,failed:outcome.failed,failures:outcome.failures.slice(0,10),browserErrors:errors.slice(0,5)}));
if(outcome.failed||errors.some(e=>/ReferenceError|SyntaxError/.test(e)))process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1});
