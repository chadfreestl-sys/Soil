/* Full-width mobile mowing editor: moves existing controls, never clones inputs. */
(()=>{'use strict';
const css=document.createElement('style');css.textContent=`
#tf-mowing-dialog{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:12px;background:rgba(10,25,19,.74)}
#tf-mowing-dialog.tf-open{display:flex}
#tf-mowing-dialog .tf-mowing-sheet{width:min(680px,100%);max-height:calc(100dvh - 24px);overflow:auto;overscroll-behavior:contain;background:#f2f7ef;color:#173d2d;border-radius:18px;padding:18px;box-shadow:0 18px 60px #0006}
#tf-mowing-dialog .tf-mowing-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:15px}
#tf-mowing-dialog .tf-mowing-head h2{color:#173d2d;margin:0;font-size:1.2rem}
#tf-mowing-dialog .tf-mowing-close{border:1px solid #b4cbbb;background:white;border-radius:12px;padding:10px 15px;color:#173d2d;font-size:1.3rem}
#tf-mowing-dialog .tf-mowing-content{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
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
 function open(trigger){lastFocus=trigger;content.replaceChildren();const candidates=[...document.querySelectorAll('button,summary,[role="button"]')].filter(el=>/mowing/i.test(el.textContent||'')&&!dialog.contains(el));let blocks=[];
 for(const el of candidates){const parent=el.closest('details,.tf-mowing-card,.tf-mini-panel,.tf-context-mini,.tf-compact-panel');if(parent&&parent!==el&&!blocks.includes(parent))blocks.push(parent);}
 // Use actual controls rather than text-only headers; preserve their listeners and state.
 for(const node of [...document.querySelectorAll('select,input')]){if(!/mow|blade|clipping|traffic/i.test(node.id||''))continue;let box=node.closest('label')||node.parentElement;if(box&&!blocks.some(b=>b.contains(box)))blocks.push(box);}
 blocks=blocks.filter(b=>!blocks.some(other=>other!==b&&other.contains(b))&&b!==dialog);
 for(const block of blocks){if(block.closest('#tf-mowing-dialog'))continue;const placeholder=document.createComment('mowing-return');block.parentNode?.insertBefore(placeholder,block);block.__tfReturn=placeholder;content.appendChild(block);if(block.tagName==='DETAILS')block.open=true;}
 if(!blocks.length){content.textContent='Mowing controls are still loading. Close and try again.';}
 dialog.classList.add('tf-open');document.body.style.overflow='hidden';dialog.querySelector('.tf-mowing-close').focus();
 }
 dialog.querySelector('.tf-mowing-close').addEventListener('click',()=>{for(const block of [...content.children]){const p=block.__tfReturn;if(p?.parentNode){p.replaceWith(block);delete block.__tfReturn;}}close();});
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.querySelector('.tf-mowing-close').click();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.classList.contains('tf-open'))dialog.querySelector('.tf-mowing-close').click();});
 document.addEventListener('click',e=>{const trigger=e.target.closest('button,summary,[role="button"]');if(!trigger||dialog.contains(trigger))return;if(!/^(?:✂️\s*)?Mowing(?:\s*closed by default)?$/i.test((trigger.textContent||'').trim().replace(/\s+/g,' ')))return;e.preventDefault();e.stopImmediatePropagation();open(trigger);},true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();