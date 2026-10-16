(()=>{
  'use strict';
  if(window.__turfariumLivingProfiles)return;
  window.__turfariumLivingProfiles=true;

  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const panels=[document.getElementById('lawn-a-panel'),document.getElementById('lawn-b-panel')].filter(Boolean);
  if(!panels.length)return;

  const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
  const metric=(panel,names,fallback)=>{
    const t=(panel.innerText||'').replace(/\s+/g,' ');
    for(const name of names){
      const re=new RegExp(name+'[^0-9-]{0,18}(-?\\d+(?:\\.\\d+)?)','i');
      const m=t.match(re); if(m)return Number(m[1]);
    }
    return fallback;
  };
  const readState=panel=>({
    vigor:clamp(metric(panel,['vigor','turf vigor','health'],68)),
    moisture:clamp(metric(panel,['moisture','soil moisture'],48)),
    oxygen:clamp(metric(panel,['o₂','oxygen','root-zone o2','o2'],62)),
    roots:clamp(metric(panel,['root mass','rooting','roots'],58))
  });

  let motion=localStorage.getItem('turfariumMotion')||'normal';
  if(reduced)motion='off';
  const stages=[];

  panels.forEach((panel,panelIndex)=>{
    const base=panel.querySelector('canvas.profile');
    if(!base)return;
    const stage=document.createElement('div');
    stage.className='tf-living-stage';
    base.parentNode.insertBefore(stage,base);
    stage.appendChild(base);
    const overlay=document.createElement('canvas');
    overlay.className='tf-living-overlay';
    overlay.setAttribute('aria-hidden','true');
    stage.appendChild(overlay);
    const ctx=overlay.getContext('2d');
    const seed=panelIndex*4.17+1.3;
    stages.push({panel,base,stage,overlay,ctx,seed,burst:0,replay:false});
  });
  if(!stages.length)return;

  const sizeOverlay=s=>{
    if(s.overlay.width!==s.base.width||s.overlay.height!==s.base.height){
      s.overlay.width=s.base.width||800; s.overlay.height=s.base.height||480;
    }
  };

  const drawLiving=(s,now)=>{
    sizeOverlay(s);
    const {ctx,overlay}=s,w=overlay.width,h=overlay.height;
    ctx.clearRect(0,0,w,h);
    if(motion==='off'||s.replay)return;
    const st=readState(s.panel), speed=motion==='low'?.55:1;
    const amp=((100-st.moisture)/100*4+1.2)*speed;
    const grassY=h*.205;
    const count=Math.round(8+st.vigor/10);
    ctx.save(); ctx.lineCap='round';
    for(let i=0;i<count;i++){
      const x=w*(.04+i/(count+1)*.92);
      const len=h*(.025+.027*(st.vigor/100));
      const sway=Math.sin(now*.0012*speed+i*.77+s.seed)*amp;
      ctx.strokeStyle=`rgba(34,112,57,${.08+.08*st.vigor/100})`; ctx.lineWidth=Math.max(1,w/650);
      ctx.beginPath();ctx.moveTo(x,grassY+len*.25);ctx.quadraticCurveTo(x+sway*.35,grassY-len*.35,x+sway,grassY-len);ctx.stroke();
    }
    // Moisture-driven pore-water movement: deliberately subtle, not decorative rain.
    const waterN=Math.round(Math.max(0,(st.moisture-38)/8)+(s.burst>0?8:0));
    for(let i=0;i<waterN;i++){
      const phase=(now*.00008*speed+i*.137+s.seed)%1;
      const x=w*(.1+((i*.311+s.seed*.17)%1)*.8), y=h*(.28+phase*.48);
      ctx.fillStyle=`rgba(70,137,180,${.035+.07*st.moisture/100})`;
      ctx.beginPath();ctx.ellipse(x,y,Math.max(1,w*.0018),Math.max(2,h*.005),0,0,Math.PI*2);ctx.fill();
    }
    // Root-zone activity follows oxygen/root condition.
    const rootAlpha=.025+.08*(st.oxygen/100)*(st.roots/100)+(s.burst>0?.08:0);
    for(let i=0;i<5;i++){
      const x=w*(.22+i*.14), y=h*(.48+i%2*.055), r=h*(.014+.007*Math.sin(now*.001+i));
      const g=ctx.createRadialGradient(x,y,0,x,y,r*2.4);g.addColorStop(0,`rgba(238,221,174,${rootAlpha})`);g.addColorStop(1,'rgba(238,221,174,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r*2.4,0,Math.PI*2);ctx.fill();
    }
    // Occasional earthworm motion only under reasonably moist, oxygenated conditions.
    if(st.moisture>32&&st.moisture<82&&st.oxygen>38){
      const wx=w*(.69+.025*Math.sin(now*.00013+s.seed)), wy=h*(.70+.018*Math.sin(now*.00018+s.seed));
      ctx.strokeStyle='rgba(126,78,55,.16)';ctx.lineWidth=Math.max(2,w*.004);ctx.beginPath();
      for(let k=0;k<18;k++){const px=wx+k*w*.0042,py=wy+Math.sin(k*.55+now*.002*speed)*h*.006;if(k===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}ctx.stroke();
    }
    if(s.burst>0){
      // Short root-extension cue after a time advance.
      ctx.strokeStyle=`rgba(245,238,211,${.12+.18*st.oxygen/100})`;ctx.lineWidth=Math.max(1,w*.0018);
      for(let i=0;i<4;i++){const x=w*(.28+i*.13),depth=h*(.09+.09*st.roots/100)*(1-s.burst*.35);ctx.beginPath();ctx.moveTo(x,h*.46);ctx.quadraticCurveTo(x+w*.02*Math.sin(i+s.seed),h*.53,x+w*.008, h*.46+depth);ctx.stroke();}
      s.burst=Math.max(0,s.burst-.018*speed);
    }
    ctx.restore();
  };

  let last=0;
  const tick=now=>{
    if(now-last>38){stages.forEach(s=>drawLiving(s,now));last=now;}
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // In-session visual history. Frames are copies of the real rendered Lawn A/B canvases.
  const frames=[];
  const copyCanvas=base=>{const c=document.createElement('canvas');c.width=base.width;c.height=base.height;c.getContext('2d').drawImage(base,0,0);return c;};
  const currentDayLabel=()=>{
    const candidates=['#simDay','#currentDay','#day','.current-day','.timeline-day'];
    for(const sel of candidates){const el=document.querySelector(sel);if(el&&el.textContent.trim())return el.textContent.trim();}
    return `State ${frames.length}`;
  };
  const capture=label=>{
    if(stages.some(s=>!s.base.width))return;
    frames.push({shots:stages.map(s=>copyCanvas(s.base)),label:label||currentDayLabel()});
    if(frames.length>14)frames.shift();
    syncReplay();
  };

  const deck=document.getElementById('profile-control-deck');
  const memory=document.getElementById('scenario-memory');
  const lawnA=document.getElementById('lawn-a-panel');
  const bar=document.createElement('section');
  bar.className='tf-replay-bar';
  bar.innerHTML=`<div class="tf-replay-title"><strong>Replay ecosystem changes</strong><small>Watch Lawn A & B diverge through this session</small></div><div class="tf-replay-controls"><button type="button" class="tf-replay-play">▶ Replay</button><input class="tf-replay-range" type="range" min="0" max="0" value="0" aria-label="Replay saved simulation states"><span class="tf-replay-status">Start</span></div><label class="tf-motion-wrap">Motion <select class="tf-motion-select"><option value="off">Off</option><option value="low">Low</option><option value="normal">Normal</option></select></label>`;
  const anchor=memory||deck;
  if(anchor)anchor.insertAdjacentElement('afterend',bar); else lawnA?.insertAdjacentElement('beforebegin',bar);
  const play=bar.querySelector('.tf-replay-play'), range=bar.querySelector('.tf-replay-range'), status=bar.querySelector('.tf-replay-status'), motionSelect=bar.querySelector('.tf-motion-select');
  motionSelect.value=motion;
  if(reduced){motionSelect.value='off';motionSelect.disabled=true;motionSelect.title='Reduced motion is enabled in your device settings';}
  motionSelect.addEventListener('change',()=>{motion=motionSelect.value;localStorage.setItem('turfariumMotion',motion);if(motion==='off')stages.forEach(s=>s.ctx.clearRect(0,0,s.overlay.width,s.overlay.height));});

  const syncReplay=()=>{range.max=Math.max(0,frames.length-1);range.value=frames.length-1;status.textContent=frames.length>1?`${frames.length} states`:'Start';play.disabled=frames.length<2;};
  const leaveReplay=()=>{stages.forEach(s=>{s.replay=false;s.stage.classList.remove('tf-replaying');});};
  const showFrame=i=>{
    const f=frames[i];if(!f)return;
    stages.forEach((s,n)=>{sizeOverlay(s);s.replay=true;s.stage.classList.add('tf-replaying');s.ctx.clearRect(0,0,s.overlay.width,s.overlay.height);s.ctx.drawImage(f.shots[n],0,0,s.overlay.width,s.overlay.height);});
    status.textContent=f.label||`State ${i+1}`;
  };
  const crossfade=(from,to,duration=720)=>new Promise(resolve=>{
    const a=frames[from],b=frames[to];if(!a||!b){resolve();return;}const start=performance.now();
    const draw=now=>{const p=Math.min(1,(now-start)/duration);stages.forEach((s,n)=>{sizeOverlay(s);s.replay=true;s.stage.classList.add('tf-replaying');const c=s.ctx;c.clearRect(0,0,s.overlay.width,s.overlay.height);c.globalAlpha=1;c.drawImage(a.shots[n],0,0,s.overlay.width,s.overlay.height);c.globalAlpha=p;c.drawImage(b.shots[n],0,0,s.overlay.width,s.overlay.height);c.globalAlpha=1;});status.textContent=b.label||`State ${to+1}`;range.value=to;if(p<1)requestAnimationFrame(draw);else resolve();};requestAnimationFrame(draw);
  });
  range.addEventListener('input',()=>showFrame(Number(range.value)));
  range.addEventListener('change',()=>setTimeout(leaveReplay,1200));
  play.addEventListener('click',async()=>{
    if(frames.length<2)return;play.disabled=true;play.textContent='Playing…';
    for(let i=0;i<frames.length-1;i++)await crossfade(i,i+1,760);
    play.textContent='▶ Replay';play.disabled=false;setTimeout(leaveReplay,1200);
  });

  // Capture the starting state after the simulator has completed its own first render.
  setTimeout(()=>capture('Start'),650);

  // Time advances trigger a short ecosystem-response burst, then record the resulting rendered profiles.
  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-step],#profile-control-deck button');
    if(!btn)return;
    const txt=(btn.textContent||'').toLowerCase();
    if(!btn.hasAttribute('data-step')&&!/(\+\s*7|\+\s*30|\+\s*90|year|advance)/.test(txt))return;
    leaveReplay();stages.forEach(s=>{s.burst=1;s.stage.classList.remove('tf-living-pulse');void s.stage.offsetWidth;s.stage.classList.add('tf-living-pulse');});
    setTimeout(()=>capture((btn.textContent||'Advance').trim()),900);
  },true);

  syncReplay();
})();
