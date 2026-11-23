// Regression guard: untreated lawns must continue to respond to environmental forcing.
// This checks the actual production source wiring, not scientific calibration.
const fs=require('node:fs'),assert=require('node:assert/strict');
const html=fs.readFileSync('lab.html','utf8');
function body(start,end){
 const i=html.indexOf(start);assert(i>=0,'missing '+start);
 const j=html.indexOf(end,i+start.length);assert(j>i,'missing end of '+start);
 return html.slice(i,j);
}
const weather=body('function weather(d){','const turf={');
const daily=body('function daily(s){','function apply(s,t,name){');
const advance=body('function advance(n){','function ');
assert.match(weather,/monthIndex\(d\)/,'weather must vary by season');
assert.match(weather,/weatherMode/,'weather scenario must affect forcing');
for(const [pattern,label] of [
 [/weather\(day\)/,'weather enters daily model'],
 [/s\.moist\s*=/,'moisture evolves without treatment'],
 [/s\.oxygenReserve\s*=/,'oxygen evolves without treatment'],
 [/s\.rootMass\s*=/,'root mass evolves without treatment'],
 [/s\.canopyCover\s*=/,'canopy evolves without treatment'],
 [/s\.tillerDensity\s*=/,'tillers evolve without treatment'],
 [/s\.good\[/,'microbial guilds evolve without treatment']
])assert.match(daily,pattern,label);
assert.match(advance,/daily\(A\);daily\(B\);/,'both lawns advance independently');
assert(!/\bapply\(A|\bapply\(B/.test(advance),'advance must not auto-apply treatment');
console.log('PASS: untreated environmental evolution wiring (static contract; not scientific validation)');
