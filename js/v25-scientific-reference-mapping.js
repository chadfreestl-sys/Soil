/* Verified scientific BASE reference mapping v25.1.
   Reference only: never replaces seasonal photos or asserts predictive accuracy. */
(()=>{'use strict';
const container=document.getElementById('tf-scientific-library');
if(!container)return;
const box=document.createElement('section');
box.setAttribute('aria-label','Verified scientific image references');
box.style.cssText='margin:12px 0;padding:12px;border:1px solid #567b64;border-radius:10px';
const title=document.createElement('h3');title.textContent='Condition-linked scientific references';
const message=document.createElement('p');message.textContent='Loading verified image topics…';
const results=document.createElement('div');results.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px';
box.append(title,message,results);
container.insertBefore(box,container.querySelector('details'));
let verified=new Map();
const imageFor=(id)=>verified.get(id);
function select(s){
 if(!s)return null;
 // Deliberately strict: moisture and heat indicate a drought-stress scenario,
 // not proof of dormancy. The image remains an illustrative reference.
 if(Number(s.moisture)<=23&&Number(s.soilTempF)>=82)return 'BASE80';
 // Irrigation input is a modeled recent-water proxy, not a sprinkler sensor.
 if(Number(s.waterInput)>=1&&Number(s.moisture)>=40)return 'BASE63';
 return null;
}
function render(){
 results.replaceChildren();
 let found=0;
 for(const key of ['A','B']){
  const snap=window.TurfariumVisualSnapshot?.(key),id=select(snap),entry=id&&imageFor(id);
  const card=document.createElement('article');
  card.style.cssText='background:#203e2c;border-radius:8px;padding:10px';
  const heading=document.createElement('strong');heading.textContent='Lawn '+key;
  const caption=document.createElement('p');
  if(entry){
   found++;
   const pic=document.createElement('img');pic.src=entry.path;pic.loading='lazy';pic.alt=id+' — '+entry.topic;
   pic.style.cssText='width:100%;aspect-ratio:21/9;object-fit:contain';
   pic.onerror=()=>{caption.textContent='Reference image unavailable: '+id;pic.remove()};
   caption.textContent=id+' · '+entry.topic+' (illustrative condition match, not a field diagnosis)';
   card.append(heading,pic,caption);
  }else{caption.textContent='No scientifically verified BASE reference matches this modeled condition.';card.append(heading,caption)}
  results.append(card);
 }
 message.textContent=found?'Verified reference topics matched: '+found+'. Seasonal lawn photos are unchanged.':'Only verified subjects can be matched. Most BASE subjects still require review.';
}
fetch('assets/turfarium/image-manifest.json').then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(m=>{
 verified=new Map(m.images.filter(e=>e.verifiedSubject&&e.topic&&e.path).map(e=>[e.id,e]));
 render();
}).catch(e=>{message.textContent='Scientific reference mapping unavailable: '+e.message});
window.addEventListener('turfarium:time-advanced',render);
window.addEventListener('turfarium:history-frame',render);
window.addEventListener('load',render);
})();
