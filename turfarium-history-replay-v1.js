/* Turfarium historical visual replay: read-only; never advances or mutates model state. */
(()=>{'use strict';
const frames=[];let timer=null,index=0,playing=false,viewing=false;
const MAX=350,DELAY=4200;
const css=document.createElement('style');css.textContent=`
#tf-playback-strip .tf-strip-replay{display:none!important}
.tf-history-replay{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:8px;padding:8px 0 0;border-top:1px solid #d5e1d3;width:100%}
.tf-history-replay button{min-height:40px;padding:7px 12px;border:1px solid #aac4af;border-radius:9px;background:#174c48;color:#fff;font-weight:750}
.tf-history-replay input[type=range]{flex:1 1 100px;min-width:80px;accent-color:#174c48}
.tf-history-replay output{font-size:.8rem;color:#214a36;font-weight:750;min-width:70px}
.tf-history-replay .tf-replay-note{font-size:.72rem;color:#41614b;flex:1 1 100%}
.tf-history-replay-local{border:1px solid #bfd3c1;border-radius:12px;background:#eef5ec;padding:9px;margin:7px 0 10px}
@media(max-width:700px){#tf-playback-strip>.tf-history-replay{display:none!important}.tf-history-replay-local{gap:6px}.tf-history-replay-local button{padding:7px 9px;font-size:.86rem}}
@media(min-width:701px){.tf-history-replay-local{display:none!important}}
`;document.head.appendChild(css);
function record(frame){
 if(!frame||!Number.isFinite(frame.day)||!frame.A||!frame.B)return;
 if(frame.day===0&&frames.length&&frames[frames.length-1].day>0){stop(true);frames.length=0;}
 const copy=JSON.parse(JSON.stringify(frame));
 const last=frames[frames.length-1];
 if(last&&last.day===copy.day)frames[frames.length-1]=copy;
 else frames.push(copy);
 if(frames.length>MAX)frames.shift();
 update();
}
window.addEventListener('turfarium:history-frame',e=>record(e.detail));
function captureInitial(){
 const buffered=window.TurfariumRecordedFrames;
 if(Array.isArray(buffered)&&buffered.length){for(const frame of buffered)record(frame);return;}
 if(frames.length||typeof window.TurfariumVisualSnapshot!=='function')return;
 try{const A=window.TurfariumVisualSnapshot('A'),B=window.TurfariumVisualSnapshot('B');if(A&&B)record({day:Number(A.day)||0,A,B});}catch(e){console.warn('[Turfarium replay] Initial frame unavailable',e);}}

let box,play,range,label,note,exit;
const mirrors=[];
function syncMirrors(){for(const m of mirrors){m.play.textContent=playing?'⏸ Pause':'▶ Replay';m.play.disabled=frames.length<2;m.range.max=String(Math.max(0,frames.length-1));m.range.value=String(viewing?index:Math.max(0,frames.length-1));m.label.textContent=viewing&&frames[index]?'Day '+frames[index].day:frames.length?'Day '+frames[frames.length-1].day:'No history';}}
function mountMirrors(){for(const key of ['A','B']){const panel=document.getElementById('lawn-'+key.toLowerCase()+'-panel');const photo=panel?.querySelector('.photo-stage');if(!photo||panel.querySelector('.tf-history-replay-local'))continue;const local=document.createElement('div');local.className='tf-history-replay tf-history-replay-local';local.setAttribute('aria-label','Replay recorded history for both lawns');const p=document.createElement('button');p.type='button';p.textContent='▶ Replay';const slider=document.createElement('input');slider.type='range';slider.min='0';slider.max='0';slider.value='0';slider.setAttribute('aria-label','Replay day for both lawns');const out=document.createElement('output');out.textContent='No history';const live=document.createElement('button');live.type='button';live.textContent='↩ Live';local.append(p,slider,out,live);p.addEventListener('click',()=>play?.click());slider.addEventListener('input',()=>{stop(false);show(Number(slider.value));});live.addEventListener('click',()=>stop(true));photo.parentNode.insertBefore(local,photo);mirrors.push({play:p,range:slider,label:out});}syncMirrors();}
function update(){
 if(!box){syncMirrors();return;}
 range.max=String(Math.max(0,frames.length-1));
 if(!viewing)range.value=String(Math.max(0,frames.length-1));
 play.disabled=frames.length<2;
 note.textContent=frames.length<2?'Advance time to record replay frames.':'Recorded '+frames.length+' stages · replay starts at the first saved day.';
 if(!viewing)label.textContent=frames.length?'Day '+frames[frames.length-1].day:'No history';
 syncMirrors();
}
function show(i){
 if(!frames.length)return;
 index=Math.max(0,Math.min(frames.length-1,Number(i)||0));
 viewing=true;
 const frame=frames[index];
 window.TurfariumVisualState?.showReplayFrame?.({A:frame.A,B:frame.B});
 for(const key of ['A','B']){
  const badge=document.getElementById('day'+key);
  if(badge)badge.textContent='Day '+frame.day+' · Replay';
 }
 range.value=String(index);label.textContent='Day '+frame.day;syncMirrors();
}
function stop(restore){
 if(timer){clearInterval(timer);timer=null;}
 playing=false;
 if(play)play.textContent='▶ Replay';syncMirrors();
 if(restore&&viewing){
  viewing=false;
  window.TurfariumVisualState?.endReplay?.();
  // Live day is sourced from the latest recorded simulation snapshot.
  const live=frames[frames.length-1];
  if(live)for(const key of ['A','B']){const badge=document.getElementById('day'+key);if(badge)badge.textContent='Day '+live.day;}
 }
 update();
}
function tick(){
 if(index>=frames.length-1){stop(false);return;}
 show(index+1);
}
function mount(){
 const strip=document.getElementById('tf-playback-strip');
 if(!strip)return;
 if(box?.isConnected)return;
 box=document.createElement('div');box.className='tf-history-replay';box.setAttribute('aria-label','Recorded visual history replay');
 play=document.createElement('button');play.type='button';play.textContent='▶ Replay';
 range=document.createElement('input');range.type='range';range.min='0';range.max='0';range.value='0';range.setAttribute('aria-label','Scrub recorded simulation history');
 label=document.createElement('output');label.textContent='No history';
 exit=document.createElement('button');exit.type='button';exit.textContent='↩ Live';
 note=document.createElement('div');note.className='tf-replay-note';
 box.append(play,range,label,exit,note);strip.appendChild(box);
 play.addEventListener('click',()=>{
  if(playing){stop(false);return;}
  captureInitial();
  if(frames.length<2)return;
  index=0; // Always restart recorded history from the first frame.
  show(index);playing=true;play.textContent='⏸ Pause';
  timer=setInterval(tick,DELAY);syncMirrors();
 });
 range.addEventListener('input',()=>{stop(false);show(Number(range.value));});
 exit.addEventListener('click',()=>stop(true));
 update();mountMirrors();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
window.addEventListener('load',()=>{captureInitial();mount();});setTimeout(()=>{captureInitial();mount();mountMirrors();},850);
window.addEventListener('pagehide',()=>stop(true));
})();