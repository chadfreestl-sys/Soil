// Run: node tests/image-mapping-contract.test.cjs
const fs=require('node:fs');
const assert=require('node:assert/strict');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'assets/turfarium/image-manifest.json'),'utf8'));
const entries=manifest.images;
assert.equal(entries.length,94,'BASE image count');
const ids=new Set(entries.map(e=>e.id));
const paths=new Set(entries.map(e=>e.path));
assert.equal(ids.size,94,'unique BASE ids');
assert.equal(paths.size,94,'unique BASE paths');
for(let n=1;n<=94;n++){
 const id='BASE'+String(n).padStart(2,'0');
 const e=entries.find(x=>x.id===id);
 assert(e,'missing '+id);
 assert(e.path?.startsWith('assets/turfarium/'+id+'/'));
 assert(['webp','png','jpeg'].includes(e.format));
 assert(fs.existsSync(path.join(root,e.path)),'missing asset '+e.path);
 assert(e.verifiedSubject===true&&typeof e.topic==='string'&&e.topic.trim().length>8,'unverified subject '+id);
 assert.equal(fs.statSync(path.join(root,e.path)).size,e.bytes,'manifest size mismatch '+id);
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
console.log('PASS: 94 BASE mappings, 32 seasonal image files, WebP signatures, and lab visual-engine inclusion.');
assert.deepEqual(unverified,[],'all 94 BASE image subjects must be verified');
console.log('PASS: all 94 BASE image subjects are verified; image-to-condition visual accuracy is not certified.');
console.log('AUDIT: BASE manifest is not consumed by the active seasonal image engine; seasonal engine uses 32 state photographs.');
