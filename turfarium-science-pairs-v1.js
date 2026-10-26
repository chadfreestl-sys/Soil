/* Turfarium science pairs v1.2 — physics open; species directly below; supporting science compact. */
(()=>{'use strict';
const byTitle=pattern=>{
  for(const h of document.querySelectorAll('h1,h2,h3,h4,.tf-collapse-title')){
    if(!pattern.test((h.textContent||'').trim()))continue;
    const p=h.closest('section.card,article.card,.card');
    if(p)return p;
  }
  return null;
};
const panelFor=id=>document.getElementById(id)?.closest('section.card,article.card,.card')||null;
function renamePanel(panel,title){
  if(!panel)return;
  const toggleTitle=panel.querySelector(':scope > .tf-collapse-toggle .tf-collapse-title');
  if(toggleTitle)toggleTitle.textContent=title;
  const heading=panel.querySelector(':scope > h1,:scope > h2,:scope > h3,:scope > h4,:scope > .head h2,:scope > .head h3,:scope > .tf-collapse-body > h2,:scope > .tf-collapse-body > .head h2');
  if(heading)heading.textContent=title;
}
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
  const title=(panel.id==='tf-divergence-panel'?'Five-year divergence tracker':(heading?.textContent||'Details')).trim();
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
  const species=panelFor('speciesSummary')||byTitle(/Species[-\s]+specific|Turf\s+species|Species\s+response/i);
  const graph=panelFor('chart')||byTitle(/Five-year\s+divergence\s+tracker|Divergence\s+tracker/i);
  if(!earth||!food||!physics||!seaweed)return false;

  let wrap=document.getElementById('tf-science-pairs');
  if(!wrap){
    wrap=document.createElement('div');wrap.id='tf-science-pairs';wrap.className='tf-science-pairs';
    physics.parentNode?.insertBefore(wrap,physics);
  }
  let left=document.getElementById('tf-science-left');
  let right=document.getElementById('tf-science-right');
  if(!left){left=document.createElement('div');left.id='tf-science-left';left.className='tf-science-column';wrap.appendChild(left)}
  if(!right){right=document.createElement('div');right.id='tf-science-right';right.className='tf-science-column';wrap.appendChild(right)}

  const prep=p=>{if(!p)return;p.classList.add('tf-science-pair-card');['order','grid-column','width','max-width'].forEach(x=>p.style.removeProperty(x));};
  [physics,species,earth,food,seaweed].forEach(prep);
  left.appendChild(physics);
  if(species)left.appendChild(species);
  left.appendChild(earth);
  right.appendChild(food);
  right.appendChild(seaweed);

  setDefault(physics,true);
  if(species){renamePanel(species,'🌱 Turf Species Response');setDefault(species,false);}
  setDefault(earth,false);
  setDefault(food,false);
  setDefault(seaweed,false);
  if(graph){setDefault(graph,false);renamePanel(graph,'Five-year divergence tracker');}
  return true;
}
const style=document.createElement('style');style.id='tf-science-pairs-style';style.textContent=`
#tf-science-pairs{grid-column:1/-1!important;width:100%;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:start;margin:0}
#tf-science-pairs>.tf-science-column{display:flex;flex-direction:column;gap:12px;min-width:0}
#tf-science-pairs .tf-science-pair-card{grid-column:auto!important;width:100%!important;max-width:none!important;margin:0!important;align-self:start;min-width:0}
#tf-science-pairs .tf-science-pair-card>.tf-collapse-toggle{width:100%;min-height:46px}
@media(max-width:760px){#tf-science-pairs{grid-template-columns:1fr;gap:9px}#tf-science-pairs>.tf-science-column{gap:9px}}
`;
const old=document.getElementById(style.id);if(old)old.remove();document.head.appendChild(style);
const boot=()=>arrange();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('load',boot,{once:true});
[100,300,700,1400,2600,4500].forEach(ms=>setTimeout(boot,ms));
})();
