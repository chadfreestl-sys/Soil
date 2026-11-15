// Run: node tests/image-mapping-contract.test.cjs
const fs=require('node:fs');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/turfarium/image-manifest.json'),'utf8'));
const entries=manifest.images;
assert.equal(entries.length,88,'BASE image count');
const ids=new Set(entries.map(e=>e.id));
const paths=new Set(entries.map(e=>e.path));
assert.equal(ids.size,88,'unique BASE ids');
assert.equal(paths.size,88,'unique BASE paths');
for(let n=1;n<=88;n++){
 const id='BASE'+String(n).padStart(2,'0');
 const e=entries.find(x=>x.id===id);
 assert(e,'missing '+id);
 assert(e.path?.startsWith('assets/turfarium/'+id+'/'));
 assert(['webp','png','jpeg'].includes(e.format));
 assert(fs.existsSync(path.join(root,e.path)),'missing asset '+e.path);
}
const engine=fs.readFileSync(path.join(root,'turfarium-visual-state-v3-2.js'),'utf8');
const lab=fs.readFileSync(path.join(root,'lab.html'),'utf8');
assert(engine.includes("images/seasons/"),'seasonal engine missing');
assert(lab.includes('turfarium-visual-state-v3-2.js'),'lab must load seasonal visual engine');
const seasons=['winter','spring','summer','fall'];
const states=['stressed','poor','fair','recovering','healthy','very-healthy','lush','elite'];
let count=0;
for(const season of seasons)for(let i=0;i<states.length;i++){
 const file='images/seasons/'+season+'/state-'+String(i+1).padStart(2,'0')+'-'+states[i]+'.webp';
 const full=path.join(root,file);
 assert(fs.existsSync(full),'missing seasonal state '+file);
 const b=fs.readFileSync(full);
 assert(b.length>=12&&b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP','invalid WebP '+file);
 count++;
}
const unverified=entries.filter(e=>!e.verifiedSubject).map(e=>e.id);
console.log('PASS: 88 BASE mappings, 32 seasonal image files, WebP signatures, and lab visual-engine inclusion.');
console.log('AUDIT: '+unverified.length+' BASE subjects remain unverified in manifest; image-to-condition visual accuracy not certified.');
console.log('AUDIT: BASE manifest is not consumed by the active seasonal image engine; seasonal engine uses 32 state photographs.');

const stateThresholds=[0,16,29,43,57,71,83,93];
for(let i=1;i<stateThresholds.length;i++)assert(stateThresholds[i]>stateThresholds[i-1],'state thresholds must ascend');
const activeStateIds=[...engine.matchAll(/\{id:'([^']+)',min:(\d+),candidates:/g)].map(m=>({id:m[1],min:Number(m[2])}));
assert.deepEqual(activeStateIds,states.map((id,i)=>({id,min:stateThresholds[i]})),'active photo states must match the verified 32-image naming contract');
assert(engine.includes('window.TurfariumVisualSnapshot?.(key)'),'visuals must read authoritative lawn snapshots');
assert(engine.includes('replaySnapshots.set(key,frames[key])'),'replay must use saved frames for each lawn');
assert(engine.includes('replaySnapshots.clear()'),'returning live must clear replay snapshots');
assert(engine.includes("if(pending.get(key)!==request)return"),'async image completion must reject obsolete requests');
assert(engine.includes("stage.dataset.tfPhotoReady='0'"),'photo load status must support an unavailable state');
assert(engine.includes('photo.src=url'),'selected photo must replace actual visible photo, not merely a hidden overlay');
const baseUI=lab.includes('id="tf-scientific-library"');
assert.equal(baseUI,false,'internal BASE library must not appear in homeowner lab');
console.log('PASS: Seasonal state IDs and thresholds match all 32 assets; replay, stale-load, and homeowner-display contracts present.');
