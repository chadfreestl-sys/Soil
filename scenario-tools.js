(()=>{
  'use strict';
  const byId=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clone=o=>JSON.parse(JSON.stringify(o));
  const mode=(document.documentElement.dataset.audience||'professional').toLowerCase();
  const STORE='livingSoilLabV196Scenarios';
  const MAX_SAVES=8;

  const scenarioSets={
    homeowner:[
      {id:'healthy',icon:'🌱',title:'Healthy baseline',desc:'Start with a reasonably balanced tall-fescue lawn and learn what changes one decision at a time.',next:'Try changing only irrigation, fertilizer, or aeration, then advance 7–30 days.',base:{grass:'Tall fescue',bulk:1.35,organic:3.5,ph:6.4,ec:.5,nitrate:14,ammonium:5,psoil:24,ksoil:140,cec:15,texture:'loam',region:'stl',startMonth:'3',weatherMode:'normal'}},
      {id:'wetclay',icon:'💧',title:'Wet compacted lawn',desc:'Clay loam, high bulk density and wet weather create a root-zone oxygen problem without assuming a nutrient deficiency.',next:'Inspect moisture, oxygen and roots before deciding whether another input makes sense.',base:{grass:'Tall fescue',bulk:1.60,organic:2.7,ph:6.2,ec:.6,nitrate:12,ammonium:5,psoil:20,ksoil:120,cec:18,texture:'clay',region:'stl',startMonth:'4',weatherMode:'wet'},state:{moist:84,oxygenReserve:34}},
      {id:'acid',icon:'🧪',title:'Low-pH stressed fescue',desc:'A low-pH starting point lets you see how turf suitability and root-zone stress can interact.',next:'Compare the species pH guidance with the soil state before experimenting with amendments.',base:{grass:'Tall fescue',bulk:1.45,organic:3.2,ph:5.2,ec:.5,nitrate:10,ammonium:5,psoil:18,ksoil:110,cec:14,texture:'clay',region:'stl',startMonth:'2',weatherMode:'normal'}},
      {id:'summer',icon:'☀️',title:'Summer heat stress',desc:'Hot, dry transition-zone weather puts moisture and temperature constraints ahead of product chasing.',next:'Advance 7 days and watch moisture, vigor and rooting before changing management.',base:{grass:'Tall fescue',bulk:1.42,organic:3.0,ph:6.3,ec:.6,nitrate:12,ammonium:4,psoil:20,ksoil:125,cec:14,texture:'loam',region:'stl',startMonth:'6',weatherMode:'heat'},state:{moist:38,oxygenReserve:72}}
    ],
    technician:[
      {id:'route-wet',icon:'🧰',title:'Wet clay callback',desc:'A dense transition-zone lawn looks off-color after wet weather. Diagnose the limiting process before assuming hunger.',next:'Use Diagnostic Lens to rank oxygen, moisture, pH, salinity and rooting constraints.',base:{grass:'Tall fescue',bulk:1.62,organic:2.8,ph:6.1,ec:.7,nitrate:13,ammonium:6,psoil:22,ksoil:130,cec:19,texture:'clay',region:'stl',startMonth:'4',weatherMode:'wet'},state:{moist:86,oxygenReserve:31}},
      {id:'route-heat',icon:'🌡️',title:'July stress visit',desc:'Tall fescue under heat and drying conditions: separate environmental stress from nutrient need.',next:'Inspect moisture, temperature, vigor and roots; then test one management change.',base:{grass:'Tall fescue',bulk:1.44,organic:3.1,ph:6.4,ec:.6,nitrate:15,ammonium:5,psoil:20,ksoil:135,cec:15,texture:'loam',region:'stl',startMonth:'6',weatherMode:'heat'},state:{moist:34,oxygenReserve:75}},
      {id:'route-salt',icon:'🧂',title:'Salt / excess-input check',desc:'Elevated EC and available N create a scenario where more fertilizer may increase stress instead of solving it.',next:'Compare EC, salt stress and available N before applying anything else.',base:{grass:'Tall fescue',bulk:1.42,organic:3.0,ph:6.3,ec:2.3,nitrate:60,ammonium:22,psoil:28,ksoil:190,cec:14,texture:'loam',region:'stl',startMonth:'5',weatherMode:'normal'}},
      {id:'route-ph',icon:'📋',title:'Low-pH diagnostic',desc:'Use species guidance and soil metrics to distinguish pH limitation from generic “needs fertilizer” thinking.',next:'Check pH fit, root condition and available nutrients; document the constraint you think is primary.',base:{grass:'Tall fescue',bulk:1.48,organic:3.4,ph:5.1,ec:.5,nitrate:11,ammonium:4,psoil:17,ksoil:105,cec:16,texture:'clay',region:'stl',startMonth:'2',weatherMode:'normal'}}
    ],
    professional:[
      {id:'pro-clay',icon:'🌾',title:'Transition-zone clay baseline',desc:'A realistic heavy-soil starting point for repeated management cycles and root-zone diagnostics.',next:'Run several 30-day cycles and watch whether the controlling constraint migrates.',base:{grass:'Tall fescue',bulk:1.55,organic:3.0,ph:6.2,ec:.6,nitrate:12,ammonium:5,psoil:20,ksoil:120,cec:18,texture:'clay',region:'stl',startMonth:'2',weatherMode:'normal'}},
      {id:'pro-wet',icon:'💧',title:'Low-O₂ wet-soil diagnostic',desc:'High moisture plus dense clay creates a physical constraint that should dominate before biology or fertility.',next:'Use Diagnostic Lens, then compare core aeration versus no intervention across matched lawns.',base:{grass:'Tall fescue',bulk:1.64,organic:2.9,ph:6.3,ec:.6,nitrate:13,ammonium:6,psoil:21,ksoil:125,cec:20,texture:'clay',region:'stl',startMonth:'4',weatherMode:'wet'},state:{moist:88,oxygenReserve:27}},
      {id:'pro-drought',icon:'☀️',title:'Heat + drought constraint',desc:'A high-stress summer case for testing irrigation timing, wetting agents and nutrient restraint.',next:'Track whether moisture or temperature remains the binding constraint after each management move.',base:{grass:'Tall fescue',bulk:1.40,organic:3.2,ph:6.4,ec:.6,nitrate:16,ammonium:4,psoil:21,ksoil:145,cec:14,texture:'loam',region:'stl',startMonth:'6',weatherMode:'drought'},state:{moist:29,oxygenReserve:82}},
      {id:'pro-trial',icon:'⚖️',title:'Controlled A/B trial',desc:'Balanced matched lawns intended for clean treatment comparisons rather than rescuing an already-stressed system.',next:'Apply one treatment to Lawn B, leave Lawn A as control, then save snapshots at 7, 30 and 90 days.',base:{grass:'Tall fescue',bulk:1.38,organic:3.6,ph:6.4,ec:.5,nitrate:14,ammonium:5,psoil:23,ksoil:140,cec:15,texture:'loam',region:'stl',startMonth:'3',weatherMode:'normal'}}
    ],
    research:[
      {id:'res-control',icon:'🔬',title:'Matched control experiment',desc:'Balanced baseline with minimal initial stress for isolating treatment-driven divergence.',next:'Change one factor only, save Day 0, and compare against later snapshots.',base:{grass:'Tall fescue',bulk:1.35,organic:3.5,ph:6.4,ec:.5,nitrate:14,ammonium:5,psoil:23,ksoil:140,cec:15,texture:'loam',region:'stl',startMonth:'3',weatherMode:'normal'}},
      {id:'res-wet',icon:'🫧',title:'Wet-clay sensitivity test',desc:'Push the soil-physics subsystem toward low oxygen and inspect downstream biological and root responses.',next:'Change bulk density or moisture independently to probe model sensitivity.',base:{grass:'Tall fescue',bulk:1.65,organic:3.0,ph:6.3,ec:.6,nitrate:12,ammonium:5,psoil:20,ksoil:120,cec:20,texture:'clay',region:'stl',startMonth:'4',weatherMode:'wet'},state:{moist:90,oxygenReserve:24}},
      {id:'res-seaweed',icon:'🌿',title:'Seaweed A/B experiment',desc:'Matched baseline prepared for a control-versus-seaweed comparison without assuming efficacy.',next:'Leave Lawn A untreated; select a seaweed material for Lawn B, apply a documented rate, then save 0/7/30/60-day snapshots.',base:{grass:'Tall fescue',bulk:1.38,organic:3.5,ph:6.4,ec:.5,nitrate:14,ammonium:5,psoil:22,ksoil:140,cec:15,texture:'loam',region:'stl',startMonth:'3',weatherMode:'normal'},prepare:{treatB:'seaweed102',rateB:2,unitB:'ozgal',sprayB:2}},
      {id:'res-n',icon:'🧬',title:'Nitrogen-source comparison',desc:'Matched lawns for comparing equivalent documented N programs while watching EC and N-cycle behavior.',next:'Set rates that deliver comparable N, apply different sources, and save snapshots before advancing.',base:{grass:'Tall fescue',bulk:1.38,organic:3.4,ph:6.4,ec:.5,nitrate:10,ammonium:4,psoil:22,ksoil:135,cec:15,texture:'loam',region:'stl',startMonth:'2',weatherMode:'normal'},prepare:{treatA:'urea',treatB:'slowN'}}
    ]
  };
  if(!scenarioSets[mode]) scenarioSets[mode]=scenarioSets.professional;

  function setValue(id,value){const el=byId(id);if(!el||value===undefined)return;el.value=String(value);el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));}
  function loadScenario(sc){
    const b=sc.base||{};
    ['grass','bulk','organic','ph','ec','nitrate','ammonium','psoil','ksoil','cec','texture','region','startMonth','weatherMode'].forEach(id=>setValue(id,b[id]));
    reset();
    if(sc.state){for(const s of [A,B])for(const [k,v] of Object.entries(sc.state))if(k in s)s[k]=v;render();}
    if(sc.prepare){for(const [id,v] of Object.entries(sc.prepare))setValue(id,v);}
    const visit=byId('visit');if(visit)visit.textContent=`Scenario loaded: ${sc.title}. ${sc.next}`;
    const status=byId('scenarioStatus');if(status)status.innerHTML=`<strong>${esc(sc.title)}</strong> loaded. ${esc(sc.next)}`;
    document.getElementById('experiment-controls')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function snapshot(){
    const inputs={};
    ['grass','bulk','organic','ph','ec','nitrate','ammonium','psoil','ksoil','cec','texture','region','startMonth','weatherMode','viewMode'].forEach(id=>{const e=byId(id);if(e)inputs[id]=e.value});
    return {version:'19.6',savedAt:new Date().toISOString(),day,inputs,A:clone(A),B:clone(B),treatmentRecords:clone(treatmentRecords),history:clone(history),log:clone(log.slice(0,80))};
  }
  function saved(){try{const x=JSON.parse(localStorage.getItem(STORE)||'[]');return Array.isArray(x)?x.filter(v=>v&&v.id&&v.data).slice(0,MAX_SAVES):[]}catch(e){return[]}}
  function persist(items){try{localStorage.setItem(STORE,JSON.stringify(items.slice(0,MAX_SAVES)));return true}catch(e){return false}}
  function refreshSaved(){const sel=byId('savedScenarioSelect');if(!sel)return;const items=saved();sel.innerHTML=items.length?items.map(x=>`<option value="${esc(x.id)}">${esc(x.name)} · Day ${x.data.day}</option>`).join(''):'<option value="">No saved scenarios yet</option>';sel.disabled=!items.length;['loadSavedScenario','compareSavedScenario','deleteSavedScenario'].forEach(id=>{const b=byId(id);if(b)b.disabled=!items.length});}
  function currentMetrics(s){const e=env(s);return {vigor:e.vigor,root:s.rootDepth,oxygen:e.oxygen,moist:s.moist,ph:s.ph,ec:s.ec,om:s.om,biology:e.good,disease:e.bad};}
  function comparison(savedData){
    const rows=[];
    for(const key of ['A','B']){
      const now=currentMetrics(key==='A'?A:B),then=currentMetrics(savedData[key]);
      const defs=[['vigor','Vigor',1],['root','Root depth',1],['oxygen','O₂',1],['moist','Moisture',1],['ph','pH',2],['ec','EC',2],['om','SOM %',2],['biology','Beneficial activity',1],['disease','Disease pressure',1]];
      rows.push(`<div class="scenario-compare-lawn"><h4>Lawn ${key}</h4>${defs.map(([k,l,p])=>{const d=now[k]-then[k];return `<div><span>${l}</span><b>${now[k].toFixed(p)}</b><small class="${d>0?'delta-up':d<0?'delta-down':'delta-flat'}">${d>0?'+':''}${d.toFixed(p)}</small></div>`}).join('')}</div>`);
    }
    return rows.join('');
  }
  function restore(data){
    if(!data||!data.A||!data.B)return;
    for(const [id,v] of Object.entries(data.inputs||{}))setValue(id,v);
    A=clone(data.A);B=clone(data.B);day=Number(data.day)||0;treatmentRecords=clone(data.treatmentRecords||{A:[],B:[]});history=clone(data.history||[]);log=clone(data.log||[]);
    render();
    const period=byId('changePeriod');if(period)period.textContent=`Restored saved scenario at Day ${day}. Advance time to create a new before/after report.`;
    const visit=byId('visit');if(visit)visit.textContent=`Saved scenario restored at Day ${day}. Review current constraints before continuing.`;
  }

  function diagnosticItems(s){
    const e=env(s),species=turf[s.grass]||turf['Tall fescue'],maxRoot=(speciesTraits[s.grass]||[20])[0];
    const bulkThreshold=s.texture==='clay'?1.50:s.texture==='sand'?1.70:1.58;
    const items=[];
    const add=(score,name,why,check)=>items.push({score:Math.max(0,Math.min(100,score)),name,why,check});
    add(e.oxygen<55?(55-e.oxygen)*2.2:0,'Root-zone oxygen',`Oxygen index ${e.oxygen.toFixed(0)}/100. Saturation and dense pore structure can restrict gas diffusion.`,`Check drainage pattern, recent rain/irrigation and compaction before adding more water.`);
    add(s.moist>76?(s.moist-76)*2.5:s.moist<36?(36-s.moist)*2.5:0,'Soil moisture',`Moisture index ${s.moist.toFixed(0)}/100 is ${s.moist>76?'high':s.moist<36?'low':'near the model comfort band'}.`,`Verify actual soil moisture and irrigation distribution; do not infer from canopy color alone.`);
    add(s.bulk>bulkThreshold?(s.bulk-bulkThreshold)*180:0,'Compaction / bulk density',`Bulk density ${s.bulk.toFixed(2)} g/cm³ versus a model caution threshold near ${bulkThreshold.toFixed(2)} for this texture.`,`Inspect penetration resistance, rooting pattern and traffic history; texture changes interpretation.`);
    const pd=s.ph<species.lo?species.lo-s.ph:s.ph>species.hi?s.ph-species.hi:0;
    add(pd*38,'pH fit',`pH ${s.ph.toFixed(1)} versus general ${s.grass} range ${species.lo.toFixed(1)}–${species.hi.toFixed(1)}.`,`Confirm with a representative soil test before considering pH correction.`);
    add(s.ec>1.5?(s.ec-1.5)*25:0,'Salinity / EC',`EC proxy ${s.ec.toFixed(2)} dS/m. Elevated soluble salts can increase osmotic stress.`,`Review recent fertilizer/salt loading and, where appropriate, verify EC with a consistent lab method.`);
    add(e.bad>32?(e.bad-32)*1.7:0,'Disease-pressure environment',`Disease-pressure index ${e.bad.toFixed(0)}/100 reflects moisture, oxygen, thatch and stress interactions.`,`Inspect actual symptoms and signs; this index is not a disease diagnosis.`);
    add(s.rootDepth<maxRoot*.55?(maxRoot*.55-s.rootDepth)/maxRoot*150:0,'Rooting limitation',`Root depth ${s.rootDepth.toFixed(1)} in versus an illustrative species ceiling of ${maxRoot} in.`,`Inspect root color, density and depth physically; identify whether moisture, oxygen, temperature or salinity is limiting.`);
    add(e.vigor<48?(48-e.vigor)*1.4:0,'Overall turf vigor',`Vigor index ${e.vigor.toFixed(0)}/100 indicates cumulative stress but does not identify a cause by itself.`,`Use the higher-ranked constraints above rather than treating low vigor as a fertilizer recommendation.`);
    return items.filter(x=>x.score>5).sort((a,b)=>b.score-a.score).slice(0,4);
  }
  function renderDiagnostics(){
    for(const key of ['A','B']){
      const box=byId('diagnostic'+key);if(!box)continue;const s=key==='A'?A:B,items=diagnosticItems(s);
      box.innerHTML=items.length?items.map((x,i)=>`<article class="diag-item ${i===0?'primary':''}"><div class="diag-rank">${i===0?'PRIMARY':'WATCH'}</div><div><strong>${esc(x.name)}</strong><p>${esc(x.why)}</p><small><b>Inspect next:</b> ${esc(x.check)}</small></div><span class="diag-score">${Math.round(x.score)}</span></article>`).join(''):`<div class="diag-clear"><strong>No dominant modeled constraint detected.</strong><span>Conditions are relatively balanced in the current state. Continue monitoring rather than manufacturing a problem.</span></div>`;
    }
  }

  function buildUI(){
    const modeShell=document.querySelector('.mode-shell');
    const anchor=modeShell||document.querySelector('header');
    if(!anchor)return;
    const onboarding=document.createElement('section');
    onboarding.className='card wide scenario-onboarding';
    onboarding.id='scenario-onboarding';
    const scenarios=scenarioSets[mode];
    onboarding.innerHTML=`<div class="scenario-head"><div><span class="scenario-kicker">QUICK START · v19.6</span><h2>Start with a real problem, not a blank dashboard.</h2><p>Load a prepared baseline, then change one thing at a time. The simulator stays fully editable.</p></div><button type="button" class="scenario-collapse" aria-expanded="true">Hide quick starts</button></div><div class="scenario-grid">${scenarios.map(s=>`<article class="scenario-card"><span class="scenario-icon">${s.icon}</span><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p><button type="button" data-scenario="${esc(s.id)}">Load scenario</button></article>`).join('')}</div><div id="scenarioStatus" class="scenario-status">Choose a scenario or continue with the current setup.</div>`;
    anchor.insertAdjacentElement('afterend',onboarding);
    onboarding.addEventListener('click',ev=>{const b=ev.target.closest('[data-scenario]');if(!b)return;const sc=scenarios.find(x=>x.id===b.dataset.scenario);if(sc)loadScenario(sc);});
    onboarding.querySelector('.scenario-collapse').addEventListener('click',ev=>{const hidden=onboarding.classList.toggle('scenario-collapsed');ev.currentTarget.textContent=hidden?'Show quick starts':'Hide quick starts';ev.currentTarget.setAttribute('aria-expanded',String(!hidden));});

    const timeline=byId('timeline-workflow');
    if(timeline){
      const tools=document.createElement('section');
      tools.className='card wide scenario-memory';
      tools.id='scenario-memory';
      tools.innerHTML=`<div class="scenario-head"><div><span class="scenario-kicker">SCENARIO MEMORY</span><h2>Save, return and compare.</h2><p>Freeze the current state in this browser, then compare later management paths against it.</p></div><span class="scenario-local">Local browser storage</span></div><div class="save-row"><button type="button" id="saveCurrentScenario" class="primary">Save current state</button><select id="savedScenarioSelect" aria-label="Saved scenarios"></select><button type="button" id="loadSavedScenario">Load</button><button type="button" id="compareSavedScenario">Compare</button><button type="button" id="deleteSavedScenario">Delete</button></div><div id="saveStatus" class="scenario-status">Up to ${MAX_SAVES} saved states. Saving does not change the simulation.</div><div id="scenarioComparison" class="scenario-comparison"></div>`;
      timeline.insertAdjacentElement('afterend',tools);
      byId('saveCurrentScenario').addEventListener('click',()=>{const def=`Day ${day} · ${A.grass} · ${new Date().toLocaleDateString()}`;const name=prompt('Name this saved scenario:',def);if(!name)return;const items=saved();items.unshift({id:String(Date.now()),name:name.trim().slice(0,70)||def,data:snapshot()});if(!persist(items)){byId('saveStatus').textContent='Could not save: browser storage is unavailable or full.';return}refreshSaved();byId('saveStatus').textContent=`✓ Saved “${name.trim().slice(0,70)||def}” at Day ${day}.`;});
      byId('loadSavedScenario').addEventListener('click',()=>{const x=saved().find(v=>v.id===byId('savedScenarioSelect').value);if(!x)return;if(confirm(`Load “${x.name}”? Current unsaved simulation state will be replaced.`)){restore(x.data);byId('saveStatus').textContent=`✓ Loaded “${x.name}”.`;byId('scenarioComparison').innerHTML='';}});
      byId('compareSavedScenario').addEventListener('click',()=>{const x=saved().find(v=>v.id===byId('savedScenarioSelect').value);if(!x)return;byId('scenarioComparison').innerHTML=`<div class="compare-title"><strong>Current state vs ${esc(x.name)}</strong><span>Delta = current − saved</span></div><div class="compare-grid">${comparison(x.data)}</div>`;});
      byId('deleteSavedScenario').addEventListener('click',()=>{const id=byId('savedScenarioSelect').value,x=saved().find(v=>v.id===id);if(!x)return;if(!confirm(`Delete saved scenario “${x.name}”?`))return;persist(saved().filter(v=>v.id!==id));refreshSaved();byId('saveStatus').textContent='Saved scenario deleted.';byId('scenarioComparison').innerHTML='';});
      refreshSaved();
    }

    if(['technician','professional','research'].includes(mode)){
      const divergence=byId('divergence')?.closest('section');
      const diag=document.createElement('section');diag.className='card wide diagnostic-lens';diag.id='diagnostic-lens';
      diag.innerHTML=`<div class="scenario-head"><div><span class="scenario-kicker">DIAGNOSTIC LENS</span><h2>What is limiting the system right now?</h2><p>Ranks modeled constraints so low vigor does not automatically become a fertilizer problem. Verify important findings in the field.</p></div><span class="scenario-local">Decision support · not diagnosis</span></div><div class="diag-grid"><div><h3>🅰️ Lawn A</h3><div id="diagnosticA"></div></div><div><h3>🅱️ Lawn B</h3><div id="diagnosticB"></div></div></div>`;
      (divergence||timeline||document.querySelector('.simulation-grid'))?.insertAdjacentElement('afterend',diag);
    }
  }

  buildUI();
  const oldRender=render;
  render=function(){oldRender();renderDiagnostics();};
  renderDiagnostics();

  const badge=document.querySelector('.build-badge');if(badge)badge.textContent='v19.6 · SCENARIOS + DIAGNOSTICS';
  const topBadge=document.querySelector('header .badge');if(topBadge)topBadge.textContent=`v19.6 · ${mode.charAt(0).toUpperCase()+mode.slice(1)}`;
  document.title=`Living Soil Lab v19.6 | ${mode.charAt(0).toUpperCase()+mode.slice(1)} Mode`;
})();