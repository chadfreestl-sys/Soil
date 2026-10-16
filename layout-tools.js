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

  const appendAfter=(anchor,panel)=>{
    if(!anchor||!panel||anchor===panel||anchor.contains(panel))return anchor;
    if(panel.previousElementSibling!==anchor)anchor.insertAdjacentElement('afterend',panel);
    return panel;
  };

  // FAST PATH: only touch the small primary workspace during startup.
  const arrangePrimaryPanels=()=>{
    const scenarios=byId('scenario-onboarding');
    const memory=byId('scenario-memory');
    if(!scenarios)return false;

    scenarios.classList.add('tf-scenarios-first');
    styleMemory(memory);

    if(grid.firstElementChild!==scenarios)grid.prepend(scenarios);
    let anchor=scenarios;
    anchor=appendAfter(anchor,deck);
    if(memory)anchor=appendAfter(anchor,memory);
    anchor=appendAfter(anchor,lawnA);
    anchor=appendAfter(anchor,lawnB);

    const replay=document.querySelector('.tf-replay-bar');
    if(replay){
      replay.classList.add('tf-replay-primary');
      anchor=appendAfter(anchor,replay);
    }
    appendAfter(anchor,timeline);

    const topAnchor=document.querySelector('.mode-shell')||document.querySelector('header');
    if(topAnchor&&grid.previousElementSibling!==topAnchor)topAnchor.insertAdjacentElement('afterend',grid);
    return true;
  };

  if(intro)intro.classList.add('visual-intro-workspace-moved','visual-intro-without-controls');

  // First paint gets the main experiment immediately.
  arrangePrimaryPanels();
  requestAnimationFrame(arrangePrimaryPanels);

  // Watch only briefly for asynchronously-created scenario/replay UI; debounce all work.
  let observerTimer=0;
  let observer;
  const onMutations=records=>{
    let relevant=false;
    for(const record of records){
      for(const node of record.addedNodes){
        if(node.nodeType!==1)continue;
        if(node.matches?.('#scenario-onboarding,#scenario-memory,.tf-replay-bar') ||
           node.querySelector?.('#scenario-onboarding,#scenario-memory,.tf-replay-bar')){
          relevant=true; break;
        }
      }
      if(relevant)break;
    }
    if(!relevant)return;
    clearTimeout(observerTimer);
    observerTimer=setTimeout(arrangePrimaryPanels,40);
  };
  observer=new MutationObserver(onMutations);
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),2200);

  const majorForHeading=pattern=>{
    const headings=document.querySelectorAll('h1,h2,h3,h4');
    for(const heading of headings){
      if(pattern.test((heading.textContent||'').trim())){
        return heading.closest('.card.wide')||heading.closest('section.card')||heading.closest('section,article,.panel')||null;
      }
    }
    return null;
  };

  // DEEP PATH: reorder off-screen expert/lab panels only after the browser is idle.
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

    const transparency=majorForHeading(/^Scientific transparency$/i);
    if(transparency){
      transparency.classList.add('tf-transparency-last');
      const main=document.querySelector('main');
      if(main&&main.lastElementChild!==transparency)main.appendChild(transparency);
    }
  };

  const idle=(fn,timeout=700)=>{
    if('requestIdleCallback' in window)requestIdleCallback(fn,{timeout});
    else setTimeout(fn,220);
  };
  idle(arrangeDeepPanels,800);

  // Living profile animation/replay is non-critical. Load it after first paint/idle.
  const loadLivingProfiles=()=>{
    if(!document.querySelector('link[data-living-profiles]')){
      const css=document.createElement('link');
      css.rel='stylesheet';
      css.href='living-profiles.css?v=20.17';
      css.dataset.livingProfiles='true';
      document.head.appendChild(css);
    }
    if(!document.querySelector('script[data-living-profiles]')){
      const script=document.createElement('script');
      script.src='living-profiles.js?v=20.17';
      script.defer=true;
      script.dataset.livingProfiles='true';
      script.addEventListener('load',()=>requestAnimationFrame(arrangePrimaryPanels),{once:true});
      document.body.appendChild(script);
    }
  };
  idle(loadLivingProfiles,1000);

  const badge=document.querySelector('.build-badge');
  if(badge)badge.textContent='v20.17 · FAST START';
  const topBadge=document.querySelector('header .badge');
  if(topBadge){
    const mode=(document.documentElement.dataset.audience||'professional');
    topBadge.textContent=`v20.17 · ${mode.charAt(0).toUpperCase()+mode.slice(1)}`;
  }
})();
