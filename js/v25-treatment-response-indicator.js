/* Turfarium v25 — display-only modeled treatment response, not photographic manipulation. */
(function(){
'use strict';
let last=null;
function parseReport(){
 const grid=document.getElementById('changeGrid');
 if(!grid)return null;
 const cards=['A','B'].map(key=>[...grid.querySelectorAll('.change-lawn')].find(x=>new RegExp('\\bLawn\\s+'+key+'\\b','i').test(x.querySelector('h4')?.textContent||'')));
 if(cards.some(x=>!x))return null;
 const vigor=cards.map(c=>{
  const line=[...c.querySelectorAll('li')].find(li=>li.querySelector('strong')?.textContent.trim()==='Turf vigor');
  const m=line?.textContent.match(/\(([0-9.+-]+)\s*[^0-9.+-]+\s*([0-9.+-]+)\)/);
  return m?{before:Number(m[1]),after:Number(m[2])}:null;
 });
 if(vigor.some(v=>!v||!Number.isFinite(v.after)))return null;
 const period=document.getElementById('changePeriod')?.textContent||'';
 const days=period.match(/Day\s+(\d+)\s*[^0-9]+\s*(\d+)/i);
 if(!days)return null;
 return {day:Number(days[2]),A:vigor[0],B:vigor[1]};
}
function render(){
 const data=parseReport()||last;
 if(!data)return;
 const clock=document.getElementById('tf-season-display')?.textContent||'';
 const clockDay=clock.match(/Day\s+(\d+)/);
 if(clockDay&&Number(clockDay[1])!==data.day)return;
 last=data;
 const diff=(data.B.after-data.B.before)-(data.A.after-data.A.before);
 for(const key of ['A','B']){
  const panel=document.getElementById('lawn-'+key.toLowerCase()+'-panel');
  const stacked=document.getElementById('tf-stacked-lawns');
  const card=[...(stacked?.querySelectorAll('.tf-lawn-visual')||[])].find(x=>new RegExp('Lawn\\s*'+key+'\\b','i').test(x.textContent.slice(0,100)));
  const stage=document.querySelector('.photo-stage[data-tf-lawn-key="'+key+'"]')||panel?.querySelector('.photo-stage')||card?.querySelector('.photo-stage');
  if(!stage)continue;
  const host=stage.closest('.tf-lawn-visual')||panel||stage.parentElement;
  if(!host)continue;
  let box=document.querySelector('[data-tf-response="'+key+'"]');
  if(!box){box=document.createElement('div');box.dataset.tfResponse=key;box.style.cssText='margin:8px 4px 12px;padding:10px 12px;border-radius:12px;background:#e9f3e8;color:#173d2b;font-size:14px;line-height:1.55;border:1px solid #c1d8c5';stage.insertAdjacentElement('afterend',box);}
  if(box.previousElementSibling!==stage)stage.insertAdjacentElement('afterend',box);
  const v=data[key];box.replaceChildren();
  const title=document.createElement('strong');title.textContent='Modeled turf vigor: '+v.after.toFixed(1)+' / 100';box.append(title);
  const sub=document.createElement('div');sub.textContent='Change since last advance: '+(v.after-v.before>=0?'+':'')+(v.after-v.before).toFixed(1)+' points';box.append(sub);
  if(key==='B'){const d=document.createElement('div');d.textContent='Additional change vs. Lawn A: '+(diff>=0?'+':'')+diff.toFixed(1)+' points';box.append(d);}
  const note=document.createElement('small');note.textContent='Simulated response; the photo stage may remain unchanged.';box.append(note);
 }
}
window.addEventListener('turfarium:time-advanced',()=>{setTimeout(render,0);setTimeout(render,200)});
window.addEventListener('turfarium:history-frame',()=>setTimeout(render,100));
window.addEventListener('resize',()=>setTimeout(render,200));
const observer=new MutationObserver(()=>{if(last)requestAnimationFrame(render)});
function watch(){const root=document.getElementById('tf-stacked-lawns');if(root)observer.observe(root,{childList:true,subtree:false});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch();
[1200,2500,5000].forEach(ms=>setTimeout(render,ms));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,600));else setTimeout(render,600);
})();
