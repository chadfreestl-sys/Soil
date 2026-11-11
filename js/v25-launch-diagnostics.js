/* Turfarium v25 read-only launch diagnostics.
 * Run in browser DevTools after lab.html loads:
 *   const s=document.createElement('script');s.src='js/v25-launch-diagnostics.js';document.body.append(s);
 *   TurfariumLaunchQA.run()
 * Does not apply treatments, advance time, or change saved data.
 */
(function(global){
'use strict';
const results=[];
function check(name,ok,details){results.push({test:name,status:ok?'PASS':'FAIL',details:String(details??'')});}
function num(x){return Number(x);}
function finite(x){return Number.isFinite(num(x));}
function imageExists(url){return new Promise(resolve=>{const img=new Image();const timer=setTimeout(()=>resolve(false),7000);img.onload=()=>{clearTimeout(timer);resolve(true)};img.onerror=()=>{clearTimeout(timer);resolve(false)};img.src=url;});}
async function run(){
 results.length=0;
 const clock=document.getElementById('time')?.textContent||document.body.innerText.match(/Day\\s+\\d+\\s*\\/\\s*1,825/)?.[0]||'';
 const dayMatch=clock.match(/Day\s+(\d+)/i);
 const day=dayMatch?Number(dayMatch[1]):NaN;
 check('Simulation day in 0–1825',Number.isInteger(day)&&day>=0&&day<=1825,clock);
 const report=document.getElementById('changePeriod')?.textContent||'';
 const reportMatch=report.match(/Day\s+(\d+)\s*→\s*(\d+)/);
 check('What Changed report matches timeline',day===0||!!(reportMatch&&Number(reportMatch[2])===day),report.slice(0,140));
 const changeGrid=document.getElementById('changeGrid');
 if(matchMedia('(max-width:700px)').matches)check('Mobile What Changed report rendered',!!(changeGrid&&changeGrid.getClientRects().length&&changeGrid.textContent.trim()),changeGrid?.id||'missing');
 const panels=['A','B'].map(k=>document.getElementById('lawn-'+k.toLowerCase()+'-panel'));
 check('Both lawn panels exist',panels.every(Boolean),panels.map(Boolean).join('/'));
 const visual=global.TurfariumVisualState;
 check('Visual engine exported',!!visual,visual?.version||'missing');
 const scores=['A','B'].map(k=>{try{return visual?.score(k)}catch{return NaN}});
 check('Independent finite visual scores',scores.every(finite),scores.join('/'));
 for(const key of ['A','B']){
  const status=visual?.getStatus?.(key);
  check('Lawn '+key+' photo state',!!status?.state&&finite(status.score),JSON.stringify(status||{}).slice(0,200));
  if(status?.src)check('Lawn '+key+' selected photo loads',await imageExists(status.src),status.src);
 }
 const scenarios=global.TurfariumFiveYearScenarios;
 check('Five-year harness available',!!scenarios?.compare,scenarios?.version||'missing');
 if(scenarios?.compare){
  try{
   const comparison=scenarios.compare();
   for(const key of ['conventional','biological','stressed']){
    const rows=comparison[key]||[];
    const days=rows.map(r=>r.day);
    const finiteRows=rows.every(r=>finite(r.canopy)&&finite(r.roots)&&r.canopy>=0&&r.canopy<=100&&r.roots>=0&&r.roots<=100);
    check(key+' reaches day 1825',days[0]===0&&days.at(-1)===1825&&days.every((d,i)=>i===0||d>days[i-1]),days.join(','));
    check(key+' indices finite and bounded',finiteRows,rows.length+' checkpoints');
   }
  }catch(e){check('Five-year harness execution',false,e.message);}
 }
 check('No golf materials in treatment picker',![...document.querySelectorAll('select option')].some(o=>/golf|putting green|fairway/i.test(o.textContent)), 'visible options');
 const summary={passed:results.filter(x=>x.status==='PASS').length,failed:results.filter(x=>x.status==='FAIL').length,day,results:[...results]};
 console.table(results);console.info('[Turfarium launch QA]',summary);
 return summary;
}
global.TurfariumLaunchQA={run,version:'25.1'};
})(window);
