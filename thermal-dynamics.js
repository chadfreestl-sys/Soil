/* Turfarium thermal dynamics v1 — exploratory, not field-calibrated.
 * Daily state: temperatures in Fahrenheit, moisture as volumetric fraction.
 * This module does not modify the existing simulator until explicitly wired in.
 */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  root.TurfariumThermal=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const depths=[2,6,12];
  function initialState(opts={}){
    const t=Number.isFinite(opts.initialSoilF)?opts.initialSoilF:50;
    return {day:0,soilF:{2:t,6:t,12:t},surfaceF:t,freezeThawCycles:0,
      frozenLast:false,rootThermalUnits:0,rootGrowthPotential:0,
      microbialActivityPotential:0,history:[]};
  }
  function step(state,weather,site={}){
    const airHighF=Number(weather.highF),airLowF=Number(weather.lowF);
    if(!Number.isFinite(airHighF)||!Number.isFinite(airLowF)||airHighF<airLowF)
      throw Error('Daily weather requires valid highF >= lowF');
    const airF=(airHighF+airLowF)/2;
    const moisture=clamp(Number.isFinite(site.moisture)?site.moisture:0.30,0.05,0.60);
    const snowIn=clamp(Number(site.snowIn)||0,0,36);
    const litter=clamp(Number(site.litterCover)||0,0,1);
    const shade=clamp(Number(site.shade)||0,0,1);
    const insulation=clamp(0.12*snowIn+0.8*litter,0,0.88);
    const solar=clamp(Number(weather.solarIndex??0.5),0,1);
    // Mean daily surface temperature: approximate energy balance, not an instantaneous frost reading.
    const surfaceTarget=airF+(1-insulation)*(7*solar*(1-shade)-2);
    const surfaceF=state.surfaceF+(surfaceTarget-state.surfaceF)*(0.78-0.55*insulation);
    const soilF={};
    // Moisture influences heat capacity AND conductivity; coefficients are illustrative.
    const conductivityFactor=clamp(0.75+0.7*moisture,0.7,1.2);
    const response={2:0.40,6:0.17,12:0.075};
    let upper=surfaceF;
    for(const d of depths){
      const old=Number(state.soilF[d]);
      soilF[d]=old+(upper-old)*response[d]*conductivityFactor;
      upper=soilF[d];
    }
    const frozen=surfaceF<=32;
    const freezeThawCycles=state.freezeThawCycles+(!frozen&&state.frozenLast?1:0);
    const rootF=0.55*soilF[2]+0.35*soilF[6]+0.10*soilF[12];
    const thermal=clamp((rootF-32)/28,0,1)*clamp((90-rootF)/18,0,1);
    const water=clamp((moisture-0.08)/0.17,0,1)*clamp((0.52-moisture)/0.15,0,1);
    const rootGrowthPotential=thermal*water;
    const microbialActivityPotential=clamp(Math.pow(2,(rootF-68)/18),0.02,2)*water;
    const entry={day:state.day+1,airF,surfaceF,soilF:{...soilF},rootF,
      frozen,rootGrowthPotential,microbialActivityPotential,moisture};
    return {day:entry.day,soilF,surfaceF,freezeThawCycles,frozenLast:frozen,
      rootThermalUnits:state.rootThermalUnits+Math.max(0,rootF-40),
      rootGrowthPotential,microbialActivityPotential,
      history:[...state.history.slice(-364),entry]};
  }
  function advance(state,days,weatherForDay,siteForDay=()=>({})){
    if(!Number.isInteger(days)||days<0||days>3650) throw Error('Invalid day count');
    let next=state;
    for(let i=0;i<days;i++) next=step(next,weatherForDay(i,next),siteForDay(i,next));
    return next;
  }
  return {initialState,step,advance};
});
