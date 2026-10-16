/* Turfarium v25 — single owner for workspace extensions.
   layout-tools.js still owns primary profile/timeline deck and base accordion.
   This controller owns weather placement, independent histories, detail folds,
   and a compact overview. It never changes simulation data or form IDs. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const lawn=id=>$('lawn-'+id+'-panel');
let busy=false;
function fold(block,label,id){
 if(!block||block.dataset.v25Fold)return;
 const box=document.createElement('section');box.className='v25-fold';
 const button=document.createElement('button');
 button.type='button';button.className='v25-fold-toggle';
 button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',id);
 const content=document.createElement('div');content.id=id;content.className='v25-fold-content';content.hidden=true;
 const name=document.createElement('span');name.textContent=label;
 const arrow=document.createElement('span');arrow.className='v25-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='▸';
 button.append(name,arrow);
 block.before(box);box.append(button,content);content.appendChild(block);
 block.dataset.v25Fold='1';
 button.addEventListener('click',()=>{
   const open=button.getAttribute('aria-expanded')!=='true';
   button.setAttribute('aria-expanded',String(open));content.hidden=!open;
   arrow.textContent=open?'▾':'▸';
 });
 return box;
}
function details(){
 for(const key of ['A','B']){
  const p=lawn(key.toLowerCase());if(!p)continue;
  fold(p.querySelector('#metric'+key),'Soil Metrics · Lawn '+key,'v25-metrics-'+key);
  const rate=p.querySelector('#rateInfo'+key);
  const candidate=rate?.parentElement;
  if(candidate&&candidate!==p&&candidate.querySelectorAll('input,select').length>=2
    && !candidate.contains(p.querySelector('.recent-applications'))){
    fold(candidate,'Application Rate & Settings · Lawn '+key,'v25-rates-'+key);
  }
 }
}
function histories(){
 const a=lawn('a'),b=lawn('b'),grid=a?.parentElement;
 if(!a||!b||!grid||b.parentElement!==grid)return;
 let anchor=b;
 for(const key of ['A','B']){
  const history=(key==='A'?a:b).querySelector('.recent-applications');
  const id='v25-history-'+key;
  let panel=$(id);
  if(!panel && history){
    panel=document.createElement('section');panel.id=id;
    panel.className='card v25-history';
    const button=document.createElement('button');button.type='button';
    button.className='v25-fold-toggle';
    button.setAttribute('aria-expanded','false');
    button.setAttribute('aria-controls',id+'-body');
    button.innerHTML='<span>Treatment History · Lawn '+key+'</span><span class="v25-arrow" aria-hidden="true">▸</span>';
    const body=document.createElement('div');body.id=id+'-body';
    body.className='v25-fold-content';body.hidden=true;
    panel.append(button,body);
    button.addEventListener('click',()=>{
      const open=button.getAttribute('aria-expanded')!=='true';
      button.setAttribute('aria-expanded',String(open));body.hidden=!open;
      button.querySelector('.v25-arrow').textContent=open?'▾':'▸';
    });
  }
  if(!panel)continue;
  const body=panel.querySelector('.v25-fold-content');
  if(history&&history.parentElement!==body)body.appendChild(history);
  if(panel.parentElement!==grid||panel.previousElementSibling!==anchor)anchor.after(panel);
  anchor=panel;
 }
}
function weather(){
 const p=$('experiment-controls'),deck=$('profile-control-deck');
 const grid=deck?.parentElement;
 if(!p||!deck||!grid||p.contains(deck))return;
 p.classList.add('tf-weather-first');
 if(p.parentElement!==grid||p.nextElementSibling!==deck)grid.insertBefore(p,deck);
 const toggle=p.querySelector(':scope > .tf-collapse-toggle');
 const body=p.querySelector(':scope > .tf-collapse-body');
 if(!toggle||!body)return;
 const title=toggle.querySelector('.tf-collapse-title');
 if(title)title.textContent='Site, Season & Weather Lab';
 if(!p.dataset.v25WeatherReady){
   p.dataset.v25WeatherReady='1';
   p.classList.add('tf-panel-collapsed');
   toggle.setAttribute('aria-expanded','false');
   body.hidden=true;
   const arrow=toggle.querySelector('.tf-collapse-chevron');
   if(arrow)arrow.textContent='▸';
 }
 // Existing layout-tools accordion owns subsequent clicks; no second listener.
}
function overview(){
 const deck=$('profile-control-deck'),a=lawn('a'),b=lawn('b');
 if(!deck||!a||!b||$('v25-overview'))return;
 const bar=document.createElement('nav');bar.id='v25-overview';
 bar.className='v25-overview';bar.setAttribute('aria-label','Lawn overview shortcuts');
 const heading=document.createElement('span');heading.className='v25-overview-title';
 heading.textContent='Lawn overview';
 bar.appendChild(heading);
 for(const [label,target] of [['Lawn A','lawn-a-panel'],['Lawn B','lawn-b-panel'],['Time advance','profile-control-deck']]){
   const link=document.createElement('a');link.href='#'+target;
   link.className='v25-overview-link';
   const icons={
     'Lawn A':'<path d="M3 20h18M5 20l3-8 3 8M11 20l3-12 4 12M17 20l2-7 2 7"/>',
     'Lawn B':'<path d="M3 20h18M5 20l3-8 3 8M11 20l3-12 4 12M17 20l2-7 2 7"/>',
     'Time advance':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'
   };
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
   svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
   svg.innerHTML=icons[label]||'';
   const labelSpan=document.createElement('span');labelSpan.textContent=label;
   link.append(svg,labelSpan);
   link.addEventListener('click',()=>{
     const panel=$(target);
     const toggle=panel?.querySelector(':scope > .tf-collapse-toggle');
     if(toggle&&panel.classList.contains('tf-panel-collapsed'))toggle.click();
   });
   bar.appendChild(link);
 }
 deck.insertAdjacentElement('afterend',bar);
}
function arrange(){
 if(busy)return;
 busy=true;
 try{weather();details();histories();overview();}
 finally{busy=false;}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arrange,{once:true});
else arrange();
window.addEventListener('load',arrange,{once:true});
requestAnimationFrame(arrange);
setTimeout(arrange,600);setTimeout(arrange,1800);setTimeout(arrange,4000);
})();
