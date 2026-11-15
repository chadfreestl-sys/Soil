/* Contract checks for the derived food-web bridge. Run: node tests/food-web-bridge-contract.test.cjs */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const bridge=fs.readFileSync('js/food-web-bridge.js','utf8');
assert.match(bridge,/organicInputs:0/, 'Do not synthesize organic additions from the biology score');
assert.doesNotMatch(bridge,/organicInputs:biology\s*\*/, 'Circular biology-to-input coupling is forbidden');
assert.match(bridge,/addEventListener\('turfarium:time-advanced'/, 'Timeline must refresh derived food-web layer');
assert.match(bridge,/scenario-restored/, 'Restoring scenarios must reset derived state');
console.log('PASS: food-web bridge input independence and lifecycle hooks');
