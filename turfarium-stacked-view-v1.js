/* Mobile visual-first lawn stack. One simulation clock, mirrored controls. */
(()=>{'use strict';
const css=document.createElement('style');css.textContent=`
@media(max-width:700px){
 #tf-stacked-lawns{display:block!important;order:-2000!important;width:100%!important;grid-column:1/-1!important;margin:4px 0 12px!important}\n .simulation-grid.tf-primary-workspace>#profile-control-deck{order:-1999!important}\n .simulation-grid.tf-primary-workspace>#tf-playback-strip{order:-1998!important}\n #tf-stacked-lawns .tf-lawn-visual:first-child{margin-top:0!important}\n #tf-mobile-intro{display:block;padding:8px 13px;margin:0 0 7px;border:1px solid #cad9c9;border-radius:12px;background:#f3f8ef;color:#204332;font-size:.84rem;line-height:1.35}\n #tf-mobile-intro p{margin:0}\n #tf-mobile-intro details{margin-top:4px}\n #tf-mobile-intro summary{cursor:pointer;font-weight:800;color:#20523b}\n #tf-mobile-intro details p{margin-top:5px}\n main .tf-homeowner-original-intro{display:none!important}
 #tf-stacked-lawns .tf-lawn-visual{margin:0 0 3px;padding:9px;background:#f4f8f2;border:1px solid #c5d8c7;border-radius:13px;min-width:0}
 #tf-stacked-lawns .tf-lawn-title{display:flex;justify-content:space-between;color:#173e2d;font-weight:800;font-size:1rem;margin-bottom:6px}
 #tf-stacked-lawns .photo-stage{display:block!important;position:relative!important;width:100%!important;aspect-ratio:5/3!important;min-height:0!important;height:auto!important;margin:0!important;overflow:hidden!important}
 #tf-stacked-lawns .photo-stage img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}
 #tf-stacked-lawns .photo-stage canvas{position:absolute!important;inset:0!important;width:100%!important;height:100%!important}
 #tf-stacked-lawns .tf-lawn-time{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;margin-top:8px}
 #tf-stacked-lawns .tf-lawn-time button{min-width:0!important;min-height:42px!important;padding:7px 2px!important;font-size:.78rem!important;font-weight:750;color:#173e2d;background:#fff;border:1px solid #b5cbb8;border-radius:9px}
 #tf-stacked-lawns #tf-playback-strip{display:block!important;margin:8px 0!important;padding:8px!important;width:100%!important;box-sizing:border-box!important}\n #tf-stacked-lawns #tf-playback-strip .tf-strip-time{display:flex!important}\n #tf-stacked-lawns .tf-lawn-time{display:none!important}
 #lawn-a-panel,#lawn-b-panel{width:100%!important;max-width:100%!important;min-width:0!important}
 #lawn-a-panel>.photo-stage,#lawn-b-panel>.photo-stage{display:none!important}
 #lawn-a-panel .tf-paired-toggle,#lawn-b-panel .tf-paired-toggle{display:none!important}
 #lawn-a-panel.tf-paired-compact,#lawn-b-panel.tf-paired-compact{display:block!important}
}
@media(min-width:701px){#tf-stacked-lawns{display:none!important}}
`;document.head.appendChild(css);
function mount(){
 const grid=document.querySelector('.simulation-grid.tf-primary-workspace')||document.querySelector('.simulation-grid');
 const strip=document.getElementById('tf-playback-strip');
 const a=document.querySelector('#lawn-a-panel .photo-stage'),b=document.querySelector('#lawn-b-panel .photo-stage');
 if(!grid||!strip||!a||!b)return false;
 let view=document.getElementById('tf-stacked-lawns');
 if(!view){
  view=document.createElement('section');view.id='tf-stacked-lawns';view.setAttribute('aria-label','Large stacked lawn images and progression');
  for(const [key,stage] of [['A',a],['B',b]]){
   const card=document.createElement('div');card.className='tf-lawn-visual';
   const title=document.createElement('div');title.className='tf-lawn-title';
   title.innerHTML='<span>Lawn '+key+'</span><span id="tf-stack-day-'+key+'">Day 0</span>';
   const controls=document.createElement('div');controls.className='tf-lawn-time';
   for(const [label,days] of [['+7 days',7],['+30 days',30],['+90 days',90],['+1 year',365]]){
    const btn=document.createElement('button');btn.type='button';btn.textContent=label;
    btn.addEventListener('click',()=>{
     const original=[...strip.querySelectorAll('.tf-strip-time button')].find(x=>(x.textContent||'').replace(/\s/g,'').includes(label.replace(/\s/g,'')));
     if(original)original.click();else{const fallback=[...document.querySelectorAll('#timeline-workflow button')].find(x=>(x.textContent||'').replace(/\s/g,'').includes(label.replace(/\s/g,'')));fallback?.click();}
    });
    controls.appendChild(btn);
   }
   card.append(title,stage,controls);view.appendChild(card);
  }
 }
 // Visual-first mobile: lawn A begins in the first viewport, B directly after.
 const intro=document.querySelector('main header');
 if(intro&&intro.parentElement){
   if(view.previousElementSibling!==intro&&view.previousElementSibling?.id!=='tf-mobile-intro')intro.insertAdjacentElement('afterend',view);
 }else if(view.parentElement!==grid){grid.insertBefore(view,grid.firstElementChild);}
 let compact=document.getElementById('tf-mobile-intro');
 if(!compact){compact=document.createElement('section');compact.id='tf-mobile-intro';compact.innerHTML='<p><strong>Explore your living lawn.</strong> Compare turf, roots and soil as weather, mowing and treatments change over time.</p><details><summary>How Turfarium works</summary><p>Start with two comparable lawns, apply different management choices, then advance time to explore modeled responses. Results are educational scenarios, not field-tested predictions.</p></details>';}
 if(view.parentElement&&view.previousElementSibling!==compact)view.parentElement.insertBefore(compact,view);
 view.style.order='';
 // Place the real, shared progression controls between the two images. 
 const first=view.querySelector('.tf-lawn-visual'); 
 if(strip.parentElement!==view){view.appendChild(strip);} 
 const sync=()=>{for(const k of ['A','B']){const src=document.getElementById('day'+k),dst=document.getElementById('tf-stack-day-'+k);if(src&&dst)dst.textContent=src.textContent;}};
 sync();setInterval(sync,1300);
 return true;
}
function start(){if(mount())return;let n=0;const timer=setInterval(()=>{if(mount()||++n>30)clearInterval(timer)},350);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();