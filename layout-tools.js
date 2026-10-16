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

  if(!document.querySelector('link[data-context-layout]')){
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href='context-layout-v20-18.css?v=20.26';
    css.dataset.contextLayout='true';
    document.head.appendChild(css);
  }
  if(!document.querySelector('link[data-collapse-layout]')){
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href='collapsible-panels-v20-21.css?v=20.26';
    css.dataset.collapseLayout='true';
    document.head.appendChild(css);
  }

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
  timeline.classList.add('timeline-report-only','tf-change-priority');

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

  const majorForHeading=pattern=>{
    const headings=document.querySelectorAll('h1,h2,h3,h4');
    for(const heading of headings){
      if(pattern.test((heading.textContent||'').trim())){
        return heading.closest('.card.wide')||heading.closest('section.card')||heading.closest('.card')||heading.closest('section,article,.panel')||null;
      }
    }
    return null;
  };

  const excludedContextPanel=panel=>!panel||panel===lawnA||panel===lawnB||panel===timeline||panel===deck||panel.id==='scenario-onboarding'||panel.id==='scenario-memory';

  const panelForControlText=pattern=>{
    const nodes=document.querySelectorAll('label,legend,.label,.control-label,.field-label');
    for(const node of nodes){
      const text=(node.textContent||'').trim().replace(/\s+/g,' ');
      if(!pattern.test(text))continue;
      const panel=node.closest('.card.wide')||node.closest('section.card')||node.closest('.card')||node.closest('.panel')||node.closest('section');
      if(!excludedContextPanel(panel))return panel;
    }
    return null;
  };

  const findContextPanels=()=>{
    let site=majorForHeading(/Site\s*(?:&|\/|\+)?\s*Turf|Turf\s*(?:Type|Species|Setup)|Lawn\s+Setup|Site\s+Setup|Turfgrass\s+Setup/i);
    let weather=majorForHeading(/Weather|Climate|Growing Conditions|Environmental Conditions/i);

    if(excludedContextPanel(site))site=null;
    if(excludedContextPanel(weather))weather=null;

    if(!site)site=panelForControlText(/^(?:Turf type|Turf species|Grass type|Turfgrass|Species|Sun\s*\/\s*shade|Sun exposure|Shade|Mowing height|Mowing baseline)$/i);
    if(!weather)weather=panelForControlText(/^(?:Climate profile|Weather|Weather pattern|Climate|Temperature|Rainfall|Rain pattern|Drought|Heat pattern)$/i);

    if(site)site.classList.add('tf-context-panel','tf-site-context');
    if(weather)weather.classList.add('tf-context-panel','tf-weather-context');
    if(site&&weather===site)weather=null;
    return {site,weather};
  };

  const findManagementPanel=()=>byId('experiment-controls')?.closest('.card.wide')
    ||byId('experiment-controls')?.closest('section.card')
    ||majorForHeading(/Management|Treatment Controls|Treatments|Applications/i);

  const titleForPanel=panel=>{
    if(panel===lawnA)return 'Lawn A';
    if(panel===lawnB)return 'Lawn B';
    if(panel.id==='scenario-onboarding')return 'Scenario Quick Start';
    if(panel.id==='scenario-memory')return 'Save & Compare';
    if(panel===deck)return 'Profile Viewer + Time Advance';
    if(panel===timeline)return 'What Changed';
    if(panel.id==='diagnostic-lens')return 'Diagnostic Lens';
    if(panel.classList.contains('tf-replay-bar'))return 'Replay';
    const heading=panel.querySelector('h1,h2,h3,h4,.scenario-kicker,.profile-deck-label strong');
    return (heading?.textContent||'Section').trim().replace(/\s+/g,' ');
  };

  const keyForPanel=panel=>{
    if(panel.id)return panel.id;
    const slug=titleForPanel(panel).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48)||'section';
    panel.id=`tf-panel-${slug}`;
    return panel.id;
  };

  const collapseStorageKey=panel=>`turfarium-collapse-v20.26:${keyForPanel(panel)}`;
  const defaultOpenPanel=panel=>panel===timeline||panel===lawnA||panel===lawnB;

  const setCollapsed=(panel,collapsed,save=true)=>{
    const button=panel.querySelector(':scope > .tf-collapse-toggle');
    const body=panel.querySelector(':scope > .tf-collapse-body');
    if(!button||!body)return;
    panel.classList.toggle('tf-panel-collapsed',collapsed);
    button.setAttribute('aria-expanded',String(!collapsed));
    button.querySelector('.tf-collapse-chevron').textContent=collapsed?'▸':'▾';
    body.hidden=collapsed;
    if(save){
      try{sessionStorage.setItem(collapseStorageKey(panel),collapsed?'1':'0');}catch(_){ }
    }
  };

  const makeCollapsible=(panel)=>{
    if(!panel||panel.dataset.tfCollapsible==='1')return;
    if(panel.closest('.tf-collapse-body'))return;
    panel.dataset.tfCollapsible='1';
    panel.classList.add('tf-collapsible-panel');
    const id=keyForPanel(panel);
    const title=titleForPanel(panel);
    const body=document.createElement('div');
    body.className='tf-collapse-body';
    while(panel.firstChild)body.appendChild(panel.firstChild);
    const button=document.createElement('button');
    button.type='button';
    button.className='tf-collapse-toggle';
    button.innerHTML=`<span class="tf-collapse-title"></span><span class="tf-collapse-chevron" aria-hidden="true">▸</span>`;
    button.querySelector('.tf-collapse-title').textContent=title;
    button.setAttribute('aria-controls',`${id}-body`);
    body.id=`${id}-body`;
    panel.append(button,body);

    let collapsed=!defaultOpenPanel(panel);
    try{
      const saved=sessionStorage.getItem(collapseStorageKey(panel));
      if(saved==='1'||saved==='0')collapsed=saved==='1';
    }catch(_){ }
    setCollapsed(panel,collapsed,false);
    button.addEventListener('click',()=>setCollapsed(panel,!panel.classList.contains('tf-panel-collapsed')));
  };

  const decorateCollapsibles=()=>{
    const {site,weather}=findContextPanels();
    const panels=[
      lawnA,lawnB,findManagementPanel(),timeline,
      byId('scenario-onboarding'),site,weather,deck,byId('scenario-memory'),
      document.querySelector('.tf-replay-bar'),byId('diagnostic-lens'),
      majorForHeading(/Soil Physics|Soil Lab|Nutrient Cycling|Soil & Nutrient|Nutrient Detail/i),
      majorForHeading(/Soil Food Web|Biology|Microbial|Microbiology/i),
      majorForHeading(/Seaweed\s+Response\s+Lab/i),
      majorForHeading(/Worm\s+Tea\s+Brewing\s+Lab/i),
      majorForHeading(/Brew\s+Microscope|Microscope\s+Observation/i),
      majorForHeading(/Custom\s+Product|Formulation\s+Studio/i),
      document.querySelector('.evidence-layer')?.closest('.card.wide')||majorForHeading(/Evidence Layer|Experiment Activity|Evidence & Confidence/i),
      majorForHeading(/^Scientific transparency$/i)
    ].filter(Boolean);
    [...new Set(panels)].forEach(makeCollapsible);
  };

  // Visual-first workspace:
  // Lawn A and Lawn B are the first open panels, then Lawn Treatments,
  // then What Changed open directly beneath the treatment panel.
  const arrangePrimaryPanels=()=>{
    const scenarios=byId('scenario-onboarding');
    const memory=byId('scenario-memory');
    const management=findManagementPanel();
    if(!scenarios)return false;

    scenarios.classList.add('tf-scenarios-first');
    styleMemory(memory);
    if(management)management.classList.add('tf-treatment-priority');
    lawnA.classList.add('tf-visual-priority');
    lawnB.classList.add('tf-visual-priority');

    if(grid.firstElementChild!==lawnA)grid.prepend(lawnA);
    let anchor=lawnA;
    anchor=appendAfter(anchor,lawnB);
    if(management)anchor=appendAfter(anchor,management);
    anchor=appendAfter(anchor,timeline);
    anchor=appendAfter(anchor,scenarios);

    const {site,weather}=findContextPanels();
    if(site)anchor=appendAfter(anchor,site);
    if(weather)anchor=appendAfter(anchor,weather);

    anchor=appendAfter(anchor,deck);
    if(memory)anchor=appendAfter(anchor,memory);

    const replay=document.querySelector('.tf-replay-bar');
    if(replay){
      replay.classList.add('tf-replay-primary');
      appendAfter(anchor,replay);
    }

    const topAnchor=document.querySelector('.mode-shell')||document.querySelector('header');
    if(topAnchor&&grid.previousElementSibling!==topAnchor)topAnchor.insertAdjacentElement('afterend',grid);
    decorateCollapsibles();
    return true;
  };

  if(intro)intro.classList.add('visual-intro-workspace-moved','visual-intro-without-controls');

  arrangePrimaryPanels();
  requestAnimationFrame(arrangePrimaryPanels);

  let observerTimer=0;
  const onMutations=records=>{
    let relevant=false;
    for(const record of records){
      for(const node of record.addedNodes){
        if(node.nodeType!==1)continue;
        if(node.matches?.('#scenario-onboarding,#scenario-memory,.tf-replay-bar,.card,section') ||
           node.querySelector?.('#scenario-onboarding,#scenario-memory,.tf-replay-bar,label,legend,h2,h3')){
          relevant=true;break;
        }
      }
      if(relevant)break;
    }
    if(!relevant)return;
    clearTimeout(observerTimer);
    observerTimer=setTimeout(()=>{arrangePrimaryPanels();decorateCollapsibles();},55);
  };
  const observer=new MutationObserver(onMutations);
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),2300);

  const arrangeDeepPanels=()=>{
    let anchor=grid;
    const diagnostic=byId('diagnostic-lens');
    if(diagnostic)anchor=appendAfter(anchor,diagnostic);

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
    decorateCollapsibles();
  };

  const idle=(fn,timeout=700)=>{
    if('requestIdleCallback' in window)requestIdleCallback(fn,{timeout});
    else setTimeout(fn,220);
  };
  idle(arrangeDeepPanels,800);

  const loadLivingProfiles=()=>{
    if(!document.querySelector('link[data-living-profiles]')){
      const css=document.createElement('link');
      css.rel='stylesheet';
      css.href='living-profiles.css?v=20.26';
      css.dataset.livingProfiles='true';
      document.head.appendChild(css);
    }
    if(!document.querySelector('script[data-living-profiles]')){
      const script=document.createElement('script');
      script.src='living-profiles.js?v=20.26';
      script.defer=true;
      script.dataset.livingProfiles='true';
      script.addEventListener('load',()=>requestAnimationFrame(()=>{arrangePrimaryPanels();decorateCollapsibles();}),{once:true});
      document.body.appendChild(script);
    }
  };
  idle(loadLivingProfiles,1000);

  const badge=document.querySelector('.build-badge');
  if(badge)badge.textContent='v20.26 · VISUALS FIRST';
  const topBadge=document.querySelector('header .badge');
  if(topBadge){
    const mode=(document.documentElement.dataset.audience||'professional');
    topBadge.textContent=`v20.26 · ${mode.charAt(0).toUpperCase()+mode.slice(1)}`;
  }
})();