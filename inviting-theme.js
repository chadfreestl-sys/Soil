(()=>{
  'use strict';

  document.body.classList.add('nature-studio');
  const mode=(document.documentElement.dataset.audience||'professional').toLowerCase();
  const copy={
    homeowner:{title:'Explore your lawn without feeling buried in data.',desc:'Start with the lawn you recognize, change one thing, move time forward, and watch the story unfold above and below the surface.'},
    technician:{title:'Turn a lawn visit into a clear field story.',desc:'Build the site picture, test a management path, and use the model to focus the next thing worth inspecting.'},
    professional:{title:'Manage the turf system without losing the big picture.',desc:'Follow soil, roots, water, nutrients and biology together while keeping the key decisions easy to reach.'},
    research:{title:'A serious model can still feel inviting to explore.',desc:'Keep the deeper controls, experimental tools and evidence information visible without making the workspace feel cold or crowded.'}
  };

  const shell=document.querySelector('.mode-shell');
  if(shell){
    const strong=shell.querySelector('.mode-copy strong');
    const p=shell.querySelector('.mode-copy p');
    if(strong) strong.textContent=copy[mode]?.title||copy.professional.title;
    if(p) p.textContent=copy[mode]?.desc||copy.professional.desc;
    const note=shell.querySelector('.audience-mode-note');
    if(note) note.innerHTML='<strong>Same ecosystem engine underneath.</strong> The workspace is arranged to help you notice the lawn first and the complexity second.';
  }

  const visual=document.querySelector('.visual-intro');
  if(visual){
    const h=visual.querySelector('h2');
    const p=visual.querySelector('p');
    if(h) h.textContent='Watch the lawn above. Follow the story below.';
    if(p) p.textContent='Two lawns share the weather, then respond to different choices across time.';
  }

  const onboarding=document.getElementById('scenario-onboarding');
  if(onboarding){
    const h=onboarding.querySelector('h2');
    const p=onboarding.querySelector('.scenario-head p');
    if(h) h.textContent='Start with a lawn situation that already feels familiar.';
    if(p) p.textContent='Pick a realistic starting point, then make it your own. Nothing is locked in.';
  }

  const memory=document.getElementById('scenario-memory');
  if(memory){
    const h=memory.querySelector('h2');
    const p=memory.querySelector('.scenario-head p');
    if(h) h.textContent='Save this moment and see where the lawn goes next.';
    if(p) p.textContent='Keep today as a reference, try another path, and compare how the system changes later.';
  }

  const diagnostic=document.getElementById('diagnostic-lens');
  if(diagnostic){
    const h=diagnostic.querySelector('h2');
    const p=diagnostic.querySelector('.scenario-head p');
    if(h) h.textContent='What may be holding this lawn back?';
    if(p) p.textContent='Use the ranked constraints to guide your attention before assuming the answer is another product.';
  }

  const profile=document.querySelector('.profile-control-deck');
  if(profile){
    const strong=profile.querySelector('.profile-deck-label strong');
    if(strong) strong.textContent='Choose what you want to see, then move the season forward.';
  }

  const visit=document.getElementById('visit');
  if(visit && /After each advance|Move time forward/i.test(visit.textContent||'')){
    visit.textContent='Move time forward, look at both lawns, then decide whether the next best move is treatment, observation, or simply more time.';
  }

  const badge=document.querySelector('.build-badge');
  if(badge) badge.textContent='v19.8 · NATURE STUDIO';
  const topBadge=document.querySelector('header .badge');
  if(topBadge) topBadge.textContent=`v19.8 · ${mode==='research'?'Research / Lab':mode.charAt(0).toUpperCase()+mode.slice(1)}`;
  document.title=`Living Soil Lab v19.8 | ${mode==='research'?'Research / Lab':mode.charAt(0).toUpperCase()+mode.slice(1)} Mode`;
})();
