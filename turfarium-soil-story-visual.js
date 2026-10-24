/* Turfarium soil story visual — decorative, responsive, no model-state claims. */
(()=>{'use strict';
function init(){
 if(document.getElementById('tf-soil-story'))return;
 const heading=[...document.querySelectorAll('h2,h3,summary')].find(el=>el.textContent.trim().toLowerCase().startsWith('shared starting conditions'));
 if(!heading)return;
 const section=heading.closest('section,.card,details')||heading.parentElement;
 if(!section)return;
 const panel=document.createElement('section');
 panel.id='tf-soil-story';
 panel.setAttribute('aria-label','Living lawn illustration');
 panel.innerHTML=`<div class="tf-story-head"><span class="tf-story-kicker">ABOVE & BELOW THE SURFACE</span><strong>One lawn. A whole living ecosystem.</strong><span>Follow the connections between turf, roots, water, and soil life.</span></div><div class="tf-story-scene" aria-hidden="true"><div class="tf-story-sky"><span class="tf-story-sun"></span><span class="tf-story-cloud"></span></div><div class="tf-story-grass"></div><div class="tf-story-earth"><div class="tf-story-roots"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="tf-story-worm"></span><span class="tf-story-microbe m1"></span><span class="tf-story-microbe m2"></span><span class="tf-story-microbe m3"></span><span class="tf-story-water w1"></span><span class="tf-story-water w2"></span><span class="tf-story-water w3"></span></div></div><div class="tf-story-foot"><span>☀ Turf canopy</span><span>↳ Root zone</span><span>● Soil biology</span><span>◈ Moisture</span></div>`;
 const style=document.createElement('style');style.textContent=`
 #tf-soil-story{overflow:hidden;margin:12px 0;border:1px solid #b8cbb5;border-radius:22px;background:#f5f8ee;color:#183d2d;box-shadow:0 10px 24px #152c1918}
 .tf-story-head{padding:16px 18px 12px;display:grid;gap:4px}.tf-story-kicker{font-size:10px;font-weight:900;letter-spacing:.17em;color:#54775d}.tf-story-head strong{font-size:clamp(18px,4.5vw,25px);line-height:1.18;color:#12472e}.tf-story-head>span:last-child{font-size:12px;font-weight:600;color:#47634f;line-height:1.45}
 .tf-story-scene{position:relative;height:180px;overflow:hidden;background:linear-gradient(#cce8e5 0%,#e7f3e0 47%,#7cad63 48%,#4f783a 53%,#715037 54%,#3e3028 100%)}
 .tf-story-sky{position:absolute;inset:0 0 48%}.tf-story-sun{position:absolute;right:14%;top:14px;width:37px;height:37px;border-radius:50%;background:#f8d66f;box-shadow:0 0 0 9px #f8e5a066}.tf-story-cloud{position:absolute;left:16%;top:30px;width:76px;height:17px;border-radius:30px;background:#fff9;box-shadow:18px -8px 0 3px #fff8}
 .tf-story-grass{position:absolute;top:42%;height:19%;left:0;right:0;background:repeating-linear-gradient(105deg,transparent 0 5px,#28683d 6px 8px,transparent 9px 13px),repeating-linear-gradient(75deg,transparent 0 4px,#39874a 5px 7px,transparent 8px 11px);clip-path:polygon(0 70%,2% 8%,4% 70%,6% 2%,8% 70%,10% 14%,12% 70%,14% 0%,16% 70%,18% 18%,20% 70%,22% 0%,24% 70%,26% 10%,28% 70%,30% 0%,32% 70%,34% 12%,36% 70%,38% 0%,40% 70%,42% 8%,44% 70%,46% 0%,48% 70%,50% 12%,52% 70%,54% 0%,56% 70%,58% 10%,60% 70%,62% 0%,64% 70%,66% 14%,68% 70%,70% 0%,72% 70%,74% 10%,76% 70%,78% 0%,80% 70%,82% 12%,84% 70%,86% 0%,88% 70%,90% 10%,92% 70%,94% 0%,96% 70%,98% 12%,100% 70%,100% 100%,0 100%)}
 .tf-story-earth{position:absolute;top:54%;bottom:0;left:0;right:0;background:radial-gradient(circle at 16% 35%,#9d7953 0 2px,transparent 3px),radial-gradient(circle at 78% 60%,#9d7953 0 2px,transparent 3px),linear-gradient(#76583e,#3d3028)}
 .tf-story-roots{position:absolute;left:15%;right:15%;top:0;height:95%;display:flex;justify-content:space-around}.tf-story-roots i{height:var(--h,75%);width:2px;background:#e7c9a0;transform:rotate(var(--r,0deg));transform-origin:top;opacity:.88;border-radius:2px}.tf-story-roots i:nth-child(2n){--h:55%;--r:16deg}.tf-story-roots i:nth-child(3n){--h:90%;--r:-13deg}
 .tf-story-worm{position:absolute;left:69%;top:42%;width:47px;height:17px;border:5px solid #d59d85;border-top:0;border-radius:0 0 45px 45px;transform:rotate(-15deg)}
 .tf-story-microbe{position:absolute;width:8px;height:8px;border-radius:50%;background:#a8c883;box-shadow:0 0 0 3px #a8c88344}.m1{left:18%;top:40%}.m2{left:51%;top:70%}.m3{left:84%;top:25%}
 .tf-story-water{position:absolute;width:7px;height:11px;background:#85c6d9;border-radius:60% 60% 65% 65%;transform:rotate(35deg)}.w1{left:32%;top:42%}.w2{left:62%;top:80%}.w3{left:90%;top:64%}
 .tf-story-foot{display:flex;gap:8px;flex-wrap:wrap;justify-content:space-around;padding:11px 9px;font-size:10px;font-weight:800;color:#315c41;background:#edf3e7}
 @media(max-width:420px){.tf-story-scene{height:150px}.tf-story-head{padding:14px 15px 10px}.tf-story-foot{font-size:9px;gap:6px}}
 `;document.head.appendChild(style);section.insertAdjacentElement('afterend',panel);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();