/* Turfarium Weather-first layout v23.4. Weather lab stays open and sits immediately above the lawn cards/mowing controls. */
(()=>{
'use strict';
const LABEL='Site, Season & Weather Lab';
const find=()=>{
 const lawnA=document.getElementById('lawn-a-panel');
 const grid=lawnA?.parentElement;
 const lab=document.getElementById('experiment-controls');
 if(!lawnA||!grid||!lab)return;
 const panel=lab.closest('.card.wide,section.card,article.card,.card')||lab;
 if(panel===lawnA||panel.contains(lawnA))return;
 panel.classList.add('tf-weather-first','tf-weather-context');
 panel.style.setProperty('grid-column','1 / -1','important');
 panel.style.setProperty('order','-1','important');
 lawnA.style.setProperty('order','0','important');
 const lawnB=document.getElementById('lawn-b-panel');
 if(lawnB)lawnB.style.setProperty('order','0','important');
 if(panel.parentElement!==grid||panel.nextElementSibling!==lawnA){
   grid.insertBefore(panel,lawnA);
 }
 const toggle=panel.querySelector(':scope > .tf-collapse-toggle');
 const body=panel.querySelector(':scope > .tf-collapse-body');
 if(toggle){
   const title=toggle.querySelector('.tf-collapse-title');
   if(title && title.textContent!==LABEL)title.textContent=LABEL;
   if(!panel.dataset.tfWeatherInitialized){
     panel.dataset.tfWeatherInitialized='1';
     panel.classList.remove('tf-panel-collapsed');
     toggle.setAttribute('aria-expanded','true');
     if(body){body.hidden=false;body.style.removeProperty('display');}
     const chevron=toggle.querySelector('.tf-collapse-chevron');
     if(chevron)chevron.textContent='▾';
   }
 }
 if(toggle && body && !panel.dataset.tfWeatherClickHook){
   panel.dataset.tfWeatherClickHook='1';
   toggle.addEventListener('click',()=>{
     requestAnimationFrame(()=>{
       if(panel.classList.contains('tf-panel-collapsed')){
         body.hidden=true;
         body.style.setProperty('display','none','important');
       }else{
         body.hidden=false;
         body.style.removeProperty('display');
       }
     });
   });
 }
 const innerTitle=panel.querySelector('.tf-collapse-body .head h2,.head h2');
 if(innerTitle && innerTitle.textContent.trim()!==LABEL)innerTitle.textContent=LABEL;
};
const css=document.createElement('style');
css.textContent='.simulation-grid.tf-primary-workspace > .tf-weather-first{grid-column:1/-1!important;order:-1!important}.simulation-grid.tf-primary-workspace > #lawn-a-panel,.simulation-grid.tf-primary-workspace > #lawn-b-panel{order:0!important}';
document.head.appendChild(css);
let pending=false;
const observer=new MutationObserver(()=>{
 if(pending)return;
 pending=true;
 requestAnimationFrame(()=>{pending=false;find();});
});
observer.observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',find,{once:true});
else find();
window.addEventListener('load',find,{once:true});
setTimeout(find,700);setTimeout(find,1800);setTimeout(find,3500);setTimeout(()=>observer.disconnect(),12000);
})();
