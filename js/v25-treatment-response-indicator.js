/* Turfarium v25 — display-only modeled treatment response, not photographic manipulation. */
(function(){
'use strict';
let last=null;
function parseReport(){
 const grid=document.getElementById('changeGrid');
 if(!grid)return null;
 const cards=[...grid.querySelectorAll('.change-lawn')].filter(x=>!x.hasAttribute('data-tf-treatment-comparison')).slice(0,2);
 if(cards.length!==2)return null;
 const vigor=cards.map(c=>{
  const line=[...c.querySelectorAll('li')].find(li=>/Turf vigor:/i.test(li.textContent));
  const m=line?.textContent.match(/\(([-\d.]+)\s*→\s*([-\d.]+)\)/);
  return m?{before:Number(m[1]),after:Number(m[2])}:null;
 });
 if(vigor.some(v=>!v||!Number.isFinite(v.after)))return null;
 const period=document.getElementById('changePeriod')?.textContent||'';
 const days=period.match(/Day\s+(\d+)\s*→\s*(\d+)/);
 if(!days)return null;
 return {day:Number(days[2]),A:vigor[0],B:vigor[1]};
}
function render(){
 const data=parseReport()||last;
 if(!data)return;
 const clock=document.getElementById('tf-season-display')?.textContent||document.body.innerText.slice(0,500);
 const clockDay=clock.match(/Day\s+(\d+)/);
 if(clockDay&&Number(clockDay[1])!==data.day)return;
 last=data;
 const diff=(data.B.after-data.B.before)-(data.A.after-data.A.before);
 for(const key of ['A','B']){
  const stage=document.querySelector('.photo-stage[data-tf-lawn-key="'+key+'"]')||document.getElementById('lawn-'+key.toLowerCase()+'-panel')?.querySelector('.photo-stage');
  if(!stage)continue;
  const host=stage.closest('.tf-lawn-visual')||stage.parentElement;
  if(!host)continue;
  let box=host.querySelector('[data-tf-response="'+key+'"]');
  if(!box){box=document.createElement('div');box.dataset.tfResponse=key;box.style.cssText='margin:8px 4px 12px;padding:10px 12px;border-radius:12px;background:#e9f3e8;color:#173d2b;font-size:14px;line-height:1.55;border:1px solid #c1d8c5';stage.insertAdjacentElement('afterend',box);}
  const v=data[key];box.replaceChildren();
  const title=document.createElement('strong');title.textContent='Modeled turf vigor: '+v.after.toFixed(1)+' / 100';box.append(title);
  const sub=document.createElement('div');sub.textContent='Change since last advance: '+(v.after-v.before>=0?'+':'')+(v.after-v.before).toFixed(1)+' points';box.append(sub);
  if(key==='B'){const d=document.createElement('div');d.textContent='Additional change vs. Lawn A: '+(diff>=0?'+':'')+diff.toFixed(1)+' points';box.append(d);}
  const note=document.createElement('small');note.textContent='Simulated response; the photo stage may remain unchanged.';box.append(note);
 }
}
window.addEventListener('turfarium:time-advanced',()=>{setTimeout(render,0);setTimeout(render,200)});
window.addEventListener('turfarium:history-frame',()=>setTimeout(render,100));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,600));else setTimeout(render,600);
})();
