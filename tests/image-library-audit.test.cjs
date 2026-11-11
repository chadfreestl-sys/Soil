// Run: node tests/image-library-audit.test.cjs
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const m=JSON.parse(fs.readFileSync(path.join(root,'assets/turfarium/image-manifest.json'),'utf8'));
assert.equal(m.images.length,88);const ids=new Set();let missing=[];let invalid=[];
for(const e of m.images){assert(!ids.has(e.id),'duplicate '+e.id);ids.add(e.id);if(!e.path||!fs.existsSync(path.join(root,e.path))){missing.push(e.id);continue;}const b=fs.readFileSync(path.join(root,e.path));const webp=b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP';const png=b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));const jpeg=b.length>3&&b[0]===0xff&&b[1]===0xd8&&b[2]===0xff;if(!webp&&!png&&!jpeg)invalid.push(e.id);}
assert.deepEqual(missing,[],'missing image files');assert.deepEqual(invalid,[],'invalid image signatures');
console.log('PASS: 88 unique BASE assets exist with recognized WebP/PNG/JPEG signatures.');console.log('NOTE: Image-to-condition scientific accuracy still requires visual review.');
