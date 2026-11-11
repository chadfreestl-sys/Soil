/* Turfarium five-year comparative scenario harness. Illustrative, not field-calibrated. */
(function(global){'use strict';
const F=global.TurfariumFoodWeb;
if(!F)return;
const clamp=(x)=>Math.max(0,Math.min(100,x));
const CHECKPOINTS=[0,30,90,180,365,730,1825];
const SEASONAL_TEMP=[37,41,51,62,71,79,84,82,74,62,49,40];
function weather(day){const month=(2+Math.floor(day/30.4375))%12;const temperatureF=SEASONAL_TEMP[month];const dry=month>=5&&month<=7;return {month,temperatureF,moisture:dry?40:55,oxygen:dry?72:67,pH:6.3};}
function management(name,day){const organic=name==='biological';const stressed=['stressed','drought','waterlogged'].includes(name);return {clippings:stressed?5:organic?80:45,organicInputs:stressed?0:organic?38:10,disturbance:stressed?80:organic?5:12,rootExudates:stressed?18:organic?58:52};}
function step(state,day,days,name){const env={...weather(day+days/2),...management(name,day)};if(name==='stressed'){env.moisture=15;env.oxygen=35;env.pH=5.0;}
 if(name==='drought'){env.moisture=15;env.oxygen=75;}
 if(name==='waterlogged'){env.moisture=94;env.oxygen=12;}
 if(name==='recovery'&&day<180){env.moisture=15;env.oxygen=75;env.organicInputs=0;env.rootExudates=18;env.disturbance=80;}
 if(name==='recovery'&&day>=180){env.moisture=55;env.oxygen=67;env.organicInputs=20;env.rootExudates=52;env.disturbance=12;}const food=F.advance(state.food,env,days);
 const heat=Math.max(0,env.temperatureF-79)/25;
 const moistureStress=Math.abs(env.moisture-55)/55;
 const oxygenStress=Math.max(0,55-env.oxygen)/55;
 const stress=heat*.55+moistureStress*.55+oxygenStress*.45+(name==='stressed'?.55:0);
 // Separate short-term loss of green canopy from living-crown survival.
 // All indices are exploratory, not measured mortality probabilities.
 const moisturePenalty=Math.max(0,28-env.moisture)/28;
 const saturationPenalty=Math.max(0,env.moisture-85)/15;
 const severeStress=Math.max(moisturePenalty,saturationPenalty,oxygenStress);
 const favorable=env.moisture>=35&&env.moisture<=80&&env.oxygen>=45;
 const dormancyTarget=clamp(100*(moisturePenalty*.8+heat*.32));
 const dormancy=clamp(state.dormancy+(dormancyTarget-state.dormancy)*(1-Math.exp(-days/20)));
 const reserveTarget=favorable?Math.max(35,75-heat*18):Math.max(3,55-severeStress*60);
 const reserves=clamp(state.reserves+(reserveTarget-state.reserves)*(1-Math.exp(-days/(favorable?100:75))));
 // Survival loss requires sustained severe stress and depleted reserves.
 const depletion=Math.max(0,(35-reserves)/35);
 const mortalityRate=severeStress*depletion*.0015;
 const survival=clamp(state.survival*Math.exp(-days*mortalityRate));
 const rootTarget=clamp(34+food.aggregation*.30+food.fungi*.15-stress*24);
 const roots=clamp(state.roots+(rootTarget-state.roots)*(1-Math.exp(-days/150)));
 const potentialCanopy=clamp(38+roots*.33+food.aggregation*.12-stress*35);
 const liveCapacity=survival*.98;
 const greenTarget=Math.min(liveCapacity,potentialCanopy*(1-dormancy*.007));
 const canopy=clamp(state.canopy+(greenTarget-state.canopy)*(1-Math.exp(-days/(favorable?65:40))));
 return {day:day+days,food,roots,canopy,survival,reserves,dormancy};}
function run(name){let state={day:0,food:F.baseline(),roots:40,canopy:45,survival:100,reserves:65,dormancy:0};const rows=[{...state,food:{...state.food}}];for(let i=1;i<CHECKPOINTS.length;i++){const target=CHECKPOINTS[i];while(state.day<target){const dt=Math.min(15,target-state.day);state=step(state,state.day,dt,name)}rows.push({...state,food:{...state.food}})}return rows;}
function compare(){return {assumptions:'Hypothesis-based indices; identical estimated St. Louis weather; not calibrated predictions.',checkpoints:CHECKPOINTS,conventional:run('conventional'),biological:run('biological'),stressed:run('stressed'),drought:run('drought'),waterlogged:run('waterlogged'),recovery:run('recovery')};}
global.TurfariumFiveYearScenarios={compare,run,weather,version:'1.3.0'};
})(window);
