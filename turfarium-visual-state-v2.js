/* Turfarium Visual State Engine v2.3 — model-driven, independent Lawn A/B photographic succession using uploaded state images. */
(()=>{'use strict';
const BASE='file_00000000f35481f5a24a1191fdf2adf5.png?v=clean-4';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
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
const loaded=new Map(),stateByKey=new Map(),requestByKey=new Map();
function readMetric(key,label,fallback=50,container='kpi'){
 const value=document.getElementById(container+key)?.textContent||'';
 const escaped=label.replace(/[.*+?^$\{\}()|[\]\\]/g,'\\$&');
 const m=value.match(new RegExp(escaped+'[^0-9]{0,100}([0-9]+(?:\\.[0-9]+)?)','i'));
 return m?clamp(Number(m[1]),0,100):fallback;
}
function day(key){const t=document.getElementById('day'+key)?.textContent||'';return +(t.match(/([0-9]+)/)?.[1]||0)}
// Illustrative visual index: real model outputs, not an independently validated turf-health measurement.
function score(key){
 const vigor=readMetric(key,'Turf vigor',65);
 const biology=readMetric(key,'Beneficial guilds',40);
 const worms=readMetric(key,'Earthworm activity',35);
 const disease=readMetric(key,'Disease pressure',20);
 const oxygen=readMetric(key,'Root-zone oxygen',65,'metric');
 const structure=readMetric(key,'Soil structure',50,'metric');
 const compaction=readMetric(key,'Compaction',45,'metric');
 const saltStress=readMetric(key,'Soluble salt stress proxy',20,'metric');
 const rootMass=readMetric(key,'Root biomass index',50,'roots');
 const raw=vigor*.33+biology*.12+worms*.06+(100-disease)*.10+oxygen*.10+structure*.10+
  (100-compaction)*.07+(100-saltStress)*.04+rootMass*.08;
 return Math.round(clamp(raw,0,100));
}
function stateForScore(s){let out=STATES[0];for(const st of STATES)if(s>=st.min)out=st;return out}
function hysteretic(key,target,s){
 const prev=stateByKey.get(key);if(!prev)return target;
 const pi=STATES.findIndex(x=>x.id===prev),ti=STATES.findIndex(x=>x.id===target.id);if(pi<0||ti===pi)return target;
 const margin=3;
 if(ti>pi){const threshold=STATES[Math.min(pi+1,STATES.length-1)].min+margin;if(s<threshold)return STATES[pi];}
 else {const threshold=STATES[pi].min-margin;if(s>=threshold)return STATES[pi];}
 return target;
}
function canLoad(src){
 if(loaded.has(src))return loaded.get(src);
 const p=new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(src);im.onerror=()=>resolve(null);im.src=src;});loaded.set(src,p);return p;
}
async function assetFor(st){
 for(const path of st.candidates){
  for(const src of [path,'https://raw.githubusercontent.com/chadfreestl-sys/Soil/main/'+path]){
   if(await canLoad(src))return src;
  }
 }
 return null;
}
function labelState(id){return id==='very-healthy'?'Very healthy':id[0].toUpperCase()+id.slice(1)}
function setIndicator(stage,message,unavailable=false){
 const el=stage.nextElementSibling?.classList.contains('tf-visual-indicator')?stage.nextElementSibling:null;
 if(el){el.textContent=message;el.dataset.tfImageUnavailable=unavailable?'1':'0'}
}
function ensureLayers(stage,photo){
 stage.dataset.tfVisualEngine='v2';
 if(!stage.nextElementSibling?.classList.contains('tf-visual-indicator')){
  const info=document.createElement('div');info.className='tf-visual-indicator';info.title='Illustrative photo stage based on the simulator\'s current state, not a calibrated agronomic prediction.';stage.after(info);
 }
 let top=stage.querySelector('img.tf-state-photo');
 if(!top){top=photo.cloneNode(false);top.className='tf-state-photo';top.setAttribute('alt','');top.removeAttribute('id');top.removeAttribute('srcset');top.setAttribute('aria-hidden','true');Object.assign(top.style,{position:'absolute',inset:'0',width:'100%',height:'100%',objectFit:'cover',opacity:'0',transition:'opacity 1.8s ease',zIndex:'1',pointerEvents:'none'});photo.style.position='relative';photo.style.zIndex='0';stage.insertBefore(top,photo.nextSibling);}
 return top;
}
async function refresh(key){
 const panel=document.getElementById('lawn-'+key.toLowerCase()+'-panel');
 const stage=panel?.querySelector('.photo-stage');
 const photo=stage?.querySelector('img.soil-photo:not(.tf-state-photo)');
 if(!stage||!photo)return;
 const top=ensureLayers(stage,photo);
 const s=score(key),wanted=hysteretic(key,stateForScore(s),s),previous=stateByKey.get(key);
 const headline='Photo stage: '+labelState(wanted.id)+' · visual index '+s;
 stage.dataset.tfVisualScore=String(s);
 stage.dataset.tfVisualState=wanted.id;
 stage.dataset.tfVisualDay=String(day(key));
 // Continuous appearance adjustments make conditions within one stage distinguishable.
 const strength=clamp((s-50)/50,-1,1);
 top.style.filter='saturate('+(1+strength*.14).toFixed(3)+') brightness('+(1+strength*.065).toFixed(3)+')';
 if(previous===wanted.id&&top.dataset.tfStateReady==='1'){
  setIndicator(stage,headline+(stage.dataset.tfVisualAsset==='missing'?' · image unavailable':''),stage.dataset.tfVisualAsset==='missing');
  return;
 }
 const request=(requestByKey.get(key)||0)+1;requestByKey.set(key,request);
 stateByKey.set(key,wanted.id);
 top.dataset.tfStateReady='0';
 setIndicator(stage,headline+' · loading photo…');
 const src=await assetFor(wanted);
 if(request!==requestByKey.get(key))return;
 const finalSrc=src||BASE;
 const notify=()=>stage.dispatchEvent(new CustomEvent('turfarium:visual-photo',{detail:{key,src:finalSrc,state:wanted.id,score:s}}));
 if(!src){
  stage.dataset.tfVisualAsset='missing';
  top.style.opacity='0';top.dataset.tfStateReady='1';top.dataset.tfState=wanted.id;
  setIndicator(stage,headline+' · image unavailable',true);
  notify();return;
 }
 stage.dataset.tfVisualAsset=src.startsWith('http')?'github':'local';
 const finish=()=>{
  if(request!==requestByKey.get(key))return;
  top.dataset.tfStateReady='1';top.dataset.tfState=wanted.id;
  setIndicator(stage,headline);
  notify();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{if(request===requestByKey.get(key))top.style.opacity='1'}));
 };
 if(top.getAttribute('src')===src){finish();return;}
 top.style.opacity='0';
 // The source was preloaded above; reuse the browser image cache and wait for the visible image to decode.
 top.onload=finish;
 top.onerror=()=>{
  if(request!==requestByKey.get(key))return;
  stage.dataset.tfVisualAsset='missing';
  top.style.opacity='0';top.dataset.tfStateReady='1';
  setIndicator(stage,headline+' · photo failed to display',true);
 };
 top.removeAttribute('srcset');top.src=src;
 if(top.complete&&top.naturalWidth>0)finish();
}
function boot(){for(const key of ['A','B']){
 const kpi=document.getElementById('kpi'+key),d=document.getElementById('day'+key);if(kpi&&!kpi.dataset.tfVisualStateObserved){kpi.dataset.tfVisualStateObserved='1';new MutationObserver(()=>requestAnimationFrame(()=>refresh(key))).observe(kpi,{subtree:true,childList:true,characterData:true});}if(d&&!d.dataset.tfVisualStateObserved){d.dataset.tfVisualStateObserved='1';new MutationObserver(()=>requestAnimationFrame(()=>refresh(key))).observe(d,{subtree:true,childList:true,characterData:true});}refresh(key);
 }}
const style=document.createElement('style');style.id='tf-visual-state-v2-style';style.textContent=`.photo-stage{position:relative}#lawn-a-panel .photo-stage>img.tf-state-photo,#lawn-b-panel .photo-stage>img.tf-state-photo{display:block;visibility:visible;position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:1;border-radius:inherit}.tf-visual-indicator{margin:7px 2px 2px;font-size:.71rem;font-weight:800;line-height:1.3;color:#244b37;letter-spacing:.005em}.tf-visual-indicator[data-tf-image-unavailable=\"1\"]{color:#9b3323}@media(prefers-reduced-motion:reduce){.photo-stage>img.tf-state-photo{transition:none!important}}`;if(!document.getElementById(style.id))document.head.appendChild(style);
window.TurfariumVisualState={version:'2.3',states:STATES,score,refresh,refreshAll:boot};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();window.addEventListener('load',boot,{once:true});[250,700,1500,3000].forEach(ms=>setTimeout(boot,ms));
})();
