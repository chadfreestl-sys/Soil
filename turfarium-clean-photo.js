/* Force the current clean soil photo after legacy layout scripts run, then ensure living motion + biology layers are loaded. */
(()=>{'use strict';
const image='file_00000000f35481f5a24a1191fdf2adf5.png?v=clean-3';
function apply(){
 for(const id of ['lawn-a-panel','lawn-b-panel']){
  const el=document.querySelector('#'+id+' .photo-stage > img.soil-photo');if(!el)continue;
  if(el.getAttribute('src')!==image)el.setAttribute('src',image);
  el.removeAttribute('srcset');
 }
}
function loadOnce(selector,src){
 if(document.querySelector(selector))return;
 const s=document.createElement('script');s.src=src;s.defer=true;document.body.appendChild(s);
}
function ensureLayers(){
 if(!document.querySelector('.tf-photo-motion'))loadOnce('script[data-tf-motion-loader]','turfarium-living-window.js?v=3.0.1');
 if(!document.getElementById('tf-bio-A'))loadOnce('script[data-tf-bio-loader]','turfarium-biology-v1.js?v=1.0.0');
}
function injectWithMarkers(){
 if(!document.querySelector('.tf-photo-motion')){const s=document.createElement('script');s.dataset.tfMotionLoader='1';s.src='turfarium-living-window.js?v=3.0.1';document.body.appendChild(s)}
 if(!document.getElementById('tf-bio-A')&&!document.querySelector('script[data-tf-bio-loader]')){const s=document.createElement('script');s.dataset.tfBioLoader='1';s.src='turfarium-biology-v1.js?v=1.0.0';document.body.appendChild(s)}
}
apply();
addEventListener('load',()=>{apply();setTimeout(injectWithMarkers,140)});
const observer=new MutationObserver(apply);
for(const id of ['lawn-a-panel','lawn-b-panel']){const p=document.getElementById(id);if(p)observer.observe(p,{subtree:true,attributes:true,attributeFilter:['src','srcset'],childList:true});}
})();