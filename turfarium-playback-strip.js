/* Turfarium compact playback strip: reuse existing controls and listeners. */
(()=>{'use strict';
 const style=document.createElement('style');
 style.id='tf-playback-strip-style';
 style.textContent=`
 .simulation-grid.tf-primary-workspace>#tf-playback-strip{grid-column:1/-1!important;order:-1001!important;min-width:0!important;margin:0 0 4px!important;padding:10px 12px!important;border-radius:12px!important}
 .simulation-grid.tf-primary-workspace>#scenario-memory{grid-column:1/-1!important;order:-997!important;margin:4px 0 10px!important}
 .simulation-grid.tf-primary-workspace>#tf-playback-strip{order:-1001!important}
 .simulation-grid.tf-primary-workspace>#lawn-a-panel{order:-999!important}
 .simulation-grid.tf-primary-workspace>#lawn-b-panel{order:-998!important}
 .simulation-grid.tf-primary-workspace>#tf-save-drawer{grid-column:1/-1!important;order:-997!important;margin:0 0 8px!important;padding:0!important;border:1px solid #b8cbb9;border-radius:10px;overflow:hidden;background:#f5f8f2}
 #tf-save-drawer>summary{display:list-item;list-style:revert;list-style-position:inside;cursor:pointer;padding:9px 13px;font-weight:800;font-size:.82rem;line-height:1.25;color:#193d2c;min-height:18px}
 #tf-save-drawer[open]>summary{border-bottom:1px solid #c8d8c8}
 #tf-save-drawer>#scenario-memory{display:block!important;width:100%!important;max-width:none!important;box-sizing:border-box!important;margin:0!important;padding:10px 12px!important;border:0!important;box-shadow:none!important}
 #tf-save-drawer:not([open])>#scenario-memory{display:none!important}
 #tf-save-drawer #scenario-memory .scenario-head{margin-bottom:6px!important}
 #tf-save-drawer #scenario-memory button{max-width:160px!important;width:auto!important;min-height:32px!important;padding:6px 10px!important;font-size:.8rem!important}
 #tf-playback-strip .tf-strip-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;min-width:0}
 #tf-playback-strip .tf-strip-label{font-weight:800;color:#1a4330;font-size:.85rem;white-space:nowrap}
 #tf-playback-strip .tf-strip-time{display:flex;align-items:center;flex:1 1 330px;gap:6px;flex-wrap:wrap;min-width:0}
 #tf-playback-strip .tf-strip-time button{flex:1 1 75px!important;width:auto!important;min-width:65px!important;min-height:38px!important;padding:7px 9px!important;margin:0!important;font-size:.82rem!important}
 #tf-playback-strip .tf-strip-replay{display:flex;align-items:center;gap:7px;flex:0 1 auto;min-width:0}
 #tf-playback-strip .tf-strip-replay .tf-replay-bar{display:flex!important;flex-wrap:wrap!important;align-items:center!important;gap:6px!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important;width:auto!important}
 #tf-playback-strip .tf-strip-replay button{width:auto!important;min-height:38px!important;padding:7px 10px!important;margin:0!important}
 #tf-playback-strip .tf-strip-changes{flex:0 1 190px;min-width:145px}
 #tf-playback-strip #tf-what-changed-details{margin:0!important;border-radius:9px!important}
 #tf-playback-strip #tf-what-changed-details>summary{padding:10px 12px!important;font-size:.86rem!important;white-space:nowrap}
 #tf-playback-strip .tf-strip-changes:has(details[open]){flex:1 1 100%}
 #tf-playback-strip #changeReport{max-width:100%;min-width:0}
 #tf-playback-strip .tf-strip-visit{flex:1 1 100%;font-size:.72rem;margin:0!important}
 #tf-playback-strip .tf-strip-time .head{display:none!important}
 #profile-control-deck .profile-time-slot:empty,#profile-control-deck .profile-replay-slot:empty,#profile-control-deck .profile-changes-slot:empty{display:none!important}
 #timeline-workflow.timeline-report-only:has(> .tf-collapse-body:empty){display:none!important}
 @media(max-width:650px){#tf-playback-strip .tf-strip-row{gap:8px}#tf-playback-strip .tf-strip-time{flex:1 1 100%}#tf-playback-strip .tf-strip-replay{flex:1 1 auto}#tf-playback-strip .tf-strip-changes{flex:1 1 auto}}
 `;
 document.head.appendChild(style);
 let strip=null,queued=false;
 function mount(){
  const grid=document.querySelector('.simulation-grid'),a=document.getElementById('lawn-a-panel');
  if(!grid||!a)return;
  if(!strip){strip=document.createElement('section');strip.id='tf-playback-strip';strip.className='card wide';
    strip.innerHTML='<div class="tf-strip-row"><span class="tf-strip-label">⏱ Progression</span><div class="tf-strip-time"></div><div class="tf-strip-replay"></div><div class="tf-strip-changes"></div><p class="tf-strip-visit"></p></div>';}
  if(strip.parentElement!==grid||strip.nextElementSibling!==a)grid.insertBefore(strip,a);
  const b=document.getElementById('lawn-b-panel');
  const memory=document.getElementById('scenario-memory');
  if(memory&&b){
    let drawer=document.getElementById('tf-save-drawer');
    if(!drawer){
      drawer=document.createElement('details');
      drawer.id='tf-save-drawer';
      drawer.className='tf-save-drawer';
      const summary=document.createElement('summary');
      summary.textContent='Save state · Load · Compare';
      drawer.appendChild(summary);
      drawer.open=false;
    }
    if(drawer.parentElement!==grid||drawer.previousElementSibling!==b)b.insertAdjacentElement('afterend',drawer);
    if(memory.parentElement!==drawer)drawer.appendChild(memory);
  }
  const time=strip.querySelector('.tf-strip-time'),replay=strip.querySelector('.tf-strip-replay'),changes=strip.querySelector('.tf-strip-changes'),visit=strip.querySelector('.tf-strip-visit');
  const steps=document.querySelector('#timeline-workflow .row:has([data-step])')||document.querySelector('#profile-control-deck .profile-step-row')||document.querySelector('.profile-step-row');
  if(steps&&steps.parentElement!==time)time.appendChild(steps);
  const replayBar=document.querySelector('.tf-replay-bar');
  if(replayBar&&replayBar.parentElement!==replay)replay.appendChild(replayBar);
  const report=document.getElementById('tf-what-changed-details')||document.getElementById('changeReport');
  if(report&&report.parentElement!==changes)changes.appendChild(report);
  const note=document.getElementById('visit');
  if(note&&note.parentElement!==visit)visit.appendChild(note);
  if(!replayBar)replay.hidden=true;else replay.hidden=false;
  if(!report)changes.hidden=true;else changes.hidden=false;
  if(!note)visit.hidden=true;else visit.hidden=false;
 }
 function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;mount();});}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
 window.addEventListener('load',schedule,{once:true});
 const observer=new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('.tf-replay-bar,#tf-what-changed-details,#changeReport,.profile-step-row')||n.querySelector?.('.tf-replay-bar,#tf-what-changed-details,#changeReport,.profile-step-row')))))schedule();});
 observer.observe(document.documentElement,{childList:true,subtree:true});
 setTimeout(schedule,600);setTimeout(schedule,1800);setTimeout(schedule,3500);
})();
