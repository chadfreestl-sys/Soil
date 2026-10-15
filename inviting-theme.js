(()=>{
  'use strict';

  document.body.classList.add('nature-studio','turfarium-v20');
  const mode=(document.documentElement.dataset.audience||'professional').toLowerCase();
  const copy={
    homeowner:{title:'See what your lawn is telling you.',desc:'Start simple, try one change, move time forward, and watch what happens above and below the surface.'},
    technician:{title:'Turn each lawn visit into a clearer story.',desc:'Build the site picture, test a management path, and focus on the next thing worth checking in the field.'},
    professional:{title:'Keep the whole turf system in view.',desc:'Follow soil, roots, water, nutrients and biology together while keeping the important decisions easy to reach.'},
    research:{title:'Explore the model without losing the living system.',desc:'Keep the deeper controls and experimental tools available while the interface stays calm and readable.'}
  };

  const brandTitle=document.querySelector('header h1');
  if(brandTitle){
    brandTitle.textContent='Turfarium';
    if(!brandTitle.querySelector('.turfarium-brand-icon')){
      const icon=document.createElement('img');
      icon.src='turfarium-icon.svg';
      icon.alt='';
      icon.className='turfarium-brand-icon';
      brandTitle.prepend(icon);
    }
  }

  const shell=document.querySelector('.mode-shell');
  if(shell){
    const strong=shell.querySelector('.mode-copy strong');
    const p=shell.querySelector('.mode-copy p');
    if(strong) strong.textContent=copy[mode]?.title||copy.professional.title;
    if(p) p.textContent=copy[mode]?.desc||copy.professional.desc;
    const note=shell.querySelector('.audience-mode-note');
    if(note) note.innerHTML='<strong>Same ecosystem underneath.</strong> This view simply changes how much detail you see at once.';
  }

  const visual=document.querySelector('.visual-intro');
  if(visual){
    const h=visual.querySelector('h2');
    const p=visual.querySelector('p');
    if(h) h.textContent='See the lawn. Then follow the story underground.';
    if(p) p.textContent='Compare two lawns under the same weather and watch different choices play out over time.';
  }

  const onboarding=document.getElementById('scenario-onboarding');
  if(onboarding){
    const h=onboarding.querySelector('h2');
    const p=onboarding.querySelector('.scenario-head p');
    if(h) h.textContent='Choose a lawn situation to start with.';
    if(p) p.textContent='Pick something familiar, then change anything you want as you explore.';
  }

  const memory=document.getElementById('scenario-memory');
  if(memory){
    const h=memory.querySelector('h2');
    const p=memory.querySelector('.scenario-head p');
    if(h) h.textContent='Save this point and compare what happens next.';
    if(p) p.textContent='Keep a reference point, try another path, and come back to compare the results.';
  }

  const diagnostic=document.getElementById('diagnostic-lens');
  if(diagnostic){
    const h=diagnostic.querySelector('h2');
    const p=diagnostic.querySelector('.scenario-head p');
    if(h) h.textContent='What may be limiting this lawn right now?';
    if(p) p.textContent='Use the ranked constraints as clues about what is worth inspecting next.';
  }

  const profile=document.querySelector('.profile-control-deck');
  if(profile){
    const strong=profile.querySelector('.profile-deck-label strong');
    if(strong) strong.textContent='Choose a view, then move time forward.';
  }

  const visit=document.getElementById('visit');
  if(visit && /After each advance|Move time forward/i.test(visit.textContent||'')){
    visit.textContent='Move time forward, compare both lawns, then decide whether the next step is treatment, observation, or more time.';
  }

  const badge=document.querySelector('.build-badge');
  if(badge) badge.textContent='v20 · FRIENDLY ECOSYSTEM UI';
  const topBadge=document.querySelector('header .badge');
  if(topBadge) topBadge.textContent=`v20 · ${mode==='research'?'Research / Lab':mode.charAt(0).toUpperCase()+mode.slice(1)}`;
  document.title=`Turfarium | ${mode==='research'?'Research / Lab':mode.charAt(0).toUpperCase()+mode.slice(1)} Mode`;
})();
