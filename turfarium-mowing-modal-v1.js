/* Full-width mobile mowing editor: moves existing controls, never clones inputs. */
(()=>{'use strict';
const css=document.createElement('style');css.textContent=`
#tf-mowing-dialog{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:12px;background:rgba(10,25,19,.74)}
#tf-mowing-dialog.tf-open{display:flex}
#tf-mowing-dialog .tf-mowing-sheet{width:min(680px,100%);max-height:calc(100dvh - 24px);overflow:auto;overscroll-behavior:contain;background:#f2f7ef;color:#173d2d;border-radius:18px;padding:18px;box-shadow:0 18px 60px #0006}
#tf-mowing-dialog .tf-mowing-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:15px}
#tf-mowing-dialog .tf-mowing-head h2{color:#173d2d;margin:0;font-size:1.2rem}
#tf-mowing-dialog .tf-mowing-close{border:1px solid #b4cbbb;background:white;border-radius:12px;padding:10px 15px;color:#173d2d;font-size:1.3rem}
#tf-mowing-dialog .tf-mowing-content{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}\n#tf-mowing-dialog .tf-mowing-lawn-group{min-width:0}\n#tf-mowing-dialog .tf-mowing-lawn-heading{margin:0 0 8px;font-size:1.05rem;color:#173d2d}\n#tf-mowing-dialog .tf-mowing-lawn-group [class*=collapse-toggle]{display:none!important}
#tf-mowing-dialog .tf-mowing-content>div{min-width:0!important;width:100%!important;max-width:none!important;overflow:visible!important}
#tf-mowing-dialog label,#tf-mowing-dialog select,#tf-mowing-dialog input{max-width:100%!important;box-sizing:border-box}
#tf-mowing-dialog .tf-mowing-content select{width:100%!important}
#tf-mowing-dialog .tf-mowing-content .tf-mowing-section-title{font-size:1rem;font-weight:800;margin:0 0 8px}
@media(max-width:450px){#tf-mowing-dialog .tf-mowing-content{grid-template-columns:minmax(0,1fr)}}
`;document.head.appendChild(css);
function init(){
 let dialog=document.getElementById('tf-mowing-dialog');
 if(!dialog){dialog=document.createElement('div');dialog.id='tf-mowing-dialog';dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','Mowing management');dialog.innerHTML='<div class="tf-mowing-sheet"><div class="tf-mowing-head"><h2>🌾 Mowing Management</h2><button class="tf-mowing-close" type="button" aria-label="Close mowing settings">✕</button></div><div class="tf-mowing-content"></div></div>';document.body.appendChild(dialog);}
 const content=dialog.querySelector('.tf-mowing-content');let lastFocus=null;
 function close(){dialog.classList.remove('tf-open');document.body.style.overflow='';lastFocus?.focus?.();}
 function open(trigger){
   lastFocus=trigger;
   content.replaceChildren();
   // Select the two actual per-lawn mowing cards, not every node mentioning mowing.
   // Moving existing nodes retains their state and event handlers.
   const controls=[...document.querySelectorAll('select')].filter(el=>
     !dialog.contains(el)&&/mowing height/i.test(el.closest('div,section,fieldset')?.textContent||'')&&
     /in|inch/i.test(el.selectedOptions?.[0]?.textContent||'')
   );
   let cards=[];
   for(const select of controls){
     const card=select.closest('.tf-mowing-card,.tf-mini-panel,.tf-context-mini,.tf-compact-panel,details,fieldset')
       ||select.closest('section');
     if(card&&!cards.includes(card)&&!cards.some(x=>x.contains(card)))cards.push(card);
   }
   // Fallback for cards with non-inch option labels.
   if(!cards.length){
     const triggers=[...document.querySelectorAll('button,summary,[role="button"]')]
       .filter(el=>!dialog.contains(el)&&/mowing/i.test(el.textContent||''));
     for(const el of triggers){
       const card=el.closest('.tf-mowing-card,.tf-mini-panel,.tf-context-mini,.tf-compact-panel,details');
       if(card&&!cards.includes(card)&&!cards.some(x=>x.contains(card)))cards.push(card);
     }
   }
   cards=cards.filter(card=>!cards.some(other=>other!==card&&other.contains(card))).slice(0,2);
   cards.forEach((card,index)=>{
     const placeholder=document.createComment('mowing-return');
     card.parentNode?.insertBefore(placeholder,card);
     card.__tfReturn=placeholder;
     card.setAttribute('data-tf-mowing-return','1');
     const section=document.createElement('section');
     section.className='tf-mowing-lawn-group';
     const heading=document.createElement('h3');
     heading.className='tf-mowing-lawn-heading';
     heading.textContent='Lawn '+(index===0?'A':'B')+' · Mowing';
     section.append(heading,card);
     content.appendChild(section);
     if(card.tagName==='DETAILS')card.open=true;
   });
   if(!cards.length)content.textContent='Mowing controls are still loading. Close and try again.';
   dialog.classList.add('tf-open');
   document.body.style.overflow='hidden';
   dialog.querySelector('.tf-mowing-close').focus();
 }
 dialog.querySelector('.tf-mowing-close').addEventListener('click',()=>{for(const block of [...content.querySelectorAll('[data-tf-mowing-return]')]){const p=block.__tfReturn;if(p?.parentNode){p.replaceWith(block);delete block.__tfReturn;block.removeAttribute('data-tf-mowing-return');}}close();});
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.querySelector('.tf-mowing-close').click();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.classList.contains('tf-open'))dialog.querySelector('.tf-mowing-close').click();});
 document.addEventListener('click',e=>{const trigger=e.target.closest('button,summary,[role="button"]');if(!trigger||dialog.contains(trigger))return;if(!/^(?:✂️\s*)?Mowing(?:\s*closed by default)?$/i.test((trigger.textContent||'').trim().replace(/\s+/g,' ')))return;e.preventDefault();e.stopImmediatePropagation();open(trigger);},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();