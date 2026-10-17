/* Turfarium Visual State Engine v2.1 — model-driven, independent Lawn A/B photographic succession using uploaded state images. */
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
const loaded=new Map(),stateByKey=new Map();
function readMetric(key,label,fallback=50){
 const text=document.getElementById('kpi'+key)?.textContent||'';
 const re=new RegExp(label+'[^0-9]{0,90}([0-9]+(?:[.]?[0-9]+)?)','i');
 const m=text.match(re);return m?clamp(+m[1],0,100):fallback;
}
function day(key){const t=document.getElementById('day'+key)?.textContent||'';return +(t.match(/([0-9]+)/)?.[1]||0)}
function score(key){
 const vigor=readMetric(key,'Turf vigor',65);
 const bio=readMetric(key,'Beneficial guilds',40);
 const worms=readMetric(key,'Earthworm activity',35);
 const disease=readMetric(key,'Disease pressure',20);
 const weeds=readMetric(key,'Weed pressure',25);
 const roots=Math.max(readMetric(key,'Root health',50),readMetric(key,'Root depth',50));
 const raw=vigor*.38+bio*.17+worms*.08+(100-disease)*.12+(100-weeds)*.15+roots*.10;
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
async function assetFor(st){for(const src of st.candidates){const ok=await canLoad(src);if(ok)return ok;}return BASE}
function ensureLayers(stage,photo){
 stage.dataset.tfVisualEngine='v2';
 let top=stage.querySelector('img.tf-state-photo');
 if(!top){top=photo.cloneNode(false);top.className='soil-photo tf-state-photo';top.removeAttribute('id');top.removeAttribute('srcset');top.setAttribute('aria-hidden','true');Object.assign(top.style,{position:'absolute',inset:'0',width:'100%',height:'100%',objectFit:'cover',opacity:'0',transition:'opacity 1.8s ease',zIndex:'1',pointerEvents:'none'});photo.style.position='relative';photo.style.zIndex='0';stage.insertBefore(top,photo.nextSibling);}
 return top;
}
async function refresh(key){
 const panel=document.getElementById('lawn-'+key.toLowerCase()+'-panel'),stage=panel?.querySelector('.photo-stage'),photo=stage?.querySelector('img.soil-photo:not(.tf-state-photo)');if(!stage||!photo)return;
 const top=ensureLayers(stage,photo),s=score(key),wanted=hysteretic(key,stateForScore(s),s),prev=stateByKey.get(key);
 stage.dataset.tfVisualScore=String(s);stage.dataset.tfVisualState=wanted.id;stage.dataset.tfVisualDay=String(day(key));
 if(prev===wanted.id&&top.dataset.tfStateReady==='1')return;
 const src=await assetFor(wanted);
 stateByKey.set(key,wanted.id);
 if(src===BASE){photo.src=BASE;photo.removeAttribute('srcset');top.style.opacity='0';top.dataset.tfStateReady='1';top.dataset.tfState=wanted.id;return;}
 if(top.src.endsWith(src)||top.getAttribute('src')===src){top.style.opacity='1';top.dataset.tfStateReady='1';top.dataset.tfState=wanted.id;return;}
 top.style.opacity='0';
 const preload=new Image();preload.onload=()=>{top.src=src;top.removeAttribute('srcset');requestAnimationFrame(()=>requestAnimationFrame(()=>{top.style.opacity='1'}));top.dataset.tfStateReady='1';top.dataset.tfState=wanted.id;};preload.src=src;
}
function boot(){for(const key of ['A','B']){
 const kpi=document.getElementById('kpi'+key),d=document.getElementById('day'+key);if(kpi&&!kpi.dataset.tfVisualStateObserved){kpi.dataset.tfVisualStateObserved='1';new MutationObserver(()=>requestAnimationFrame(()=>refresh(key))).observe(kpi,{subtree:true,childList:true,characterData:true});}if(d&&!d.dataset.tfVisualStateObserved){d.dataset.tfVisualStateObserved='1';new MutationObserver(()=>requestAnimationFrame(()=>refresh(key))).observe(d,{subtree:true,childList:true,characterData:true});}refresh(key);
 }}
const style=document.createElement('style');style.id='tf-visual-state-v2-style';style.textContent=`.photo-stage{position:relative}.photo-stage>img.tf-state-photo{border-radius:inherit}@media(prefers-reduced-motion:reduce){.photo-stage>img.tf-state-photo{transition:none!important}}`;if(!document.getElementById(style.id))document.head.appendChild(style);
window.TurfariumVisualState={version:'2.1',states:STATES,score,refresh,refreshAll:boot};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();window.addEventListener('load',boot,{once:true});[250,700,1500,3000].forEach(ms=>setTimeout(boot,ms));
})();
