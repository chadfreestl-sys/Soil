// Cross-system regression: feed real five-year scenario outputs into the BASE88 selector.
// Scenario trajectories are illustrative; these checks guard wiring and image semantics.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const window={};
for(const p of ['js/food-web.js','js/five-year-scenarios.js'])
 vm.runInNewContext(fs.readFileSync(p,'utf8'),{window});
const series=window.TurfariumFiveYearScenarios.compare();
const source=fs.readFileSync('turfarium-visual-state-v3-2.js','utf8');
const match=source.match(/const BASE88=(\[.*?\]);\nfunction verifiedBase\(score,season,snapshot,key\)\{[\s\S]*?\n\}\nasync function imageFor/);
assert(match,'BASE88 selector must be extractable');
const ctx={Number,Math,String};vm.createContext(ctx);
vm.runInContext(match[0].replace(/\nasync function imageFor$/,'')+'\nthis.pick=verifiedBase;this.entries=BASE88;',ctx);
const season=day=>['winter','spring','summer','fall'][Math.floor((day%365)/91.25)%4];
const forbidden=new Set(['snow','frost','rain','irrigation','storm','aeration','waterlogged']);
const byPath=new Map(Array.from(ctx.entries,x=>['assets/turfarium/BASE'+String(x.n).padStart(2,'0')+'/BASE'+String(x.n).padStart(2,'0')+'.'+x.ext,x]));
const report=[];
for(const label of ['conventional','biological','stressed']){
 for(const row of series[label]){
  // Scenario output exposes canopy, roots, and biological guilds, not the full
  // live simulation snapshot. Neutral water/oxygen and no events are intentional.
  const snap={day:row.day,canopyCover:row.canopy,tillerDensity:row.canopy,
   rootMass:row.roots,weedPressure:35,moisture:55,oxygen:65};
  const a=ctx.pick(row.canopy,season(row.day),snap,'A');
  const b=ctx.pick(row.canopy,season(row.day),snap,'B');
  assert(a&&b,'image must resolve: '+label+' day '+row.day);
  assert.equal(a,ctx.pick(row.canopy,season(row.day),snap,'A'),'stable selection');
  assert.equal(b,ctx.pick(row.canopy,season(row.day),snap,'B'),'stable B selection');
  for(const path of [a,b]){
   const image=byPath.get(path);
   assert(image,'image must be in BASE88: '+path);
   assert(!forbidden.has(image.event),'no event imagery without event: '+path);
  }
  report.push({label,day:row.day,canopy:row.canopy,roots:row.roots,A:a,B:b});
 }
}
const checkpoints=series.conventional.map(x=>x.day);
for(let i=0;i<checkpoints.length;i++){
 const c=report.find(x=>x.label==='conventional'&&x.day===checkpoints[i]);
 const stressed=report.find(x=>x.label==='stressed'&&x.day===checkpoints[i]);
 if(Math.abs(c.canopy-stressed.canopy)>=30)
  if(c.A===stressed.A)console.warn('VISUAL GAP: substantial canopy separation maps to same BASE88 image at day '+c.day+' (conventional='+c.canopy.toFixed(1)+', stressed='+stressed.canopy.toFixed(1)+')');
}
console.log('PASS: mapping contracts; asset coverage and visual gaps are reported separately for review');
console.log('PASS: 3 scenario pathways × '+checkpoints.length+' checkpoints × 2 lawns; deterministic, mapped, event-safe');
console.log(JSON.stringify(report));
