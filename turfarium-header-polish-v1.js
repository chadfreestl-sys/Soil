/* Turfarium header polish v1.3 — bolder masthead with no audience badge on desktop or mobile. */
(()=>{'use strict';
function polish(){
  const header=document.querySelector('main > header')||document.querySelector('header');
  if(!header)return false;
  header.className='tf-header-polish';
  header.innerHTML=`
    <div class="tf-header-main">
      <img class="tf-header-logo" src="turfarium-icon.svg" alt="">
      <div class="tf-header-copy">
        <h1>Turfarium</h1>
        <div class="tf-header-product-line">Interactive Turf Ecosystem Simulator</div>
        <p class="tf-header-sub">Turfgrass · soil · roots · biology over time</p>
      </div>
    </div>`;
  return true;
}
const style=document.createElement('style');
style.id='tf-header-polish-v13-style';
style.textContent=`
header.tf-header-polish{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:18px!important;padding:20px 22px!important;flex-wrap:nowrap!important}
.tf-header-main{display:flex;align-items:center;gap:14px;min-width:0;flex:1 1 auto}
.tf-header-logo{width:70px;height:70px;flex:0 0 70px;display:block}
.tf-header-copy{min-width:0}.tf-header-copy h1{margin:0!important;color:#0d613b!important;font-size:clamp(2.2rem,4.4vw,3rem)!important;line-height:.95!important;letter-spacing:-.055em!important;font-weight:950!important;white-space:nowrap;text-shadow:0 .35px 0 currentColor}
.tf-header-product-line{margin-top:6px;color:#20392d!important;font-size:1rem;font-weight:900!important;line-height:1.18;letter-spacing:-.015em}
.tf-header-sub{margin:4px 0 0!important;color:#617469!important;font-size:.8rem!important;line-height:1.35!important;font-weight:650!important}
.tf-header-mode-badge{display:none!important}
@media(max-width:620px){
  header.tf-header-polish{display:block!important;padding:16px!important}
  .tf-header-main{gap:11px;align-items:center}
  .tf-header-logo{width:54px;height:54px;flex-basis:54px}
  .tf-header-copy h1{font-size:1.85rem!important;white-space:normal;font-weight:900!important;letter-spacing:-.045em!important;text-shadow:none}
  .tf-header-product-line{font-size:.84rem!important;margin-top:4px!important;line-height:1.22!important;font-weight:850!important}
  .tf-header-sub{font-size:.72rem!important;margin-top:3px!important;line-height:1.25!important;font-weight:600!important}
}
@media(max-width:390px){
  .tf-header-copy h1{font-size:1.7rem!important}
  .tf-header-product-line{font-size:.8rem!important}
  .tf-header-sub{font-size:.68rem!important}
  .tf-header-logo{width:50px;height:50px;flex-basis:50px}
}
`;
if(!document.getElementById(style.id))document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',polish,{once:true});else polish();
window.addEventListener('load',polish,{once:true});
[150,500,1200].forEach(ms=>setTimeout(polish,ms));
})();
