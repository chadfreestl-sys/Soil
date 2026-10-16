/* Turfarium 24.0: independently collapsible application details and soil metrics */
(()=>{
'use strict';
function collapseBlock(lawn,block,label,key){
 if(!block||block.dataset.tfFolded)return;
 block.dataset.tfFolded='1';
 const wrap=document.createElement('div');
 wrap.className='tf-detail-fold';
 const btn=document.createElement('button');
 btn.type='button';btn.className='tf-detail-toggle';
 btn.setAttribute('aria-expanded','false');
 const id='tf-detail-'+key;
 btn.setAttribute('aria-controls',id);
 btn.innerHTML='<span>'+label+'</span><span aria-hidden="true" class="tf-detail-arrow">▸</span>';
 const body=document.createElement('div');body.className='tf-detail-body';body.id=id;body.hidden=true;
 block.before(wrap);wrap.append(btn,body);body.appendChild(block);
 btn.addEventListener('click',()=>{
   const open=btn.getAttribute('aria-expanded')!=='true';
   btn.setAttribute('aria-expanded',String(open));
   body.hidden=!open;
   btn.querySelector('.tf-detail-arrow').textContent=open?'▾':'▸';
 });
}
function install(){
 for(const key of ['A','B']){
  const lawn=document.getElementById('lawn-'+key.toLowerCase()+'-panel');
  if(!lawn)continue;
  const metrics=lawn.querySelector('#metric'+key);
  collapseBlock(lawn,metrics,'Soil Metrics · Lawn '+key,'metrics-'+key.toLowerCase());
  const rate=lawn.querySelector('#rateInfo'+key);
  if(rate){
    // Only collapse the parent rate form if it contains the rate controls,
    // never the entire lawn or the apply button.
    const candidate=rate.parentElement;
    if(candidate&&candidate!==lawn&&candidate.querySelectorAll('input,select').length>=2){
      collapseBlock(lawn,candidate,'Application Rate & Settings · Lawn '+key,'rates-'+key.toLowerCase());
    }
  }
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
window.addEventListener('load',install,{once:true});setTimeout(install,800);setTimeout(install,2200);
})();
