(()=>{
  'use strict';

  const mode=(document.documentElement.dataset.audience||'professional').toLowerCase();
  const copy={
    homeowner:{title:'Explore what your lawn may be telling you.',desc:'Start simple. Change one thing, move time forward, and watch how the turf and root zone respond.'},
    technician:{title:'Work the lawn like a field problem.',desc:'Build the site picture, test a treatment path, and use the model to sharpen what you inspect next.'},
    professional:{title:'See the whole turf system work together.',desc:'Run management decisions across time and watch soil, roots, water, nutrients and biology interact.'},
    research:{title:'Explore the model, challenge it, and learn from it.',desc:'Use matched scenarios, saved states and deeper controls to test assumptions and inspect system behavior.'}
  };

  const shell=document.querySelector('.mode-shell');
  if(shell){
    const strong=shell.querySelector('.mode-copy strong');
    const p=shell.querySelector('.mode-copy p');
    if(strong) strong.textContent=copy[mode]?.title||copy.professional.title;
    if(p) p.textContent=copy[mode]?.desc||copy.professional.desc;
    const note=shell.querySelector('.audience-mode-note');
    if(note) note.innerHTML='<strong>Same ecosystem engine underneath.</strong> This mode simply keeps the most useful information for your goal close at hand.';
  }

  const visual=document.querySelector('.visual-intro');
  if(visual){
    const h=visual.querySelector('h2');
    const p=visual.querySelector('p');
    if(h) h.textContent='See what’s happening above and below the surface.';
    if(p) p.textContent='Two lawns. Shared weather. Different choices. Watch the system respond over time.';
  }

  const onboarding=document.getElementById('scenario-onboarding');
  if(onboarding){
    const h=onboarding.querySelector('h2');
    const p=onboarding.querySelector('.scenario-head p');
    if(h) h.textContent='Jump in with a lawn that already has a story.';
    if(p) p.textContent='Choose a realistic starting point, then make it your own. Every value stays editable.';
  }

  const memory=document.getElementById('scenario-memory');
  if(memory){
    const h=memory.querySelector('h2');
    const p=memory.querySelector('.scenario-head p');
    if(h) h.textContent='Save a moment. Come back and compare.';
    if(p) p.textContent='Keep a snapshot of the lawn today, try another management path, and see how the two states differ later.';
  }

  const diagnostic=document.getElementById('diagnostic-lens');
  if(diagnostic){
    const h=diagnostic.querySelector('h2');
    const p=diagnostic.querySelector('.scenario-head p');
    if(h) h.textContent='What may be holding the lawn back right now?';
    if(p) p.textContent='The model ranks likely constraints so you can focus your inspection instead of automatically reaching for another product.';
  }

  const profile=document.getElementById('profile-workflow-shell');
  if(profile){
    const intro=profile.querySelector('.profile-workflow-intro');
    if(intro) intro.textContent='Pick a profile, move time forward, and watch Lawn A and Lawn B change together.';
  }

  const visit=document.getElementById('visit');
  if(visit && /After each advance/i.test(visit.textContent||'')){
    visit.textContent='Move time forward, look at both lawns, then decide whether the next best move is treatment, observation, or simply more time.';
  }

  const badge=document.querySelector('.build-badge');
  if(badge) badge.textContent='v19.7 · WARMER EXPERIENCE';
  const topBadge=document.querySelector('header .badge');
  if(topBadge) topBadge.textContent=`v19.7 · ${mode==='research'?'Research / Lab':mode.charAt(0).toUpperCase()+mode.slice(1)}`;
  document.title=`Living Soil Lab v19.7 | ${mode==='research'?'Research / Lab':mode.charAt(0).toUpperCase()+mode.slice(1)} Mode`;
})();
