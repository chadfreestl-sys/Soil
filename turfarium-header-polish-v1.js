/* Turfarium header polish v1 — remove build-status clutter and tighten the product heading. */
(()=>{'use strict';
let done=false;
function polish(){
  const header=document.querySelector('main > header')||document.querySelector('header');
  if(!header)return false;
  header.classList.add('tf-header-polish');

  // Remove build/status treatment from the public-facing masthead.
  header.querySelectorAll('.build-badge').forEach(el=>el.remove());
  [...header.querySelectorAll('*')].forEach(el=>{
    if(/HIGH\s+CONTRAST/i.test((el.textContent||'').trim()) && !el.querySelector('*'))el.remove();
  });

  const h1=header.querySelector('h1');
  const brand=h1?.closest('div');
  if(brand){
    brand.classList.add('tf-header-brand');
    const sub=brand.querySelector('.sub');
    if(sub){sub.textContent='Turfgrass · soil · roots · biology over time';sub.classList.add('tf-header-sub');}

    let productLine=[...brand.querySelectorAll('p,div,span,strong')].find(el=>/^Interactive Turf Ecosystem Simulator$/i.test((el.textContent||'').trim()));
    if(!productLine){
      productLine=document.createElement('div');
      productLine.className='tf-header-product-line';
      productLine.textContent='Interactive Turf Ecosystem Simulator';
      h1?.insertAdjacentElement('afterend',productLine);
    }else productLine.classList.add('tf-header-product-line');
  }

  const mode=(document.documentElement.dataset.audience||'homeowner').toLowerCase();
  const label=mode==='research'?'Research / Lab':mode.charAt(0).toUpperCase()+mode.slice(1);
  const modeBadge=[...header.querySelectorAll('.badge')].find(el=>!/HIGH\s+CONTRAST/i.test(el.textContent||''));
  if(modeBadge){modeBadge.textContent=label;modeBadge.classList.add('tf-header-mode-badge');}

  done=true;
  return true;
}

const style=document.createElement('style');
style.id='tf-header-polish-v1-style';
style.textContent=`
header.tf-header-polish{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:14px!important;padding:20px 22px!important}
header.tf-header-polish>.build-badge{display:none!important}
header.tf-header-polish .tf-header-brand{min-width:0;display:grid;grid-template-columns:auto 1fr;column-gap:14px;align-items:center}
header.tf-header-polish .tf-header-brand h1{grid-column:2;margin:0!important;line-height:1!important;display:flex;align-items:center;gap:10px;font-size:clamp(2rem,5vw,2.75rem)!important;letter-spacing:-.045em!important}
header.tf-header-polish .tf-header-brand h1 .turfarium-brand-icon{grid-column:1;grid-row:1 / span 3;width:62px!important;height:62px!important;margin:0!important;align-self:center}
header.tf-header-polish .tf-header-product-line{grid-column:2;margin-top:5px;color:#213b2e!important;font-size:.94rem;font-weight:800;line-height:1.25}
header.tf-header-polish .tf-header-sub{grid-column:2;margin:3px 0 0!important;color:#617469!important;font-size:.82rem!important;line-height:1.35!important}
header.tf-header-polish .tf-header-mode-badge{align-self:center!important;justify-self:end!important;white-space:nowrap!important;padding:8px 13px!important;font-weight:850!important}
@media(max-width:620px){
  header.tf-header-polish{grid-template-columns:1fr!important;padding:17px 16px!important;gap:12px!important}
  header.tf-header-polish .tf-header-brand{grid-template-columns:auto 1fr;column-gap:12px}
  header.tf-header-polish .tf-header-brand h1{font-size:2rem!important}
  header.tf-header-polish .tf-header-brand h1 .turfarium-brand-icon{width:56px!important;height:56px!important}
  header.tf-header-polish .tf-header-product-line{font-size:.88rem!important;margin-top:4px!important}
  header.tf-header-polish .tf-header-sub{font-size:.76rem!important}
  header.tf-header-polish .tf-header-mode-badge{justify-self:start!important;margin-left:68px!important;padding:7px 11px!important}
}
`;
if(!document.getElementById(style.id))document.head.appendChild(style);

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',polish,{once:true});else polish();
window.addEventListener('load',polish,{once:true});
[150,450,1000,2200].forEach(ms=>setTimeout(polish,ms));
const mo=new MutationObserver(()=>{if(!done)polish();else{
  const h=document.querySelector('main > header')||document.querySelector('header');
  if(h?.querySelector('.build-badge')||[...h?.querySelectorAll('*')||[]].some(el=>/HIGH\s+CONTRAST/i.test((el.textContent||'').trim())&&!el.querySelector('*')))polish();
}});
mo.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
setTimeout(()=>mo.disconnect(),8000);
})();
