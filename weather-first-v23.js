/* Turfarium Weather Lab v23.7 — non-invasive. Keeps the existing Weather Lab in its native layout, open by default. */
(()=>{
'use strict';
const LABEL='Site, Season & Weather Lab';
function openWeather(){
 const lab=document.getElementById('experiment-controls');
 if(!lab)return;
 const panel=lab.closest('.card.wide,section.card,article.card,.card')||lab;
 // Undo any layout mutations left by earlier weather-placement versions.
 panel.classList.remove('tf-weather-first','tf-weather-context');
 panel.style.removeProperty('order');
 panel.style.removeProperty('grid-column');
 panel.style.removeProperty('width');
 panel.style.removeProperty('max-width');
 panel.style.removeProperty('position');
 panel.style.removeProperty('z-index');
 panel.style.removeProperty('margin-top');
 panel.style.removeProperty('margin-bottom');
 document.querySelectorAll('.tf-weather-peer-spacer').forEach(el=>el.remove());
 const toggle=panel.querySelector(':scope > .tf-collapse-toggle');
 const body=panel.querySelector(':scope > .tf-collapse-body');
 if(toggle){
   const title=toggle.querySelector('.tf-collapse-title');
   if(title)title.textContent=LABEL;
   panel.classList.remove('tf-panel-collapsed');
   toggle.setAttribute('aria-expanded','true');
   if(body){body.hidden=false;body.style.removeProperty('display');}
   const chevron=toggle.querySelector('.tf-collapse-chevron');
   if(chevron)chevron.textContent='▾';
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',openWeather,{once:true});else openWeather();
window.addEventListener('load',openWeather,{once:true});
setTimeout(openWeather,500);setTimeout(openWeather,1600);setTimeout(openWeather,3200);
})();
