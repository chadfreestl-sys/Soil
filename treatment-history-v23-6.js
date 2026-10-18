/* Turfarium v23.8 — independent Treatment History A/B cards, initially closed. */
(()=>{
'use strict';
function install(){
 const a=document.getElementById('lawn-a-panel');
 const b=document.getElementById('lawn-b-panel');
 const grid=a?.parentElement;
 if(!a||!b||!grid||b.parentElement!==grid)return;
 let anchor=document.getElementById('tf-save-drawer')||b;
 for(const key of ['A','B']){
  const lawn=key==='A'?a:b;
  const history=lawn.querySelector('.recent-applications');
  if(!history)continue;
  let panel=document.getElementById('tf-history-card-'+key.toLowerCase());
  if(!panel){
   panel=document.createElement('section');
   panel.id='tf-history-card-'+key.toLowerCase();
   panel.className='card tf-history-panel tf-history-standalone';
   panel.setAttribute('aria-label','Lawn '+key+' Treatment History');
   const toggle=document.createElement('button');
   toggle.type='button';toggle.className='tf-history-toggle';
   toggle.setAttribute('aria-expanded','false');
   const body=document.createElement('div');
   body.className='tf-history-body';
   body.id='tf-history-'+key.toLowerCase()+'-content';
   body.hidden=true;
   toggle.setAttribute('aria-controls',body.id);
   toggle.innerHTML='<span>📋 Treatment History · Lawn '+key+'</span><span class="tf-history-chevron" aria-hidden="true">▸</span>';
   panel.append(toggle,body);
   toggle.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')!=='true';
    toggle.setAttribute('aria-expanded',String(open));
    body.hidden=!open;
    toggle.querySelector('.tf-history-chevron').textContent=open?'▾':'▸';
   });
  }
  panel.style.setProperty('order','-996','important');
  panel.style.setProperty('grid-column','auto','important');
  const body=panel.querySelector('.tf-history-body');
  if(history.parentElement!==body)body.appendChild(history);
  history.dataset.tfHistoryWrapped='1';
  if(panel.parentElement!==grid||panel.previousElementSibling!==anchor)anchor.after(panel);
  anchor=panel;
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
window.addEventListener('load',install,{once:true});
setTimeout(install,850);setTimeout(install,2600);
setTimeout(install,4200);
})();
