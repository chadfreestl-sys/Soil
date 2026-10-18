/* Turfarium Seasonal Photo Engine v3.0.
 * The ACTUAL lawn photograph is replaced on each verified state/season update;
 * the former photo is only a fading overlay. No hidden base photograph can mask progression.
 * The visual index and its photographs are illustrative; not a validated prediction.
 */
(()=>{'use strict';
const BASE='file_00000000f35481f5a24a1191fdf2adf5.png?v=clean-4';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const STATES=[
 {id:'stressed',min:0,candidates:['images/file_00000000f60c81f58e1f9164cec9f9d0.png']},
 {id:'poor',min:16,candidates:['images/file_00000000c8c081f5b7ed6a85460fa618.png']},
 {id:'fair',min:29,candidates:['images/file_00000000a54881f58bfef47b7c6a0230.png']},
 {id:'recovering',min:43,candidates:['images/file_000000005a7081f5876ddfa2f162213a.png']},
 {id:'healthy',min:57,candidates:['images/file_00000000069081f5b11be646372e7edc.png']},
 {id:'very-healthy',min:71,candidates:['images/file_00000000ccd481f5abee6788cae396de.png']},
 {id:'lush',min:83,candidates:['images/file_00000000450881f5a5dda37355d92399.png']},
 {id:'elite',min:93,candidates:['images/file_00000000712881f58d3f5b83c6615429.png']}
];

const loaded=new Map();
const lastState=new Map();
const pending=new Map();
const labels=STATES.map(x=>x.id==='very-healthy'?'Very healthy':x.id[0].toUpperCase()+x.id.slice(1));
const SEASONS=['winter','winter','spring','spring','spring','summer','summer','summer','fall','fall','fall','winter'];
function monthFor(key,snapshot){
 if(snapshot&&Number.isInteger(snapshot.month))return clamp(snapshot.month,0,11);
 const sel=Number(document.getElementById('startMonth')?.value);
 const start=Number.isInteger(sel)&&sel>=0&&sel<=11?sel:2;
 const days=dayFor(key);
 return (start+Math.floor((days%365)/30.4167))%12;
}
function dayFor(key){
 const d=document.getElementById('day'+key)?.textContent||'';
 return +(d.match(/\d+/)?.[0]||0);
}
function metric(key,label,fallback,group='kpi'){
 const root=document.getElementById(group+key);
 if(!root)return fallback;
 // Labels in the panel may contain extra evidence badges; only use the numeric result.
 const nodes=[...root.querySelectorAll(group==='kpi'?'.kpi':'.metric')];
 const node=nodes.find(el=>(el.querySelector('span')?.textContent||'').includes(label));
 if(node){
  const v=parseFloat((node.querySelector('strong,b')?.textContent||'').replace(/,/g,''));
  if(Number.isFinite(v))return clamp(v,0,100);
 }
 return fallback;
}
function fallbackSnapshot(key){
 return {
  day:dayFor(key),vigor:metric(key,'Turf vigor',55),
  biology:metric(key,'Beneficial guilds',30),worms:metric(key,'Earthworm activity',20),
  disease:metric(key,'Disease pressure',35),oxygen:metric(key,'Root-zone oxygen',45,'metric'),
  structure:metric(key,'Soil structure',35,'metric'),
  compaction:metric(key,'Compaction',55,'metric'),
  saltStress:metric(key,'Soluble salt stress proxy',12,'metric'),
  rootMass:metric(key,'Root biomass index',30,'roots')
 };
}
function snapshotFor(key){
 try{const direct=window.TurfariumVisualSnapshot?.(key);if(direct&&Number.isFinite(direct.vigor))return direct}
 catch(e){console.warn('[Turfarium] visual snapshot unavailable:',e)}
 return fallbackSnapshot(key);
}
function scoreFrom(s){
 const raw=Number(s.vigor)*.33+Number(s.biology)*.12+Number(s.worms)*.06+
 (100-Number(s.disease))*.10+Number(s.oxygen)*.10+Number(s.structure)*.10+
 (100-Number(s.compaction))*.07+(100-Number(s.saltStress))*.04+Number(s.rootMass)*.08;
 return Math.round(clamp(raw,0,100));
}
function score(key){return scoreFrom(snapshotFor(key))}
function stateForScore(n){
 let ix=0;for(let i=0;i<STATES.length;i++)if(n>=STATES[i].min)ix=i;
 return ix;
}
function stateWithHysteresis(key,target,n){
 const old=lastState.get(key);
 if(!old)return target;
 const previous=old.index;
 if(previous===target)return target;
 const margin=2;
 if(target>previous&&n<STATES[Math.min(previous+1,7)].min+margin)return previous;
 if(target<previous&&n>=STATES[previous].min-margin)return previous;
 return target;
}
function imageUrl(index,season){
 return 'images/seasons/'+season+'/state-'+String(index+1).padStart(2,'0')+'-'+STATES[index].id+'.webp';
}
function canLoad(url){
 if(loaded.has(url))return loaded.get(url);
 const result=new Promise(resolve=>{
  const image=new Image();
  image.onload=()=>resolve(true);
  image.onerror=()=>resolve(false);
  image.src=url;
 });
 loaded.set(url,result);
 return result;
}
async function imageFor(index,season){
 const local=imageUrl(index,season);
 if(await canLoad(local))return {src:local,kind:'seasonal'};
 // CDN fallback if Cloudflare's asset layer has not finished updating.
 const remote='https://raw.githubusercontent.com/chadfreestl-sys/Soil/main/'+local;
 if(await canLoad(remote))return {src:remote,kind:'seasonal-github'};
 for(const src of STATES[index].candidates){
  if(await canLoad(src))return {src,kind:'classic'};
 }
 return {src:null,kind:'unavailable'};
}
function elements(key){
 const panel=document.getElementById('lawn-'+key.toLowerCase()+'-panel');
 const stage=panel?.querySelector('.photo-stage');
 const photo=stage?.querySelector('img.soil-photo:not(.tf-state-photo)');
 return {stage,photo};
}
function ensureStage(stage,photo){
 stage.dataset.tfVisualEngine='v2'; // Prevent clean-photo's legacy base-image reset.
 let overlay=stage.querySelector('img.tf-state-photo');
 if(!overlay){
  overlay=document.createElement('img');
  overlay.className='tf-state-photo';
  overlay.setAttribute('alt','');overlay.setAttribute('aria-hidden','true');
  Object.assign(overlay.style,{position:'absolute',inset:'0',width:'100%',height:'100%',
   objectFit:'cover',objectPosition:'center',zIndex:'2',opacity:'0',
   transition:'opacity 1.3s ease',pointerEvents:'none'});
  photo.insertAdjacentElement('afterend',overlay);
 }
 let indicator=stage.nextElementSibling;
 if(!indicator?.classList.contains('tf-visual-indicator')){
  indicator=document.createElement('div');
  indicator.className='tf-visual-indicator';
  indicator.title='Illustrative image selected from the live turf ecosystem state.';
  stage.insertAdjacentElement('afterend',indicator);
 }
 return {overlay,indicator};
}
function indicatorText(indicator,text,error=false){
 indicator.textContent=text;indicator.dataset.tfImageUnavailable=error?'1':'0';
}
function notify(stage,key,src,season,index,n){
 stage.dispatchEvent(new CustomEvent('turfarium:visual-photo',{detail:{
  key,src,season,state:STATES[index].id,score:n
 }}));
}
function present(key,stage,photo,overlay,indicator,url,season,index,n,kind,request){
 if(pending.get(key)!==request)return;
 const display='Photo stage: '+labels[index]+' · '+season[0].toUpperCase()+season.slice(1)+' · index '+n;
 const already=photo.getAttribute('src')===url||photo.src===url;
 const done=()=>{
  if(pending.get(key)!==request)return;
  stage.dataset.tfVisualAsset=kind;
  stage.dataset.tfVisualSource=url;
  stage.dataset.tfPhotoReady='1';
  indicatorText(indicator,display+(kind==='classic'?' · classic fallback':''));
  notify(stage,key,url,season,index,n);
  // Reveal new image by fading OUT the previous one.
  requestAnimationFrame(()=>requestAnimationFrame(()=>{if(pending.get(key)===request)overlay.style.opacity='0'}));
 };
 if(already){overlay.style.opacity='0';done();return;}
 const previous=photo.currentSrc||photo.src;
 overlay.src=previous||BASE;
 overlay.style.opacity='1';
 photo.onload=done;
 photo.onerror=()=>{
  if(pending.get(key)!==request)return;
  photo.onload=null;photo.onerror=null;
  stage.dataset.tfPhotoReady='0';stage.dataset.tfVisualAsset='unavailable';
  indicatorText(indicator,display+' · photo unavailable',true);
  overlay.style.opacity='0';
 };
 photo.removeAttribute('srcset');
 photo.src=url; // IMPORTANT: update the actual photo; the overlay is only transitional.
 if(photo.complete&&photo.naturalWidth>0)done();
}
async function refresh(key){
 const {stage,photo}=elements(key);
 if(!stage||!photo)return;
 const {overlay,indicator}=ensureStage(stage,photo);
 const snapshot=snapshotFor(key);
 const rawScore=scoreFrom(snapshot);
 const month=monthFor(key,snapshot),season=SEASONS[month];
 // March-start photos should not imply a fully established summer canopy at day zero.
 // Visual-only early-season adjustment fades gradually; underlying vigor is unchanged.
 const elapsed=Math.max(0,Number(snapshot.day??dayFor(key))||0);
 const earlySpring=month===2||month===3||month===4;
 const establishmentOffset=earlySpring?Math.round(16*Math.max(0,1-elapsed/90)):0;
 const n=clamp(rawScore-establishmentOffset,0,100);
 const index=stateWithHysteresis(key,stateForScore(n),n);
 const id=STATES[index].id,signature=season+'/'+id;
 stage.dataset.tfVisualDay=String(snapshot.day??dayFor(key));
 stage.dataset.tfVisualScore=String(n);
 stage.dataset.tfVisualRawScore=String(rawScore);
 stage.dataset.tfVisualState=id;
 stage.dataset.tfVisualSeason=season;
 if(stage.dataset.tfPhotoSignature===signature&&stage.dataset.tfPhotoReady==='1'&&lastState.get(key)?.signature===signature){
  indicatorText(indicator,'Photo stage: '+labels[index]+' · '+season[0].toUpperCase()+season.slice(1)+' · visual index '+n+(establishmentOffset?' · early-spring canopy adjustment':''));
  return;
 }
 const request=(pending.get(key)||0)+1;
 pending.set(key,request);
 stage.dataset.tfPhotoSignature=signature;stage.dataset.tfPhotoReady='0';
 lastState.set(key,{index,signature});
 indicatorText(indicator,'Photo stage: '+labels[index]+' · '+season[0].toUpperCase()+season.slice(1)+' · loading…');
 const asset=await imageFor(index,season);
 if(pending.get(key)!==request)return;
 if(!asset.src){
  stage.dataset.tfVisualAsset='unavailable';
  stage.dataset.tfPhotoReady='0';
  indicatorText(indicator,'Photo stage: '+labels[index]+' · '+season+' · image unavailable',true);
  return;
 }
 present(key,stage,photo,overlay,indicator,asset.src,season,index,n,asset.kind,request);
}
let observing=false;
function boot(){
 if(!observing){
  observing=true;
  for(const key of ['A','B']){
   for(const id of ['kpi'+key,'day'+key]){
    const el=document.getElementById(id);
    if(!el)continue;
    new MutationObserver(()=>requestAnimationFrame(()=>refresh(key))).observe(el,
      {subtree:true,childList:true,characterData:true});
   }
  }
  const month=document.getElementById('startMonth');
  if(month)month.addEventListener('change',()=>{refresh('A');refresh('B')});
 }
 refresh('A');refresh('B');
}
const css=document.createElement('style');
css.id='tf-visual-state-v3-style';
css.textContent='.photo-stage{position:relative}'+
 '#lawn-a-panel .photo-stage>img.tf-state-photo,#lawn-b-panel .photo-stage>img.tf-state-photo{'+
 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2;pointer-events:none}'+
 '.tf-visual-indicator{margin:7px 2px 3px;font-size:.72rem;font-weight:800;line-height:1.35;color:#234f37}'+
 '.tf-visual-indicator[data-tf-image-unavailable="1"]{color:#a1382d}'+
 '@media(prefers-reduced-motion:reduce){.photo-stage>img.tf-state-photo{transition:none!important}}';
if(!document.getElementById(css.id))document.head.appendChild(css);
window.TurfariumVisualState={
 version:'3.0',states:STATES,score,refresh,refreshAll:boot,
 getStatus:key=>{const st=elements(key).stage;return st?{
  state:st.dataset.tfVisualState,season:st.dataset.tfVisualSeason,score:st.dataset.tfVisualScore,
  asset:st.dataset.tfVisualAsset,src:st.dataset.tfVisualSource,ready:st.dataset.tfPhotoReady
 }:null}
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('load',boot,{once:true});
})();
