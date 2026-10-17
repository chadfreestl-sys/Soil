/* Force the current clean soil photo after legacy layout scripts run, then load current living motion + biology + environmental drift + weather + treatment layout + default month + shared-start layout + visual state layers once. */
(()=>{'use strict';
const image='file_00000000f35481f5a24a1191fdf2adf5.png?v=clean-4';
function apply(){
 for(const id of ['lawn-a-panel','lawn-b-panel']){
  const stage=document.querySelector('#'+id+' .photo-stage');if(!stage||stage.dataset.tfVisualEngine==='v2')continue;
  const el=stage.querySelector(':scope > img.soil-photo:not(.tf-state-photo)');if(!el)continue;
  if(el.getAttribute('src')!==image)el.setAttribute('src',image);el.removeAttribute('srcset');
 }
}
function inject(){
 if(!document.querySelector('script[src*="turfarium-living-window.js"]')){document.querySelectorAll('.tf-photo-motion,.tf-soil-lens').forEach(el=>el.remove());document.getElementById('tf-photo-motion-style')?.remove();const s=document.createElement('script');s.dataset.tfMotionLoader='1';s.src='turfarium-living-window.js?v=4.0.0';document.body.appendChild(s);}
 if(!document.getElementById('tf-bio-A')&&!document.querySelector('script[src*="turfarium-biology-v1.js"]')){const s=document.createElement('script');s.dataset.tfBioLoader='1';s.src='turfarium-biology-v1.js?v=1.1.0';document.body.appendChild(s);}
 if(!document.getElementById('tf-env-A')&&!document.querySelector('script[src*="turfarium-environment-v1.js"]')){const s=document.createElement('script');s.dataset.tfEnvLoader='1';s.src='turfarium-environment-v1.js?v=1.1.0';document.body.appendChild(s);}
 if(!document.querySelector('script[src*="weather-first-v23.js"]')){const s=document.createElement('script');s.dataset.tfWeatherLoader='1';s.src='weather-first-v23.js?v=24.1.0';document.body.appendChild(s);}
 if(!document.querySelector('script[src*="turfarium-treatment-layout-v1.js"]')){const s=document.createElement('script');s.dataset.tfTreatmentLayoutLoader='1';s.src='turfarium-treatment-layout-v1.js?v=1.0.0';document.body.appendChild(s);}
 if(!document.querySelector('script[src*="turfarium-default-month-v1.js"]')){const s=document.createElement('script');s.dataset.tfDefaultMonthLoader='1';s.src='turfarium-default-month-v1.js?v=1.0.0';document.body.appendChild(s);}
 if(!document.querySelector('script[src*="turfarium-shared-start-layout-v1.js"]')){const s=document.createElement('script');s.dataset.tfSharedStartLayoutLoader='1';s.src='turfarium-shared-start-layout-v1.js?v=2.0.0';document.body.appendChild(s);}
 if(!document.querySelector('script[src*="turfarium-visual-state-v2.js"]')){const s=document.createElement('script');s.dataset.tfVisualStateLoader='1';s.src='turfarium-visual-state-v2.js?v=2.0.0';document.body.appendChild(s);}
}
apply();addEventListener('load',()=>{apply();setTimeout(inject,160)});
const observer=new MutationObserver(apply);for(const id of ['lawn-a-panel','lawn-b-panel']){const p=document.getElementById(id);if(p)observer.observe(p,{subtree:true,attributes:true,attributeFilter:['src','srcset'],childList:true});}
})();
