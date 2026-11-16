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
const replaySnapshots=new Map();
const labels=STATES.map(x=>x.id==='very-healthy'?'Very healthy':x.id[0].toUpperCase()+x.id.slice(1));
const SEASONS=['winter','winter','spring','spring','spring','summer','summer','summer','fall','fall','fall','winter'];
function monthFor(key,snapshot){
 if(snapshot&&Number.isInteger(snapshot.month))return clamp(snapshot.month,0,11);
 const sel=Number(document.getElementById('startMonth')?.value);
 const start=Number.isInteger(sel)&&sel>=0&&sel<=11?sel:2;
 const days=dayFor(key);
 const edges=[0,31,59,90,120,151,181,212,243,273,304,334,365];const within=days%365;const offset=Math.max(0,edges.findIndex((_,i)=>i<12&&within<edges[i+1]));return (start+offset)%12;
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
 if(replaySnapshots.has(key))return replaySnapshots.get(key);
 try{const direct=window.TurfariumVisualSnapshot?.(key);if(direct&&Number.isFinite(direct.vigor))return direct}
 catch(e){console.warn('[Turfarium] visual snapshot unavailable:',e)}
 return fallbackSnapshot(key);
}
function scoreFrom(s){
 // Visible canopy determines photographic succession. Soil biology and root
 // metrics influence photos indirectly through the plant growth model.
 // Fallback retains compatibility with snapshots recorded before physiology v1.
 if(Number.isFinite(Number(s.canopyCover))&&Number.isFinite(Number(s.tillerDensity))){
  const cover=clamp(Number(s.canopyCover),0,100);
  const tillers=clamp(Number(s.tillerDensity),0,100);
  const leaves=clamp(Number(s.leafArea)||0,0,100);
  const color=clamp(Number(s.vigor)||0,0,100);
  return Math.round(clamp(cover*.52+tillers*.24+leaves*.12+color*.12,0,100));
 }
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
 // Cache successes indefinitely, but retry failed CDN assets after a cooldown.
 // A transient 404/network failure must not permanently hide a seasonal image.
 const cached=loaded.get(url);
 if(cached&&(!cached.failedAt||Date.now()-cached.failedAt<60000))return cached.promise;
 const entry={promise:null,failedAt:0};
 entry.promise=new Promise(resolve=>{
  const image=new Image();
  image.onload=()=>resolve(true);
  image.onerror=()=>resolve(false);
  image.src=url;
 }).then(ok=>{if(!ok)entry.failedAt=Date.now();return ok});
 loaded.set(url,entry);
 return entry.promise;
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
 // Mobile stacked layout MOVES the actual photo-stage out of its original panel.
 // Resolve by stable stage identity first, then its original location, then stacked card.
 const panel=document.getElementById('lawn-'+key.toLowerCase()+'-panel');
 const stacked=document.getElementById('tf-stacked-lawns');
 const card=stacked?.querySelector('.tf-lawn-visual:nth-child('+(key==='A'?1:2)+')');
 let stage=document.querySelector('.photo-stage[data-tf-lawn-key="'+key+'"]')||
   panel?.querySelector('.photo-stage')||card?.querySelector('.photo-stage');
 if(stage)stage.dataset.tfLawnKey=key;
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
   transition:'opacity 2.4s ease-in-out',pointerEvents:'none'});
  photo.insertAdjacentElement('afterend',overlay);
 }
 // The mobile layout moves the photo-stage, leaving its original caption behind.
 // Reattach that same caption rather than creating a second, stale indicator.
 let indicator=stage.nextElementSibling;
 if(!indicator?.classList.contains('tf-visual-indicator')){
  const key=stage.dataset.tfLawnKey;
  const original=document.getElementById('lawn-'+String(key||'').toLowerCase()+'-panel');
  indicator=original?.querySelector('.tf-visual-indicator')||document.createElement('div');
  indicator.className='tf-visual-indicator';
  indicator.title='Illustrative image selected from the live turf ecosystem state.';
  stage.insertAdjacentElement('afterend',indicator);
 }
 // Any detached legacy captions are not authoritative and must not be displayed.
 const key=stage.dataset.tfLawnKey;
 const original=document.getElementById('lawn-'+String(key||'').toLowerCase()+'-panel');
 original?.querySelectorAll('.tf-visual-indicator').forEach(el=>{if(el!==indicator)el.remove()});
 return {overlay,indicator};
}
// Status remains available to the visual engine but is not homeowner-facing UI.
const statusStyle=document.createElement('style');
statusStyle.id='tf-hide-photo-diagnostics';
statusStyle.textContent='.tf-visual-indicator{display:none!important}';
document.head.appendChild(statusStyle);
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
  // Reject stale completion before publishing readiness or source metadata.
  // Otherwise a prior-season load can briefly appear ready to other modules.
  const liveSeason=stage.querySelector('.tf-season-on-photo')?.dataset.season;
  if(liveSeason&&liveSeason!==season){
   requestAnimationFrame(()=>refresh(key));
   return;
  }
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
 overlay.style.transition='none';
 overlay.src=previous||BASE;
 overlay.style.opacity='1';
 void overlay.offsetWidth;
 overlay.style.transition='opacity 2.4s ease-in-out';
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
 const canopyStatus=' · cover '+(Number(snapshot.canopyCover)||0).toFixed(1)+'% · tillers '+(Number(snapshot.tillerDensity)||0).toFixed(1);
 const month=monthFor(key,snapshot),season=SEASONS[month];
 // Show a verifiable visual clock directly on each lawn, independent of photo loading.
 let badge=stage.querySelector('.tf-season-on-photo');
 if(!badge){badge=document.createElement('span');badge.className='tf-season-on-photo';badge.setAttribute('aria-live','polite');stage.appendChild(badge);}
 const monthName=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][month];
 badge.textContent=monthName+' · '+season[0].toUpperCase()+season.slice(1)+' · Day '+(snapshot.day??dayFor(key));
 badge.dataset.season=season;
 // March-start photos should not imply a fully established summer canopy at day zero.
 // Visual-only early-season adjustment fades gradually; underlying vigor is unchanged.
 const elapsed=Math.max(0,Number(snapshot.day??dayFor(key))||0);
 const earlySpring=month===2||month===3||month===4;
 const establishmentOffset=earlySpring?Math.round(16*Math.max(0,1-elapsed/90)):0;
 const n=clamp(rawScore-establishmentOffset,0,100);
 // A restart or backward replay must not retain the later photograph's state.
 const previousDay=Number(lastState.get(key)?.day);
 if(Number.isFinite(previousDay)&&elapsed<previousDay)lastState.delete(key);
 const index=stateWithHysteresis(key,stateForScore(n),n);
 const signature=season+'|'+index;
 // Continuous, model-linked visual progression even when the photo stays in the
 // same categorical image band. Small increments should be subtle, not dramatic.
 // Canopy appearance follows modeled turf vigor and stress; root status informs
 // the photographic stage, but is not mistaken for directly visible leaf color.
 const canopy=clamp(Number(snapshot.vigor)||0,0,100);
 const root=clamp(Number(snapshot.rootMass)||0,0,100);
 const oxygen=clamp(Number(snapshot.oxygen)||0,0,100);
 const salt=clamp(Number(snapshot.saltStress)||0,0,100);
 const canopyGrowth=clamp((canopy-20)/75,0,1);
 const rootSupport=clamp((root*.65+oxygen*.35)/100,0,1);
 const stressPenalty=clamp(salt/100,0,1);
 // Turfarium v25 models tall fescue only. Do not apply warm-season dormancy
 // or transition multipliers to this cool-season species.
 const seasonalWarmth=season==='summer'?1.06:season==='winter'?.75:season==='fall'?.91:1;
 const dormancyFactor=season==='winter'?.76:season==='fall'?.9:1;
 // Continuous per-lawn appearance: discrete photo assets may share a state,
 // but the live photograph must still reflect independently modeled canopy vigor.
 // Keep adjustments restrained: treatments do not automatically imply greener turf.
 const cover=clamp(Number(snapshot.canopyCover)||0,0,100);
 const tillers=clamp(Number(snapshot.tillerDensity)||0,0,100);
 const leafArea=clamp(Number(snapshot.leafArea)||0,0,100);
 const canopyHealth=clamp(canopy*.58+cover*.22+tillers*.12+leafArea*.08,0,100);
 const moistureStress=clamp((35-(Number(snapshot.moisture)||35))/35,0,1);
 const saturation=clamp((.57+canopyHealth*.0082-stressPenalty*.12-moistureStress*.12)*seasonalWarmth*dormancyFactor,.32,1.34);
 const brightness=clamp((.78+canopyHealth*.0038-stressPenalty*.06-moistureStress*.06)*(season==='winter'?.92:1),.70,1.16);
 const contrast=clamp(.97+canopyHealth*.001, .95,1.09);
 // A separate canopy-only layer makes the continuous modeled response visible
 // without recoloring soil or inventing new root/earthworm positions.
 // Its strength follows the absolute per-lawn plant state, not treatment labels.
 let canopyLayer=stage.querySelector('.tf-canopy-response');
 if(!canopyLayer){
  canopyLayer=document.createElement('div');
  canopyLayer.className='tf-canopy-response';
  canopyLayer.setAttribute('aria-hidden','true');
  stage.appendChild(canopyLayer);
 }
 const canopySignal=clamp((canopyHealth-45)/45,0,1);
 const moistureSignal=clamp((Number(snapshot.moisture)||35)/100,0,1);
 const canopyTintStrength=clamp(.025+canopySignal*.19+moistureSignal*.045-stressPenalty*.08,0,.25);
 canopyLayer.style.background='linear-gradient(to bottom,rgba(37,108,37,'+canopyTintStrength.toFixed(3)+') 0%,rgba(48,118,43,'+(canopyTintStrength*.67).toFixed(3)+') 24%,transparent 43%)';
 canopyLayer.dataset.tfCanopyResponse=canopyHealth.toFixed(1);
 // Keep the base scientific photograph intact while showing continuous,
 // independently modeled canopy and soil-moisture differences. These are
 // illustrative visual treatments, not newly simulated roots or organisms.
 let canopyOptics=stage.querySelector('.tf-canopy-optics');
 if(!canopyOptics){
  canopyOptics=document.createElement('div');
  canopyOptics.className='tf-canopy-optics';
  canopyOptics.setAttribute('aria-hidden','true');
  stage.appendChild(canopyOptics);
 }
 const greenSignal=clamp((canopyHealth-35)/65,0,1);
 const opticsSaturation=clamp(.70+greenSignal*.80-moistureStress*.15-stressPenalty*.14,.56,1.55);
 const opticsBrightness=clamp(.86+greenSignal*.23-moistureStress*.10,.72,1.13);
 canopyOptics.style.backdropFilter='saturate('+opticsSaturation.toFixed(3)+') brightness('+opticsBrightness.toFixed(3)+')';
 canopyOptics.style.webkitBackdropFilter=canopyOptics.style.backdropFilter;
 canopyOptics.dataset.tfCanopyIndex=canopyHealth.toFixed(1);
 let soilOptics=stage.querySelector('.tf-soil-moisture-optics');
 if(!soilOptics){
  soilOptics=document.createElement('div');
  soilOptics.className='tf-soil-moisture-optics';
  soilOptics.setAttribute('aria-hidden','true');
  stage.appendChild(soilOptics);
 }
 const soilMoisture=clamp(Number(snapshot.moisture??35),0,100);
 // Dry soil becomes slightly lighter; moist soil slightly darker. The mask
 // excludes most of the canopy and never changes root shapes.
 const soilShade=clamp((soilMoisture-45)/55,-.60,.60);
 soilOptics.style.background=soilShade>=0
  ?'rgba(15,18,12,'+(soilShade*.14).toFixed(3)+')'
  :'rgba(201,172,122,'+(-soilShade*.12).toFixed(3)+')';
 soilOptics.dataset.tfMoistureIndex=soilMoisture.toFixed(1);


 photo.style.setProperty('filter','saturate('+saturation.toFixed(3)+') brightness('+brightness.toFixed(3)+') contrast('+contrast.toFixed(3)+')','important');
 photo.style.transition='filter 3.8s ease-in-out';
 stage.dataset.tfVisualFilter='saturation '+saturation.toFixed(2)+'; brightness '+brightness.toFixed(2);
 stage.dataset.tfVisualDay=String(snapshot.day??dayFor(key));
 stage.dataset.tfVisualScore=String(n);
 stage.dataset.tfVisualRawScore=String(rawScore);
 stage.dataset.tfVisualState=STATES[index].id;
 stage.dataset.tfVisualSeason=season;
 stage.dataset.tfRootSupport=rootSupport.toFixed(3);
 stage.dataset.tfCanopyVigor=String(Math.round(canopy));
 stage.dataset.tfLastRenderedScore=String(n);
 stage.dataset.tfLastRenderedDay=String(Number(snapshot.day??dayFor(key))||0);
 stage.dataset.tfVisualProgress='score '+n+' / canopy '+Math.round(canopy)+' / root support '+Math.round(rootSupport*100);
 if(stage.dataset.tfPhotoSignature===signature&&stage.dataset.tfPhotoReady==='1'&&lastState.get(key)?.signature===signature){
  lastState.set(key,{index,signature,day:elapsed});
  indicatorText(indicator,'Photo stage: '+labels[index]+' · '+season[0].toUpperCase()+season.slice(1)+' · visual index '+n+(establishmentOffset?' · early-spring canopy adjustment':'')+canopyStatus);
  return;
 }
 const request=(pending.get(key)||0)+1;
 pending.set(key,request);
 stage.dataset.tfPhotoSignature=signature;stage.dataset.tfPhotoReady='0';
 lastState.set(key,{index,signature,day:elapsed});
 indicatorText(indicator,'Photo stage: '+labels[index]+' · '+season[0].toUpperCase()+season.slice(1)+' · loading…');
 const asset=await imageFor(index,season);
 if(pending.get(key)!==request)return;
 // A later clock update may have changed the season during asset resolution.
 if(stage.querySelector('.tf-season-on-photo')?.dataset.season!==season){
  requestAnimationFrame(()=>refresh(key));
  return;
 }
 if(!asset.src){
  stage.dataset.tfVisualAsset='unavailable';
  stage.dataset.tfPhotoReady='0';
  indicatorText(indicator,'Photo stage: '+labels[index]+' · '+season+' · image unavailable',true);
  return;
 }
 present(key,stage,photo,overlay,indicator,asset.src,season,index,n,asset.kind,request);
}
let observing=false;
let visualClockTimer=null;
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
  // Keep caption and season synchronized even when host updates state without mutating observed KPI nodes.
  // A slow clock is sufficient; refresh() avoids image reloads when the stage is unchanged.
  if(!visualClockTimer)visualClockTimer=setInterval(()=>{
   if(document.hidden)return;
   for(const key of ['A','B']){
    const stage=elements(key).stage;
    if(!stage)continue;
    const snapshot=snapshotFor(key);
    const season=SEASONS[monthFor(key,snapshot)];
    const day=String(snapshot.day??dayFor(key));
    if(stage.dataset.tfVisualDay!==day||stage.dataset.tfVisualSeason!==season)refresh(key);
   }
  },1500);
  // Reconcile visible caption against the authoritative clock badge, including
  // asynchronous photo completions and third-party mobile DOM relocation.
  if(!window.TurfariumCaptionSyncTimer)window.TurfariumCaptionSyncTimer=setInterval(()=>{
   if(document.hidden)return;
   for(const key of ['A','B']){
    const {stage,photo}=elements(key);if(!stage||!photo)continue;
    const badge=stage.querySelector('.tf-season-on-photo');
    const indicator=stage.nextElementSibling;
    if(!badge||!indicator?.classList.contains('tf-visual-indicator'))continue;
    const season=badge.dataset.season;
    const shown=indicator.textContent||'';
    const seasonLabel=season?.charAt(0).toUpperCase()+season?.slice(1);
    if(seasonLabel&&shown.startsWith('Photo stage:')&&!shown.includes(' · '+seasonLabel+' · ')){
     const score=stage.dataset.tfVisualScore||'?';
     const state=stage.dataset.tfVisualState||'unknown';
     indicatorText(indicator,'Photo stage: '+state.replace(/-/g,' ')+' · '+seasonLabel+' · visual index '+score);
     refresh(key);
    }
   }
  },1200);
  const month=document.getElementById('startMonth');
  if(month)month.addEventListener('change',()=>{refresh('A');refresh('B')});
 }
 refresh('A');refresh('B');
}
const css=document.createElement('style');
css.id='tf-visual-state-v3-style';
css.textContent='.photo-stage{position:relative}'+
 '.photo-stage>img.tf-state-photo{'+
 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2;pointer-events:none}'+
 '.tf-visual-indicator{margin:7px 2px 3px;font-size:.72rem;font-weight:800;line-height:1.35;color:#234f37}'+
 '.tf-visual-indicator[data-tf-image-unavailable="1"]{color:#a1382d}'+
 '@media(prefers-reduced-motion:reduce){.photo-stage>img.tf-state-photo{transition:none!important}}';
