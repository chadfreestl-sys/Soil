/* Turfarium thermal timeline bridge — observational, not yet coupled to plant biology. */
(function(){
 'use strict';
 const $=id=>document.getElementById(id);
 const climate={
  stl:[31,36,46,57,67,76,80,78,71,59,47,36],
  gainesville:[54,57,63,69,76,81,82,82,79,71,62,56],
  denver:[30,33,40,48,58,68,74,72,63,51,39,31],
  seattle:[42,44,47,51,57,62,66,66,61,53,46,42],
  phoenix:[55,59,65,73,82,92,96,95,89,77,64,55]
 };
 let state=null,lastDay=0,lastSettings='';
 function settings(){
  return [ $('region')?.value||'stl',$('startMonth')?.value||'2',$('weatherMode')?.value||'normal'].join('|');
 }
 function forecast(day){
  const region=$('region')?.value||'stl';
  const start=Number($('startMonth')?.value||2);
  const month=Math.floor((start+day/30.4375)%12);
  const next=(month+1)%12;
  const frac=(start+day/30.4375)%12-month;
  const arr=climate[region]||climate.stl;
  const baseline=arr[month]*(1-frac)+arr[next]*frac;
  const mode=$('weatherMode')?.value||'normal';
  const anomaly={normal:0,drought:4,wet:-2,heat:9,cool:-7}[mode]||0;
  const cycle=Math.sin(day*2.39996)*3.5;
  const mean=baseline+anomaly+cycle;
  return {highF:mean+9,lowF:mean-9,solarIndex:Math.max(0.15,0.6+0.22*Math.sin(day*0.34))};
 }
 function moisture(){
  // Legacy moist is a 0–100 relative index, NOT measured volumetric water content.
  // Mapping is a provisional proxy only.
  const legacy=Number(window.TurfariumThermalMoistureIndex);
  return Number.isFinite(legacy)?Math.max(0.08,Math.min(0.5,legacy/200)):0.30;
 }
 function readDay(){
  const match=($('time')?.textContent||'').match(/Day\s+(\d+)/i);
  return match?Number(match[1]):0;
 }
 function fmt(n){return Number.isFinite(n)?n.toFixed(1)+'°F':'—'}
 function render(){
  const host=$('tf-thermal-panel');
  if(!host||!state)return;
  const last=state.history.at(-1);
  const air=last?.airF??null;
  const root=last?.rootF??(0.55*state.soilF[2]+0.35*state.soilF[6]+0.1*state.soilF[12]);
  host.innerHTML='<strong>🌡️ Soil thermal profile · experimental</strong>'+
   '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:7px">'+
   [['Air mean',air],['Surface mean',state.surfaceF],['2 in',state.soilF[2]],['6 in',state.soilF[6]],['12 in',state.soilF[12]],['Root-zone proxy',root]]
    .map(([name,value])=>'<span>'+name+': <b>'+fmt(value)+'</b></span>').join('')+
   '</div><small>Illustrative synthetic weather · daily averages; frost and freezing cannot be inferred from daily mean alone. '+
   'Freeze–thaw transitions (surface mean): '+state.freezeThawCycles+
   '. Thermal outputs do not yet drive plant or microbial indices.</small>';
 }
 function initialize(){
  if(!window.TurfariumThermal)return;
  const arr=climate[$('region')?.value]||climate.stl;
  const month=Number($('startMonth')?.value||2);
  state=window.TurfariumThermal.initialState({initialSoilF:arr[month]});
  lastDay=0;lastSettings=settings();render();
 }
 function onAdvance(){
  if(!window.TurfariumThermal)return;
  const current=readDay();
  if(!state||current<lastDay||settings()!==lastSettings)initialize();
  if(current>lastDay){
   const start=lastDay;
   state=window.TurfariumThermal.advance(state,current-start,i=>forecast(start+i),()=>({moisture:moisture()}));
   lastDay=current;
  }
  render();
 }
 function start(){
  const anchor=$('timeline-workflow');
  if(!anchor||$('tf-thermal-panel'))return;
  const panel=document.createElement('div');
  panel.id='tf-thermal-panel';
  panel.setAttribute('role','status');
  panel.style.cssText='padding:12px;margin:10px 0;border:1px solid #80ad9a;border-radius:12px;background:#173c34;color:#f5fff7;font-size:.85rem;line-height:1.7';
  anchor.insertBefore(panel,anchor.querySelector('#visit'));
  initialize();
  window.addEventListener('turfarium:time-advanced',onAdvance);
  $('restart')?.addEventListener('click',()=>setTimeout(initialize,0));
  ['region','startMonth','weatherMode'].forEach(id=>$(id)?.addEventListener('change',()=>{initialize();onAdvance()}));
  onAdvance();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
