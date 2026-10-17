/* Turfarium science pairs v1.1 — root-zone physics above earthworm; physics open by default. */
(()=>{'use strict';
const byTitle=pattern=>{
  for(const h of document.querySelectorAll('h1,h2,h3,h4,.tf-collapse-title')){
    if(!pattern.test((h.textContent||'').trim()))continue;
    const p=h.closest('section.card,article.card,.card');
    if(p)return p;
  }
  return null;
};
function setDefault(panel,open){
  if(!panel||panel.dataset.tfScienceDefaulted==='1')return;
  const existingToggle=panel.querySelector(':scope > .tf-collapse-toggle');
  const existingBody=panel.querySelector(':scope > .tf-collapse-body');
  if(existingToggle&&existingBody){
    panel.classList.toggle('tf-panel-collapsed',!open);
    existingToggle.setAttribute('aria-expanded',String(open));
    const chev=existingToggle.querySelector('.tf-collapse-chevron');if(chev)chev.textContent=open?'▾':'▸';
    existingBody.hidden=!open;
    panel.dataset.tfScienceDefaulted='1';
    return;
  }
  const heading=panel.querySelector(':scope > h1,:scope > h2,:scope > h3,:scope > h4,:scope > .head h2,:scope > .head h3');
  const title=(heading?.textContent||'Details').trim();
  const body=document.createElement('div');body.className='tf-collapse-body';
  while(panel.firstChild)body.appendChild(panel.firstChild);
  const btn=document.createElement('button');btn.type='button';btn.className='tf-collapse-toggle';btn.setAttribute('aria-expanded',String(open));
  btn.innerHTML='<span class="tf-collapse-title"></span><span class="tf-collapse-chevron" aria-hidden="true"></span>';
  btn.querySelector('.tf-collapse-title').textContent=title;
  btn.querySelector('.tf-collapse-chevron').textContent=open?'▾':'▸';
  panel.append(btn,body);panel.classList.add('tf-collapsible-panel');panel.classList.toggle('tf-panel-collapsed',!open);panel.dataset.tfCollapsible='1';panel.dataset.tfScienceDefaulted='1';body.hidden=!open;
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
    physics.parentNode?.insertBefore(wrap,physics);
  }
  for(const p of [physics,food,earth,seaweed]){
    p.classList.add('tf-science-pair-card');
    p.style.removeProperty('order');p.style.removeProperty('grid-column');p.style.removeProperty('width');p.style.removeProperty('max-width');
    wrap.appendChild(p);
  }
  setDefault(physics,true);
  setDefault(earth,false);
  setDefault(food,false);
  setDefault(seaweed,false);
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
