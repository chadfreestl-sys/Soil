/* Turfarium 23.6 — treatment history as independent, default-closed panels.
   Preserve original history DOM nodes and IDs so the simulation can update them. */
(()=>{
'use strict';
const mark='tf-history-panel';
const titleMatches=s=>/^treatment\s+history(?:\s*[:—-].*)?$/i.test((s||'').trim());
const attach=()=>{
 const lawns=[document.getElementById('lawn-a-panel'),document.getElementById('lawn-b-panel')].filter(Boolean);
 for(const lawn of lawns){
  const headings=[...lawn.querySelectorAll('h2,h3,h4,h5,strong,.section-title,.panel-title')];
  for(const heading of headings){
   if(!titleMatches(heading.textContent) || heading.closest('.'+mark))continue;
   // The heading's nearest immediate content block is the existing history area.
   // Do not move or duplicate the history records.
   let target=heading.parentElement;
   if(!target||target===lawn)continue;
   // Prefer the whole history block if heading is its first heading.
   if(target.classList.contains('head') && target.parentElement!==lawn)target=target.parentElement;
   if(target===lawn||target.closest('.'+mark))continue;
   if(target.contains(lawn.querySelector('.tf-collapse-toggle')))continue;
   const wrapper=document.createElement('section');
   wrapper.className=mark;
   const toggle=document.createElement('button');
   toggle.type='button';toggle.className='tf-history-toggle';
   toggle.setAttribute('aria-expanded','false');
   const body=document.createElement('div');
   body.className='tf-history-body';body.hidden=true;
   toggle.innerHTML='<span>Treatment History</span><span aria-hidden="true" class="tf-history-chevron">▸</span>';
   target.before(wrapper);wrapper.append(toggle,body);body.appendChild(target);
   toggle.addEventListener('click',()=>{
     const expanded=toggle.getAttribute('aria-expanded')!=='true';
     toggle.setAttribute('aria-expanded',String(expanded));
     body.hidden=!expanded;
     toggle.querySelector('.tf-history-chevron').textContent=expanded?'▾':'▸';
   });
  }
 }
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach,{once:true});else attach();
window.addEventListener('load',attach,{once:true});
setTimeout(attach,1000);
setTimeout(attach,2500);
})();
