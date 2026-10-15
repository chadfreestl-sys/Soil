(()=>{
  const MODES={
    homeowner:{label:'Homeowner',verb:'Understand my lawn',desc:'Plain-language exploration focused on visible lawn problems, root-zone causes, weather, management and safer what-if learning.'},
    technician:{label:'Technician',verb:'Diagnose & explain',desc:'Field-oriented workflow focused on inspection, treatments, rates, previous-visit changes and what to investigate next.'},
    professional:{label:'Professional',verb:'Manage the system',desc:'Full turf-management workspace with soil physics, nutrient loading, biology, repeated treatments and advanced product controls.'},
    research:{label:'Research / Lab',verb:'Interrogate the model',desc:'Maximum transparency with model assumptions, exploratory biology, brewing, microscopy and confidence information available when needed.'}
  };
  const allowed=new Set(Object.keys(MODES));
  const params=new URLSearchParams(location.search);
  let mode=(params.get('mode')||localStorage.getItem('lslAudienceMode')||'professional').toLowerCase();
  if(!allowed.has(mode)) mode='professional';
  localStorage.setItem('lslAudienceMode',mode);
  document.documentElement.dataset.audience=mode;

  const sectionRules={
    homeowner:{hide:['Living ecosystem microscope','Custom product formulation studio','Worm Tea Brewing Lab','Soil lab & nutrient cycling','Experiment activity','Brew Microscope Observation Log','Evidence & Confidence Layer']},
    technician:{hide:['Worm Tea Brewing Lab','Brew Microscope Observation Log','Evidence & Confidence Layer']},
    professional:{hide:[]},
    research:{hide:[]}
  };
  const hideNames=sectionRules[mode].hide;
  const sections=[...document.querySelectorAll('section')];
  sections.forEach(sec=>{
    const h=sec.querySelector('h2,h3');
    const title=h?.textContent?.trim()||'';
    sec.classList.toggle('audience-hidden',hideNames.some(name=>title.includes(name)));
  });

  document.querySelectorAll('nav a[href^="#"]').forEach(link=>{
    const target=document.querySelector(link.getAttribute('href'));
    if(target?.classList.contains('audience-hidden')) link.classList.add('audience-hidden');
  });

  // The full evidence announcement was visually competing with the simulator.
  // Keep the confidence system, but make it secondary to the actual turf/soil data.
  [...document.querySelectorAll('.v8-hero')].forEach(el=>{
    if(/evidence tiers|confidence separated/i.test(el.textContent||'')) el.classList.add('evidence-hero-hidden');
  });

  const evidenceSection=document.getElementById('evidence-layer');
  if(evidenceSection && !evidenceSection.classList.contains('audience-hidden')){
    evidenceSection.classList.add('evidence-collapsed');
    const head=evidenceSection.querySelector('.head');
    if(head){
      const toggle=document.createElement('button');
      toggle.type='button';
      toggle.className='evidence-toggle';
      toggle.textContent='Show confidence guide';
      toggle.setAttribute('aria-expanded','false');
      toggle.addEventListener('click',()=>{
        const collapsed=evidenceSection.classList.toggle('evidence-collapsed');
        toggle.textContent=collapsed?'Show confidence guide':'Hide confidence guide';
        toggle.setAttribute('aria-expanded',String(!collapsed));
      });
      head.appendChild(toggle);
    }
  }

  const header=document.querySelector('header');
  const info=MODES[mode];
  if(header){
    const shell=document.createElement('div');
    shell.className='mode-shell';
    shell.innerHTML=`<div class="mode-copy"><span class="mode-kicker">Audience mode · same simulation engine</span><strong>${info.label} — ${info.verb}</strong><p>${info.desc}</p><div class="audience-mode-note"><strong>Mode changes presentation, not the underlying ecosystem equations.</strong> Confidence information remains available without dominating the workspace.</div></div><div class="mode-actions"><span class="mode-pill">${info.label}</span><a class="mode-change" href="./">Change audience</a></div>`;
    header.insertAdjacentElement('afterend',shell);
  }

  const badge=document.querySelector('.build-badge');
  if(badge) badge.textContent='v19.5.1 · AUDIENCE MODES';
  const topBadge=document.querySelector('header .badge');
  if(topBadge) topBadge.textContent=`v19.5.1 · ${info.label}`;
  document.title=`Turfarium v19.5.1 | ${info.label} Mode`;

  const hints={
    homeowner:{'Shared starting conditions':'Start with what you know about the lawn. You can leave advanced values alone and compare management choices visually.','⏱ Simulation time':'Try one change at a time, advance the clock, then inspect the lawn and root-zone response.'},
    technician:{'Shared starting conditions':'Treat this like a property intake: turf, soil, moisture, season and site conditions drive the diagnosis.','⏱ Simulation time':'Use the visit cycle: inspect → treat → advance → compare → decide what to check next.'},
    professional:{'Shared starting conditions':'Build the site profile first; advanced outputs are only as useful as the starting assumptions.','⏱ Simulation time':'Use repeated management cycles to explore cumulative effects rather than one-off product reactions.'},
    research:{'Shared starting conditions':'Document the scenario carefully so comparisons remain interpretable and reproducible.','⏱ Simulation time':'Use controlled scenario changes and repeated runs to probe sensitivity and model behavior.'}
  };
  sections.forEach(sec=>{
    if(sec.classList.contains('audience-hidden')) return;
    const h=sec.querySelector('h2,h3');
    if(!h) return;
    const title=h.textContent.trim();
    const entry=Object.entries(hints[mode]).find(([key])=>title.includes(key));
    if(entry){
      const p=document.createElement('p');
      p.className='audience-mode-note';
      p.textContent=entry[1];
      h.insertAdjacentElement('afterend',p);
    }
  });
})();
