/* Turfarium hypothesis-scenario regression suite; run in browser after food-web + scenarios scripts. */
(function(global){'use strict';
function run(){const api=global.TurfariumFiveYearScenarios;if(!api)throw Error('Five-year scenarios unavailable');
 const names=['conventional','biological','stressed','drought','waterlogged','recovery'];const checks=[];
 const assert=(name,ok,detail)=>checks.push({name,pass:!!ok,detail:detail||''});
 const data=Object.fromEntries(names.map(name=>[name,api.run(name)]));
 for(const name of names){const rows=data[name];assert(name+' checkpoints',rows.length===7&&rows[0].day===0&&rows.at(-1).day===1825);assert(name+' finite bounded canopy/roots',rows.every(r=>Number.isFinite(r.canopy)&&Number.isFinite(r.roots)&&r.canopy>=0&&r.canopy<=100&&r.roots>=0&&r.roots<=100));assert(name+' finite food-web indices',rows.every(r=>Object.values(r.food).every(x=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=100)));assert(name+' deterministic',JSON.stringify(rows)===JSON.stringify(api.run(name)));assert(name+' finite survival/reserves/dormancy',rows.every(r=>[r.survival,r.reserves,r.dormancy].every(x=>Number.isFinite(x)&&x>=0&&x<=100)));assert(name+' survival cannot spontaneously increase',rows.every((r,i)=>i===0||r.survival<=rows[i-1].survival+1e-9));}
 assert('drought suppresses canopy at year 5',data.drought.at(-1).canopy<data.conventional.at(-1).canopy);
 assert('waterlogging suppresses canopy at year 5',data.waterlogged.at(-1).canopy<data.conventional.at(-1).canopy);
 assert('combined stress suppresses canopy at year 5',data.stressed.at(-1).canopy<data.conventional.at(-1).canopy);
 assert('drought retains more live crowns than waterlogging at year 5',data.drought.at(-1).survival>data.waterlogged.at(-1).survival);assert('recovery regreens without regenerating dead crowns',data.recovery.at(-1).canopy>data.recovery[3].canopy&&data.recovery.at(-1).survival<=data.recovery[3].survival);assert('recovery improves from day 180 to year 5',data.recovery.at(-1).canopy>data.recovery[3].canopy);
 assert('biological hypothesis exceeds conventional year 5',data.biological.at(-1).canopy>data.conventional.at(-1).canopy,'This is a model assumption, not scientific validation.');
 const result={passed:checks.filter(x=>x.pass).length,failed:checks.filter(x=>!x.pass).length,checks};return result;}
 global.TurfariumScenarioRegression=Object.freeze({run,version:'1.0.0'});
})(window);
