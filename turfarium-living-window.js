/* Turfarium observation window v2: understated visual response, model-driven, no painted roots. */
(()=>{'use strict';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
for(const key of ['A','B']){
 const panel=document.getElementById('lawn-'+key.toLowerCase()+'-panel');
 const stage=panel?.querySelector('.photo-stage');
 const photo=stage?.querySelector('img.soil-photo');
 if(!stage||!photo)continue;
 const mask=document.createElement('div');mask.className='tf-soil-lens';
 mask.setAttribute('aria-hidden','true');
 Object.assign(mask.style,{position:'absolute',inset:'0',zIndex:'2',pointerEvents:'none',transition:'background 1.2s ease'});
 stage.append(mask);
 const read=(name,fallback)=>{const t=document.getElementById('kpi'+key)?.textContent||'';const re=new RegExp(name+'[^0-9]{0,75}([0-9]+(?:[.][0-9]+)?)','i');return +(t.match(re)?.[1]??fallback)};
 const refresh=()=>{
  const vigor=clamp(read('Turf vigor',65),0,100),biology=clamp(read('Beneficial guilds',35),0,100);
  const health=vigor/100,soil=biology/100;
  // Small, bounded color/contrast responses. A and B follow their own model values.
  photo.style.setProperty('filter',`saturate(${(.79+health*.37).toFixed(3)}) brightness(${(.89+health*.15).toFixed(3)}) contrast(${(.98+soil*.07).toFixed(3)})`,'important');
  mask.style.background=`linear-gradient(to bottom, rgba(116,101,45,${((1-health)*.085).toFixed(3)}) 0%, transparent 34%, rgba(33,21,13,${((1-soil)*.08).toFixed(3)}) 100%)`;
  stage.dataset.tfVisualVigor=String(Math.round(vigor));
 };
 const target=document.getElementById('kpi'+key);
 if(target)new MutationObserver(()=>requestAnimationFrame(refresh)).observe(target,{subtree:true,childList:true,characterData:true});
 refresh();
}
})();