(()=>{
  'use strict';
  const byId=id=>document.getElementById(id);
  const grid=document.querySelector('.simulation-grid');
  const lawnA=byId('lawn-a-panel');
  const lawnB=byId('lawn-b-panel');
  const timeline=byId('timeline-workflow');
  const intro=document.querySelector('.visual-intro');
  const viewOptions=intro?.querySelector('.view-options');

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

  timeline.classList.add('timeline-report-only');

  const styleMemory=memory=>{
    if(!memory)return;
    memory.classList.add('profile-save-memory');
    const kicker=memory.querySelector('.scenario-kicker');
    const heading=memory.querySelector('h2');
    const copy=memory.querySelector('.scenario-head p');
    const local=memory.querySelector('.scenario-local');
    if(kicker)kicker.textContent='SAVE & COMPARE';
    if(heading)heading.textContent='Save this point';
    if(copy)copy.textContent='Keep a snapshot before you test the next change, then load or compare it later.';
    if(local)local.textContent='Stored on this device';
  };

  const majorForHeading=pattern=>{
    const heading=[...document.querySelectorAll('h1,h2,h3,h4')]
      .find(el=>pattern.test((el.textContent||'').trim()));
    if(!heading)return null;
    return heading.closest('.card.wide')||heading.closest('section.card')||heading.closest('section,article,.panel')||null;
  };

  const appendAfter=(anchor,panel)=>{
    if(!anchor||!panel||anchor===panel||anchor.contains(panel))return anchor;
    anchor.insertAdjacentElement('afterend',panel);
    return panel;
  };

  // Approved primary experiment flow:
  // Scenario -> Profile/Time -> Save -> Lawn A/B -> Replay -> What Changed.
  const arrangePrimaryPanels=()=>{
    const scenarios=byId('scenario-onboarding');
    const memory=byId('scenario-memory');
    if(!scenarios)return false;

    scenarios.classList.add('tf-scenarios-first');
    styleMemory(memory);

    grid.prepend(scenarios);
    let anchor=scenarios;
    anchor=appendAfter(anchor,deck);
    if(memory)anchor=appendAfter(anchor,memory);
    anchor=appendAfter(anchor,lawnA);
    anchor=appendAfter(anchor,lawnB);

    // living-profiles.js creates this later; keep enforcing until it exists.
    const replay=document.querySelector('.tf-replay-bar');
    if(replay){
      replay.classList.add('tf-replay-primary');
      anchor=appendAfter(anchor,replay);
    }
    appendAfter(anchor,timeline);

    const topAnchor=document.querySelector('.mode-shell')||document.querySelector('header');
    if(topAnchor)topAnchor.insertAdjacentElement('afterend',grid);
    return true;
  };

  // Approved deeper flow after the main experiment. Only move major/wide panels so
  // nested controls stay intact.
  const arrangeDeepPanels=()=>{
    let anchor=grid;

    const diagnostic=byId('diagnostic-lens');
    if(diagnostic)anchor=appendAfter(anchor,diagnostic);

    const management=byId('experiment-controls')?.closest('.card.wide')
      ||byId('experiment-controls')?.closest('section.card')
      ||majorForHeading(/Management|Treatment Controls|Treatments|Applications/i);
    if(management&&!grid.contains(management))anchor=appendAfter(anchor,management);

    const soil=majorForHeading(/Soil Physics|Soil Lab|Nutrient Cycling|Soil & Nutrient|Nutrient Detail/i);
    if(soil&&!grid.contains(soil))anchor=appendAfter(anchor,soil);

    const biology=majorForHeading(/Soil Food Web|Biology|Microbial|Microbiology/i);
    if(biology&&!grid.contains(biology))anchor=appendAfter(anchor,biology);

    // Specialized labs: keep together and below core soil/biology panels.
    const labPatterns=[
      /Seaweed\s+Response\s+Lab/i,
      /Worm\s+Tea\s+Brewing\s+Lab/i,
      /Brew\s+Microscope|Microscope\s+Observation/i,
      /Custom\s+Product|Formulation\s+Studio/i
    ];
    const seen=new Set();
    for(const pattern of labPatterns){
      const panel=majorForHeading(pattern);
      if(panel&&!grid.contains(panel)&&!seen.has(panel)){
        seen.add(panel);
        panel.classList.add('tf-specialized-lab');
        anchor=appendAfter(anchor,panel);
      }
    }

    const evidence=document.querySelector('.evidence-layer')?.closest('.card.wide')
      ||majorForHeading(/Evidence Layer|Experiment Activity|Evidence & Confidence/i);
    if(evidence&&!grid.contains(evidence))anchor=appendAfter(anchor,evidence);

    return anchor;
  };

  // Scientific transparency is always the final simulator panel.
  const moveTransparencyToEnd=()=>{
    const panel=majorForHeading(/^Scientific transparency$/i);
    if(!panel)return false;
    panel.classList.add('tf-transparency-last');
    const main=document.querySelector('main');
    if(main)main.appendChild(panel);
    else document.body.appendChild(panel);
    return true;
  };

  const enforceAll=()=>{
    arrangePrimaryPanels();
    arrangeDeepPanels();
    moveTransparencyToEnd();
  };

  enforceAll();
  [0,80,250,700,1600,3000].forEach(ms=>setTimeout(enforceAll,ms));
  const observer=new MutationObserver(enforceAll);
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),6500);

  if(intro)intro.classList.add('visual-intro-workspace-moved','visual-intro-without-controls');

  if(!document.querySelector('link[data-living-profiles]')){
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href='living-profiles.css?v=20.16';
    css.dataset.livingProfiles='true';
    document.head.appendChild(css);
  }
  if(!document.querySelector('script[data-living-profiles]')){
    const script=document.createElement('script');
    script.src='living-profiles.js?v=20.16';
    script.defer=true;
    script.dataset.livingProfiles='true';
    document.body.appendChild(script);
  }

  const badge=document.querySelector('.build-badge');
  if(badge)badge.textContent='v20.16 · PANEL HIERARCHY';
  const topBadge=document.querySelector('header .badge');
  if(topBadge){
    const mode=(document.documentElement.dataset.audience||'professional');
    topBadge.textContent=`v20.16 · ${mode.charAt(0).toUpperCase()+mode.slice(1)}`;
  }
})();
