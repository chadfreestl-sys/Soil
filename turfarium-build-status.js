/* Turfarium build and non-invasive dashboard diagnostics. */
(()=>{'use strict';
const BUILD='25.0.97';
function check(){
 const grid=document.querySelector('.simulation-grid');
 const ids=['tf-playback-strip','lawn-a-panel','lawn-b-panel','tf-save-drawer','tf-history-card-a','tf-history-card-b'];
 const els=ids.map(id=>document.getElementById(id));
 const missing=ids.filter((_,i)=>!els[i]);
 const order=els.map(el=>el&&el.parentElement===grid?Number.parseFloat(getComputedStyle(el).order)||0:null);
 const wrong=missing.length===0&&order.some((v,i)=>i>0&&v<order[i-1]);
 const result={build:BUILD,missing,order,wrongOrder:wrong,checkedAt:new Date().toISOString()};
 window.TurfariumBuildStatus=result;
 const canopy=document.getElementById('canopyTimeline');
 const canopyVisible=!!(canopy&&canopy.getClientRects().length&&canopy.closest('#tf-playback-strip'));
 result.canopyVisible=canopyVisible;
 result.healthy=!missing.length&&!wrong&&canopyVisible;

}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(check,1800),{once:true});else setTimeout(check,1800);
window.addEventListener('load',()=>setTimeout(check,2800),{once:true});
})();
