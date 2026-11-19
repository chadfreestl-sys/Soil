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
  if(window.matchMedia('(max-width:700px)').matches){
    // Place the consolidated setup directly beneath the Turfarium banner,
    // before the mobile comparison introduction and lawn images.
    return document.querySelector('main>header')||document.querySelector('header');
  }
  return document.querySelector('.mode-shell')||document.querySelector('header');
}
function findProfile(){
  const selector=document.getElementById('viewMode');
  if(!selector)return null;
  // Profile controls are sometimes wrapped in a generated details drawer.
  return selector.closest('#tf-profile-mobile-card,#tf-setup-soil-profile,section.card,.card,details')||null;
}
function place(){
  const scenario=document.getElementById('scenario-onboarding');
  const shared=getShared();
  const anchor=topAnchor();
  if(!scenario||!shared||!anchor||scenario===shared)return false;
  let stack=document.getElementById('tf-top-start-stack');
  if(!stack){
    stack=document.createElement('section');
    stack.id='tf-top-start-stack';
    stack.className='tf-top-start-stack';
    stack.setAttribute('aria-label','Simulation setup');
  }
  // Insert once, then move only if a different layout module actually displaced it.
  if(stack.previousElementSibling!==anchor)anchor.insertAdjacentElement('afterend',stack);
  // On phones the comparison introduction belongs above setup, immediately
  // below the banner. Move the existing live element, never duplicate it.
  if(window.matchMedia('(max-width:700px)').matches){
    const intro=document.getElementById('tf-mobile-intro');
    if(intro&&intro.nextElementSibling!==stack)stack.insertAdjacentElement('beforebegin',intro);
  }
  if(!stack.querySelector(':scope > .tf-setup-heading')){
    const heading=document.createElement('div');
    heading.className='tf-setup-heading';
    heading.innerHTML='<div class="tf-setup-heading-icon" aria-hidden="true">⚙</div><div><h2>Set up your simulation</h2><p>Choose a scenario, set your baseline and explore the soil.</p></div>';
    stack.prepend(heading);
  }
  if(scenario.parentElement!==stack)stack.appendChild(scenario);
  if(shared.parentElement!==stack)stack.appendChild(shared);
  // Keep the compact setup cards in a predictable order without remounting them.
  if(scenario.previousElementSibling!==stack.querySelector(':scope > .tf-setup-heading')){
    stack.querySelector(':scope > .tf-setup-heading')?.insertAdjacentElement('afterend',scenario);
  }
  if(shared.previousElementSibling!==scenario)scenario.insertAdjacentElement('afterend',shared);
  if(window.matchMedia('(max-width:700px)').matches){
    const profile=findProfile();
    if(profile&&profile!==scenario&&profile!==shared&&!profile.contains(stack)){
      if(!profile.id)profile.id='tf-setup-soil-profile';
      if(profile.parentElement!==stack)stack.appendChild(profile);
      if(profile.matches('details')&&!profile.dataset.tfSetupDefaultClosed){
        profile.open=false;
        profile.dataset.tfSetupDefaultClosed='1';
      }
    }
  }
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
  return true;
}
const style=document.createElement('style');
style.id='tf-shared-start-layout-style-v3';
style.textContent=`
#tf-top-start-stack{display:block!important;width:100%!important;max-width:none!important;margin:14px 0 16px!important}
#tf-top-start-stack>#scenario-onboarding,#tf-top-start-stack>#shared-starting-conditions{display:block!important;width:100%!important;max-width:none!important;margin:0 0 12px!important}
#tf-top-start-stack>#shared-starting-conditions{margin-bottom:0!important}
@media(max-width:700px){
 #tf-top-start-stack{border:1px solid #c9d9cb!important;border-radius:16px!important;background:#f5f8f1!important;padding:10px!important;margin:10px 0 14px!important}
 #tf-top-start-stack>#scenario-onboarding,#tf-top-start-stack>#shared-starting-conditions,#tf-top-start-stack>#tf-setup-soil-profile{margin:0 0 7px!important;border-radius:11px!important;box-shadow:none!important}
 #tf-top-start-stack>#tf-setup-soil-profile{margin-bottom:0!important}
}
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
const polish=document.createElement('style');
polish.id='tf-mobile-setup-polish-v1';
polish.textContent=`
@media(max-width:700px){
 #tf-top-start-stack{
   display:flex!important;flex-direction:column!important;gap:0!important;
   padding:12px!important;margin:12px 0 16px!important;
   border:1px solid #c3d7c8!important;border-radius:19px!important;
   background:linear-gradient(155deg,#f9fcf7 0%,#edf5eb 100%)!important;
   box-shadow:0 7px 22px rgba(25,66,45,.08)!important;
 }
 #tf-top-start-stack>.tf-setup-heading{display:flex!important;align-items:center!important;gap:11px!important;padding:3px 5px 12px!important;margin:0 0 4px!important;border-bottom:1px solid #d7e4d8!important}
 #tf-top-start-stack .tf-setup-heading-icon{width:39px;height:39px;flex:0 0 39px;display:grid;place-items:center;background:#dcecdf;color:#195137;border-radius:12px;font-size:23px}
 #tf-top-start-stack .tf-setup-heading h2{font-size:17px!important;line-height:1.2!important;letter-spacing:-.02em!important;margin:0 0 3px!important;color:#173f2d!important}
 #tf-top-start-stack .tf-setup-heading p{font-size:12px!important;line-height:1.35!important;margin:0!important;color:#5c7864!important}
 #tf-top-start-stack>#scenario-onboarding,
 #tf-top-start-stack>#shared-starting-conditions,
 #tf-top-start-stack>#tf-setup-soil-profile,
 #tf-top-start-stack>details:has(#viewMode),
 #tf-top-start-stack>section:has(#viewMode){
   border:0!important;border-bottom:1px solid #dce8dd!important;
   background:transparent!important;box-shadow:none!important;
   padding:5px 2px!important;margin:0!important;border-radius:0!important;
 }
 #tf-top-start-stack>:last-child{border-bottom:0!important}
 #tf-top-start-stack #scenario-onboarding .scenario-head,
 #tf-top-start-stack #shared-starting-conditions>.head{margin:0!important}
 #tf-top-start-stack #scenario-onboarding summary,
 #tf-top-start-stack #shared-starting-conditions>.head,
 #tf-top-start-stack #tf-setup-soil-profile>summary{
   min-height:47px!important;border:0!important;border-radius:10px!important;
   background:#e7f1e6!important;box-shadow:none!important;
   padding:11px 13px!important;color:#1d4b34!important;
 }
 #tf-top-start-stack #scenario-onboarding summary:hover,
 #tf-top-start-stack #tf-setup-soil-profile>summary:hover{background:#dcebdc!important}
 #tf-top-start-stack #viewMode{margin:6px 0!important}
}
`;
document.head.appendChild(polish);
let queued=false;
const run=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;place();});};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('load',run,{once:true});
// Watch only relevant structural additions, avoiding a full-document mutation feedback loop.
const mo=new MutationObserver(records=>{
  if(records.some(record=>[...record.addedNodes].some(node=>node.nodeType===1&&(
    node.matches?.('#tf-stacked-lawns,#scenario-onboarding,#shared-starting-conditions,#tf-top-start-stack')||
    node.querySelector?.('#tf-stacked-lawns,#scenario-onboarding,#shared-starting-conditions')
  ))))run();
});
mo.observe(document.body||document.documentElement,{childList:true,subtree:true});
[50,150,300,600,1000,1800,3000,5000,8000,12000].forEach(ms=>setTimeout(run,ms));
})();
