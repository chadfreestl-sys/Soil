/* Mobile-only organized research drawers. Move original nodes, never clone inputs. */
(()=>{'use strict';
const css=document.createElement('style');
css.textContent=`@media(max-width:700px){
#tf-root-physics-disclosure>summary{list-style:none!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;min-height:52px!important;padding:13px 15px!important;border:1px solid #d4dfd3!important;border-radius:12px!important;background:#f4f3e9!important;color:#194532!important;font-weight:850!important;cursor:pointer!important}
#tf-root-physics-disclosure>summary::-webkit-details-marker{display:none}
#tf-root-physics-disclosure>summary::after{content:'▸';flex:none}
#tf-root-physics-disclosure[open]>summary::after{content:'▾'}
#tf-root-physics-disclosure:not([open])>.tf-root-physics-body{display:none!important}
.tf-root-physics-body{padding:13px 3px 3px!important}

#microscope-lab{grid-column:1/-1!important;width:100%!important;max-width:100%!important;margin:12px 0 20px!important}
#microscope-lab .head{align-items:flex-start!important}
#microscope-lab{padding:9px!important}
#tf-microscope-disclosure{display:block!important;width:100%!important}
#tf-microscope-disclosure>summary{list-style:none!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important;min-height:52px!important;padding:13px 15px!important;border:1px solid #c8dacd!important;border-radius:12px!important;background:#eaf3e9!important;color:#194532!important;font-size:17px!important;font-weight:850!important;cursor:pointer!important}
#tf-microscope-disclosure>summary::-webkit-details-marker{display:none}
#tf-microscope-disclosure>summary::after{content:'▸';font-size:17px!important}
#tf-microscope-disclosure[open]>summary::after{content:'▾'}
#tf-microscope-disclosure:not([open])>.tf-microscope-disclosure-body{display:none!important}
.tf-microscope-disclosure-body{min-width:0!important;padding:12px 3px 3px!important}

.tf-research-drawer{grid-column:1/-1!important;display:block!important;width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;margin:0 0 10px!important;padding:8px!important;border:1px solid #cad9ca!important;border-radius:16px!important;background:#f8faf5!important;box-shadow:0 3px 12px #173c2510!important}
.tf-research-drawer>summary{display:grid!important;grid-template-columns:28px minmax(0,1fr) 28px!important;align-items:center!important;gap:8px!important;cursor:pointer!important;list-style:none!important;padding:13px 12px!important;margin:0!important;background:#eaf3e9!important;border-radius:11px!important;font-size:16px!important;font-weight:800!important;line-height:1.3!important;color:#194532!important}
.tf-research-drawer>summary::-webkit-details-marker{display:none}
.tf-research-drawer>summary:after{content:'▸';font-size:16px;grid-column:3;justify-self:center}
.tf-research-drawer[open]>summary:after{content:'▾'}
.tf-research-drawer>summary .tf-drawer-icon{grid-column:1;justify-self:center}
.tf-research-drawer>summary .tf-drawer-label{grid-column:2;text-align:center;min-width:0}
.tf-research-body{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:9px!important;padding-top:10px!important;min-width:0!important}
.tf-research-body>*{width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;margin:0!important;grid-column:1/-1!important}
.tf-research-body .card,.tf-research-body details{border-radius:12px!important}
.tf-research-body h2,.tf-research-body h3,.tf-research-body summary{font-size:clamp(14px,3.7vw,17px)!important;line-height:1.35!important}
.tf-research-drawer:not([open])>.tf-research-body{display:none!important}
/* Consistent readable headings, full-width long labels, and no orphan half-cards. */
.tf-research-body{grid-template-columns:minmax(0,1fr)!important}
.tf-research-body>section.card,.tf-research-body>article.card{grid-column:1/-1!important}
.tf-research-body .tf-collapse-toggle,.tf-research-body summary{font-size:15px!important;line-height:1.35!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important}
#tf-science-card-grid{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:12px!important;grid-column:1/-1!important;width:100%!important;min-width:0!important}
#tf-science-card-grid>section.card,#tf-science-card-grid>article.card{width:100%!important;max-width:100%!important;min-width:0!important;grid-column:1/-1!important;margin:0!important}
#tf-science-card-grid .tf-collapse-toggle,#tf-science-card-grid summary{font-size:15px!important;line-height:1.35!important;white-space:normal!important;overflow:visible!important;text-overflow:clip!important}

/* Refined mobile research hub: consistent rhythm, color, and touch targets. */
#tf-research-organizer{gap:10px!important;margin:16px 0 0!important;padding:14px!important;border:1px solid #c4d9cf!important;border-radius:22px!important;background:linear-gradient(165deg,#f7faf5,#e9f2ec)!important;box-shadow:0 10px 28px #173e2c12!important}
.tf-research-drawer{margin:0!important;padding:5px!important;border:1px solid #c7d9d0!important;border-radius:16px!important;background:#fffefa!important;box-shadow:0 2px 8px #123b2b0b!important;overflow:hidden!important}
.tf-research-drawer>summary{min-height:66px!important;border-radius:12px!important;padding:14px 12px!important;font-size:15px!important;letter-spacing:.01em!important;color:#fff!important;box-shadow:inset 0 1px #ffffff30!important}
#tf-research-records>summary{background:linear-gradient(110deg,#254f6d,#1e415c)!important}
#tf-research-ecology>summary{background:linear-gradient(110deg,#08785f,#075944)!important}
#tf-research-experiments>summary{background:linear-gradient(110deg,#aa5a2e,#88451f)!important}
.tf-research-drawer>summary .tf-drawer-label{font-size:15px!important;font-weight:850!important;line-height:1.3!important}
.tf-research-drawer>summary .tf-drawer-icon{font-size:21px!important}
.tf-research-drawer>summary:focus-visible{outline:3px solid #e4c778!important;outline-offset:-4px!important}
.tf-research-body{padding:10px 4px 4px!important;gap:9px!important}
.tf-research-body>section.card,.tf-research-body>article.card{border-radius:13px!important;padding:8px!important;background:#f8faf7!important;box-shadow:none!important}
.tf-research-body .tf-collapse-toggle,.tf-research-body summary{min-height:52px!important;font-size:15px!important;font-weight:750!important;white-space:normal!important;text-overflow:clip!important}
#tf-science-card-grid{display:contents!important}

}`;
document.head.appendChild(css);
const groups=[
 {id:'records',title:'📋 Records & diagnostics',terms:[]},
 {id:'ecology',title:'🌱 Ecosystem research',terms:['Turf Species Response','Earthworm Ecology Module','Linked soil food web','Seaweed Response Lab']},
 {id:'experiments',title:'🧪 Experiment tools',terms:['Custom product formulation studio','Worm Tea Brewing Lab','Soil lab & nutrient cycling','Experiment activity']}
];
function findCard(term){
 const query=term.toLowerCase();
 // The legacy accordion wrapper uses BUTTON headings and nested .tf-collapse-body.
 // Find the visible control first, then take its complete original card.
 const headings=document.querySelectorAll(
   'section.card .tf-collapse-toggle,article.card .tf-collapse-toggle,'+
   'section.card h2,article.card h2,section.card h3,article.card h3,'+
   'section.card > details > summary,article.card > details > summary'
 );
 for(const heading of headings){
   if(!heading.textContent.trim().toLowerCase().includes(query))continue;
   const card=heading.closest('section.card,article.card');
   if(card && !card.closest('#tf-research-organizer,#tf-stacked-lawns,#tf-mowing-dialog'))return card;
 }
 return null;
}
function organize(){
 if(!matchMedia('(max-width:700px)').matches)return;
 let host=document.getElementById('tf-research-organizer');
 if(!host){host=document.createElement('section');host.id='tf-research-organizer';host.style.cssText='width:100%;min-width:0;grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr);gap:8px';}
 const collected=groups.map(group=>({...group,nodes:group.terms.map(findCard).filter(Boolean)}));
 // Keep the three category drawers visible even when modules mount late.
 // Put advanced research navigation at the very bottom of the mobile page.
 // Never insert before a moving source card; that can trigger scroll jumps.
 const main=document.querySelector('main')||document.body;
 if(host.parentElement!==main)main.appendChild(host);
 for(const group of collected){
   let drawer=document.getElementById('tf-research-'+group.id);
   if(!drawer){
     drawer=document.createElement('details');drawer.className='tf-research-drawer';drawer.id='tf-research-'+group.id;
     const summary=document.createElement('summary');
     const icon=document.createElement('span');icon.className='tf-drawer-icon';icon.setAttribute('aria-hidden','true');
     const label=document.createElement('span');label.className='tf-drawer-label';
     const match=group.title.match(/^(\S+)\s+(.+)$/);
     icon.textContent=match?match[1]:'';
     label.textContent=match?match[2]:group.title;
     summary.append(icon,label);
     const body=document.createElement('div');body.className='tf-research-body';
     drawer.append(summary,body);host.appendChild(drawer);
   }
   const body=drawer.querySelector('.tf-research-body');
   for(const node of group.nodes)if(node.parentElement!==body)body.appendChild(node);
   drawer.hidden=body.children.length===0;
 }
  // Root-zone physics starts closed on mobile; keep the original live readouts mounted.
  const physics=document.getElementById('physicsPanel')?.closest('section.card');
  if(physics && !physics.querySelector(':scope > #tf-root-physics-disclosure')){
    const heading=physics.querySelector(':scope > h2');
    const disclosure=document.createElement('details');
    disclosure.id='tf-root-physics-disclosure';
    const summary=document.createElement('summary');
    summary.textContent=heading?.textContent.trim()||'Root-zone physics · drainage & oxygen';
    const body=document.createElement('div');
    body.className='tf-root-physics-body';
    while(physics.firstChild){
      const node=physics.firstChild;
      if(node===heading){node.remove();continue;}
      body.appendChild(node);
    }
    disclosure.append(summary,body);
    physics.appendChild(disclosure);
    disclosure.open=false;
  }
  // Preserve the live microscope node and its event handlers.
  // Move its existing node only when necessary; retain all controls and listeners.
  const microscope=document.getElementById('microscope-lab');
  // Keep microscope in place until its final position is resolved below.
  // Single native disclosure owns all microscope content; do not clone the live canvas or controls.
  if(microscope && !microscope.querySelector(':scope > #tf-microscope-disclosure')){
    const disclosure=document.createElement('details');
    disclosure.id='tf-microscope-disclosure';
    const summary=document.createElement('summary');
    summary.textContent='🔬 Living ecosystem microscope';
    const body=document.createElement('div');
    body.className='tf-microscope-disclosure-body';
    while(microscope.firstChild)body.appendChild(microscope.firstChild);
    disclosure.append(summary,body);
    microscope.appendChild(disclosure);
    disclosure.open=false;
    disclosure.addEventListener('toggle',()=>{
      if(disclosure.open)requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
    });
  }

  // Resolve the original legacy cards using their accordion buttons.
  // Moving the card preserves every input, canvas, and event listener.
  for(const group of groups){
    const body=document.querySelector('#tf-research-'+group.id+' > .tf-research-body');
    if(!body)continue;
    for(const term of group.terms){
      const card=findCard(term);
      if(card && card.parentElement!==body)body.appendChild(card);
    }
  }
  // Remove only the abandoned empty wrapper from the failed two-column experiment.
  const oldGrid=document.getElementById('tf-science-card-grid');
  if(oldGrid && !oldGrid.children.length)oldGrid.remove();
  // Preserve the confidence module in the main document.
  const confidence=document.getElementById('evidence-layer');
  if(confidence && confidence.parentElement!==main)main.appendChild(confidence);
  // Only the research grouping belongs at the bottom; simulation controls stay in place.
  // Keep the independent Lawn A/B history widgets together inside Records.
 const records=document.querySelector('#tf-research-records .tf-research-body');
 if(records){
   const histories=[...document.querySelectorAll('summary,button,h2,h3')].filter(el=>/Treatment History\s*[·:–-]?\s*Lawn\s*[AB]/i.test(el.textContent.trim()) && !el.closest('#tf-research-organizer'));
   for(const title of histories){
     const panel=title.closest('details,section.card,article.card,.card');
     if(panel && panel!==host && !panel.contains(host) && !panel.closest('#tf-stacked-lawns') && !records.contains(panel))records.prepend(panel);
   }
 }
 const recordsDrawer=document.getElementById('tf-research-records');
 if(recordsDrawer)recordsDrawer.hidden=!records?.children.length;
 // Place the existing microscope immediately above Brew Microscope Observation Log.
 // Only move if necessary; do not recreate its canvas or reset disclosure state.
 const brewLog=findCard('Brew Microscope Observation Log');
 if(microscope && brewLog && microscope!==brewLog && !microscope.contains(brewLog)){
   if(microscope.parentElement!==brewLog.parentElement || microscope.nextElementSibling!==brewLog){
     brewLog.parentElement.insertBefore(microscope,brewLog);
   }
 }
}
// Mount once. Re-running layout timers moved live nodes while Android users interacted.
function boot(){
 organize();
 const main=document.querySelector('main')||document.body;
 let footer=document.getElementById('tf-build-footer');
 if(!footer){
   footer=document.createElement('footer');
   footer.id='tf-build-footer';
   footer.setAttribute('aria-label','Turfarium application version');
   footer.innerHTML='<strong>TURFARIUM · v25.1.04</strong><span>Tall Fescue &amp; Living Soil Simulator</span><small>© 2026 Turfarium</small>';
   footer.style.cssText='box-sizing:border-box;width:100%;max-width:100%;margin:28px auto 12px;padding:18px 12px;text-align:center;color:#526d61;font:12px/1.65 system-ui,sans-serif;opacity:.88';
   footer.querySelectorAll('strong,span,small').forEach(el=>el.style.cssText='display:block');
   main.appendChild(footer);
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
// One late pass after layout-tools has wrapped headings. No repeating timers.
window.addEventListener('load',()=>requestAnimationFrame(organize),{once:true});
// Some scientific cards are mounted asynchronously. Observe briefly and only
// rerun after a newly mounted card appears; ignore our own drawer moves.
let pending=false;
const observer=new MutationObserver(records=>{
 if(pending || !matchMedia('(max-width:700px)').matches)return;
 const added=records.some(record=>[...record.addedNodes].some(node=>
   node.nodeType===1 && !node.closest?.('#tf-research-organizer') &&
   (node.matches?.('section.card,article.card') || node.querySelector?.('section.card,article.card'))));
 if(!added)return;
 pending=true;
 requestAnimationFrame(()=>{pending=false;organize();});
});
if(document.readyState==='loading'){
 document.addEventListener('DOMContentLoaded',()=>observer.observe(document.body,{childList:true,subtree:true}),{once:true});
}else observer.observe(document.body,{childList:true,subtree:true});
setTimeout(()=>observer.disconnect(),4500);
})();