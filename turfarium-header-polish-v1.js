/* Turfarium header polish v1.1 — compact, single-source masthead for desktop and mobile. */
(()=>{'use strict';
function polish(){
  const header=document.querySelector('main > header')||document.querySelector('header');
  if(!header)return false;
  const mode=(document.documentElement.dataset.audience||'homeowner').toLowerCase();
  const label=mode==='research'?'Research / Lab':mode.charAt(0).toUpperCase()+mode.slice(1);
  header.className='tf-header-polish';
  header.innerHTML=`
    <div class="tf-header-main">
      <img class="tf-header-logo" src="turfarium-icon.svg" alt="">
      <div class="tf-header-copy">
        <h1>Turfarium</h1>
        <div class="tf-header-product-line">Interactive Turf Ecosystem Simulator</div>
        <p class="tf-header-sub">Turfgrass · soil · roots · biology over time</p>
      </div>
    </div>
    <span class="badge tf-header-mode-badge">${label}</span>`;
  return true;
}
const style=document.createElement('style');
style.id='tf-header-polish-v11-style';
style.textContent=`
header.tf-header-polish{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;padding:20px 22px!important;flex-wrap:nowrap!important}
.tf-header-main{display:flex;align-items:center;gap:14px;min-width:0;flex:1 1 auto}
.tf-header-logo{width:66px;height:66px;flex:0 0 66px;display:block}
.tf-header-copy{min-width:0}.tf-header-copy h1{margin:0!important;color:#0d613b!important;font-size:clamp(2rem,4vw,2.7rem)!important;line-height:.98!important;letter-spacing:-.045em!important;font-weight:900!important;white-space:nowrap}
.tf-header-product-line{margin-top:6px;color:#20392d!important;font-size:.98rem;font-weight:850;line-height:1.2}
.tf-header-sub{margin:4px 0 0!important;color:#617469!important;font-size:.8rem!important;line-height:1.35!important}
.tf-header-mode-badge{flex:0 0 auto;white-space:nowrap!important;padding:8px 13px!important;font-weight:850!important}
@media(max-width:620px){
  header.tf-header-polish{display:block!important;padding:16px 16px 15px!important}
  .tf-header-main{gap:11px;align-items:center}
  .tf-header-logo{width:54px;height:54px;flex-basis:54px}
  .tf-header-copy h1{font-size:1.85rem!important;white-space:normal}
  .tf-header-product-line{font-size:.84rem!important;margin-top:4px!important;line-height:1.22!important}
  .tf-header-sub{font-size:.72rem!important;margin-top:3px!important;line-height:1.25!important}
  .tf-header-mode-badge{display:inline-flex!important;margin:12px 0 0 65px!important;padding:6px 10px!important;font-size:.74rem!important}
}
@media(max-width:390px){
  .tf-header-copy h1{font-size:1.7rem!important}
  .tf-header-product-line{font-size:.8rem!important}
  .tf-header-sub{font-size:.68rem!important}
  .tf-header-logo{width:50px;height:50px;flex-basis:50px}
  .tf-header-mode-badge{margin-left:61px!important}
}
`;
if(!document.getElementById(style.id))document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',polish,{once:true});else polish();
window.addEventListener('load',polish,{once:true});
[150,500,1200].forEach(ms=>setTimeout(polish,ms));
})();
