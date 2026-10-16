/* Turfarium Weather-first layout v23.5. Weather lab stays open and sits directly under the lawn images, above mowing/management. */
(()=>{
'use strict';
const LABEL='Site, Season & Weather Lab';
const GAP=16;
let ro=null;
const sizeSpacer=(panel,spacer)=>{
 if(!panel||!spacer)return;
 spacer.style.height=Math.ceil(panel.getBoundingClientRect().height)+'px';
};
const find=()=>{
 const lawnA=document.getElementById('lawn-a-panel');
 const lawnB=document.getElementById('lawn-b-panel');
 const lab=document.getElementById('experiment-controls');
 if(!lawnA||!lawnB||!lab)return;
 const panel=lab.closest('.card.wide,section.card,article.card,.card')||lab;
 if(panel===lawnA||panel===lawnB||panel.contains(lawnA)||panel.contains(lawnB))return;
 const stageA=lawnA.querySelector('.photo-stage');
 const stageB=lawnB.querySelector('.photo-stage');
 if(!stageA||!stageB)return;
 panel.classList.add('tf-weather-first','tf-weather-context');
 panel.style.removeProperty('order');
 panel.style.removeProperty('grid-column');
 let spacer=lawnB.querySelector('.tf-weather-peer-spacer');
 if(!spacer){spacer=document.createElement('div');spacer.className='tf-weather-peer-spacer';spacer.setAttribute('aria-hidden','true');stageB.insertAdjacentElement('afterend',spacer);}
 if(panel.parentElement!==lawnA||stageA.nextElementSibling!==panel){stageA.insertAdjacentElement('afterend',panel);}
 const toggle=panel.querySelector(':scope > .tf-collapse-toggle');
 const body=panel.querySelector(':scope > .tf-collapse-body');
 if(toggle){
  const title=toggle.querySelector('.tf-collapse-title');
  if(title&&title.textContent!==LABEL)title.textContent=LABEL;
  if(!panel.dataset.tfWeatherInitialized){
   panel.dataset.tfWeatherInitialized='1';
   panel.classList.remove('tf-panel-collapsed');
   toggle.setAttribute('aria-expanded','true');
   if(body){body.hidden=false;body.style.removeProperty('display');}
   const chevron=toggle.querySelector('.tf-collapse-chevron');if(chevron)chevron.textContent='▾';
  }
 }
 if(toggle&&body&&!panel.dataset.tfWeatherClickHook){
  panel.dataset.tfWeatherClickHook='1';
  toggle.addEventListener('click',()=>requestAnimationFrame(()=>{
   if(panel.classList.contains('tf-panel-collapsed')){body.hidden=true;body.style.setProperty('display','none','important');}
   else{body.hidden=false;body.style.removeProperty('display');}
   sizeSpacer(panel,spacer);
  }));
 }
 const innerTitle=panel.querySelector('.tf-collapse-body .head h2,.head h2');
 if(innerTitle&&innerTitle.textContent.trim()!==LABEL)innerTitle.textContent=LABEL;
 const desktop=matchMedia('(min-width:901px)').matches;
 if(desktop){
  panel.style.width=`calc(200% + ${GAP}px)`;
  panel.style.maxWidth='none';
  panel.style.position='relative';
  panel.style.zIndex='5';
  panel.style.marginTop='12px';
  panel.style.marginBottom='12px';
  spacer.style.display='block';
  sizeSpacer(panel,spacer);
 }else{
  panel.style.width='100%';panel.style.maxWidth='100%';panel.style.position='relative';panel.style.zIndex='auto';
  spacer.style.display='none';spacer.style.height='0px';
 }
 if(!ro&&window.ResizeObserver){ro=new ResizeObserver(()=>sizeSpacer(panel,spacer));ro.observe(panel);}
};
const css=document.createElement('style');
css.textContent=`
#lawn-a-panel>.tf-weather-first{box-sizing:border-box}
.tf-weather-peer-spacer{width:100%;pointer-events:none}
@media(max-width:900px){#lawn-a-panel>.tf-weather-first{width:100%!important;max-width:100%!important}.tf-weather-peer-spacer{display:none!important;height:0!important}}
`;
document.head.appendChild(css);
let pending=false;
const observer=new MutationObserver(()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;find();});});
observer.observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',find,{once:true});else find();
window.addEventListener('load',find,{once:true});window.addEventListener('resize',find,{passive:true});
setTimeout(find,500);setTimeout(find,1400);setTimeout(find,3200);setTimeout(()=>observer.disconnect(),12000);
})();
