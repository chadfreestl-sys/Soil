/* Turfarium BASE88 reference browser: all original cross-sections available without
   claiming that untagged images represent the current modeled condition. */
(()=>{'use strict';
const count=88;
const url=n=>{const id='BASE'+String(n).padStart(2,'0');return 'assets/turfarium/'+id+'/'+id+'.webp'};
const css=document.createElement('style');css.textContent=`
.tf-base-open{display:block;margin:5px 0 8px;padding:7px 10px;border:1px solid #a7c5ae;border-radius:8px;background:#f5fbf5;color:#214b35;font:600 12px system-ui;cursor:pointer}
.tf-base-dialog{border:0;border-radius:14px;padding:12px;width:min(94vw,820px);max-height:90vh;background:#f5faf4;color:#183f2b;box-shadow:0 15px 55px #0007}
.tf-base-dialog::backdrop{background:#0a191bc9}
.tf-base-head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:9px;font:600 15px system-ui}
.tf-base-head button,.tf-base-controls button{padding:9px 13px;border:1px solid #a4b9a8;border-radius:8px;background:white;color:#193d29;font-weight:600}
.tf-base-dialog img{display:block;width:100%;height:auto;max-height:63vh;object-fit:contain;border-radius:8px;background:#e2e9df}
.tf-base-controls{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:9px}
.tf-base-note{font:12px/1.4 system-ui;margin-top:8px;color:#435d4b}
`;document.head.append(css);
const dlg=document.createElement('dialog');dlg.className='tf-base-dialog';dlg.innerHTML='<div class="tf-base-head"><span id="tf-base-title">Turfarium image library</span><button type="button" id="tf-base-close" aria-label="Close image library">Close ×</button></div><img id="tf-base-image" alt="Educational tall fescue soil cross-section"><div class="tf-base-controls"><button type="button" id="tf-base-prev">← Previous</button><span id="tf-base-count"></span><button type="button" id="tf-base-next">Next →</button></div><div class="tf-base-note">Reference image from the 88-image BASE library. Illustrative only: not a prediction of either lawn’s current condition. The live simulation photograph and metrics are unchanged.</div>';
document.body.append(dlg);
let current=1;const photo=dlg.querySelector('#tf-base-image'),label=dlg.querySelector('#tf-base-count');
function show(n){current=((n-1+count)%count)+1;photo.src=url(current);label.textContent=current+' / '+count;photo.alt='Turfarium BASE'+current+' educational cross-section'}
dlg.querySelector('#tf-base-close').onclick=()=>dlg.close();
dlg.querySelector('#tf-base-prev').onclick=()=>show(current-1);
dlg.querySelector('#tf-base-next').onclick=()=>show(current+1);
dlg.addEventListener('keydown',e=>{if(e.key==='ArrowRight')show(current+1);if(e.key==='ArrowLeft')show(current-1)});
function attach(){
 for(const key of ['A','B']){
  const stage=document.querySelector('.photo-stage[data-tf-lawn-key="'+key+'"]')||document.querySelector('#lawn-'+key.toLowerCase()+'-panel .photo-stage');
  if(!stage||!stage.parentElement)continue;
  const host=stage.parentElement;
  let btn=host.querySelector(':scope > .tf-base-open');
  if(!btn){btn=document.createElement('button');btn.type='button';btn.className='tf-base-open';btn.textContent='Explore 88 soil & turf images';btn.onclick=()=>{show(1);dlg.showModal()};stage.insertAdjacentElement('afterend',btn)}
 }
}
attach();addEventListener('load',attach);new MutationObserver(()=>{if(!dlg.open)attach()}).observe(document.body,{childList:true,subtree:true});
})();