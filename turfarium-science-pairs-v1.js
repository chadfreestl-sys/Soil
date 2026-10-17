/* Turfarium science pairs v1 — compact normally-closed science modules in two desktop columns. */
(()=>{'use strict';
const byTitle=pattern=>{
  for(const h of document.querySelectorAll('h1,h2,h3,h4,.tf-collapse-title')){
    if(!pattern.test((h.textContent||'').trim()))continue;
    const p=h.closest('section.card,article.card,.card');
    if(p)return p;
  }
  return null;
};
function makeClosed(panel){
  if(!panel)return;
  const existingToggle=panel.querySelector(':scope > .tf-collapse-toggle');
  const existingBody=panel.querySelector(':scope > .tf-collapse-body');
  if(existingToggle&&existingBody){
    panel.classList.add('tf-panel-collapsed');
    existingToggle.setAttribute('aria-expanded','false');
    const chev=existingToggle.querySelector('.tf-collapse-chevron');if(chev)chev.textContent='▸';
    existingBody.hidden=true;
    return;
  }
  const heading=panel.querySelector(':scope > h1,:scope > h2,:scope > h3,:scope > h4,:scope > .head h2,:scope > .head h3');
  const title=(heading?.textContent||'Details').trim();
  const body=document.createElement('div');body.className='tf-collapse-body';
  while(panel.firstChild)body.appendChild(panel.firstChild);
  const btn=document.createElement('button');btn.type='button';btn.className='tf-collapse-toggle';btn.setAttribute('aria-expanded','false');
  btn.innerHTML='<span class="tf-collapse-title"></span><span class="tf-collapse-chevron" aria-hidden="true">▸</span>';
  btn.querySelector('.tf-collapse-title').textContent=title;
  panel.append(btn,body);panel.classList.add('tf-collapsible-panel','tf-panel-collapsed');panel.dataset.tfCollapsible='1';body.hidden=true;
  btn.addEventListener('click',()=>{const closed=panel.classList.toggle('tf-panel-collapsed');btn.setAttribute('aria-expanded',String(!closed));btn.querySelector('.tf-collapse-chevron').textContent=closed?'▸':'▾';body.hidden=closed;});
}
function arrange(){
  const earth=byTitle(/Earthworm\s+Ecology/i);
  const food=byTitle(/Linked\s+soil\s+food\s+web|Soil\s+Food\s+Web/i);
  const physics=byTitle(/Root-zone\s+physics|Root\s+zone\s+physics/i);
  const seaweed=document.getElementById('seaweed-response')||byTitle(/Seaweed\s+Response\s+Lab/i);
  if(!earth||!food||!physics||!seaweed)return false;
  let wrap=document.getElementById('tf-science-pairs');
  if(!wrap){
    wrap=document.createElement('div');wrap.id='tf-science-pairs';wrap.className='tf-science-pairs';
    earth.parentNode?.insertBefore(wrap,earth);
  }
  for(const p of [earth,food,physics,seaweed]){
    p.classList.add('tf-science-pair-card');
    p.style.removeProperty('order');p.style.removeProperty('grid-column');p.style.removeProperty('width');p.style.removeProperty('max-width');
    if(p.parentElement!==wrap)wrap.appendChild(p);
    makeClosed(p);
  }
  return true;
}
const style=document.createElement('style');style.id='tf-science-pairs-style';style.textContent=`
#tf-science-pairs{grid-column:1/-1!important;width:100%;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start;margin:0}
#tf-science-pairs>.tf-science-pair-card{grid-column:auto!important;width:100%!important;max-width:none!important;margin:0!important;align-self:start;min-width:0}
#tf-science-pairs>.tf-science-pair-card>.tf-collapse-toggle{width:100%;min-height:46px}
@media(max-width:760px){#tf-science-pairs{grid-template-columns:1fr;gap:9px}}
`;
if(!document.getElementById(style.id))document.head.appendChild(style);
const boot=()=>arrange();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('load',boot,{once:true});
[100,300,700,1400,2600,4500].forEach(ms=>setTimeout(boot,ms));
})();
