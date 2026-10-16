/* Turfarium v23.3 compact illustrated ecosystem previews (schematic, not live readings) */
(()=>{
const render=()=>{
 const deck=document.getElementById('profile-control-deck');
 const grid=deck?.querySelector('.profile-deck-grid');
 if(!grid||grid.querySelector('.tf-quick-visuals'))return;
 const svg=(kind)=>{
  const roots=kind==='roots';
  return '<svg viewBox="0 0 120 70" role="img" aria-label="'+(roots?'Illustration of turf roots':'Illustration of soil layers')+'"><rect width="120" height="70" fill="#c7e6ef"/><rect y="27" width="120" height="43" fill="#806044"/><path d="M0 28H120" stroke="#4e963c" stroke-width="5"/>'+[12,26,40,54,68,82,96,110].map(x=>'<path d="M'+x+' 27q-7 -12 -3 -19m3 19q6 -11 9 -17" stroke="#4a963d" stroke-width="2.5" fill="none"/>').join('')+(roots?[18,39,61,83,104].map(x=>'<path d="M'+x+' 28q-10 12 0 23t-4 17m4 -20 10 10m-10 -2 -8 8" stroke="#efe1ba" stroke-width="1.6" fill="none"/>').join(''):'<path d="M0 43H120M0 57H120" stroke="#ab805d" stroke-width="3"/><circle cx="19" cy="49" r="3" fill="#c5b497"/><circle cx="73" cy="62" r="4" fill="#c5b497"/>')+'</svg>';
 };
 const wrap=document.createElement('div');
 wrap.className='tf-quick-visuals';
 wrap.setAttribute('aria-label','Illustrative ecosystem previews');
 wrap.innerHTML='<div class="tf-quick-visual">'+svg('soil')+'<span><strong>Soil profile</strong><small>Schematic layers</small></span></div><div class="tf-quick-visual">'+svg('roots')+'<span><strong>Root zone</strong><small>Schematic roots</small></span></div>';
 grid.appendChild(wrap);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
window.addEventListener('load',render,{once:true});
setTimeout(render,1100);
})();