css.textContent+=' .photo-stage>.tf-canopy-response{position:absolute;inset:0;z-index:4;pointer-events:none;transition:background 2.5s ease-out}';
css.textContent+=' .photo-stage>.tf-canopy-optics{position:absolute;inset:0;z-index:3;pointer-events:none;mask-image:linear-gradient(to bottom,#000 0%,#000 18%,transparent 43%);-webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 18%,transparent 43%);transition:backdrop-filter 2.5s ease-out}';
css.textContent+=' .photo-stage>.tf-soil-moisture-optics{position:absolute;inset:0;z-index:3;pointer-events:none;mask-image:linear-gradient(to bottom,transparent 38%,#000 61%,#000 100%);-webkit-mask-image:linear-gradient(to bottom,transparent 38%,#000 61%,#000 100%);transition:background 2.5s ease-out}';
css.textContent+=' .photo-stage .tf-season-on-photo{position:absolute;bottom:9px;left:9px;z-index:30;pointer-events:none;padding:5px 9px;border-radius:8px;background:rgba(19,54,40,.88);color:white;font:700 12px/1.25 system-ui,sans-serif;box-shadow:0 2px 6px #0005} .photo-stage .tf-season-on-photo[data-season="winter"]{background:rgba(43,71,92,.91)} .photo-stage .tf-season-on-photo[data-season="fall"]{background:rgba(107,68,26,.91)} .photo-stage .tf-season-on-photo[data-season="summer"]{background:rgba(37,89,34,.91)}';
if(!document.getElementById(css.id))document.head.appendChild(css);
window.TurfariumVisualState={
 version:'3.10',states:STATES,score,refresh,refreshAll:boot,
 showReplayFrame:(frames)=>{for(const key of ['A','B']){if(!frames?.[key])continue;replaySnapshots.set(key,frames[key]);const stage=elements(key).stage;if(stage){stage.dataset.tfPhotoSignature='';stage.dataset.tfPhotoReady='0';}lastState.delete(key);refresh(key);}},
 endReplay:()=>{replaySnapshots.clear();lastState.clear();refresh('A');refresh('B');},
 getStatus:key=>{const st=elements(key).stage;return st?{
  state:st.dataset.tfVisualState,season:st.dataset.tfVisualSeason,score:st.dataset.tfVisualScore,
  asset:st.dataset.tfVisualAsset,src:st.dataset.tfVisualSource,ready:st.dataset.tfPhotoReady
 }:null}
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('load',boot,{once:true});
window.addEventListener('turfarium:time-advanced',()=>{refresh('A');refresh('B')});
document.getElementById('grass')?.addEventListener('change',()=>{refresh('A');refresh('B')});
})();
