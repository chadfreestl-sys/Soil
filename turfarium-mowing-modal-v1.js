/* Focused mowing editor: one lawn at a time; never move Weather or whole panel rows. */
(()=>{'use strict';
const css=document.createElement('style');
css.textContent=`
#tf-mowing-dialog{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:12px;background:rgba(10,25,19,.74)}
#tf-mowing-dialog.tf-open{display:flex}
#tf-mowing-dialog .tf-mowing-sheet{width:min(560px,100%);max-height:calc(100dvh - 24px);overflow:auto;overscroll-behavior:contain;background:#f2f7ef;color:#173d2d;border-radius:18px;padding:16px;box-shadow:0 18px 60px #0006}
#tf-mowing-dialog .tf-mowing-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}
#tf-mowing-dialog h2{font-size:1.2rem;margin:0}
#tf-mowing-dialog .tf-mowing-close{border:1px solid #b4cbbb;background:white;border-radius:12px;padding:8px 13px;color:#173d2d;font-size:1.3rem}
#tf-mowing-dialog .tf-mowing-tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
#tf-mowing-dialog .tf-mowing-tabs button{padding:11px 6px;border:1px solid #b4cbbb;border-radius:10px;background:#fff;color:#173d2d;font-weight:800}
#tf-mowing-dialog .tf-mowing-tabs button[aria-selected=true]{background:#246747;color:white}
#tf-mowing-dialog .tf-mowing-content{display:block!important;min-width:0}
#tf-mowing-dialog .tf-mowing-content>*,#tf-mowing-dialog select{width:100%!important;max-width:100%!important;box-sizing:border-box}
#tf-mowing-dialog .tf-mowing-content [class*=collapse-toggle]{display:none!important}
#tf-mowing-dialog .tf-mowing-content label{display:block;margin-top:9px}
#tf-mowing-dialog .tf-mowing-content .tf-mowing-card{min-width:0!important}
#tf-mowing-dialog .tf-mowing-help{font-size:.82rem;line-height:1.4;margin:0 0 8px;color:#416451}
`;
document.head.appendChild(css);
function init(){
 let dialog=document.getElementById('tf-mowing-dialog');
 if(!dialog){
  dialog=document.createElement('div');dialog.id='tf-mowing-dialog';
  dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Mowing management');
  dialog.innerHTML='<div class="tf-mowing-sheet"><div class="tf-mowing-head"><h2>✂️ Mowing Management</h2><button class="tf-mowing-close" type="button" aria-label="Close mowing settings">✕</button></div><div class="tf-mowing-tabs" role="tablist"><button type="button" data-lawn="A" role="tab">Lawn A</button><button type="button" data-lawn="B" role="tab">Lawn B</button></div><p class="tf-mowing-help">Edit one lawn at a time. Changes are retained when you switch lawns.</p><div class="tf-mowing-content"></div></div>';
  document.body.appendChild(dialog);
 }
 const content=dialog.querySelector('.tf-mowing-content');
 let lastFocus=null,active=null,slots={};
 const isMow=el=>/mowing/i.test((el.textContent||'').replace(/\s+/g,' '))&&el.matches('button,summary,[role="button"]');
 function locate(lawn){
   const panel=document.getElementById('lawn-'+lawn.toLowerCase()+'-panel');
   if(!panel)return null;
   const trigger=[...panel.querySelectorAll('button,summary,[role="button"]')].find(isMow);
   if(!trigger)return null;
   // The mowing tile shares a row with Weather. Move only the tile, never the row.
   let tile=trigger.closest('details,.tf-mowing-card,.tf-mini-panel,.tf-context-mini,.tf-compact-panel');
   if(!tile){
     tile=trigger;
     for(let i=0;i<3&&tile.parentElement;i++){
       const parent=tile.parentElement;
       if(parent.querySelectorAll('button,summary,[role="button"]').length>1)break;
       tile=parent;
       if(tile.querySelector('select'))break;
     }
   }
   return tile;
 }
 function restore(){
   const old=content.firstElementChild;
   if(old&&old.__tfReturn?.parentNode){
     old.__tfReturn.replaceWith(old);
     delete old.__tfReturn;
   }
   content.replaceChildren();
 }
 function show(lawn){
   restore();active=lawn;
   const tile=locate(lawn);
   dialog.querySelectorAll('[data-lawn]').forEach(btn=>btn.setAttribute('aria-selected',String(btn.dataset.lawn===lawn)));
   if(!tile){content.textContent='Mowing controls for Lawn '+lawn+' are unavailable.';return;}
   const placeholder=document.createComment('mowing-return-'+lawn);
   tile.parentNode.insertBefore(placeholder,tile);
   tile.__tfReturn=placeholder;
   content.appendChild(tile);
   if(tile.tagName==='DETAILS')tile.open=true;
 }
 function close(){
   restore();dialog.classList.remove('tf-open');document.body.style.overflow='';
   lastFocus?.focus?.();
 }
 function open(trigger){
   lastFocus=trigger;
   const panel=trigger.closest('#lawn-a-panel,#lawn-b-panel');
   const lawn=panel?.id==='lawn-b-panel'?'B':'A';
   dialog.classList.add('tf-open');document.body.style.overflow='hidden';
   show(lawn);dialog.querySelector('.tf-mowing-close').focus();
 }
 dialog.querySelector('.tf-mowing-close').addEventListener('click',close);
 dialog.querySelectorAll('[data-lawn]').forEach(btn=>btn.addEventListener('click',()=>show(btn.dataset.lawn)));
 dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.classList.contains('tf-open'))close();});
 document.addEventListener('click',e=>{
   const trigger=e.target.closest('button,summary,[role="button"]');
   if(!trigger||dialog.contains(trigger))return;
   if(!trigger.closest('#lawn-a-panel,#lawn-b-panel'))return;
   if(!/^(?:✂️\s*)?Mowing(?:\s*closed by default)?$/i.test((trigger.textContent||'').trim().replace(/\s+/g,' ')))return;
   e.preventDefault();e.stopImmediatePropagation();open(trigger);
 },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();