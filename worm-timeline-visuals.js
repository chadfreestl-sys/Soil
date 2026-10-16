/* Turfarium v1.2 — independently animated soil organisms for Lawn A and Lawn B.
   Visual interpretation of model activity, not an organism-count forecast. */
(()=>{
'use strict';
if(window.__tfWormScenesV12)return;
window.__tfWormScenesV12=true;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const style=document.createElement('style');
style.textContent=`
.tf-worm-layer{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;z-index:35!important;pointer-events:none!important;overflow:hidden!important}
.tf-worm-layer svg{position:absolute;width:100%;height:100%;inset:0;overflow:visible}
.tf-worm-unit{transform-box:fill-box;transform-origin:center;animation:tf-worm-crawl 5s ease-in-out infinite alternate;will-change:transform}
.tf-worm-unit:nth-child(2){animation-duration:7s;animation-delay:-2s}
.tf-worm-unit:nth-child(3){animation-duration:9s;animation-delay:-4s}
@keyframes tf-worm-crawl{0%{transform:translate(-15px,-6px) rotate(-7deg)}50%{transform:translate(14px,7px) rotate(5deg)}100%{transform:translate(39px,-5px) rotate(-4deg)}}
.tf-worm-badge{position:absolute;z-index:36;right:8px;bottom:8px;background:#f8f3df;color:#173a29;border:1px solid #345e45;border-radius:7px;font:800 11px/1.3 Arial,sans-serif;padding:5px 7px;box-shadow:0 2px 8px #0006}
.tf-worm-unit.is-inactive{opacity:0!important}
@media(prefers-reduced-motion:reduce){.tf-worm-unit{animation:none!important}}
`;
document.head.appendChild(style);
const makeWorm=(x,y,index)=>`<g class="tf-worm-unit" data-worm="${index}" transform="translate(${x} ${y})"><path d="M -24 0 C -12 -13 0 13 14 0 S 29 -6 35 0" fill="none" stroke="#281510" stroke-width="12" stroke-linecap="round"/><path d="M -24 0 C -12 -13 0 13 14 0 S 29 -6 35 0" fill="none" stroke="#e4a188" stroke-width="8" stroke-linecap="round"/><path d="M -24 0 C -12 -13 0 13 14 0 S 29 -6 35 0" fill="none" stroke="#7f4b43" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round"/></g>`;
const panels=['A','B'].map((key,i)=>{
 const panel=document.getElementById('lawn-'+key.toLowerCase()+'-panel');
 const stage=panel?.querySelector('.photo-stage');
 if(!stage)return null;
 stage.style.setProperty('position','relative','important');
 const layer=document.createElement('div');layer.className='tf-worm-layer';
 layer.innerHTML=`<svg viewBox="0 0 500 300" preserveAspectRatio="none" aria-hidden="true">${makeWorm(135+i*30,208,0)}${makeWorm(285-i*22,246,1)}${makeWorm(380,190,2)}</svg><span class="tf-worm-badge">🪱 Lawn ${key} · worms loading</span>`;
 stage.appendChild(layer);
 return {key,panel,layer,activity:33};
}).filter(Boolean);
if(!panels.length)return;
const update=s=>{
 const kpi=document.getElementById('kpi'+s.key);
 const txt=(kpi?.textContent||s.panel.textContent||'').replace(/\\s+/g,' ');
 const m=txt.match(/Earthworm activity[^0-9]{0,40}(\\d+(?:\\.\\d+)?)\\s*\\/\\s*100/i);
 if(m)s.activity=clamp(Number(m[1]),0,100);
 const badge=document.getElementById('day'+s.key);
 const day=Number((badge?.textContent||'').match(/Day\\s*(\\d+)/i)?.[1]||0);
 const count=s.activity<10?0:s.activity<35?1:s.activity<65?2:3;
 s.layer.querySelectorAll('.tf-worm-unit').forEach((worm,i)=>worm.classList.toggle('is-inactive',i>=count));
 s.layer.querySelector('.tf-worm-badge').textContent='🪱 Lawn '+s.key+' · '+Math.round(s.activity)+'/100 · Day '+day;
};
panels.forEach(update);
setInterval(()=>panels.forEach(update),700);
})();
