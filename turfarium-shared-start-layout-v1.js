/* Turfarium shared-start layout v2 — place the real Shared Starting Conditions card directly below Scenario Quick Start using stable element IDs, without touching the A/B grid. */
(()=>{'use strict';
function getShared(){
  const grass=document.getElementById('grass');
  if(!grass)return null;
  const panel=grass.closest('section.card,.card');
  if(!panel)return null;
  panel.id=panel.id||'shared-starting-conditions';
  panel.classList.add('tf-shared-start-top');
  return panel;
}
function place(){
  const scenario=document.getElementById('scenario-onboarding');
  const shared=getShared();
  if(!scenario||!shared||scenario===shared||scenario.contains(shared)||shared.contains(scenario))return false;

  // The requested top sequence is: Scenarios -> Shared Starting Conditions -> everything else.
  if(scenario.nextElementSibling!==shared){
    scenario.insertAdjacentElement('afterend',shared);
  }

  // Clear legacy positioning that can override the physical DOM order.
  for(const el of [scenario,shared]){
    el.style.removeProperty('order');
    el.style.removeProperty('grid-column');
    el.style.removeProperty('position');
    el.style.removeProperty('inset');
    el.style.removeProperty('top');
    el.style.removeProperty('left');
    el.style.setProperty('width','100%');
    el.style.setProperty('max-width','none');
  }
  return scenario.nextElementSibling===shared;
}

const style=document.createElement('style');
style.id='tf-shared-start-layout-style';
style.textContent=`
#scenario-onboarding + #shared-starting-conditions,
#scenario-onboarding + .tf-shared-start-top{display:block!important;width:100%!important;max-width:none!important;margin-top:12px!important}
`;
if(!document.getElementById(style.id))document.head.appendChild(style);

let queued=false;
const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;place();});};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('load',run,{once:true});
const mo=new MutationObserver(run);mo.observe(document.body||document.documentElement,{childList:true,subtree:true});
[100,250,500,900,1500,2500,4000,6500,9000].forEach(ms=>setTimeout(run,ms));
setTimeout(()=>mo.disconnect(),12000);
})();
