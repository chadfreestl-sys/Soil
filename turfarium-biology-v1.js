/* Turfarium Biological Activity System v1
   Habitat-response layer derived from existing model readouts. Panels are collapsed by default.
   Main habitat adds only subtle mesofauna/microbial activity cues; microscope-scale microbes remain conceptual. */
(()=>{'use strict';
const clamp=(x,a=0,b=100)=>Math.max(a,Math.min(b,x));
const style=document.createElement('style');
style.id='tf-biology-v1-style';
style.textContent=`
.tf-bio-panel{margin-top:12px;border:1px solid #315f58;border-radius:12px;background:linear-gradient(145deg,#0c2426,#0b1c22);overflow:hidden}
.tf-bio-panel>summary{list-style:none;cursor:pointer;padding:12px 13px;display:flex;align-items:center;justify-content:space-between;gap:12px;font-weight:800;color:#daf8e8}
.tf-bio-panel>summary::-webkit-details-marker{display:none}.tf-bio-panel>summary:after{content:'＋';font-size:1.05rem;color:#8ce0bc}.tf-bio-panel[open]>summary:after{content:'−'}
.tf-bio-sub{display:block;font-size:.76rem;color:#c0d9d1;font-weight:650;margin-top:3px}.tf-bio-body{padding:0 12px 12px}.tf-bio-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.tf-bio-tile{background:linear-gradient(145deg,#123638,#0f2c30);border:1px solid #35635d;border-radius:10px;padding:10px 11px;min-width:0;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)}.tf-bio-tile span{display:block;color:#d4e6df;font-size:.76rem;font-weight:650;line-height:1.2}.tf-bio-tile b{display:block;color:#fff!important;font-size:1.35rem;font-weight:800;line-height:1.05;margin-top:5px;text-shadow:0 1px 1px rgba(0,0,0,.4)}.tf-bio-tile small{font-size:.72rem;color:#a9d8c7;font-weight:700;margin-left:3px}.tf-bio-note{font-size:.74rem;color:#b8cbc5;line-height:1.45;margin:10px 1px 0}.tf-bio-bar{height:5px;background:#173b38;border-radius:5px;overflow:hidden;margin-top:8px}.tf-bio-bar i{display:block;height:100%;background:linear-gradient(90deg,#69c89a,#c3e998);transition:width .7s ease;box-shadow:0 0 4px rgba(160,224,181,.26)}.tf-bio-bar.risk i{background:linear-gradient(90deg,#e0be72,#e28c6d)}
.tf-bio-panel>summary>span:last-child{color:#fff!important;font-size:1.28rem;font-weight:850;letter-spacing:.01em;text-shadow:0 1px 2px rgba(0,0,0,.45)}
.tf-fauna-life{position:absolute;inset:0;z-index:4;pointer-events:none;overflow:hidden;border-radius:inherit}.tf-fauna{position:absolute;opacity:0;transition:opacity .8s ease;will-change:transform,opacity}.tf-springtail{width:4px;height:1.8px;border-radius:60%;background:#dad6c4;box-shadow:0 0 1px #000;animation:tfSpring 5.4s ease-in-out infinite alternate}.tf-mite{width:3px;height:3px;border-radius:50%;background:#a97745;box-shadow:-1px 0 0 -0.2px #5a3e28,1px 0 0 -0.2px #5a3e28;animation:tfMite 7.8s ease-in-out infinite alternate}.tf-microhot{width:3px;height:3px;border-radius:50%;background:rgba(173,218,161,.42);filter:blur(.45px);animation:tfPulse 3.8s ease-in-out infinite alternate}@keyframes tfSpring{0%{transform:translate3d(0,0,0) rotate(-8deg)}42%{transform:translate3d(7px,-2px,0) rotate(5deg)}58%{transform:translate3d(11px,-8px,0) rotate(-12deg)}100%{transform:translate3d(17px,1px,0) rotate(8deg)}}@keyframes tfMite{0%{transform:translate3d(0,0,0)}50%{transform:translate3d(-5px,3px,0)}100%{transform:translate3d(8px,-2px,0)}}@keyframes tfPulse{0%{opacity:.08;transform:scale(.8)}100%{opacity:.5;transform:scale(1.8)}}
@media(max-width:480px){.tf-bio-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.tf-bio-panel>summary{padding:11px}.tf-bio-tile{padding:9px}.tf-bio-tile b{font-size:1.22rem}.tf-bio-panel>summary>span:last-child{font-size:1.16rem}.tf-fauna{transform:scale(.9)}}
@media(prefers-reduced-motion:reduce){.tf-fauna{animation:none!important}}
`;
document.head.append(style);
const label=v=>v>=76?'Rich':v>=56?'Active':v>=36?'Moderate':v>=18?'Limited':'Weak';
const read=(panel,names,fallback)=>{const t=panel.textContent||'';for(const name of names){const re=new RegExp(name+'[^0-9]{0,55}([0-9]+(?:\\.[0-9]+)?)','i'),m=t.match(re);if(m)return +m[1]}return fallback};
function calc(panel){
 const vigor=clamp(read(panel,['Turf vigor'],65)),bio=clamp(read(panel,['Beneficial guilds','Biology'],40)),worms=clamp(read(panel,['Earthworm activity'],33));
 const moist=clamp(read(panel,['Soil moisture','Moisture'],58)),oxygen=clamp(read(panel,['Root-zone oxygen','Oxygen'],65)),comp=clamp(read(panel,['Compaction'],45));
 const om=clamp(read(panel,['Soil organic matter','Organic matter','SOM'],3),0,15),ph=clamp(read(panel,['Soil pH','pH'],6.4),4,9),ec=clamp(read(panel,['EC proxy','EC'],.7),0,6),root=clamp(read(panel,['Root depth'],12),0,40);
 const moistureFit=clamp(100-Math.abs(moist-58)*1.65),phFit=clamp(100-Math.abs(ph-6.5)*24),saltFit=clamp(100-ec*13),structure=clamp(100-comp);
 const habitat=clamp(vigor*.19+bio*.19+oxygen*.14+moistureFit*.12+structure*.11+phFit*.08+saltFit*.05+clamp(om/6*100)*.07+clamp(root/24*100)*.05);
 const microbial=clamp(bio*.33+oxygen*.15+moistureFit*.16+phFit*.10+clamp(om/5*100)*.16+vigor*.10);
 const fungal=clamp(microbial*.52+clamp(om/5*100)*.22+structure*.13+clamp(root/22*100)*.13);
 const bacterial=clamp(microbial*.60+moistureFit*.17+phFit*.11+vigor*.12);
 const meso=clamp(microbial*.36+fungal*.22+moistureFit*.16+habitat*.18+structure*.08);
 const macro=clamp(habitat*.36+worms*.34+clamp(om/5*100)*.12+moistureFit*.10+structure*.08);
 const springtails=clamp(meso*.62+fungal*.24+moistureFit*.14),mites=clamp(meso*.58+microbial*.22+habitat*.20);
 const stress=clamp((100-vigor)*.28+(100-oxygen)*.18+comp*.17+(100-moistureFit)*.12+(100-saltFit)*.12+(100-phFit)*.13);
 const pest=clamp(stress*.48+(100-habitat)*.26+Math.max(0,moist-72)*.55+Math.max(0,65-vigor)*.18);
 const balance=clamp(habitat*.50+microbial*.27+meso*.13+macro*.10-pest*.18);
 return{habitat,microbial,bacterial,fungal,meso,macro,springtails,mites,pest,balance,worms};
}
function tile(name,val,risk=false){return `<div class="tf-bio-tile"><span>${name}</span><b>${Math.round(val)} <small>${label(val)}</small></b><div class="tf-bio-bar${risk?' risk':''}"><i style="width:${Math.round(val)}%"></i></div></div>`}
function addFauna(panel,key){const stage=panel.querySelector('.photo-stage');if(!stage)return null;let layer=stage.querySelector('.tf-fauna-life');if(layer)return layer;layer=document.createElement('div');layer.className='tf-fauna-life';layer.setAttribute('aria-hidden','true');
 const make=(cls,count,seed)=>{for(let i=0;i<count;i++){const e=document.createElement('i');e.className='tf-fauna '+cls;const x=7+((i*31+seed*17)%88),y=42+((i*23+seed*11)%49);e.style.left=x+'%';e.style.top=y+'%';e.style.animationDelay=(-((i+seed)*.63))+'s';e.dataset.rank=String(i);layer.append(e)}};
 make('tf-springtail',12,key==='A'?2:5);make('tf-mite',9,key==='A'?7:3);make('tf-microhot',15,key==='A'?4:8);stage.append(layer);return layer}
function updateFauna(layer,s){if(!layer)return;const groups=[['tf-springtail',s.springtails],['tf-mite',s.mites],['tf-microhot',s.microbial]];for(const [cls,val] of groups){const nodes=[...layer.querySelectorAll('.'+cls)],visible=Math.round(clamp(val)/100*nodes.length);nodes.forEach((n,i)=>{n.style.opacity=i<visible?(cls==='tf-microhot'?'.34':'.78'):'0';n.style.animationDuration=((cls==='tf-springtail'?7:cls==='tf-mite'?10:5)-(val/100)*(cls==='tf-springtail'?2.7:cls==='tf-mite'?3:1.2)+(i%4)*.35)+'s'})}}
for(const key of ['A','B']){const panel=document.getElementById('lawn-'+key.toLowerCase()+'-panel');if(!panel)continue;const kpis=document.getElementById('kpi'+key)||panel.querySelector('.kpis');if(!kpis)continue;
 const details=document.createElement('details');details.className='tf-bio-panel';details.id='tf-bio-'+key;details.innerHTML=`<summary><span>🧬 Biological Activity <span class="tf-bio-sub">Habitat · microbes · soil fauna · imbalance</span></span><span id="tf-bio-score-${key}"></span></summary><div class="tf-bio-body"><div class="tf-bio-grid" id="tf-bio-grid-${key}"></div><p class="tf-bio-note">Modeled activity indices, not organism counts. Main-window microfauna are subtle habitat cues; microscope observations remain separate from these simulated indices.</p></div>`;kpis.insertAdjacentElement('afterend',details);
 const fauna=addFauna(panel,key);
 const refresh=()=>{const s=calc(panel);details.querySelector('#tf-bio-score-'+key).textContent=Math.round(s.habitat)+'/100';details.querySelector('#tf-bio-grid-'+key).innerHTML=tile('Habitat quality',s.habitat)+tile('Microbial activity',s.microbial)+tile('Bacterial activity',s.bacterial)+tile('Fungal activity',s.fungal)+tile('Mesofauna',s.meso)+tile('Macrofauna',s.macro)+tile('Food-web balance',s.balance)+tile('Pest / imbalance pressure',s.pest,true);updateFauna(fauna,s);panel.dataset.tfHabitat=Math.round(s.habitat);panel.dataset.tfMicrobial=Math.round(s.microbial);panel.dataset.tfMesofauna=Math.round(s.meso);panel.dataset.tfPest=Math.round(s.pest)};
 const watch=document.getElementById('kpi'+key);if(watch)new MutationObserver(()=>requestAnimationFrame(refresh)).observe(watch,{subtree:true,childList:true,characterData:true});const metrics=document.getElementById('metric'+key);if(metrics)new MutationObserver(()=>requestAnimationFrame(refresh)).observe(metrics,{subtree:true,childList:true,characterData:true});refresh();
}
})();