/* Mobile-only organized research drawers. Move original nodes, never clone inputs. */
(()=>{'use strict';
const css=document.createElement('style');
css.textContent=`@media(max-width:700px){
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
 {id:'records',title:'📋 Records & diagnostics',terms:['Treatment History','Diagnostic Lens','Five-year progression stress test','Evidence & Confidence Layer']},
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
 if(!host.isConnected)first.before(host);
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
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',organize,{once:true});else organize();
[700,1800,3500].forEach(ms=>setTimeout(organize,ms));
})();