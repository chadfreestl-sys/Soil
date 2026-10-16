/* Turfarium default start month v1 — set month-style selectors to March on initial load. */
(()=>{'use strict';
let applied=false;
function isMonthSelect(sel){
 const labels=[...sel.options].map(o=>(o.textContent||'').trim().toLowerCase());
 const hasMarch=labels.some(t=>t==='march'||t.startsWith('mar '));
 const monthHits=['january','february','march','april','may','june','july','august','september','october','november','december'].filter(m=>labels.some(t=>t===m||t.startsWith(m.slice(0,3)))).length;
 return hasMarch&&monthHits>=8;
}
function setMarch(){
 if(applied)return;
 const candidates=[...document.querySelectorAll('select')].filter(isMonthSelect);
 if(!candidates.length)return;
 for(const sel of candidates){
  const opt=[...sel.options].find(o=>{const t=(o.textContent||'').trim().toLowerCase();return t==='march'||t.startsWith('mar ')});
  if(!opt)continue;
  sel.value=opt.value;
  opt.selected=true;
  sel.dispatchEvent(new Event('change',{bubbles:true}));
 }
 applied=true;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setMarch,{once:true});else setMarch();
window.addEventListener('load',setMarch,{once:true});
setTimeout(setMarch,250);setTimeout(setMarch,900);setTimeout(setMarch,1800);
})();
