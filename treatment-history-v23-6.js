/* Turfarium v23.7 — actual treatment history blocks, default closed */
(()=>{
'use strict';
function install(){
 for(const key of ['A','B']){
  const lawn=document.getElementById('lawn-'+key.toLowerCase()+'-panel');
  const history=lawn?.querySelector('.recent-applications');
  if(!history||history.dataset.tfHistoryWrapped==='1')continue;
  history.dataset.tfHistoryWrapped='1';
  const panel=document.createElement('section');
  panel.className='tf-history-panel';
  panel.setAttribute('aria-label','Lawn '+key+' treatment history');
  const toggle=document.createElement('button');
  toggle.type='button';toggle.className='tf-history-toggle';
  toggle.setAttribute('aria-expanded','false');
  const content=document.createElement('div');
  content.className='tf-history-body';content.hidden=true;
  content.id='tf-history-'+key.toLowerCase()+'-content';
  toggle.setAttribute('aria-controls',content.id);
  toggle.innerHTML='<span>📋 Treatment History · Lawn '+key+'</span><span class="tf-history-chevron" aria-hidden="true">▸</span>';
  history.before(panel);panel.append(toggle,content);content.appendChild(history);
  toggle.addEventListener('click',()=>{
   const open=toggle.getAttribute('aria-expanded')!=='true';
   toggle.setAttribute('aria-expanded',String(open));
   content.hidden=!open;
   toggle.querySelector('.tf-history-chevron').textContent=open?'▾':'▸';
  });
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
window.addEventListener('load',install,{once:true});
setTimeout(install,900);
setTimeout(install,2500);
})();
