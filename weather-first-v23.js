/* Turfarium Weather Lab v23.8 — safe compact weather access beside mowing; native weather panel remains in place and collapsed by default. */
(()=>{
'use strict';
const LABEL='Site, Season & Weather Lab';
function nativeWeather(){
 const lab=document.getElementById('experiment-controls');
 if(!lab)return null;
 return lab.closest('.card.wide,section.card,article.card,.card')||lab;
}
function collapseWeather(){
 const panel=nativeWeather();if(!panel)return;
 panel.classList.remove('tf-weather-first','tf-weather-context');
 for(const p of ['order','grid-column','width','max-width','position','z-index','margin-top','margin-bottom'])panel.style.removeProperty(p);
 document.querySelectorAll('.tf-weather-peer-spacer').forEach(el=>el.remove());
 const toggle=panel.querySelector(':scope > .tf-collapse-toggle');
 const body=panel.querySelector(':scope > .tf-collapse-body');
 if(toggle){
  const title=toggle.querySelector('.tf-collapse-title');if(title)title.textContent=LABEL;
  panel.classList.add('tf-panel-collapsed');toggle.setAttribute('aria-expanded','false');
  if(body){body.hidden=true;body.style.setProperty('display','none','important');}
  const c=toggle.querySelector('.tf-collapse-chevron');if(c)c.textContent='▸';
 }
}
function toggleWeather(){
 const panel=nativeWeather();if(!panel)return;
 const toggle=panel.querySelector(':scope > .tf-collapse-toggle');
 const body=panel.querySelector(':scope > .tf-collapse-body');
 const closed=panel.classList.contains('tf-panel-collapsed');
 panel.classList.toggle('tf-panel-collapsed',!closed);
 if(toggle)toggle.setAttribute('aria-expanded',closed?'true':'false');
 if(body){body.hidden=!closed;if(closed)body.style.removeProperty('display');else body.style.setProperty('display','none','important');}
 const c=toggle?.querySelector('.tf-collapse-chevron');if(c)c.textContent=closed?'▾':'▸';
 if(closed)setTimeout(()=>panel.scrollIntoView({behavior:'smooth',block:'nearest'}),30);
}
function installButtons(){
 collapseWeather();
 for(const key of ['A','B']){
  const env=document.getElementById('tf-env-'+key);if(!env)continue;
  const sum=env.querySelector(':scope > summary');if(!sum||sum.querySelector('.tf-weather-near-mow'))continue;
  sum.classList.add('tf-env-summary-row');
  const b=document.createElement('button');b.type='button';b.className='tf-weather-near-mow';b.textContent='🌦️ Weather';b.setAttribute('aria-label','Open Site, Season & Weather Lab');
  b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();toggleWeather();});
  sum.appendChild(b);
 }
}
const style=document.createElement('style');style.id='tf-weather-near-mow-style';style.textContent=`
.tf-env>summary.tf-env-summary-row{display:flex;align-items:center;gap:9px;justify-content:flex-start!important;flex-wrap:wrap}
.tf-env>summary.tf-env-summary-row>span:first-child{margin-right:auto}
.tf-weather-near-mow{border:1px solid #9fb7a4;background:rgba(255,255,255,.72);color:#173f2a;border-radius:999px;padding:6px 10px;font:inherit;font-size:.75rem;font-weight:800;line-height:1;cursor:pointer}
.tf-weather-near-mow:hover{background:#fff}
@media(max-width:520px){.tf-weather-near-mow{padding:6px 9px;font-size:.72rem}}
`;
if(!document.getElementById(style.id))document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installButtons,{once:true});else installButtons();
window.addEventListener('load',installButtons,{once:true});
const mo=new MutationObserver(()=>installButtons());mo.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(installButtons,500);setTimeout(installButtons,1500);setTimeout(installButtons,3000);setTimeout(()=>mo.disconnect(),12000);
})();
