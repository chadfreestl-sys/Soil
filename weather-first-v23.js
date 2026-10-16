/* Turfarium Weather Lab v24.1 — stable compact Weather + Mowing controls. No outer-grid reordering or duplicated weather controls. */
(()=>{
'use strict';
const LABEL='Site, Season & Weather Lab';
let placeholder=null,activePanel=null;
const by=id=>document.getElementById(id);

function nativeWeather(){
 const lab=by('experiment-controls');
 if(!lab)return null;
 return lab.closest('.card.wide,section.card,article.card,.card')||lab;
}
function parts(panel){return{
 toggle:panel?.querySelector(':scope > .tf-collapse-toggle'),
 body:panel?.querySelector(':scope > .tf-collapse-body')
}}
function setExpanded(panel,open){
 if(!panel)return;
 const {toggle,body}=parts(panel);
 panel.classList.toggle('tf-panel-collapsed',!open);
 if(toggle){
  const title=toggle.querySelector('.tf-collapse-title');if(title)title.textContent=LABEL;
  toggle.setAttribute('aria-expanded',open?'true':'false');
  const c=toggle.querySelector('.tf-collapse-chevron');if(c)c.textContent=open?'▾':'▸';
 }
 if(body){body.hidden=!open;if(open)body.style.removeProperty('display');else body.style.setProperty('display','none','important');}
}
function cleanOldArtifacts(){
 document.querySelectorAll('.tf-weather-near-mow,.tf-weather-peer-spacer').forEach(el=>el.remove());
 document.getElementById('tf-weather-near-mow-style')?.remove();
}
function hideNative(){
 const panel=nativeWeather();if(!panel||panel.closest('#tf-weather-drawer'))return;
 panel.classList.remove('tf-weather-first','tf-weather-context');
 for(const p of ['order','grid-column','width','max-width','position','z-index','margin-top','margin-bottom'])panel.style.removeProperty(p);
 setExpanded(panel,false);
 panel.dataset.tfWeatherDocked='1';
 panel.style.setProperty('display','none','important');
}
function ensureDrawer(){
 let overlay=by('tf-weather-overlay');if(overlay)return overlay;
 overlay=document.createElement('div');overlay.id='tf-weather-overlay';overlay.innerHTML=`<section id="tf-weather-drawer" role="dialog" aria-modal="true" aria-label="${LABEL}"><div class="tf-weather-drawer-head"><strong>🌦️ ${LABEL}</strong><button type="button" id="tf-weather-close" aria-label="Close weather lab">✕</button></div><div id="tf-weather-drawer-body"></div></section>`;
 document.body.appendChild(overlay);
 overlay.addEventListener('click',e=>{if(e.target===overlay)closeDrawer()});
 by('tf-weather-close').addEventListener('click',closeDrawer);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))closeDrawer()});
 return overlay;
}
function openDrawer(){
 const panel=nativeWeather();if(!panel)return;
 const overlay=ensureDrawer(),body=by('tf-weather-drawer-body');
 if(!placeholder){placeholder=document.createComment('tf-weather-home');panel.parentNode?.insertBefore(placeholder,panel);}
 activePanel=panel;
 panel.style.removeProperty('display');
 panel.style.width='100%';panel.style.maxWidth='none';panel.style.margin='0';
 body.appendChild(panel);
 setExpanded(panel,true);
 overlay.classList.add('open');document.body.classList.add('tf-weather-lock');
 requestAnimationFrame(()=>overlay.querySelector('#tf-weather-close')?.focus());
}
function closeDrawer(){
 const overlay=by('tf-weather-overlay');
 if(activePanel&&placeholder?.parentNode){
  setExpanded(activePanel,false);
  for(const p of ['width','max-width','margin'])activePanel.style.removeProperty(p);
  placeholder.parentNode.insertBefore(activePanel,placeholder.nextSibling);
  activePanel.style.setProperty('display','none','important');
 }
 activePanel=null;
 overlay?.classList.remove('open');document.body.classList.remove('tf-weather-lock');
}
function installBesideMowing(){
 cleanOldArtifacts();hideNative();
 for(const key of ['A','B']){
  const env=by('tf-env-'+key);if(!env)continue;
  const summary=env.querySelector(':scope > summary');
  if(summary){
   const spans=summary.querySelectorAll(':scope > span');
   if(spans[0])spans[0].textContent='✂️ Mowing';
   if(spans[1])spans[1].textContent='closed by default';
  }
  let shell=env.parentElement?.classList.contains('tf-management-tabs')?env.parentElement:null;
  if(!shell){
   shell=document.createElement('div');shell.className='tf-management-tabs';shell.dataset.lawn=key;
   env.parentNode?.insertBefore(shell,env);shell.appendChild(env);
  }
  let weather=shell.querySelector(':scope > .tf-weather-tab');
  if(!weather){
   weather=document.createElement('button');weather.type='button';weather.className='tf-weather-tab';weather.innerHTML='<strong>🌦️ Weather</strong><small>closed by default</small>';
   weather.addEventListener('click',openDrawer);
   shell.insertBefore(weather,env);
  }
 }
}
const style=document.createElement('style');style.id='tf-weather-v24-style';style.textContent=`
.tf-management-tabs{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px;align-items:start;margin:10px 0 2px}
.tf-management-tabs>.tf-env{margin:0!important;min-width:0;border-radius:13px!important}
.tf-management-tabs>.tf-env>summary{min-height:64px!important;padding:10px 12px!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;gap:2px!important;line-height:1.1!important}
.tf-management-tabs>.tf-env>summary>span:first-child{font-size:.88rem!important;font-weight:850!important;white-space:nowrap!important}
.tf-management-tabs>.tf-env>summary>span:last-child{font-size:.66rem!important;font-weight:650!important;color:#587060!important;white-space:nowrap!important}
.tf-weather-tab{min-height:64px;border:1px solid #b9d0bd!important;border-radius:13px!important;background:rgba(240,248,238,.72)!important;color:#183f2b!important;padding:10px 12px!important;text-align:left!important;display:flex!important;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;font:inherit!important;box-shadow:none!important}
.tf-weather-tab strong{font-size:.88rem;line-height:1.1;font-weight:850}.tf-weather-tab small{font-size:.66rem;color:#587060;line-height:1.1;font-weight:650}.tf-weather-tab:hover{background:#fff!important}
#tf-weather-overlay{position:fixed;inset:0;z-index:999999;background:rgba(5,15,18,.58);backdrop-filter:blur(4px);display:none;align-items:flex-start;justify-content:center;padding:clamp(12px,4vh,42px) 12px;overflow:auto}
#tf-weather-overlay.open{display:flex}body.tf-weather-lock{overflow:hidden}
#tf-weather-drawer{width:min(1120px,96vw);max-height:90vh;overflow:auto;background:#eef4ee;border:1px solid #9fb7a4;border-radius:16px;box-shadow:0 24px 70px rgba(0,0,0,.35);padding:12px;color:#183f2b}
.tf-weather-drawer-head{position:sticky;top:-12px;z-index:4;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 8px 12px;background:#eef4ee;border-bottom:1px solid #c5d5c8;margin:-1px -1px 10px}.tf-weather-drawer-head strong{font-size:1rem}.tf-weather-drawer-head button{width:38px;height:38px;border-radius:10px!important;padding:0!important;font-weight:900!important;background:#fff!important;color:#173f2a!important;border:1px solid #aec3b2!important}
#tf-weather-drawer .tf-collapse-toggle{display:none!important}#tf-weather-drawer .tf-collapse-body{display:block!important}#tf-weather-drawer .tf-panel-collapsed>.tf-collapse-body{display:block!important}
@media(max-width:620px){.tf-management-tabs{grid-template-columns:1fr 1fr;gap:8px}.tf-management-tabs>.tf-env>summary,.tf-weather-tab{min-height:62px!important;padding:9px 10px!important}.tf-management-tabs>.tf-env>summary>span:first-child,.tf-weather-tab strong{font-size:.84rem!important}.tf-management-tabs>.tf-env>summary>span:last-child,.tf-weather-tab small{font-size:.63rem!important}#tf-weather-overlay{padding:8px}#tf-weather-drawer{width:100%;max-height:94vh;border-radius:13px}}
@media(max-width:390px){.tf-management-tabs>.tf-env>summary>span:first-child,.tf-weather-tab strong{font-size:.8rem!important}.tf-management-tabs>.tf-env>summary>span:last-child,.tf-weather-tab small{font-size:.6rem!important}}
`;
if(!by(style.id))document.head.appendChild(style);
function boot(){installBesideMowing();ensureDrawer()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('load',boot,{once:true});
let queued=false;const mo=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;installBesideMowing()})});mo.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(boot,400);setTimeout(boot,1200);setTimeout(boot,2800);setTimeout(()=>mo.disconnect(),15000);
})();
