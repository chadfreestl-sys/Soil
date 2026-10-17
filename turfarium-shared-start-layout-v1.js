/* Turfarium shared-start layout v3 — create one stable top stack: Scenario Quick Start, then Shared Starting Conditions. */
(()=>{'use strict';
function getShared(){
  const grass=document.getElementById('grass');
  const panel=grass?.closest('section.card,.card');
  if(!panel)return null;
  panel.id=panel.id||'shared-starting-conditions';
  panel.classList.add('tf-shared-start-top');
  return panel;
}
function topAnchor(){
  return document.querySelector('.mode-shell')||document.querySelector('header');
}
function place(){
  const scenario=document.getElementById('scenario-onboarding');
  const shared=getShared();
  const anchor=topAnchor();
  if(!scenario||!shared||!anchor||scenario===shared)return false;
  let stack=document.getElementById('tf-top-start-stack');
  if(!stack){
    stack=document.createElement('div');
    stack.id='tf-top-start-stack';
    stack.className='tf-top-start-stack';
    anchor.insertAdjacentElement('afterend',stack);
  }else if(stack.previousElementSibling!==anchor){
    anchor.insertAdjacentElement('afterend',stack);
  }
  if(scenario.parentElement!==stack||stack.firstElementChild!==scenario)stack.prepend(scenario);
  if(shared.parentElement!==stack||scenario.nextElementSibling!==shared)scenario.insertAdjacentElement('afterend',shared);
  for(const el of [scenario,shared]){
    el.style.removeProperty('order');
    el.style.removeProperty('grid-column');
    el.style.removeProperty('position');
    el.style.removeProperty('inset');
    el.style.removeProperty('top');
    el.style.removeProperty('left');
    el.style.setProperty('width','100%','important');
    el.style.setProperty('max-width','none','important');
  }
  return stack.firstElementChild===scenario&&scenario.nextElementSibling===shared;
}
const style=document.createElement('style');
style.id='tf-shared-start-layout-style-v3';
style.textContent=`
#tf-top-start-stack{display:block!important;width:100%!important;max-width:none!important;margin:14px 0 16px!important}
#tf-top-start-stack>#scenario-onboarding,#tf-top-start-stack>#shared-starting-conditions{display:block!important;width:100%!important;max-width:none!important;margin:0 0 12px!important}
#tf-top-start-stack>#shared-starting-conditions{margin-bottom:0!important}
`;
document.head.appendChild(style);
let queued=false;
const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;place();});};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('load',run,{once:true});
const mo=new MutationObserver(run);mo.observe(document.documentElement,{childList:true,subtree:true});
[50,150,300,600,1000,1800,3000,5000,8000,12000].forEach(ms=>setTimeout(run,ms));
})();
