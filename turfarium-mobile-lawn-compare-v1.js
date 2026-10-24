/* Turfarium mobile lawn comparison layout v1.0 */
(()=>{'use strict';
const style=document.createElement('style');style.textContent=`
@media(max-width:700px){
 #lawn-a-panel .kpis,#lawn-b-panel .kpis{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;margin-top:8px!important}
 #lawn-a-panel .kpis .kpi,#lawn-b-panel .kpis .kpi{min-width:0!important;padding:10px!important;margin:0!important}
 #lawn-a-panel .kpis .kpi strong,#lawn-b-panel .kpis .kpi strong{font-size:1.24rem!important}
 #lawn-a-panel,#lawn-b-panel{padding-bottom:12px!important}\n #lawn-a-panel .head,#lawn-b-panel .head{margin-bottom:5px!important}\n #lawn-a-panel .tf-visual-indicator,#lawn-b-panel .tf-visual-indicator{margin:5px 2px!important}\n #lawn-a-panel .tf-bio-panel,#lawn-b-panel .tf-bio-panel{margin-top:8px!important}\n #lawn-a-panel .tf-mobile-advance,#lawn-b-panel .tf-mobile-advance{display:block!important}\n .tf-mobile-advance{display:block;margin:7px 0 10px;padding:9px;border:1px solid #b8d0bd;border-radius:12px;background:#eef5ec}
 .tf-mobile-advance-title{font-size:.78rem;font-weight:800;color:#22533a;margin-bottom:7px}
 .tf-mobile-advance-actions{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px}
 .tf-mobile-advance button{min-width:0!important;padding:9px 2px!important;font-size:.78rem!important;min-height:43px;border-radius:8px;background:#174c48;color:white}
}
@media(min-width:701px){.tf-mobile-advance{display:none!important}}
`;document.head.appendChild(style);
function init(){
 const source=document.querySelector('#timeline-workflow button[data-step]');
 if(!source)return;
 for(const key of ['A','B']){
  const panel=document.getElementById('lawn-'+key.toLowerCase()+'-panel');
  const photo=panel?.querySelector('.photo-stage');
  if(!photo||panel.querySelector('.tf-mobile-advance'))continue;
  const box=document.createElement('div');box.className='tf-mobile-advance';
  box.setAttribute('aria-label','Advance simulation time from Lawn '+key);
  const heading=document.createElement('div');heading.className='tf-mobile-advance-title';
  heading.textContent='⏱ Advance time · both lawns';
  const actions=document.createElement('div');actions.className='tf-mobile-advance-actions';
  for(const [days,label] of [[7,'+7 days'],[30,'+30 days'],[90,'+90 days'],[365,'+1 year']]){
   const btn=document.createElement('button');btn.type='button';btn.textContent=label;
   btn.addEventListener('click',()=>{const original=document.querySelector('#timeline-workflow button[data-step="'+days+'"]');if(original&&!original.disabled)original.click()});
   actions.appendChild(btn);
  }
  box.append(heading,actions);photo.insertAdjacentElement('beforebegin',box);
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('load',init,{once:true});
setTimeout(init,500);setTimeout(init,1600);
})();