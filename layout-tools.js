(()=>{
  'use strict';
  const byId=id=>document.getElementById(id);
  const grid=document.querySelector('.simulation-grid');
  const lawnA=byId('lawn-a-panel');
  const lawnB=byId('lawn-b-panel');
  const timeline=byId('timeline-workflow');
  const intro=document.querySelector('.visual-intro');
  const viewOptions=intro?.querySelector('.view-options');
  const memory=byId('scenario-memory');
  const modeShell=document.querySelector('.mode-shell');
  const header=document.querySelector('header');

  if(!grid||!lawnA||!lawnB||!timeline)return;

  grid.classList.add('tf-primary-workspace');

  const deck=document.createElement('section');
  deck.id='profile-control-deck';
  deck.className='card wide profile-control-deck';
  deck.innerHTML=`
    <div class="profile-deck-label">
      <span class="profile-deck-kicker">LIVE PROFILE CONTROLS</span>
      <strong>Profile Viewer + Time Advance</strong>
    </div>
    <div class="profile-deck-grid">
      <div class="profile-view-slot"></div>
      <div class="profile-time-slot"></div>
    </div>`;

  const viewSlot=deck.querySelector('.profile-view-slot');
  const timeSlot=deck.querySelector('.profile-time-slot');

  if(viewOptions){
    viewOptions.classList.add('profile-view-embedded');
    const label=viewOptions.querySelector('label[for="viewMode"]');
    if(label)label.textContent='Profile viewer';
    viewSlot.appendChild(viewOptions);
  }else{
    viewSlot.innerHTML='<span class="profile-missing">Profile viewer unavailable.</span>';
  }

  const timeHead=timeline.querySelector('.head');
  const stepRow=timeline.querySelector('.row');
  const visit=byId('visit');
  if(timeHead){
    timeHead.classList.add('profile-time-head');
    const heading=timeHead.querySelector('h2');
    if(heading)heading.textContent='⏱ Time advance';
    timeSlot.appendChild(timeHead);
  }
  if(stepRow){
    stepRow.classList.add('profile-step-row');
    timeSlot.appendChild(stepRow);
  }
  if(visit){
    visit.classList.add('profile-visit-note');
    timeSlot.appendChild(visit);
  }

  grid.insertBefore(deck,lawnA);

  if(memory){
    memory.classList.add('profile-save-memory');
    const kicker=memory.querySelector('.scenario-kicker');
    const heading=memory.querySelector('h2');
    const copy=memory.querySelector('.scenario-head p');
    const local=memory.querySelector('.scenario-local');
    if(kicker)kicker.textContent='SAVE & COMPARE';
    if(heading)heading.textContent='Save this point';
    if(copy)copy.textContent='Keep a snapshot before you test the next change, then load or compare it later.';
    if(local)local.textContent='Stored on this device';
    deck.insertAdjacentElement('afterend',memory);
  }

  lawnB.insertAdjacentElement('afterend',timeline);
  timeline.classList.add('timeline-report-only');

  // Scenarios must always be the first working block, with the live lawn workspace directly after.
  // scenario-tools.js can render asynchronously relative to this file, so enforce the order repeatedly.
  const placePrimaryFlow=()=>{
    const topAnchor=document.querySelector('.mode-shell')||document.querySelector('header');
    const scenarios=byId('scenario-onboarding');
    if(!topAnchor)return false;
    if(scenarios){
      scenarios.classList.add('tf-scenarios-first');
      topAnchor.insertAdjacentElement('afterend',scenarios);
      scenarios.insertAdjacentElement('afterend',grid);
      return true;
    }
    topAnchor.insertAdjacentElement('afterend',grid);
    return false;
  };

  placePrimaryFlow();
  setTimeout(placePrimaryFlow,0);
  setTimeout(placePrimaryFlow,120);
  setTimeout(placePrimaryFlow,500);
  setTimeout(placePrimaryFlow,1400);
  const observer=new MutationObserver(()=>{
    if(byId('scenario-onboarding')){
      placePrimaryFlow();
      observer.disconnect();
    }
  });
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),4000);

  if(intro) intro.classList.add('visual-intro-workspace-moved','visual-intro-without-controls');

  const cardsForHeading=pattern=>{
    const seen=new Set();
    return [...document.querySelectorAll('h1,h2,h3,h4')]
      .filter(el=>pattern.test((el.textContent||'').trim()))
      .map(el=>el.closest('.card')||el.closest('section,article,.panel')||el.parentElement)
      .filter(el=>el&&!seen.has(el)&&seen.add(el));
  };

  const moveSeaweedLab=()=>{
    const seaweeds=cardsForHeading(/Seaweed\s+Response\s+Lab/i);
    if(!seaweeds.length)return false;
    const worm=cardsForHeading(/Worm\s+Tea\s+Brewing\s+Lab/i).pop();
    const microscope=cardsForHeading(/Brew\s+Microscope|Microscope\s+Observation/i).pop();
    let anchor=worm||microscope;

    seaweeds.forEach(seaweed=>{
      if(anchor&&anchor!==seaweed&&anchor.parentElement){
        anchor.insertAdjacentElement('afterend',seaweed);
      }else{
        (document.querySelector('main')||document.body).appendChild(seaweed);
      }
      seaweed.dataset.tfSeaweedMoved='true';
      seaweed.classList.add('tf-advanced-input-lab');
      seaweed.style.order='900';
      anchor=seaweed;
    });
    return true;
  };

  moveSeaweedLab();
  setTimeout(moveSeaweedLab,300);
  setTimeout(moveSeaweedLab,1200);

  if(!document.querySelector('link[data-living-profiles]')){
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href='living-profiles.css?v=20.6';
    css.dataset.livingProfiles='true';
    document.head.appendChild(css);
  }
  if(!document.querySelector('script[data-living-profiles]')){
    const script=document.createElement('script');
    script.src='living-profiles.js?v=20.6';
    script.defer=true;
    script.dataset.livingProfiles='true';
    document.body.appendChild(script);
  }

  const badge=document.querySelector('.build-badge');
  if(badge)badge.textContent='v20.13 · SCENARIOS FIRST';
  const topBadge=document.querySelector('header .badge');
  if(topBadge){
    const mode=(document.documentElement.dataset.audience||'professional');
    topBadge.textContent=`v20.13 · ${mode.charAt(0).toUpperCase()+mode.slice(1)}`;
  }
})();
