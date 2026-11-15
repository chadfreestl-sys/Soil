/* Turfarium food web bridge v1. Relative biological activity, not organism counts. */
(()=>{'use strict';
const keys=['A','B'],records=new Map();
function number(key,label,fallback){
 const root=document.getElementById('kpi'+key);
 const node=[...(root?.querySelectorAll('.kpi')||[])].find(n=>(n.querySelector('span')?.textContent||'').includes(label));
 const v=parseFloat(node?.querySelector('strong')?.textContent||'');
 return Number.isFinite(v)?v:fallback;
}
function day(key){return Number((document.getElementById('day'+key)?.textContent||'0').match(/\d+/)?.[0]||0)}
function environment(key){
 const biology=number(key,'Beneficial guilds',40);
 const snapshot=window.TurfariumVisualSnapshot?.(key)||{};
 const month=Number(document.getElementById('startMonth')?.value||2);
 const seasonMonth=(month+Math.floor(day(key)/30.44))%12;
 const seasonalTemperature=[37,41,51,62,71,79,84,82,74,62,49,40][seasonMonth];
 return {temperatureF:Number.isFinite(snapshot.soilTempF)?snapshot.soilTempF:seasonalTemperature,
 moisture:Number.isFinite(snapshot.moisture)?snapshot.moisture:55,
 oxygen:Number.isFinite(snapshot.oxygen)?snapshot.oxygen:65,
 pH:Number.isFinite(snapshot.soilPH)?snapshot.soilPH:6.3,
 rootExudates:number(key,'Turf vigor',55),clippings:50,organicInputs:Math.max(0,Math.min(100,(snapshot.soilLabileC??biology)*.5)),
 // Derived from authoritative lawn state; these are heuristic relative indices, not measured toxicity.
 solubleSaltStress:Math.max(0,Math.min(100,((snapshot.saltStress??12)-24)*1.4)),
 ammoniumStress:Math.max(0,Math.min(100,((snapshot.soilNH4??5)-25)*1.2)),
 phosphorusLimitation:Math.max(0,Math.min(100,(15-(snapshot.soilP??20))*5)),
 disturbance:Number.isFinite(snapshot.compaction)?snapshot.compaction*.25:0};
}
function render(key){
 const model=window.TurfariumFoodWeb;if(!model)return;
 const d=day(key),prev=records.get(key);
 let state=prev?.state||model.baseline();
 if(prev&&d<prev.day){state=model.baseline();records.delete(key)}
 if(!prev||d!==prev.day){
  // On first render, reconstruct from the day-zero baseline to the displayed day.
  // This avoids showing baseline biology for a lawn opened at a later checkpoint.
  const elapsed=prev&&d>=prev.day?Math.max(0,d-prev.day):Math.max(0,d);
  // Run in bounded monthly intervals to avoid unrealistic single-step jumps.
  let remaining=Math.min(elapsed,365*5);
  while(remaining>0){const step=Math.min(5,remaining);state=model.advance(state,environment(key),step);remaining-=step}
  records.set(key,{day:d,state});
 }
 const host=document.getElementById('lawn-'+key.toLowerCase()+'-panel');if(!host)return;
 let box=host.querySelector('.tf-food-web');
 if(!box){box=document.createElement('details');box.className='tf-food-web';box.innerHTML='<summary>Living soil food web · exploratory model</summary><div class="tf-food-grid"></div><small>Relative indices (0–100), not measured populations. Soil chemistry comes from the main lawn model; prior-day conditions are approximated and treatment-response calibration is still in development.</small>';host.appendChild(box)}
 const labels={earthwormActivity:'Earthworm activity',microbialBiomass:'Microbial biomass proxy',bacteria:'Bacteria',fungi:'Fungi',protozoa:'Protozoa',nematodesBacterial:'Bacterial-feeding nematodes',nematodesFungal:'Fungal-feeding nematodes',nematodesPlant:'Plant-feeding nematodes',nematodesPredator:'Predatory nematodes',earthworms:'Earthworms',microarthropods:'Microarthropods'};
 box.querySelector('.tf-food-grid').replaceChildren(...Object.entries(labels).map(([k,label])=>{
  const el=document.createElement('div');el.className='tf-food-item';
  const val=Math.round(state[k]);el.innerHTML='<span></span><b></b><div class="tf-food-track"><i></i></div>';
  el.querySelector('span').textContent=label;el.querySelector('b').textContent=String(val);
  el.querySelector('i').style.width=val+'%';return el;
 }));
}
function boot(){
 if(!window.TurfariumFoodWeb)return;
 for(const key of keys){
  const el=document.getElementById('day'+key);if(el&&!el.dataset.tfFoodObserver){
   el.dataset.tfFoodObserver='1';
   new MutationObserver(()=>requestAnimationFrame(()=>render(key))).observe(el,{subtree:true,childList:true,characterData:true});
  }
  render(key);
 }
}
const style=document.createElement('style');style.textContent='.tf-food-web{margin:12px 0;padding:12px;background:#e8f1e6;border:1px solid #a6c6ad;border-radius:12px;color:#163b29}.tf-food-web summary{cursor:pointer;font-weight:850}.tf-food-web small{display:block;margin-top:10px;color:#355844}.tf-food-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px}.tf-food-item{display:grid;grid-template-columns:1fr auto;gap:4px;font-size:.78rem}.tf-food-track{grid-column:1/-1;height:6px;background:#c1d2c4;border-radius:10px;overflow:hidden}.tf-food-track i{display:block;height:100%;background:#357c50}@media(max-width:520px){.tf-food-grid{grid-template-columns:1fr}}';document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('load',boot,{once:true});
 document.getElementById('startMonth')?.addEventListener('change',()=>{records.clear();boot()});
window.addEventListener('turfarium:scenario-restored',()=>{records.clear();boot();});
window.addEventListener('turfarium:time-advanced',boot);
window.TurfariumFoodWebBridge={refresh:boot,get:key=>records.get(key)?.state||null};
})();