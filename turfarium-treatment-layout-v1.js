/* Turfarium treatment layout v1 — keep the selected treatment description directly below the treatment selector row and remove redundant ready-to-apply copy. */
(()=>{'use strict';
const byText=(root,re)=>[...root.querySelectorAll('div,p,span,small,strong,h2,h3,h4,label')].find(el=>re.test((el.textContent||'').trim()));
function treatmentRow(panel){
 const btn=[...panel.querySelectorAll('button')].find(b=>/apply\s+treatment/i.test(b.textContent||''));
 if(!btn)return null;
 let row=btn.parentElement;
 while(row&&row!==panel){
  if(row.querySelector('select')&&row.contains(btn))return row;
  row=row.parentElement;
 }
 return btn.parentElement;
}
function treatmentSelect(panel,row){
 return row?.querySelector('select') || [...panel.querySelectorAll('select')].find(s=>{
  const v=(s.options[s.selectedIndex]?.textContent||'').trim();return v&&v.length<80;
 });
}
function descriptionCard(panel,select,row){
 const selected=(select?.options[select.selectedIndex]?.textContent||'').trim();
 const candidates=[...panel.querySelectorAll('div,section,article')].filter(el=>{
  if(el===row||row?.contains(el))return false;
  const t=(el.textContent||'').trim();
  if(!t||t.length>1200)return false;
  const hasResponse=/illustrative\s+response|field\s+recommendation|product\s+label\s+rate/i.test(t);
  const hasSelected=selected? t.toLowerCase().includes(selected.toLowerCase()):false;
  return hasResponse&&(hasSelected||/treatment/i.test(t));
 });
 if(!candidates.length)return null;
 return candidates.sort((a,b)=>(a.textContent||'').length-(b.textContent||'').length)[0];
}
function removeReadyCopy(panel){
 const re=/^\s*ready\s+to\s+apply\s+(?:a\s+)?treatment[.!]?\s*$/i;
 [...panel.querySelectorAll('div,p,span,small,strong')].forEach(el=>{
  if(re.test((el.textContent||'').trim())){
   const parent=el.parentElement;
   el.remove();
   if(parent&&parent!==panel&&!parent.textContent.trim()&&!parent.children.length)parent.remove();
  }
 });
}
function arrange(panel){
 removeReadyCopy(panel);
 const row=treatmentRow(panel);if(!row)return;
 const select=treatmentSelect(panel,row);if(!select)return;
 const card=descriptionCard(panel,select,row);if(!card)return;
 card.classList.add('tf-treatment-description-direct');
 if(row.nextElementSibling!==card)row.insertAdjacentElement('afterend',card);
}
function run(){
 for(const id of ['lawn-a-panel','lawn-b-panel']){const panel=document.getElementById(id);if(panel)arrange(panel);}
}
const style=document.createElement('style');style.id='tf-treatment-layout-v1-style';style.textContent=`
.tf-treatment-description-direct{margin-top:8px!important;margin-bottom:10px!important}
@media(max-width:620px){.tf-treatment-description-direct{margin-top:7px!important;margin-bottom:9px!important}}
`;
if(!document.getElementById(style.id))document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('load',run,{once:true});
let q=false;const mo=new MutationObserver(()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;run()})});mo.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
setTimeout(run,400);setTimeout(run,1200);setTimeout(run,2600);setTimeout(()=>mo.disconnect(),12000);
})();
