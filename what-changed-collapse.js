/* Reliable independently collapsible What Changed report. */
(()=>{'use strict';
function mount(){
 const report=document.getElementById('changeReport');
 if(!report||report.closest('#tf-what-changed-details'))return;
 const details=document.createElement('details');
 details.id='tf-what-changed-details';
 details.className='tf-what-changed-details';
 details.open=false;
 const summary=document.createElement('summary');
 summary.textContent='What Changed';
 summary.setAttribute('aria-label','Expand What Changed report');
 report.parentNode.insertBefore(details,report);
 details.append(summary,report);
 // Keep the existing report intact, but place its collapsed toggle after replay.
 function place(){
  const item=document.getElementById('tf-what-changed-details');
  if(!item)return;
  const mobile=window.matchMedia('(max-width:700px)').matches;
  const replay=mobile?document.getElementById('tf-stacked-replay'):
   document.querySelector('#tf-playback-strip .tf-history-replay')||document.getElementById('tf-playback-strip');
  if(!replay||!replay.parentNode)return;
  if(item.previousElementSibling!==replay)replay.insertAdjacentElement('afterend',item);
 }
 place();
 window.addEventListener('turfarium:time-advanced',place);
 window.addEventListener('resize',place);
 [400,1400,3200].forEach(ms=>setTimeout(place,ms));
 // Ensure a parent timeline collapse does not hide the independent toggle.
 const timeline=document.getElementById('timeline-workflow');
 if(timeline){
   const body=timeline.querySelector(':scope > .tf-collapse-body');
   if(body&&body.hidden){body.hidden=false;timeline.classList.remove('tf-panel-collapsed');const toggle=timeline.querySelector(':scope > .tf-collapse-toggle');if(toggle){toggle.setAttribute('aria-expanded','true');}}
 }
}
const style=document.createElement('style');style.textContent=`
 #tf-what-changed-details{display:block!important;max-width:100%;border:1px solid #b7cbb3;border-radius:12px;background:#f2f7ef;margin:12px 0;overflow:hidden}
 #tf-what-changed-details>summary{cursor:pointer;display:list-item;list-style:revert;list-style-position:inside;padding:15px 18px;font-weight:800;font-size:1.05rem;color:#183e2c;user-select:none}
 #tf-what-changed-details:not([open])>#changeReport{display:none!important}
 #tf-what-changed-details[open]>#changeReport{display:block!important;padding:0 12px 12px;margin:0}
 #tf-what-changed-details{box-sizing:border-box;width:100%;margin:8px 0 12px!important;grid-column:1/-1}
 #tf-stacked-lawns>#tf-what-changed-details{background:#f2f7ef!important}
 #tf-what-changed-details>summary:focus-visible{outline:3px solid #3a8060;outline-offset:-3px}
 `;document.head.append(style);
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
 window.addEventListener('load',mount,{once:true});setTimeout(mount,1100);
})();
