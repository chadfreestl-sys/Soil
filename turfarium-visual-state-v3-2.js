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
  // Visible drought stress must affect the photographic category as well as
  // color grading. Moisture is a conceptual 0-100 index, not VWC: only
  // pronounced dry conditions reduce the visual score. Preserve canopy
  // structure and avoid assigning treatment-specific bonuses.
  const moisture=s.moisture==null?NaN:Number(s.moisture);
  const dryPenalty=Number.isFinite(moisture)
   ?clamp((48-moisture)*1.30,0,30):0;
  const heat=s.soilTempF==null?NaN:Number(s.soilTempF);
  const heatPenalty=Number.isFinite(heat)&&Number.isFinite(moisture)&&moisture<43
   ?clamp((heat-82)*.20,0,5):0;
  // Give independently modeled turf health meaningful influence alongside
  // actual canopy cover, tillering and leaf area. A vigor difference should
  // be legible without fabricating treatment-specific photographic bonuses.
  return Math.round(clamp(cover*.36+tillers*.18+leaves*.10+color*.36-dryPenalty-heatPenalty,0,100));
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
 const margin=1;
 // Only delay a transition across its immediately adjacent boundary.
 // A large drought/recovery jump must never be trapped in an obsolete band.
 if(target>previous&&n<STATES[previous+1].min+margin)return previous;
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
// Reviewed BASE01–88 subject metadata; event-specific illustrations require event evidence.
const BASE88=[{"n":1,"season":"spring","event":"none","vigor":"mid","weed":1,"root":0,"ext":"webp"},{"n":2,"season":"spring","event":"none","vigor":"mid","weed":1,"root":0,"ext":"webp"},{"n":3,"season":"spring","event":"none","vigor":"low","weed":0,"root":0,"ext":"webp"},{"n":4,"season":"spring","event":"none","vigor":"low","weed":0,"root":0,"ext":"webp"},{"n":5,"season":"spring","event":"none","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":6,"season":"spring","event":"waterlogged","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":7,"season":"spring","event":"waterlogged","vigor":"low","weed":0,"root":0,"ext":"webp"},{"n":8,"season":"spring","event":"none","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":9,"season":"spring","event":"aeration","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":10,"season":"spring","event":"aeration","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":11,"season":"spring","event":"none","vigor":"high","weed":1,"root":0,"ext":"webp"},{"n":12,"season":"spring","event":"none","vigor":"low","weed":0,"root":0,"ext":"webp"},{"n":13,"season":"fall","event":"none","vigor":"low","weed":0,"root":0,"ext":"webp"},{"n":14,"season":"any","event":"none","vigor":"mid","weed":1,"root":0,"ext":"webp"},{"n":15,"season":"fall","event":"none","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":16,"season":"fall","event":"none","vigor":"mid","weed":0,"root":1,"ext":"webp"},{"n":17,"season":"fall","event":"none","vigor":"low","weed":0,"root":0,"ext":"webp"},{"n":18,"season":"winter","event":"snow","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":19,"season":"winter","event":"snow","vigor":"low","weed":0,"root":0,"ext":"webp"},{"n":20,"season":"winter","event":"snow","vigor":"low","weed":0,"root":0,"ext":"webp"},{"n":21,"season":"spring","event":"snow","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":22,"season":"spring","event":"snow","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":23,"season":"spring","event":"none","vigor":"mid","weed":1,"root":0,"ext":"webp"},{"n":24,"season":"spring","event":"none","vigor":"high","weed":0,"root":1,"ext":"webp"},{"n":25,"season":"spring","event":"none","vigor":"mid","weed":1,"root":0,"ext":"webp"},{"n":26,"season":"spring","event":"none","vigor":"mid","weed":1,"root":0,"ext":"webp"},{"n":27,"season":"spring","event":"none","vigor":"high","weed":1,"root":0,"ext":"webp"},{"n":28,"season":"spring","event":"none","vigor":"high","weed":0,"root":1,"ext":"webp"},{"n":29,"season":"spring","event":"none","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":30,"season":"spring","event":"none","vigor":"mid","weed":0,"root":1,"ext":"webp"},{"n":31,"season":"any","event":"none","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":32,"season":"fall","event":"none","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":33,"season":"fall","event":"none","vigor":"high","weed":0,"root":1,"ext":"webp"},{"n":34,"season":"any","event":"none","vigor":"high","weed":0,"root":1,"ext":"webp"},{"n":35,"season":"winter","event":"snow","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":36,"season":"any","event":"none","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":37,"season":"any","event":"rain","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":38,"season":"any","event":"none","vigor":"mid","weed":1,"root":0,"ext":"webp"},{"n":39,"season":"any","event":"none","vigor":"mid","weed":1,"root":0,"ext":"webp"},{"n":40,"season":"any","event":"none","vigor":"mid","weed":1,"root":0,"ext":"webp"},{"n":41,"season":"fall","event":"none","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":42,"season":"fall","event":"none","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":43,"season":"fall","event":"none","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":44,"season":"fall","event":"none","vigor":"high","weed":0,"root":1,"ext":"webp"},{"n":45,"season":"fall","event":"none","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":46,"season":"fall","event":"none","vigor":"mid","weed":1,"root":0,"ext":"webp"},{"n":47,"season":"fall","event":"none","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":48,"season":"winter","event":"snow","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":49,"season":"winter","event":"snow","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":50,"season":"winter","event":"snow","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":51,"season":"any","event":"storm","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":52,"season":"fall","event":"none","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":53,"season":"fall","event":"none","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":54,"season":"winter","event":"frost","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":55,"season":"winter","event":"snow","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":56,"season":"winter","event":"snow","vigor":"high","weed":0,"root":1,"ext":"webp"},{"n":57,"season":"winter","event":"snow","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":58,"season":"winter","event":"snow","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":59,"season":"spring","event":"none","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":60,"season":"spring","event":"none","vigor":"high","weed":1,"root":0,"ext":"webp"},{"n":61,"season":"summer","event":"none","vigor":"high","weed":0,"root":1,"ext":"webp"},{"n":62,"season":"summer","event":"none","vigor":"high","weed":0,"root":1,"ext":"webp"},{"n":63,"season":"summer","event":"irrigation","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":64,"season":"summer","event":"none","vigor":"mid","weed":1,"root":0,"ext":"jpg"},{"n":65,"season":"summer","event":"none","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":66,"season":"summer","event":"none","vigor":"high","weed":1,"root":1,"ext":"webp"},{"n":67,"season":"summer","event":"none","vigor":"high","weed":0,"root":1,"ext":"webp"},{"n":68,"season":"summer","event":"none","vigor":"high","weed":1,"root":1,"ext":"webp"},{"n":69,"season":"summer","event":"none","vigor":"high","weed":1,"root":0,"ext":"webp"},{"n":70,"season":"summer","event":"irrigation","vigor":"high","weed":1,"root":0,"ext":"webp"},{"n":71,"season":"summer","event":"none","vigor":"mid","weed":1,"root":1,"ext":"webp"},{"n":72,"season":"summer","event":"none","vigor":"mid","weed":1,"root":0,"ext":"webp"},{"n":73,"season":"summer","event":"none","vigor":"high","weed":0,"root":1,"ext":"webp"},{"n":74,"season":"summer","event":"none","vigor":"low","weed":0,"root":1,"ext":"webp"},{"n":75,"season":"summer","event":"irrigation","vigor":"mid","weed":0,"root":0,"ext":"webp"},{"n":76,"season":"summer","event":"none","vigor":"low","weed":0,"root":0,"ext":"webp"},{"n":77,"season":"summer","event":"none","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":78,"season":"summer","event":"none","vigor":"mid","weed":1,"root":1,"ext":"webp"},{"n":79,"season":"summer","event":"none","vigor":"low","weed":0,"root":0,"ext":"webp"},{"n":80,"season":"summer","event":"none","vigor":"low","weed":0,"root":0,"ext":"webp"},{"n":81,"season":"summer","event":"none","vigor":"low","weed":0,"root":0,"ext":"webp"},{"n":82,"season":"summer","event":"none","vigor":"high","weed":1,"root":0,"ext":"webp"},{"n":83,"season":"summer","event":"none","vigor":"high","weed":0,"root":1,"ext":"webp"},{"n":84,"season":"summer","event":"none","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":85,"season":"summer","event":"none","vigor":"high","weed":0,"root":1,"ext":"webp"},{"n":86,"season":"summer","event":"none","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":87,"season":"summer","event":"none","vigor":"high","weed":0,"root":0,"ext":"webp"},{"n":88,"season":"summer","event":"none","vigor":"mid","weed":1,"root":0,"ext":"webp"},{"n":89,"season":"winter","event":"none","vigor":"low","weed":0,"root":0,"ext":"png"},{"n":90,"season":"winter","event":"none","vigor":"mid","weed":0,"root":0,"ext":"png"},{"n":91,"season":"winter","event":"none","vigor":"high","weed":0,"root":1,"ext":"png"}];
function verifiedBase(score,season,snapshot,key){
 const s=snapshot||{};
 const moisture=Number(s.moisture),oxygen=Number(s.oxygen),root=Number(s.rootMass);
 const snow=Number(s.snowDepth??s.snowCover??0)>0;
 const frost=s.frostActive===true;
 const rain=s.rainActive===true;
 const irrigation=s.irrigating===true||s.irrigationActive===true;
 const storm=s.stormActive===true;
 const aeration=s.aerationActive===true||s.recentCoreAeration===true;
 const wet=Number.isFinite(moisture)&&moisture>=88&&Number.isFinite(oxygen)&&oxygen<35;
 const band=score<43?'low':score<73?'mid':'high';
 const eligible=BASE88.filter(x=>{
  if(x.season!=='any'&&x.season!==season)return false;
  if(x.event==='snow'&&!snow)return false;
  if(x.event==='frost'&&!frost)return false;
  if(x.event==='rain'&&!rain)return false;
  if(x.event==='irrigation'&&!irrigation)return false;
  if(x.event==='storm'&&!storm)return false;
  if(x.event==='aeration'&&!aeration)return false;
  if(x.event==='waterlogged'&&!wet)return false;
  if(x.event==='none'&&snow)return false;
  if(x.event==='none'&&irrigation)return false;
  return true;
 });
 if(!eligible.length)return null;
 const desiredWeeds=s.weedPressure==null&&s.weeds==null?NaN:Number(s.weedPressure??s.weeds);
 const cover=s.canopyCover==null?NaN:Number(s.canopyCover);
 const tillers=s.tillerDensity==null?NaN:Number(s.tillerDensity);
 const day=Number.isFinite(Number(s.day))?Number(s.day):0;
 // Continuous plant-condition matching separates lawns even within the same
 // broad vigor band. A/B never receives a synthetic "make different" bonus.
 const condition=Number.isFinite(cover)&&Number.isFinite(tillers)
  ?Math.max(0,Math.min(100,score*.45+cover*.38+tillers*.17)):score;
 const target=condition<43?'low':condition<73?'mid':'high';
 const targetVigor=target==='low'?27:target==='mid'?58:86;
 const phase=Math.floor(Math.max(0,day)/21);
 const scored=eligible.map(x=>{
  const imageVigor=x.vigor==='low'?27:x.vigor==='mid'?58:86;
  let cost=Math.abs(imageVigor-condition)*.7;
  // Category mismatch remains expensive: a severely thin lawn must not
  // suddenly display a pristine dense canopy to create visual variety.
  if(x.vigor!==target)cost+=13;
  if(Number.isFinite(desiredWeeds))cost+=Math.abs((x.weed?65:12)-desiredWeeds)*.24;
  if(Number.isFinite(root))cost+=(x.root?Math.max(0,42-root):Math.max(0,root-65))*.16;
  if(x.event!=='none')cost-=20;
  return {x,cost};
 }).sort((a,b)=>a.cost-b.cost||a.x.n-b.x.n);
 // Choose only among credible near-matches, with independent but stable
 // variation driven by measured lawn condition and simulated day.
 const best=scored[0].cost;
 const peers=scored.filter(v=>v.cost<=best+5);
 const conditionSeed=Math.floor(condition/6)+
  (Number.isFinite(cover)?Math.floor(cover/8)*3:0)+
  (Number.isFinite(desiredWeeds)?Math.floor(desiredWeeds/12)*5:0)+
  (Number.isFinite(root)?Math.floor(root/12)*7:0);
 peers.sort((a,b)=>{
  const ha=(a.x.n*37+phase*19+conditionSeed*13)%101;
  const hb=(b.x.n*37+phase*19+conditionSeed*13)%101;
  return ha-hb||a.x.n-b.x.n;
 });
 // Equal model states may use different but equivalently suitable reference
 // photographs. This changes presentation only, never the underlying model.
 const ranked=peers.map(v=>v.x);
 const selected=(key==='B'&&ranked.length>1?ranked[1]:ranked[0]);
 const pick=selected,id='BASE'+String(pick.n).padStart(2,'0');
 return 'assets/turfarium/'+id+'/'+id+'.'+pick.ext;
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
   objectFit:'contain',objectPosition:'center',zIndex:'2',opacity:'0',
   transition:'opacity 2.4s ease-in-out',pointerEvents:'none'});
  photo.insertAdjacentElement('afterend',overlay);
 }
 // The mobile layout moves the photo-stage, leaving its original caption behind.
 // Reattach that same caption rather than creating a second, stale indicator.
 let indicator=stage.parentElement?.querySelector(':scope > .tf-visual-indicator');
 if(!indicator){
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
  const liveSeason=(stage.parentElement?.querySelector('.tf-photo-stat-strip .tf-season-on-photo')||stage.querySelector('.tf-season-on-photo'))?.dataset.season;
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
 let badge=(stage.parentElement?.querySelector('.tf-photo-stat-strip .tf-season-on-photo')||stage.querySelector('.tf-season-on-photo'));
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
 const previousState=lastState.get(key);
 if(previousState&&elapsed<previousState.day)lastState.delete(key);
 const index=stateWithHysteresis(key,stateForScore(n),n);
 const curatedCandidate=verifiedBase(n,season,snapshot,key);
 const signature=season+'|'+index+'|'+(curatedCandidate||'seasonal'); // Same signature across lawns is valid when their modeled visual categories match.
 // Within a category, interpolate toward the next condition photograph.
 // This preserves the existing eight-state asset library while allowing two
 // independently modeled lawns to show different canopy development.
 // No treatment-label bonus: the blend depends solely on live canopy score.
 const nextIndex=Math.min(index+1,STATES.length-1);
 const lower=STATES[index].min;
 const upper=nextIndex===index?100:STATES[nextIndex].min;
 const fraction=nextIndex===index?0:clamp((n-lower)/Math.max(1,upper-lower),0,1);
 let blend=stage.querySelector('img.tf-photo-interpolation');
 if(!blend){
  blend=document.createElement('img');
  blend.className='tf-photo-interpolation';
  blend.alt='';
  blend.setAttribute('aria-hidden','true');
  stage.appendChild(blend);
 }
 const blendRequest=(Number(stage.dataset.tfBlendRequest)||0)+1;
 stage.dataset.tfBlendRequest=String(blendRequest);
 blend.style.opacity='0';
 blend.dataset.tfBlendFraction=fraction.toFixed(3);
 blend.dataset.tfBlendTarget=STATES[nextIndex].id;
 // Do not overlay a seasonal photo on top of a curated BASE cross-section:
 // that blends different root layouts and makes progression harder to interpret.
 if(!curatedCandidate&&nextIndex!==index&&fraction>.02){
  imageFor(nextIndex,season).then(asset=>{
   if(Number(stage.dataset.tfBlendRequest)!==blendRequest)return;
   if(!asset.src)return;
   const nextPhoto=new Image();
   nextPhoto.onload=()=>{
    if(Number(stage.dataset.tfBlendRequest)!==blendRequest)return;
    blend.src=asset.src;
    blend.style.opacity=(fraction*.92).toFixed(3);
   };
   nextPhoto.src=asset.src;
   if(nextPhoto.complete&&nextPhoto.naturalWidth>0)nextPhoto.onload();
  });
 }

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
 const moistureStress=clamp((50-Number(snapshot.moisture??50))/35,0,1);
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
 // The photograph is a categorical reference, not a pixel-accurate forecast.
 // Express *small* independent physiological differences as canopy-only color,
 // without fabricating ground cover, roots, organisms, or new photo assets.
 const canopyTintStrength=clamp(.025+canopySignal*.19+moistureSignal*.045-stressPenalty*.08,0,.25);
 // Absolute physiological state only: the neighboring lawn cannot alter this lawn's appearance.
 const visibleTint=clamp(canopyTintStrength,0,.20);
 const droughtAmber=clamp(moistureStress*.34,0,.34);
 canopyLayer.style.background='linear-gradient(to bottom,rgba(160,125,54,'+droughtAmber.toFixed(3)+') 0%,rgba(166,132,68,'+(droughtAmber*.82).toFixed(3)+') 27%,transparent 43%),linear-gradient(to bottom,rgba(37,108,37,'+(visibleTint*(1-moistureStress*.75)).toFixed(3)+') 0%,rgba(48,118,43,'+(visibleTint*.67*(1-moistureStress*.75)).toFixed(3)+') 24%,transparent 43%)';
 canopyLayer.dataset.tfRelativeVigor='not-used';
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
 const opticsSaturation=clamp(.70+greenSignal*.80-moistureStress*.48-stressPenalty*.14,.40,1.55);
 const opticsBrightness=clamp(.86+greenSignal*.23-moistureStress*.18,.67,1.13);
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
 // When discrete photo assets coincide, display the independently modeled
 // comparison rather than artificially inventing different roots or organisms.
 let comparison=(stage.parentElement?.querySelector('.tf-photo-stat-strip .tf-visual-comparison')||stage.querySelector('.tf-visual-comparison'));
 if(key==='B'){
  if(!comparison){comparison=document.createElement('span');comparison.className='tf-visual-comparison';comparison.setAttribute('aria-live','polite');stage.appendChild(comparison);}
  const a=snapshotFor('A'),delta=Number(snapshot.vigor)-Number(a?.vigor);
  const aCover=Number(a?.canopyCover),bCover=Number(snapshot.canopyCover);
  const coverDelta=Number.isFinite(aCover)&&Number.isFinite(bCover)?bCover-aCover:NaN;
  const cleanDelta=v=>Math.abs(v)<.005?0:v;
  const aTillers=Number(a?.tillerDensity),bTillers=Number(snapshot.tillerDensity);
  const tillerDelta=Number.isFinite(aTillers)&&Number.isFinite(bTillers)?bTillers-aTillers:NaN;
  const aRoots=Number(a?.rootMass),bRoots=Number(snapshot.rootMass);
  const rootDelta=Number.isFinite(aRoots)&&Number.isFinite(bRoots)?bRoots-aRoots:NaN;
  comparison.hidden=!Number.isFinite(delta);
  if(Number.isFinite(delta)){
   comparison.textContent='B vs A: '+(delta>=0?'+':'')+delta.toFixed(1)+' vigor'+(Number.isFinite(coverDelta)?' · '+(cleanDelta(coverDelta)>=0?'+':'')+cleanDelta(coverDelta).toFixed(2)+' pts cover':'')+(Number.isFinite(tillerDelta)?' · '+(tillerDelta>=0?'+':'')+tillerDelta.toFixed(1)+' tillers':'')+(Number.isFinite(rootDelta)?' · '+(rootDelta>=0?'+':'')+rootDelta.toFixed(1)+' roots':'');
   comparison.dataset.tfDifference=delta.toFixed(2);
  }
 }else if(comparison)comparison.remove();
 // Move both captions into a dedicated strip beneath the photo, never over turf.
 // Re-run on refresh because the stacked mobile layout can move photo-stage.
 let strip=stage.parentElement?.querySelector(':scope > .tf-photo-stat-strip');
 if(!strip){
  strip=document.createElement('div');
  strip.className='tf-photo-stat-strip';
  stage.insertAdjacentElement('afterend',strip);
 }
 const seasonBadge=(stage.parentElement?.querySelector('.tf-photo-stat-strip .tf-season-on-photo')||stage.querySelector('.tf-season-on-photo'));
 if(seasonBadge)strip.appendChild(seasonBadge);
 if(comparison&&key==='B')strip.appendChild(comparison);
 // Force captions outside the photograph even when another script reattaches them.
 for(const node of [...stage.querySelectorAll('.tf-season-on-photo,.tf-visual-comparison')])strip.appendChild(node);
 // Existing caption and the stat strip both remain attached to the moved stage.


 if(stage.dataset.tfPhotoSignature===signature&&stage.dataset.tfPhotoReady==='1'&&lastState.get(key)?.signature===signature&&photo.getAttribute('src')===stage.dataset.tfVisualSource){
  lastState.set(key,{index,signature,day:elapsed});
  indicatorText(indicator,'Photo stage: '+labels[index]+' · '+season[0].toUpperCase()+season.slice(1)+' · visual index '+n+(establishmentOffset?' · early-spring canopy adjustment':'')+canopyStatus);
  return;
 }
 const request=(pending.get(key)||0)+1;
 pending.set(key,request);
 stage.dataset.tfPhotoSignature=signature;stage.dataset.tfPhotoReady='0';
 lastState.set(key,{index,signature,day:elapsed});
 indicatorText(indicator,'Photo stage: '+labels[index]+' · '+season[0].toUpperCase()+season.slice(1)+' · loading…');
 let asset=await imageFor(index,season);
 if(curatedCandidate&&await canLoad(curatedCandidate))asset={src:curatedCandidate,kind:'verified-base'};
 if(pending.get(key)!==request)return;
 // A later clock update may have changed the season during asset resolution.
 if((stage.parentElement?.querySelector('.tf-photo-stat-strip .tf-season-on-photo')||stage.querySelector('.tf-season-on-photo'))?.dataset.season!==season){
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
    const vigor=String(Math.round(Number(snapshot.vigor)||0));
    // Re-render after treatment/undo even if the clock did not advance.
    // Also keep the relative A/B tint synchronized after either lawn changes.
    const peer=snapshotFor(key==='A'?'B':'A');
    // Independent photo optics no longer use peer-relative tint.
    // Do not refresh forever comparing the retired tint field with peer vigor.
    if(stage.dataset.tfVisualDay!==day||stage.dataset.tfVisualSeason!==season||
       stage.dataset.tfCanopyVigor!==vigor)refresh(key);
   }
  },1500);
  // Reconcile visible caption against the authoritative clock badge, including
  // asynchronous photo completions and third-party mobile DOM relocation.
  if(!window.TurfariumCaptionSyncTimer)window.TurfariumCaptionSyncTimer=setInterval(()=>{
   if(document.hidden)return;
   for(const key of ['A','B']){
    const {stage,photo}=elements(key);if(!stage||!photo)continue;
    const badge=(stage.parentElement?.querySelector('.tf-photo-stat-strip .tf-season-on-photo')||stage.querySelector('.tf-season-on-photo'));
    const indicator=stage.parentElement?.querySelector(':scope > .tf-visual-indicator');
    if(!badge||!indicator)continue;
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
css.textContent+=' .photo-stage>img.tf-photo-interpolation{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2;pointer-events:none;opacity:0;transition:opacity 1.5s ease-out}';
css.textContent+=' .photo-stage>.tf-canopy-response{position:absolute;inset:0;z-index:4;pointer-events:none;transition:background 2.5s ease-out}';
css.textContent+=' .photo-stage>.tf-canopy-optics{position:absolute;inset:0;z-index:3;pointer-events:none;mask-image:linear-gradient(to bottom,#000 0%,#000 18%,transparent 43%);-webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 18%,transparent 43%);transition:backdrop-filter 2.5s ease-out}';
css.textContent+=' .photo-stage>.tf-soil-moisture-optics{position:absolute;inset:0;z-index:3;pointer-events:none;mask-image:linear-gradient(to bottom,transparent 38%,#000 61%,#000 100%);-webkit-mask-image:linear-gradient(to bottom,transparent 38%,#000 61%,#000 100%);transition:background 2.5s ease-out}';
css.textContent+=' .tf-photo-stat-strip{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:5px 10px;margin:7px 2px 4px;color:#214b37;font:700 12px/1.45 system-ui,sans-serif} .tf-photo-stat-strip>.tf-visual-comparison,.tf-photo-stat-strip>.tf-season-on-photo{position:static!important;inset:auto!important;max-width:100%;padding:0!important;border:0!important;border-radius:0!important;background:none!important;color:inherit!important;box-shadow:none!important;text-align:left!important;font:inherit!important;pointer-events:auto!important}';
css.textContent+=' .photo-stage>.tf-season-on-photo,.photo-stage>.tf-visual-comparison{display:none!important}';
css.textContent+=' .photo-stage .tf-season-on-photo{position:absolute;bottom:9px;left:9px;z-index:30;pointer-events:none;padding:5px 9px;border-radius:8px;background:rgba(19,54,40,.88);color:white;font:700 12px/1.25 system-ui,sans-serif;box-shadow:0 2px 6px #0005} .photo-stage .tf-season-on-photo[data-season="winter"]{background:rgba(43,71,92,.91)} .photo-stage .tf-season-on-photo[data-season="fall"]{background:rgba(107,68,26,.91)} .photo-stage .tf-season-on-photo[data-season="summer"]{background:rgba(37,89,34,.91)}';
if(!document.getElementById(css.id))document.head.appendChild(css);
window.TurfariumVisualState={
 version:'3.12',states:STATES,score,refresh,refreshAll:boot,
 diagnose:(key)=>{const snapshot=snapshotFor(key);const raw=scoreFrom(snapshot);const day=Number(snapshot.day??dayFor(key))||0;const month=monthFor(key,snapshot);const offset=month>=2&&month<=4?Math.round(16*Math.max(0,1-day/90)):0;const adjusted=clamp(raw-offset,0,100);const index=stateForScore(adjusted);return {key,day,season:SEASONS[month],rawScore:raw,adjustedScore:adjusted,unhysterizedState:STATES[index].id,expectedAsset:imageUrl(index,SEASONS[month]),snapshot,rendered:window.TurfariumVisualState.getStatus(key)};},
 compare:()=>({A:window.TurfariumVisualState.diagnose('A'),B:window.TurfariumVisualState.diagnose('B')}),
 showReplayFrame:(frames)=>{for(const key of ['A','B']){if(!frames?.[key])continue;replaySnapshots.set(key,frames[key]);const stage=elements(key).stage;if(stage){stage.dataset.tfPhotoSignature='';stage.dataset.tfPhotoReady='0';}lastState.delete(key);refresh(key);}},
 endReplay:()=>{replaySnapshots.clear();lastState.clear();refresh('A');refresh('B');},
 getStatus:key=>{const st=elements(key).stage;return st?{
  state:st.dataset.tfVisualState,season:st.dataset.tfVisualSeason,score:st.dataset.tfVisualScore,
  rawScore:st.dataset.tfVisualRawScore,day:st.dataset.tfVisualDay,
  snapshot:(()=>{const s=snapshotFor(key);return {vigor:s.vigor,canopyCover:s.canopyCover,tillerDensity:s.tillerDensity,leafArea:s.leafArea,rootMass:s.rootMass,moisture:s.moisture,saltStress:s.saltStress}})(),
  asset:st.dataset.tfVisualAsset,src:st.dataset.tfVisualSource,ready:st.dataset.tfPhotoReady
 }:null}
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('load',boot,{once:true});
window.addEventListener('turfarium:time-advanced',()=>{refresh('A');refresh('B')});
document.getElementById('grass')?.addEventListener('change',()=>{refresh('A');refresh('B')});
})();
