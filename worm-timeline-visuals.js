/* Turfarium independent lawn biology visualizer v1.0
   Educational animation: movement illustrates model indices, not organism tracking. */
(()=>{
'use strict';
if(window.__tfWormScenes)return;
window.__tfWormScenes=true;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const scenes=['A','B'].map((key,i)=>{
 const panel=document.getElementById('lawn-'+key.toLowerCase()+'-panel');
 const stage=panel?.querySelector('.photo-stage');
 if(!stage)return null;
 stage.style.position='relative';
 const canvas=document.createElement('canvas');
 canvas.className='tf-worm-scene';
 canvas.setAttribute('aria-hidden','true');
 canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3';
 stage.appendChild(canvas);
 const note=document.createElement('div');
 note.className='tf-worm-status';
 note.style.cssText='position:absolute;right:7px;bottom:7px;z-index:4;padding:4px 7px;border-radius:8px;background:rgba(10,35,25,.83);color:#fff;font:700 11px system-ui,sans-serif;pointer-events:none';
 stage.appendChild(note);
 return {key,i,panel,stage,canvas,note,ctx:canvas.getContext('2d'),day:-1,activity:33,vigor:71,phase:i*1.9,step:0};
}).filter(Boolean);
if(!scenes.length)return;
const metric=(panel,label,fallback)=>{
 const cards=[...panel.querySelectorAll('.kpi')];
 for(const card of cards){
  const t=(card.textContent||'').replace(/\\s+/g,' ').trim();
  if(t.toLowerCase().includes(label.toLowerCase())){
   const match=t.match(/(-?\\d+(?:\\.\\d+)?)\\s*\\/\\s*100/);
   if(match)return clamp(Number(match[1]),0,100);
  }
 }
 return fallback;
};
const refresh=s=>{
 const badge=document.getElementById('day'+s.key);
 const day=Number((badge?.textContent||'').match(/Day\\s+(\\d+)/i)?.[1]||0);
 if(day!==s.day){s.day=day;s.step+=1;}
 s.activity=metric(s.panel,'Earthworm activity',s.activity);
 s.vigor=metric(s.panel,'Turf vigor',s.vigor);
 s.note.textContent='Worm activity '+Math.round(s.activity)+'/100 · Day '+day;
};
const draw=(s,t)=>{
 const rect=s.stage.getBoundingClientRect();
 if(rect.width<40||rect.height<40)return;
 const dpr=Math.min(devicePixelRatio||1,2),w=Math.round(rect.width*dpr),h=Math.round(rect.height*dpr);
 if(s.canvas.width!==w||s.canvas.height!==h){s.canvas.width=w;s.canvas.height=h;}
 const ctx=s.ctx;
 ctx.clearRect(0,0,w,h);
 const moving=!reduced&&localStorage.getItem('turfariumMotion')!=='off';
 const speed=localStorage.getItem('turfariumMotion')==='low'?.4:1;
 const time=moving?t*.00033*speed:0;
 const count=s.activity<12?0:s.activity<35?1:s.activity<65?2:3;
 // Separate organisms per lawn; visibility and travel depend on each lawn's own model activity.
 for(let j=0;j<count;j++){
  const seed=s.i*3.1+j*2.2;
  const activity=s.activity/100;
  const x=w*(.18+((seed*.19+.27+time*(.055+.08*activity)*(j%2?1:-1))% .65+.65)% .65);
  const y=h*(.70+.09*Math.sin(seed*1.8+time*.65)+.045*j);
  const length=w*(.067+.025*activity),segments=22;
  ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
  ctx.shadowColor='rgba(0,0,0,.65)';ctx.shadowBlur=3*dpr;
  ctx.beginPath();
  for(let k=0;k<=segments;k++){
   const p=k/segments;
   const px=x+(p-.5)*length;
   const py=y+Math.sin(p*8.5-time*3+seed)*h*.013*(moving?1:.45);
   if(k===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
  }
  ctx.strokeStyle='rgba(22,13,11,.83)';ctx.lineWidth=7*dpr;ctx.stroke();
  ctx.shadowBlur=0;
  ctx.strokeStyle='rgba(174,105,91,.93)';ctx.lineWidth=4.3*dpr;ctx.stroke();
  ctx.setLineDash([1.2*dpr,3.5*dpr]);ctx.strokeStyle='rgba(84,43,39,.75)';ctx.lineWidth=1.4*dpr;ctx.stroke();
  ctx.restore();
 }
 // Subtle turf response cue in each lawn, keyed to its own vigor and simulation day.
 const roots=Math.round(3+s.vigor/28);
 ctx.save();ctx.strokeStyle='rgba(246,232,196,.24)';ctx.lineWidth=1.5*dpr;ctx.lineCap='round';
 for(let j=0;j<roots;j++){
  const x=w*(.23+j*.13),top=h*.46;
  const len=h*(.045+.06*s.vigor/100);
  ctx.beginPath();ctx.moveTo(x,top);
  ctx.quadraticCurveTo(x+w*.015,top+len*.5,x+w*.012+Math.sin(j+s.day*.012)*w*.008,top+len);
  ctx.stroke();
 }
 ctx.restore();
};
let last=0;
const loop=t=>{
 if(t-last>75){scenes.forEach(s=>{refresh(s);draw(s,t)});last=t;}
 requestAnimationFrame(loop);
};
scenes.forEach(refresh);
requestAnimationFrame(loop);
})();
