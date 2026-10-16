/* Turfarium shared-start layout v1 — keep Shared Starting Conditions directly below Scenario Quick Start without disturbing the A/B lawn grid. */
(()=>{'use strict';
const norm=s=>(s||'').replace(/\s+/g,' ').trim().toLowerCase();
const cardFor=node=>node?.closest('.card.wide,section.card,article.card,.card,section,article')||null;
function findShared(){
  const nodes=[...document.querySelectorAll('.tf-collapse-title,h1,h2,h3,h4,summary,strong,.head')];
  const hit=nodes.find(n=>norm(n.textContent).includes('shared starting conditions'));
  const panel=cardFor(hit);
  if(!panel)return null;
  if(panel.id==='scenario-onboarding'||panel.contains(document.getElementById('scenario-onboarding')))return null;
  return panel;
}
function place(){
  const scenario=document.getElementById('scenario-onboarding');
  const shared=findShared();
  if(!scenario||!shared||scenario===shared||scenario.contains(shared)||shared.contains(scenario))return false;
  // Keep both as full-width top-level workflow cards and place Shared Starting Conditions immediately after Scenarios.
  shared.classList.add('tf-shared-start-top');
  shared.style.setProperty('grid-column','1 / -1','important');
  shared.style.setProperty('order','-970','important');
  scenario.style.setProperty('grid-column','1 / -1','important');
  scenario.style.setProperty('order','-980','important');
  if(shared.parentElement===scenario.parentElement && scenario.nextElementSibling!==shared){
    scenario.insertAdjacentElement('afterend',shared);
  }else if(scenario.parentElement && shared.parentElement!==scenario.parentElement){
    scenario.insertAdjacentElement('afterend',shared);
  }
  return true;
}
const style=document.createElement('style');style.id='tf-shared-start-layout-style';style.textContent=`
.simulation-grid.tf-primary-workspace>#scenario-onboarding{order:-980!important;grid-column:1/-1!important}
.simulation-grid.tf-primary-workspace>.tf-shared-start-top{order:-970!important;grid-column:1/-1!important}
`;
if(!document.getElementById(style.id))document.head.appendChild(style);
let queued=false;
const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;place();});};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('load',run,{once:true});
const mo=new MutationObserver(run);mo.observe(document.documentElement,{childList:true,subtree:true});
setTimeout(run,300);setTimeout(run,900);setTimeout(run,1800);setTimeout(run,3200);setTimeout(()=>mo.disconnect(),12000);
})();
