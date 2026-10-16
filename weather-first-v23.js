/* Turfarium Weather-first layout v23.0. No simulation engine changes. */
(()=>{
'use strict';
const LABEL='Site, Season & Weather Lab';
const find=()=>{
 const deck=document.getElementById('profile-control-deck');
 const grid=deck?.parentElement;
 const lab=document.getElementById('experiment-controls');
 if(!deck||!grid||!lab||lab===deck||lab.contains(deck))return;
 const panel=lab.closest('.card.wide,section.card,article.card,.card')||lab;
 if(panel===deck||panel.contains(deck))return;
 panel.classList.add('tf-weather-first','tf-weather-context');
 panel.style.setProperty('order','-2000','important');
 panel.style.setProperty('grid-column','1 / -1','important');
 deck.style.setProperty('order','-1900','important');
 if(panel.parentElement!==grid||panel.nextElementSibling!==deck){
   grid.insertBefore(panel,deck);
 }
 const toggle=panel.querySelector(':scope > .tf-collapse-toggle');
 const body=panel.querySelector(':scope > .tf-collapse-body');
 if(toggle){
   const title=toggle.querySelector('.tf-collapse-title');
   if(title && title.textContent!==LABEL)title.textContent=LABEL;
   if(panel.classList.contains('tf-panel-collapsed')){
     panel.classList.remove('tf-panel-collapsed');
     toggle.setAttribute('aria-expanded','true');
     if(body)body.hidden=false;
     const chevron=toggle.querySelector('.tf-collapse-chevron');
     if(chevron)chevron.textContent='▾';
   }
 }
 const innerTitle=panel.querySelector('.tf-collapse-body .head h2,.head h2');
 if(innerTitle && innerTitle.textContent.trim()!==LABEL)innerTitle.textContent=LABEL;
};
const css=document.createElement('style');
css.textContent='.simulation-grid.tf-primary-workspace > .tf-weather-first{order:-2000!important;grid-column:1/-1!important}.simulation-grid.tf-primary-workspace > #profile-control-deck{order:-1900!important;grid-column:1/-1!important}';
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
setTimeout(find,1000);setTimeout(find,3500);setTimeout(()=>observer.disconnect(),12000);
})();
