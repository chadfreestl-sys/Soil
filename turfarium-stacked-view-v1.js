/* Mobile visual-first lawn stack. One simulation clock, mirrored controls. */
(()=>{'use strict';
const css=document.createElement('style');css.textContent=`
@media(max-width:700px){
 #tf-stacked-lawns{display:block!important;order:-2000!important;width:100%!important;grid-column:1/-1!important;margin:4px 0 12px!important}\n #tf-stacked-lawns .tf-lawn-visual .tf-history-replay{display:none!important}\n #tf-stacked-lawns #tf-stacked-replay .tf-history-replay{display:flex!important}\n .simulation-grid.tf-primary-workspace>#profile-control-deck{order:-1999!important}\n .simulation-grid.tf-primary-workspace>#tf-playback-strip{order:-1998!important}\n #tf-stacked-lawns .tf-lawn-visual:first-child{margin-top:0!important}\n #tf-mobile-intro{display:block;padding:8px 13px;margin:0 0 7px;border:1px solid #cad9c9;border-radius:12px;background:#f3f8ef;color:#204332;font-size:.84rem;line-height:1.35}\n #tf-mobile-intro p{margin:0}\n #tf-mobile-intro details{margin-top:4px}\n #tf-mobile-intro summary{cursor:pointer;font-weight:800;color:#20523b}\n #tf-mobile-intro details p{margin-top:5px}\n main .tf-homeowner-original-intro{display:none!important}
 #tf-stacked-lawns .tf-lawn-visual{margin:0 0 3px;padding:9px;background:#f4f8f2;border:1px solid #c5d8c7;border-radius:13px;min-width:0}
 #tf-stacked-lawns .tf-lawn-title{display:flex;justify-content:space-between;color:#173e2d;font-weight:800;font-size:1rem;margin-bottom:6px}
 #tf-stacked-lawns .photo-stage{display:block!important;position:relative!important;width:100%!important;aspect-ratio:5/3!important;min-height:0!important;height:auto!important;margin:0!important;overflow:hidden!important}
 #tf-stacked-lawns .photo-stage img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}
 #tf-stacked-lawns .photo-stage canvas{position:absolute!important;inset:0!important;width:100%!important;height:100%!important}
 #tf-stacked-lawns .tf-lawn-time{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;margin-top:8px}
 #tf-stacked-lawns .tf-lawn-time button{min-width:0!important;min-height:42px!important;padding:7px 2px!important;font-size:.78rem!important;font-weight:750;color:#173e2d;background:#fff;border:1px solid #b5cbb8;border-radius:9px}
 #tf-stacked-lawns #tf-playback-strip{display:block!important;margin:3px 0 7px!important;padding:7px!important;width:100%!important;box-sizing:border-box!important}\n #tf-stacked-lawns #tf-playback-strip .tf-strip-time{display:flex!important}\n main .tf-homeowner-original-intro{display:none!important}\n #tf-stacked-lawns .tf-lawn-visual .tf-lawn-time{display:none!important}\n #tf-stacked-lawns .tf-lawn-visual{display:block!important}\n #tf-stacked-lawns .tf-lawn-visual .photo-stage{display:block!important}\n #tf-stacked-lawns .tf-lawn-visual .tf-history-replay-local{display:none!important}\n #tf-stacked-lawns .tf-lawn-visual .photo-stage~.tf-history-replay{display:none!important}\n #tf-stacked-lawns #tf-stacked-quick-progress{display:grid!important}\n #tf-stacked-replay{display:flex!important;align-items:center;flex-wrap:wrap;gap:7px;margin:3px 0 9px;padding:8px;border:1px solid #c5d8c7;border-radius:11px;background:#f4f8f2}\n #tf-stacked-replay .tf-replay-bar{display:flex!important;flex-wrap:wrap!important;align-items:center!important;gap:7px;width:100%!important}\n #tf-stacked-replay button{min-height:38px!important}\n #tf-stacked-replay input[type=range]{max-width:45vw!important}\n #tf-playback-strip .tf-strip-replay{display:none!important}\n #tf-stacked-replay .tf-history-replay{display:flex!important;margin:0!important;border:0!important;padding:0!important}\n #tf-stacked-replay .tf-replay-note{width:100%}\n.tf-homeowner-duplicate-hidden{display:none!important}
 #lawn-a-panel,#lawn-b-panel{width:100%!important;max-width:100%!important;min-width:0!important}
 #lawn-a-panel>.photo-stage,#lawn-b-panel>.photo-stage{display:none!important}\n #lawn-a-panel>.tf-history-replay-local,#lawn-b-panel>.tf-history-replay-local{display:none!important}
 #lawn-a-panel .tf-paired-toggle,#lawn-b-panel .tf-paired-toggle{display:none!important}
 #lawn-a-panel.tf-paired-compact,#lawn-b-panel.tf-paired-compact{display:block!important}
}
@media(min-width:701px){#tf-stacked-lawns{display:none!important}}
`;document.head.appendChild(css);
function mount(){
 const grid=document.querySelector('.simulation-grid.tf-primary-workspace')||document.querySelector('.simulation-grid');
 const strip=document.getElementById('tf-playback-strip');
 const a=document.querySelector('#lawn-a-panel .photo-stage'),b=document.querySelector('#lawn-b-panel .photo-stage');
 if(!grid||!a||!b)return false;
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
     const original=[...(document.getElementById('tf-playback-strip')?.querySelectorAll('.tf-strip-time button')||[])].find(x=>(x.textContent||'').replace(/\s/g,'').includes(label.replace(/\s/g,'')));
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
 // Remove duplicate local replay mirrors; retain one shared historical replay control.
 document.querySelectorAll('.tf-history-replay-local').forEach(el=>el.remove());
 view.style.order='';
 // Place the real, shared progression controls between the two images. 
 const first=view.querySelector('.tf-lawn-visual'); 
 if(strip&&strip.parentElement!==view){view.appendChild(strip);} 
 // The playback module may re-parent the toolbar later; keep a local, stable mirror. 
 let quick=document.getElementById('tf-stacked-quick-progress');
 if(!quick){
  quick=document.createElement('div');quick.id='tf-stacked-quick-progress';quick.className='tf-lawn-time';
  quick.style.cssText='display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;margin:5px 0 2px';
  for(const label of ['+7 days','+30 days','+90 days','+1 year']){
   const button=document.createElement('button');button.type='button';button.textContent=label;
   button.addEventListener('click',()=>{
    const all=[...document.querySelectorAll('#tf-playback-strip .tf-strip-time button')];
    const target=all.find(x=>x.textContent.trim().replace(/\\s+/g,'').includes(label.replace(/\\s+/g,'')));
    if(target)target.click();
   });quick.appendChild(button);
  }
  view.appendChild(quick);
 }
 // Keep the live replay controls directly beneath the local progression buttons.
 let replayHost=document.getElementById('tf-stacked-replay');
 if(!replayHost){replayHost=document.createElement('div');replayHost.id='tf-stacked-replay';replayHost.setAttribute('aria-label','Replay controls');quick.insertAdjacentElement('afterend',replayHost);}
 const liveReplay=document.querySelector('#tf-playback-strip > .tf-history-replay')||document.querySelector('#tf-playback-strip .tf-strip-replay .tf-replay-bar')||document.querySelector('.tf-replay-bar');
 if(liveReplay&&liveReplay.parentElement!==replayHost)replayHost.appendChild(liveReplay);
 // Keep the canonical playback strip in its original workflow to avoid reparenting conflicts.
 if(strip&&strip.parentElement===view)grid.insertBefore(strip,document.getElementById('lawn-a-panel'));
 // Collapse only the duplicated full-size Homeowner introduction, not scientific modules.
 for(const el of document.querySelectorAll('main section,main article,main .card')){
   if(el===view||el.contains(view)||el.id==='tf-mobile-intro')continue;
   const heading=el.querySelector('h1,h2,h3');
   if(heading&&/See what your lawn is telling you/i.test(heading.textContent||''))el.classList.add('tf-homeowner-duplicate-hidden');
 }
 // The replay module may finish initializing after this script; mount its real bar once available.
 if(!liveReplay){let attempts=0;const retry=setInterval(()=>{const bar=document.querySelector('#tf-playback-strip > .tf-history-replay')||document.querySelector('.tf-replay-bar');if(bar){replayHost.appendChild(bar);clearInterval(retry);}else if(++attempts>25)clearInterval(retry);},400);}


 // Position the two images consecutively; shared progression and replay follow both.
 const cards=[...view.querySelectorAll(':scope > .tf-lawn-visual')];
 if(cards.length===2){view.insertBefore(cards[0],view.firstElementChild);cards[0].insertAdjacentElement('afterend',cards[1]);}
 if(quick&&cards[1]&&quick.previousElementSibling!==cards[1])cards[1].insertAdjacentElement('afterend',quick);
 if(replayHost&&quick&&replayHost.previousElementSibling!==quick)quick.insertAdjacentElement('afterend',replayHost);
 const sync=()=>{for(const k of ['A','B']){const src=document.getElementById('day'+k),dst=document.getElementById('tf-stack-day-'+k);if(src&&dst)dst.textContent=src.textContent;}};
 sync();setInterval(sync,1300);
 return true;
}
function start(){if(mount())return;let n=0;const timer=setInterval(()=>{if(mount()||++n>30)clearInterval(timer)},350);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();