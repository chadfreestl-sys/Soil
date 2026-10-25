/* Turfarium mobile visual comparison v26: single stacked photo viewer. */
(()=>{'use strict';
const style=document.createElement('style');
style.textContent=`
#tf-mobile-pair{display:none}
@media(max-width:700px){
 #tf-mobile-pair{display:block!important;width:100%!important;box-sizing:border-box!important;margin:8px 0 12px!important;padding:8px!important;background:#f5f8f2;border:1px solid #cad9cb;border-radius:12px}
 #tf-mobile-pair .tf-pair-grid{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:12px!important}
 #tf-mobile-pair .tf-pair-cell{min-width:0!important;width:100%!important}
 #tf-mobile-pair .tf-pair-label{display:flex;justify-content:space-between;align-items:center;font-size:1rem;font-weight:800;color:#173d2d;margin:0 0 5px}
 #tf-mobile-pair .tf-pair-label span{font-size:.82rem;font-weight:650}
 #tf-mobile-pair .tf-pair-photo{width:100%;aspect-ratio:21/9;overflow:hidden;border-radius:10px;background:#d6e2d5}
 #tf-mobile-pair img{display:block;width:100%;height:100%;object-fit:cover}
 #lawn-a-panel .photo-stage,#lawn-b-panel .photo-stage{display:none!important}
 #lawn-a-panel .tf-replay-bar,#lawn-b-panel .tf-replay-bar{display:none!important}
 .tf-primary-workspace{display:block!important}
 .tf-primary-workspace>#lawn-a-panel,.tf-primary-workspace>#lawn-b-panel{width:100%!important;margin:5px 0!important}
 .tf-primary-workspace>#lawn-a-panel.tf-paired-compact,.tf-primary-workspace>#lawn-b-panel.tf-paired-compact{display:none!important}
 .tf-primary-workspace>#lawn-a-panel.tf-paired-expanded,.tf-primary-workspace>#lawn-b-panel.tf-paired-expanded{display:block!important}
 #tf-playback-strip #canopyTimeline.tf-compact #canopyTimelineValues{display:none!important}
 #tf-playback-strip .tf-canopy-summary{color:#234936!important}
}`;
document.head.appendChild(style);
function mount(){
 const a=document.querySelector('#lawn-a-panel .photo-stage img');
 const b=document.querySelector('#lawn-b-panel .photo-stage img');
 const grid=document.querySelector('.simulation-grid');
 if(!a||!b||!grid)return;
 let dock=document.getElementById('tf-mobile-pair');
 if(!dock){
  dock=document.createElement('section');dock.id='tf-mobile-pair';
  dock.setAttribute('aria-label','Lawn A and Lawn B stacked visual comparison');
  dock.innerHTML='<div class="tf-pair-grid"><div class="tf-pair-cell"><div class="tf-pair-label">Lawn A <span id="tf-pair-day-a">Day 0</span></div><div class="tf-pair-photo"><img id="tf-pair-image-a" alt="Lawn A current turf and soil"></div></div><div class="tf-pair-cell"><div class="tf-pair-label">Lawn B <span id="tf-pair-day-b">Day 0</span></div><div class="tf-pair-photo"><img id="tf-pair-image-b" alt="Lawn B current turf and soil"></div></div></div>';
 }
 const anchor=document.getElementById('tf-playback-strip')||document.getElementById('canopyTimeline');
 if(anchor){anchor.insertAdjacentElement('afterend',dock);}
 else{grid.parentElement.insertBefore(dock,grid);}
 const sync=()=>{
  for(const [key,source] of [['a',a],['b',b]]){
   const target=document.getElementById('tf-pair-image-'+key);
   if(!target)continue;
   const src=source.currentSrc||source.src;
   if(target.src!==src)target.src=src;
   target.style.filter=getComputedStyle(source).filter;
   target.style.opacity=getComputedStyle(source).opacity;
   const day=document.getElementById('day'+key.toUpperCase());
   const label=document.getElementById('tf-pair-day-'+key);
   if(day&&label)label.textContent=day.textContent;
  }
 };
 const observer=new MutationObserver(sync);
 for(const el of [a,b,document.getElementById('dayA'),document.getElementById('dayB')]){
  if(el)observer.observe(el,{attributes:true,childList:true,characterData:true,subtree:true});
 }
 sync();
 window.addEventListener('load',sync,{once:true});
 setInterval(sync,1500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();