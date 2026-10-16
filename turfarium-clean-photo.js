/* Force the current clean soil photo after legacy layout scripts run. */
(()=>{'use strict';
const image='file_00000000f35481f5a24a1191fdf2adf5.png?v=clean-2';
function apply(){
 for(const id of ['lawn-a-panel','lawn-b-panel']){
  const el=document.querySelector('#'+id+' .photo-stage > img.soil-photo');if(!el)continue;
  if(el.getAttribute('src')!==image)el.setAttribute('src',image);
  el.removeAttribute('srcset');
 }
}
apply();
addEventListener('load',apply);
const observer=new MutationObserver(apply);
for(const id of ['lawn-a-panel','lawn-b-panel']){const p=document.getElementById(id);if(p)observer.observe(p,{subtree:true,attributes:true,attributeFilter:['src','srcset'],childList:true});}
})();