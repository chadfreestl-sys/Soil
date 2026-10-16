/* Turfarium desktop motion booster: preserve mobile tuning, amplify only wide-screen movement. */
(()=>{'use strict';
const mq=matchMedia('(min-width:900px) and (prefers-reduced-motion:no-preference)');
const style=document.createElement('style');style.id='tf-desktop-motion-style';style.textContent=`
@media (min-width:900px) and (prefers-reduced-motion:no-preference){
 .tf-photo-motion .tf-grass-life{animation-name:tfGrassLifeDesktop!important}
 @keyframes tfGrassLifeDesktop{
  0%{transform:translate3d(-1.15px,.05px,0) skewX(-.22deg)}
  32%{transform:translate3d(.65px,-.22px,0) skewX(.16deg)}
  67%{transform:translate3d(1.35px,.08px,0) skewX(.24deg)}
  100%{transform:translate3d(-.75px,.18px,0) skewX(-.14deg)}
 }
}`;document.head.append(style);
function amplify(){
 const wide=mq.matches;
 document.querySelectorAll('.tf-photo-motion .tf-worm-live').forEach(el=>{
  const base=el.dataset.tfBaseMotion||['--tf-worm-x1','--tf-worm-y1','--tf-worm-x2','--tf-worm-y2','--tf-worm-x3','--tf-worm-y3','--tf-worm-r1','--tf-worm-r2','--tf-worm-r3'].map(k=>el.style.getPropertyValue(k)||'0').join('|');
  el.dataset.tfBaseMotion=base;
  const vals=base.split('|');
  const keys=['--tf-worm-x1','--tf-worm-y1','--tf-worm-x2','--tf-worm-y2','--tf-worm-x3','--tf-worm-y3','--tf-worm-r1','--tf-worm-r2','--tf-worm-r3'];
  const factor=wide?2.35:1;
  keys.forEach((k,i)=>{const raw=vals[i]||'0';const n=parseFloat(raw)||0;const unit=raw.includes('deg')?'deg':'px';el.style.setProperty(k,(n*factor).toFixed(3)+unit)});
 });
}
requestAnimationFrame(()=>requestAnimationFrame(amplify));
addEventListener('load',amplify,{once:true});
if(mq.addEventListener)mq.addEventListener('change',amplify);else if(mq.addListener)mq.addListener(amplify);
})();