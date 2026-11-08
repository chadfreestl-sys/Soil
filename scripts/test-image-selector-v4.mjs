// Run: node scripts/test-image-selector-v4.mjs
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const sandbox={};
vm.runInNewContext(readFileSync('turfarium-image-selector-v4.js','utf8'),sandbox);
const {createSelector}=sandbox.TurfariumImageSelectorV4;
const base={status:'path-verified',approved:true,season:'spring',conditions:{canopy:70,moisture:50,compaction:30,biology:40,vigor:65}};
const unverified={...base,id:'unverified',status:'unverified',src:'x.webp'};
const uncalibrated={...base,id:'uncalibrated',src:'y.webp',conditions:null};
const approved={...base,id:'good',src:'good.webp'};
const selector=createSelector([unverified,uncalibrated,approved]);
assert.equal(selector.count,1);
assert.equal(selector.select({season:'spring',canopy:70,moisture:50})?.id,'good');
assert.equal(selector.select({season:'winter'}),null);
assert.equal(createSelector([{...approved,approved:false}]).select({season:'spring'}),null);
assert.equal(createSelector([{...approved,conditions:null}]).select({season:'spring'}),null);
console.log('PASS: only verified, approved, calibrated assets selectable; season isolation and safe null fallback');
