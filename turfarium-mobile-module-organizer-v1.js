/* Mobile-only organized research drawers. Move original nodes, never clone inputs. */
(()=>{'use strict';
const css=document.createElement('style');
css.textContent=`@media(max-width:700px){
.tf-orphan-blank-mobile-tile{display:none!important}
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
 const candidates=[...document.querySelectorAll('section.card,article.card,details')];
 const query=term.toLowerCase();
 return candidates.find(el=>{
   if(el.closest('#tf-research-organizer,#tf-stacked-lawns,#tf-mowing-dialog'))return false;
   const title=el.querySelector(':scope > h2,:scope > h3,:scope > summary,:scope > .head h2,:scope > .head h3');
   return title&&title.textContent.trim().toLowerCase().includes(query);
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
 if(host.parentElement!==main||host!==main.lastElementChild)main.appendChild(host);
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
  // Remove only the visually blank, non-interactive 40–95px tile beneath Diagnostics.
  // The old selector missed it because it had a wrapper or an ID.
  const diagnostic=document.getElementById('diagnostic-lens');
  if(diagnostic){
    const bottom=diagnostic.getBoundingClientRect().bottom;
    for(const el of document.querySelectorAll('main *')){
      if(el===diagnostic||diagnostic.contains(el)||el.closest('#tf-research-organizer,#microscope-lab,#evidence-layer'))continue;
      const r=el.getBoundingClientRect();
      if(r.width<40||r.width>95||r.height<40||r.height>95||r.top<bottom-8||r.top>bottom+230||r.left>110)continue;
      if(el.textContent.trim()||el.matches('button,a,input,select,textarea,summary,details,[role="button"],[tabindex]')||el.querySelector('button,a,input,select,textarea,summary,details,[role="button"],[tabindex],canvas,svg,img,video'))continue;
      // Only hide the outermost matching blank tile, never a populated parent.
      if(el.parentElement?.classList.contains('tf-orphan-blank-mobile-tile'))continue;
      el.classList.add('tf-orphan-blank-mobile-tile');
    }
  }
  // Scientific microscope belongs after the research drawers, at the end of the page.
  // Move its existing node only when necessary; retain all controls and listeners.
  const microscope=document.getElementById('microscope-lab');
  if(microscope && microscope.parentElement===main && microscope!==main.lastElementChild)main.appendChild(microscope);
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

  // Confidence is the final scientific reference panel, after the microscope.
  const confidence=document.getElementById('evidence-layer');
  if(confidence && confidence.parentElement!==main)main.appendChild(confidence);
  if(confidence && confidence!==main.lastElementChild)main.appendChild(confidence);
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
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',organize,{once:true});else organize();
[700,1800,3500].forEach(ms=>setTimeout(organize,ms));
})();