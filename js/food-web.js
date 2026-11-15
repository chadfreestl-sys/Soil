/* Turfarium food-web engine v1 — independent, bounded, hypothesis-based dynamics.
   Units are relative activity indices (0–100), NOT measured organism counts.
   Designed to be stepped separately for each lawn. */
(function(global){
"use strict";
const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,Number.isFinite(v)?v:a));
const baseline=()=>({bacteria:45,fungi:35,protozoa:25,nematodesBacterial:22,nematodesFungal:14,nematodesPlant:8,nematodesPredator:9,earthworms:28,earthwormActivity:28,microbialBiomass:40,microarthropods:23,carbon:45,aggregation:40});
function advance(previous,environment={},days=30){
 const p={...baseline(),...(previous||{})};
 const e={temperatureF:65,moisture:55,oxygen:70,pH:6.3,clippings:50,organicInputs:0,disturbance:0,rootExudates:45,phosphorusLimitation:0,solubleSaltStress:0,ammoniumStress:0,...environment};
 const temp=clamp(1-Math.abs(e.temperatureF-68)/55,0,1);
 const wet=clamp(1-Math.abs(e.moisture-55)/70,0,1);
 const air=clamp(e.oxygen/75,0,1);
 const acidity=clamp(1-Math.abs(e.pH-6.5)/3,0,1);
 const habitat=temp*wet*air*acidity;
 // Inputs are relative 0–100 stress/limitation indices, not fertilizer rates or EC measurements.
 const chemicalStress=clamp((clamp(e.solubleSaltStress)*.7+clamp(e.ammoniumStress)*.3)/100,0,1);
 const phosphorusFactor=1-.35*clamp(e.phosphorusLimitation)/100;
 const food=clamp((e.clippings*.35+e.organicInputs*.35+e.rootExudates*.30)*phosphorusFactor,0,100);
 const delta=Math.min(Math.max(days,0),365)/30;
 const target={
 bacteria:clamp(15+food*.58+habitat*24-chemicalStress*18),
 fungi:clamp(15+food*.48+habitat*27-e.disturbance*.18-chemicalStress*12),
 protozoa:clamp(8+p.bacteria*.55+habitat*18),
 nematodesBacterial:clamp(7+p.bacteria*.5+habitat*13),
 nematodesFungal:clamp(7+p.fungi*.5+habitat*13),
 nematodesPlant:clamp(5+e.rootExudates*.28+habitat*10),
 nematodesPredator:clamp(5+(p.nematodesBacterial+p.nematodesFungal)*.22+habitat*12),
 earthworms:clamp(5+food*.34+habitat*35-e.disturbance*.22-chemicalStress*10),
 microarthropods:clamp(7+food*.37+p.fungi*.18+habitat*15-e.disturbance*.18)
 };
 const next={...p};
 for(const [key,value] of Object.entries(target)){
   const rate=key==="earthworms"?.06:key==="fungi"?.17:.24;
   next[key]=clamp(p[key]+(value-p[key])*(1-Math.exp(-rate*delta)));
 }
 // Activity responds faster than abundance; avoid interpreting avoidance as mortality.
 const activityTarget=clamp(next.earthworms*(.35+.65*habitat)*(1-.6*chemicalStress));
 next.earthwormActivity=clamp((p.earthwormActivity??p.earthworms)+(activityTarget-(p.earthwormActivity??p.earthworms))*(1-Math.exp(-.9*delta)));
 const biomassTarget=clamp((next.bacteria+next.fungi)/2);
 next.microbialBiomass=clamp((p.microbialBiomass??40)+(biomassTarget-(p.microbialBiomass??40))*(1-Math.exp(-.12*delta)));
 next.carbon=clamp(p.carbon+delta*(e.clippings*.012+e.organicInputs*.018-(next.bacteria+next.fungi)*.009));
 next.aggregation=clamp(p.aggregation+delta*((next.fungi+next.earthworms)*.014-e.disturbance*.025));
 return next;
}
global.TurfariumFoodWeb={baseline,advance,version:"1.2.0",note:"Illustrative relative indices, not laboratory-calibrated organism counts."};
})(window);
