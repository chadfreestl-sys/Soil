/* Turfarium ecosystem motion v1: visual-only; simulation engine untouched. */
(()=>{'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const scenes=['A','B'].map((key,idx)=>{
 const panel=document.getElementById('lawn-'+key.toLowerCase()+'-panel');
 const stage=panel?.querySelector('.photo-stage');if(!stage)return null;
 stage.style.position='relative';
 stage.querySelectorAll('.tf-live-worm,.tf-worm-layer,.tf-worm-status-live').forEach(n=>n.remove());
 const canvas=document.createElement('canvas');canvas.className='tf-ecosystem-motion';
 Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'7'});
 stage.append(canvas);
 return {key,idx,stage,canvas,ctx:canvas.getContext('2d'),worms:Array.from({length:3},(_,i)=>({seed:i*2.7+idx*1.1,x:.18+i*.23,y:.58+i*.1})),activity:40,vigor:60,day:0};
}).filter(Boolean);
if(!scenes.length)return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
function metrics(s){
 const k=document.getElementById('kpi'+s.key)?.textContent||'';
 const a=k.match(/Earthworm activity[^0-9]{0,70}(\d+(?:\.\d+)?)\s*\/\s*100/i);
 const v=k.match(/Turf vigor[^0-9]{0,70}(\d+(?:\.\d+)?)\s*\/\s*100/i);
 if(a)s.activity=clamp(+a[1],0,100);
 if(v)s.vigor=clamp(+v[1],0,100);
 s.day=+(document.getElementById('day'+s.key)?.textContent.match(/Day\s*(\d+)/i)?.[1]||0);
}
function worm(ctx,x,y,len,phase,scale){
 const points=[];const n=32;
 for(let i=0;i<=n;i++){
  const p=i/n,amp=Math.sin(Math.PI*p);
  points.push([x+(p-.5)*len,y+Math.sin(p*10-phase)*len*.055*amp]);
 }
 ctx.save();ctx.lineCap='round';ctx.lineJoin='round';
 const draw=(width,color)=>{ctx.beginPath();points.forEach(([px,py],i)=>i?ctx.lineTo(px,py):ctx.moveTo(px,py));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke()};
 draw(10*scale,'rgba(20,12,9,.48)');draw(8*scale,'#56342d');draw(5.7*scale,'#ad7666');draw(1.6*scale,'#d6a596');
 for(let i=2;i<n;i++){let p=i/n,[px,py]=points[i];ctx.beginPath();ctx.ellipse(px,py,1.1*scale,3.5*scale,Math.sin(p*10-phase)*.12,0,Math.PI*2);ctx.strokeStyle='rgba(58,29,25,.45)';ctx.lineWidth=.65*scale;ctx.stroke()}
 const [cx,cy]=points[21];ctx.beginPath();ctx.ellipse(cx,cy,3.3*scale,4.4*scale,0,0,Math.PI*2);ctx.fillStyle='rgba(191,126,106,.65)';ctx.fill();
 ctx.restore();
}
function frame(ms){
 for(const s of scenes){
  metrics(s);const rect=s.stage.getBoundingClientRect();if(rect.width<1||rect.height<1)continue;
  const dpr=Math.min(devicePixelRatio||1,2),w=rect.width,h=rect.height;
  if(s.canvas.width!==Math.round(w*dpr)||s.canvas.height!==Math.round(h*dpr)){s.canvas.width=Math.round(w*dpr);s.canvas.height=Math.round(h*dpr)}
  const c=s.ctx;c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,w,h);
  const t=reduce.matches?0:ms*.001;
  // Root fibers are translucent overlays driven by lawn vigor and elapsed simulation time.
  const rootDepth=clamp(.10+s.vigor*.0015+s.day/1825*.09,.1,.34);
  c.strokeStyle='rgba(224,205,151,.28)';c.lineWidth=.7;
  for(let i=0;i<30;i++){const x=w*(.04+i*.032),depth=h*rootDepth*(.45+(i%7)/12);
   c.beginPath();c.moveTo(x,h*.28);c.bezierCurveTo(x-5,h*.36,x+9,h*.38,x+Math.sin(i*3)*9,h*.28+depth);c.stroke();}
  const visible=s.activity<12?0:s.activity<38?1:s.activity<68?2:3;
  for(let i=0;i<visible;i++){
   const a=s.worms[i],speed=.004+s.activity*.00012;
   const x=w*(.18+((a.x+t*speed*(i%2?-.55:1)+10)% .64));
   const y=h*(a.y+Math.sin(t*.35+a.seed+s.day*.009)*.024);
   c.save();c.beginPath();c.rect(0,h*.35,w,h*.62);c.clip();
   worm(c,x,y,Math.min(w*.14,115),t*1.8+a.seed,clamp(w/650,.48,1.1));
   c.restore();
  }
 }
 requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
})();