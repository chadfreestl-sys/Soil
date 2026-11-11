/* Turfarium v25: authoritative event-driven vigor comparison, display only. */
(function(){
'use strict';
let report=null;
const status={version:'25.2',loaded:true,received:false,rendered:false,error:null};
window.TurfariumVigorIndicatorStatus=status;
function locate(key){
 const root=document.getElementById('tf-stacked-lawns');
 const cards=[...(root?.querySelectorAll('.tf-lawn-visual')||[])];
 const card=cards.find(el=>new RegExp('Lawn\\s*'+key+'\\b','i').test(el.textContent.slice(0,120)));
 const panel=document.getElementById('lawn-'+key.toLowerCase()+'-panel');
 return card||panel||null;
}
function draw(){
 if(!report)return;
 try{
  let placed=0;
  const advantage=(report.B.after-report.B.before)-(report.A.after-report.A.before);
  for(const key of ['A','B']){
   const card=locate(key);
   if(!card)continue;
   let box=document.querySelector('[data-tf-response="'+key+'"]');
   if(!box){box=document.createElement('div');box.dataset.tfResponse=key;}
   box.style.cssText='display:block;margin:10px 4px 12px;padding:12px;border:1px solid #b8d6bd;border-radius:12px;background:#e9f3e8;color:#173d2b;font-size:14px;line-height:1.6';
   const v=report[key],change=v.after-v.before;
   box.replaceChildren();
   const heading=document.createElement('strong');heading.textContent='Modeled turf vigor: '+v.after.toFixed(1)+' / 100';box.append(heading);
   const delta=document.createElement('div');delta.textContent='Change since last advance: '+(change>=0?'+':'')+change.toFixed(1)+' points';box.append(delta);
   if(key==='B'){const comparison=document.createElement('div');comparison.textContent='Additional change vs. Lawn A: '+(advantage>=0?'+':'')+advantage.toFixed(1)+' points';box.append(comparison);}
   const note=document.createElement('small');note.textContent='Simulated indices; photographs change only at visual thresholds.';box.append(note);
   const stage=card.querySelector('.photo-stage');
   if(stage)stage.insertAdjacentElement('afterend',box);else card.append(box);
   placed++;
  }
  status.rendered=placed===2;status.error=placed===2?null:'Found '+placed+' of 2 lawn cards';
 }catch(error){status.error=String(error);console.error('[Turfarium vigor indicator]',error);}
}
window.addEventListener('turfarium:time-advanced',event=>{
 const d=event.detail||{},v=d.vigor;
 if(!v||!['A','B'].every(k=>Number.isFinite(v[k]?.before)&&Number.isFinite(v[k]?.after))){status.error='Timeline event missing numeric vigor';return;}
 report={day:d.to,A:v.A,B:v.B};status.received=true;draw();setTimeout(draw,100);setTimeout(draw,600);
});
window.addEventListener('turfarium:history-frame',()=>{if(report)setTimeout(draw,100)});
window.addEventListener('resize',()=>{if(report)setTimeout(draw,150)});
function init(){
 const root=document.getElementById('tf-stacked-lawns');
 if(root)new MutationObserver(()=>{if(report)requestAnimationFrame(draw)}).observe(root,{childList:true,subtree:false});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
