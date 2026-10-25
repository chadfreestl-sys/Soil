/* Turfarium build and non-invasive dashboard diagnostics. */
(()=>{'use strict';
const BUILD='25.0.0';
const style=document.createElement('style');
style.textContent='#tf-build-status{position:fixed;right:10px;bottom:10px;z-index:9999;background:#173e2d;color:#fff;border:1px solid #9cbda9;border-radius:9px;padding:5px 9px;font:600 11px/1.3 system-ui,sans-serif;box-shadow:0 2px 9px #0003;opacity:.88}#tf-build-status[data-health="issues"]{background:#70471d}';
document.head.appendChild(style);
function check(){
 const grid=document.querySelector('.simulation-grid');
 const ids=['tf-playback-strip','lawn-a-panel','lawn-b-panel','tf-save-drawer','tf-history-card-a','tf-history-card-b'];
 const els=ids.map(id=>document.getElementById(id));
 const missing=ids.filter((_,i)=>!els[i]);
 const order=els.map(el=>el&&el.parentElement===grid?Number.parseFloat(getComputedStyle(el).order)||0:null);
 const wrong=missing.length===0&&order.some((v,i)=>i>0&&v<order[i-1]);
 const result={build:BUILD,missing,order,wrongOrder:wrong,checkedAt:new Date().toISOString()};
 window.TurfariumBuildStatus=result;
 let badge=document.getElementById('tf-build-status');
 if(!badge){badge=document.createElement('div');badge.id='tf-build-status';badge.title='Turfarium build status; click to see layout diagnostics';badge.addEventListener('click',()=>{console.table(window.TurfariumBuildStatus);alert(JSON.stringify(window.TurfariumBuildStatus,null,2));});document.body.appendChild(badge);}
 const canopy=document.getElementById('canopyTimeline');
 const canopyVisible=!!(canopy&&canopy.getClientRects().length&&canopy.closest('#tf-playback-strip'));
 result.canopyVisible=canopyVisible;
 const healthy=!missing.length&&!wrong&&canopyVisible;
 badge.dataset.health=healthy?'ok':'issues';
 badge.textContent='Turfarium v'+BUILD+(healthy?' ✓':' · check layout');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(check,1800),{once:true});else setTimeout(check,1800);
window.addEventListener('load',()=>setTimeout(check,2800),{once:true});
})();
