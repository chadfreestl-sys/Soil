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
.tf-research-drawer>summary{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;cursor:pointer!important;list-style:none!important;padding:13px 12px!important;margin:0!important;background:#eaf3e9!important;border-radius:11px!important;font-size:16px!important;font-weight:800!important;line-height:1.3!important;color:#194532!important}
.tf-research-drawer>summary::-webkit-details-marker{display:none}
.tf-research-drawer>summary:after{content:'▸';font-size:16px;flex:none}
.tf-research-drawer[open]>summary:after{content:'▾'}
.tf-research-body{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:9px!important;padding-top:10px!important;min-width:0!important}
.tf-research-body>*{width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;margin:0!important;grid-column:1/-1!important}
.tf-research-body .card,.tf-research-body details{border-radius:12px!important}
.tf-research-body h2,.tf-research-body h3,.tf-research-body summary{font-size:clamp(14px,3.7vw,17px)!important;line-height:1.35!important}
.tf-research-drawer:not([open])>.tf-research-body{display:none!important}
}`;
document.head.appendChild(css);
const groups=[
 {id:'records',title:'📋 Records & diagnostics',terms:['Diagnostic Lens','Five-year progression stress test']},
 {id:'ecology',title:'🌱 Ecosystem research',terms:['Turf Species Response','Earthworm Ecology Module','Linked soil food web','Seaweed Response Lab']},
 {id:'experiments',title:'🧪 Experiment tools',terms:['Custom product formulation studio','Worm Tea Brewing Lab','Soil lab & nutrient cycling','Experiment activity']}
];
function findCard(term){
 const query=term.toLowerCase();
 // layout-tools wraps original headings inside .tf-collapse-body and inserts
 // a new direct toggle. Match the *outer card*, never move its inner details.
 const cards=[...document.querySelectorAll('section.card,article.card')];
 return cards.find(card=>{
   if(card.closest('#tf-research-organizer,#tf-stacked-lawns,#tf-mowing-dialog'))return false;
   const headings=card.querySelectorAll(':scope > h2,:scope > h3,:scope > .head h2,:scope > .head h3,:scope > .tf-collapse-toggle .tf-collapse-title,:scope > .tf-collapse-body > .head h2,:scope > .tf-collapse-body > h2,:scope > .tf-collapse-body > .head h3');
   return [...headings].some(heading=>heading.textContent.trim().toLowerCase().includes(query));
 });
}
function organize(){
 if(!matchMedia('(max-width:700px)').matches)return;
 let host=document.getElementById('tf-research-organizer');
 if(!host){host=document.createElement('section');host.id='tf-research-organizer';host.style.cssText='width:100%;min-width:0;grid-column:1/-1;display:grid;grid-template-columns:minmax(0,1fr);gap:8px';}
 const collected=groups.map(group=>({...group,nodes:group.terms.map(findCard).filter(Boolean)}));
 const first=collected.flatMap(g=>g.nodes)[0];
 if(!first)return;
 // Put advanced research navigation at the very bottom of the mobile page.
 // Never insert before a moving source card; that can trigger scroll jumps.
 const main=document.querySelector('main')||document.body;
 if(host.parentElement!==main)main.appendChild(host);
 for(const group of collected){
   let drawer=document.getElementById('tf-research-'+group.id);
   if(!drawer){
     drawer=document.createElement('details');drawer.className='tf-research-drawer';drawer.id='tf-research-'+group.id;
     const summary=document.createElement('summary');summary.textContent=group.title;
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
   footer.innerHTML='<strong>TURFARIUM · v25.0.98</strong><span>Tall Fescue &amp; Living Soil Simulator</span><small>© 2026 Turfarium</small>';
   footer.style.cssText='box-sizing:border-box;width:100%;max-width:100%;margin:28px auto 12px;padding:18px 12px;text-align:center;color:#526d61;font:12px/1.65 system-ui,sans-serif;opacity:.88';
   footer.querySelectorAll('strong,span,small').forEach(el=>el.style.cssText='display:block');
   main.appendChild(footer);
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
// One late pass after layout-tools has wrapped headings. No repeating timers.
window.addEventListener('load',()=>requestAnimationFrame(organize),{once:true});
})();