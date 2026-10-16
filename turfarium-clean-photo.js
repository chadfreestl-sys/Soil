/* Force the current clean soil photo after legacy layout scripts run, then ensure living motion v3 is loaded. */
(()=>{'use strict';
const image='file_00000000f35481f5a24a1191fdf2adf5.png?v=clean-3';
function apply(){
 for(const id of ['lawn-a-panel','lawn-b-panel']){
  const el=document.querySelector('#'+id+' .photo-stage > img.soil-photo');if(!el)continue;
  if(el.getAttribute('src')!==image)el.setAttribute('src',image);
  el.removeAttribute('srcset');
 }
}
function ensureMotion(){
 if(document.querySelector('.tf-photo-motion'))return;
 const s=document.createElement('script');s.src='turfarium-living-window.js?v=3.0.1';s.defer=true;document.body.appendChild(s);
}
apply();
addEventListener('load',()=>{apply();setTimeout(ensureMotion,120)});
const observer=new MutationObserver(apply);
for(const id of ['lawn-a-panel','lawn-b-panel']){const p=document.getElementById(id);if(p)observer.observe(p,{subtree:true,attributes:true,attributeFilter:['src','srcset'],childList:true});}
})();