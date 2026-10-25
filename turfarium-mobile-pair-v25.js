/* Mobile comparison dock: mirror existing lawn photos without moving simulation-owned nodes. */
(()=>{'use strict';
const css=document.createElement('style');css.textContent=`
#tf-mobile-pair{display:none}
@media(max-width:700px){
 #tf-mobile-pair{display:block!important;grid-column:1/-1!important;order:-1000!important;margin:0 0 5px!important;padding:8px!important;background:#f5f8f2;border:1px solid #cad9cb;border-radius:13px}
 #tf-mobile-pair .tf-pair-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
 #tf-mobile-pair .tf-pair-cell{min-width:0;overflow:hidden}
 #tf-mobile-pair .tf-pair-label{font-size:.83rem;font-weight:800;color:#173d2d;margin:0 0 5px;display:flex;justify-content:space-between;gap:3px}
 #tf-mobile-pair .tf-pair-label span{font-weight:600;font-size:.72rem}
 #tf-mobile-pair .tf-pair-photo{width:100%;aspect-ratio:1.25/1;overflow:hidden;border-radius:9px;background:#d6e2d5}
 #tf-mobile-pair img{display:block;width:100%;height:100%;object-fit:cover;object-position:center}
 #lawn-a-panel>.photo-stage,#lawn-b-panel>.photo-stage{display:none!important}
 #tf-playback-strip #canopyTimeline{padding:0!important;background:transparent!important;border:0!important;color:#183b2c!important;margin:5px 0 0!important}
 #tf-playback-strip #canopyTimeline>strong{font-size:.82rem!important;color:#183b2c!important}
 #tf-playback-strip #canopyTimeline>small{display:none!important}
 #tf-playback-strip #canopyTimelineValues{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:5px}
 #tf-playback-strip #canopyTimelineValues>div{border:1px solid #cad9cb!important;border-radius:8px;background:#edf4eb;padding:6px!important;font-size:.73rem!important;line-height:1.45!important;overflow-wrap:anywhere}
 #tf-playback-strip{padding:8px!important}
 #lawn-a-panel,#lawn-b-panel{margin-top:3px!important}
}
`;document.head.appendChild(css);
function mount(){
 const grid=document.querySelector('.simulation-grid'),a=document.querySelector('#lawn-a-panel .photo-stage img'),b=document.querySelector('#lawn-b-panel .photo-stage img');
 if(!grid||!a||!b)return;
 let dock=document.getElementById('tf-mobile-pair');
 if(!dock){dock=document.createElement('section');dock.id='tf-mobile-pair';dock.setAttribute('aria-label','Side-by-side Lawn A and Lawn B visual comparison');dock.innerHTML='<div class="tf-pair-grid"><div class="tf-pair-cell"><div class="tf-pair-label">🅰 Lawn A <span id="tf-pair-day-a">Day 0</span></div><div class="tf-pair-photo"><img id="tf-pair-image-a" alt="Current visual state of Lawn A"></div></div><div class="tf-pair-cell"><div class="tf-pair-label">🅱 Lawn B <span id="tf-pair-day-b">Day 0</span></div><div class="tf-pair-photo"><img id="tf-pair-image-b" alt="Current visual state of Lawn B"></div></div></div>';grid.insertBefore(dock,document.getElementById('lawn-a-panel'));}
 const sync=()=>{for(const [key,source] of [['a',a],['b',b]]){const target=document.getElementById('tf-pair-image-'+key);if(!target)continue;const src=source.currentSrc||source.src;if(target.src!==src)target.src=src;target.style.filter=getComputedStyle(source).filter;target.style.opacity=getComputedStyle(source).opacity;const day=document.getElementById('day'+key.toUpperCase());const label=document.getElementById('tf-pair-day-'+key);if(label&&day)label.textContent=day.textContent;}};
 const obs=new MutationObserver(sync);for(const el of [a,b,document.getElementById('dayA'),document.getElementById('dayB')])if(el)obs.observe(el,{attributes:true,childList:true,characterData:true,subtree:true});
 sync();window.addEventListener('load',sync,{once:true});setInterval(sync,1800);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();