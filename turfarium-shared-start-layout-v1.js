/* Turfarium shared-start layout v4 — create one stable top stack: Scenario Quick Start, then Shared Starting Conditions. */
(()=>{'use strict';
function getShared(){
  const grass=document.getElementById('grass');
  const panel=grass?.closest('section.card,.card');
  if(!panel)return null;
  panel.id=panel.id||'shared-starting-conditions';
  panel.classList.add('tf-shared-start-top');
  // Default the shared baseline panel closed on mobile; preserve controls in the DOM.
  if(window.matchMedia('(max-width:700px)').matches && !panel.dataset.tfSharedDefaultClosed){
    panel.dataset.tfSharedDefaultClosed='1';
    const collapse=panel.querySelector(':scope > .tf-collapse-toggle');
    if(collapse){
      if(collapse.getAttribute('aria-expanded')==='true')collapse.click();
    }else{
      const head=panel.querySelector(':scope > .head');
      if(head){
        head.setAttribute('role','button');
        head.setAttribute('tabindex','0');
        head.setAttribute('aria-expanded','false');
        const toggle=()=>{
          const opened=head.getAttribute('aria-expanded')!=='true';
          head.setAttribute('aria-expanded',String(opened));
          panel.classList.toggle('tf-shared-open',opened);
        };
        head.addEventListener('click',toggle);
        head.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
      }
    }
  }

  const lab=panel.querySelector('details.labinputs');
  if(lab&&!lab.dataset.tfCompactInit){lab.open=false;lab.dataset.tfCompactInit='1';}
  if(!panel.dataset.tfCompactSummary){
    const heading=panel.querySelector(':scope > .head h2');
    if(heading)heading.textContent='Shared starting conditions · Soil lab baseline';
    panel.dataset.tfCompactSummary='1';
  }
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

const closedStyle=document.createElement('style');
closedStyle.textContent=`@media(max-width:700px){
 #shared-starting-conditions:not(.tf-shared-open) > :not(.head):not(.tf-collapse-toggle){display:none!important}
 #shared-starting-conditions:not(.tf-shared-open) > .head{margin:0!important;cursor:pointer}
 #shared-starting-conditions:not(.tf-shared-open){padding:8px 12px!important}
}`;
document.head.appendChild(closedStyle);
const compact=document.createElement('style');compact.id='tf-compact-baseline-v4';compact.textContent=`
#tf-top-start-stack{margin:8px 0 10px!important}
#tf-top-start-stack>#shared-starting-conditions{padding:10px 14px!important;border-radius:12px!important}
#shared-starting-conditions>.head{display:flex!important;align-items:center!important;gap:10px!important;flex-wrap:wrap!important;margin:0 0 7px!important}
#shared-starting-conditions>.head h2{font-size:1rem!important;margin:0!important;line-height:1.3!important}
#shared-starting-conditions>.head .badge{font-size:.72rem!important;padding:3px 8px!important}
#shared-starting-conditions>.controls{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px 12px!important;margin:0!important}
#shared-starting-conditions>.controls>div{min-width:0!important}
#shared-starting-conditions label{font-size:.78rem!important;margin-bottom:3px!important}
#shared-starting-conditions input,#shared-starting-conditions select{max-width:100%!important;box-sizing:border-box!important}
#shared-starting-conditions #turfInfo{font-size:.73rem!important;line-height:1.25!important;margin-top:3px!important}
#shared-starting-conditions details.labinputs{margin:6px 0!important;padding:0!important}
#shared-starting-conditions details.labinputs>summary{cursor:pointer;font-size:.82rem!important;font-weight:700;padding:7px 9px;border:1px solid #b9cdbb;border-radius:8px}
#shared-starting-conditions details.labinputs:not([open])>summary{margin-bottom:0!important}
#shared-starting-conditions details.labinputs .controls{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important}
#shared-starting-conditions>.row{display:flex!important;gap:8px!important;flex-wrap:wrap!important;margin-top:6px!important}
#shared-starting-conditions>.row button{width:auto!important;flex:0 1 auto!important;min-height:36px!important;padding:7px 12px!important;font-size:.8rem!important}
#shared-starting-conditions>small.note{display:block;font-size:.72rem!important;line-height:1.3!important;margin-top:5px!important}
#profile-control-deck{padding:12px 14px!important}
#profile-control-deck .profile-deck-grid{gap:8px!important}
#profile-control-deck .profile-deck-title{margin-bottom:7px!important}
#profile-control-deck .profile-replay-slot>*,#profile-control-deck .profile-save-slot>*{padding:8px 10px!important}
#profile-control-deck .profile-save-slot button{width:auto!important;max-width:125px!important;min-width:0!important;flex:0 0 auto!important;padding:5px 8px!important;min-height:32px!important;font-size:.74rem!important}
#profile-control-deck .profile-save-slot .row,#profile-control-deck .profile-save-slot .scenario-actions{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:8px!important;flex-wrap:wrap!important}
#profile-control-deck .profile-save-slot select,#profile-control-deck .profile-save-slot input{max-width:min(100%,300px)!important;min-width:0!important}
#profile-control-deck .profile-save-slot .scenario-head{margin-bottom:5px!important}
@media(max-width:420px){#profile-control-deck .profile-save-slot button{max-width:125px!important}}
@media(max-width:750px){#shared-starting-conditions>.controls,#shared-starting-conditions details.labinputs .controls{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
@media(max-width:420px){#shared-starting-conditions>.controls,#shared-starting-conditions details.labinputs .controls{grid-template-columns:minmax(0,1fr)!important}#shared-starting-conditions>.row button{flex:1 1 100%!important}}
`;
document.head.appendChild(compact);
document.head.appendChild(style);
let queued=false;
const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;place();});};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('load',run,{once:true});
const mo=new MutationObserver(run);mo.observe(document.documentElement,{childList:true,subtree:true});
[50,150,300,600,1000,1800,3000,5000,8000,12000].forEach(ms=>setTimeout(run,ms));
})();
