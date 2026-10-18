/* Turfarium five-year comparative scenario harness. Illustrative, not field-calibrated. */
(function(global){'use strict';
const F=global.TurfariumFoodWeb;
if(!F)return;
const clamp=(x)=>Math.max(0,Math.min(100,x));
const CHECKPOINTS=[0,30,90,180,365,730,1825];
const SEASONAL_TEMP=[37,41,51,62,71,79,84,82,74,62,49,40];
function weather(day){const month=(2+Math.floor(day/30.4375))%12;const temperatureF=SEASONAL_TEMP[month];const dry=month>=5&&month<=7;return {month,temperatureF,moisture:dry?40:55,oxygen:dry?72:67,pH:6.3};}
function management(name,day){const organic=name==='biological';return {clippings:organic?80:45,organicInputs:organic?65:10,disturbance:organic?5:12,rootExudates:organic?58:52};}
function step(state,day,days,name){const env={...weather(day+days/2),...management(name,day)};const food=F.advance(state.food,env,days);
 const heat=Math.max(0,env.temperatureF-79)/25;
 const moistureStress=Math.abs(env.moisture-55)/55;
 const stress=heat*.55+moistureStress*.55;
 const rootTarget=clamp(34+food.aggregation*.30+food.fungi*.15-stress*24);
 const roots=clamp(state.roots+(rootTarget-state.roots)*(1-Math.exp(-days/150)));
 const canopyTarget=clamp(38+roots*.33+food.aggregation*.12-stress*35);
 const canopy=clamp(state.canopy+(canopyTarget-state.canopy)*(1-Math.exp(-days/65)));
 return {day:day+days,food,roots,canopy};}
function run(name){let state={day:0,food:F.baseline(),roots:40,canopy:45};const rows=[{...state,food:{...state.food}}];for(let i=1;i<CHECKPOINTS.length;i++){const target=CHECKPOINTS[i];while(state.day<target){const dt=Math.min(15,target-state.day);state=step(state,state.day,dt,name)}rows.push({...state,food:{...state.food}})}return rows;}
function compare(){return {assumptions:'Hypothesis-based indices; identical estimated St. Louis weather; not calibrated predictions.',checkpoints:CHECKPOINTS,conventional:run('conventional'),biological:run('biological')};}
global.TurfariumFiveYearScenarios={compare,run,weather,version:'1.0.0'};
})(window);
