/* Force the current clean soil photo after legacy layout scripts run, then load current living motion + biology + environmental drift + weather placement layers. */
(()=>{'use strict';
const image='file_00000000f35481f5a24a1191fdf2adf5.png?v=clean-4';
function apply(){
 for(const id of ['lawn-a-panel','lawn-b-panel']){
  const el=document.querySelector('#'+id+' .photo-stage > img.soil-photo');if(!el)continue;
  if(el.getAttribute('src')!==image)el.setAttribute('src',image);
  el.removeAttribute('srcset');
 }
}
const hasScript=needle=>[...document.scripts].some(s=>(s.getAttribute('src')||'').includes(needle));
function inject(){
 if(!window.__tfLivingV4Loaded&&!hasScript('turfarium-living-window.js')){
  window.__tfLivingV4Loaded=true;
  document.querySelectorAll('.tf-photo-motion,.tf-soil-lens').forEach(el=>el.remove());
  document.getElementById('tf-photo-motion-style')?.remove();
  const s=document.createElement('script');s.dataset.tfMotionLoader='1';s.src='turfarium-living-window.js?v=4.0.0';document.body.appendChild(s);
 }
 if(!document.getElementById('tf-bio-A')&&!hasScript('turfarium-biology-v1.js')){
  const s=document.createElement('script');s.dataset.tfBioLoader='1';s.src='turfarium-biology-v1.js?v=1.1.0';document.body.appendChild(s);
 }
 if(!document.getElementById('tf-env-A')&&!hasScript('turfarium-environment-v1.js')){
  const s=document.createElement('script');s.dataset.tfEnvLoader='1';s.src='turfarium-environment-v1.js?v=1.1.0';document.body.appendChild(s);
 }
 if(!hasScript('weather-first-v23.js')){
  const s=document.createElement('script');s.dataset.tfWeatherLoader='1';s.src='weather-first-v23.js?v=23.6.0';document.body.appendChild(s);
 }
}
apply();
addEventListener('load',()=>{apply();setTimeout(inject,160)});
const observer=new MutationObserver(apply);
for(const id of ['lawn-a-panel','lawn-b-panel']){const p=document.getElementById(id);if(p)observer.observe(p,{subtree:true,attributes:true,attributeFilter:['src','srcset'],childList:true});}
})();