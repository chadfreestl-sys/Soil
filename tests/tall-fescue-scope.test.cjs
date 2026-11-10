// Run: node tests/tall-fescue-scope.test.cjs
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('lab.html','utf8');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);
for(const js of scripts)new vm.Script(js);
const grass=html.match(/<select id="grass">([\s\S]*?)<\/select>/)?.[1];
assert.ok(grass,'turf selector exists');
assert.equal((grass.match(/<option/g)||[]).length,1);
assert.match(grass,/Tall fescue/);
for(const name of ['Fine fescue','Kentucky bluegrass','Perennial ryegrass','Creeping bentgrass','Zoysia','Bermudagrass','St. Augustinegrass','Centipedegrass','Bahiagrass','Buffalograss','Seashore paspalum'])assert.ok(!html.includes(name),'inactive species: '+name);
for(const id of ['mowHeight','mowA','mowB']){const input=html.match(new RegExp('<input[^>]*id="'+id+'"[^>]*>'))?.[0];assert.ok(input,'missing '+id);assert.match(input,/min="2\.5"/);assert.match(input,/max="4"/);}
assert.ok(!/golf|humicgolf|golfwet|foliarN|\bcrf\b/i.test(html),'golf-only product code remains');
console.log('PASS: tall-fescue-only UI, script syntax, residential mowing, no golf-only products');
