(()=>{
  'use strict';

  const VERSION='21.9';
  const byId=id=>document.getElementById(id);
  const grid=document.querySelector('.simulation-grid');
  const lawnA=byId('lawn-a-panel');
  const lawnB=byId('lawn-b-panel');
  const timeline=byId('timeline-workflow');
  const intro=document.querySelector('.visual-intro');
  const viewOptions=intro?.querySelector('.view-options');
  if(!grid||!lawnA||!lawnB||!timeline)return;

  grid.classList.add('tf-primary-workspace');
  // Override legacy CSS ordering regardless of stylesheet load order.
  if(!document.getElementById('tf-profile-first-rule')){
    const style=document.createElement('style');
    style.id='tf-profile-first-rule';
    style.textContent=`
      .simulation-grid.tf-primary-workspace > .tf-weather-context {order:-999.5!important;grid-column:1/-1!important}
      .simulation-grid.tf-primary-workspace > #profile-control-deck {order:-1000!important;grid-column:1/-1!important}
      .simulation-grid.tf-primary-workspace > #lawn-a-panel {order:-999!important}
      .simulation-grid.tf-primary-workspace > #lawn-b-panel {order:-998!important}
      .simulation-grid.tf-primary-workspace > :not(#profile-control-deck):not(#lawn-a-panel):not(#lawn-b-panel):not(.tf-weather-context) {order:0!important}
    `;
    document.head.appendChild(style);
  }

  const loadCss=(key,href)=>{
    if(document.querySelector(`link[data-${key}]`))return;
    const css=document.createElement('link');
    css.rel='stylesheet';
    css.href=href;
    css.dataset[key]='true';
    document.head.appendChild(css);
  };
  loadCss('contextLayout',`context-layout-v20-18.css?v=${VERSION}`);
  loadCss('collapseLayout',`collapsible-panels-v20-21.css?v=${VERSION}`);

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
  if(stepRow){stepRow.classList.add('profile-step-row');timeSlot.appendChild(stepRow);}
  if(visit){visit.classList.add('profile-visit-note');timeSlot.appendChild(visit);}
  timeline.classList.add('timeline-report-only','tf-change-lower');

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
    for(const heading of document.querySelectorAll('h1,h2,h3,h4')){
      if(pattern.test((heading.textContent||'').trim())){
        return heading.closest('.card.wide')||heading.closest('section.card')||heading.closest('.card')||heading.closest('section,article,.panel')||null;
      }
    }
    return null;
  };

  const excludedContextPanel=panel=>!panel||panel===lawnA||panel===lawnB||panel===timeline||panel===deck||panel.id==='scenario-onboarding'||panel.id==='scenario-memory';

  const panelForControlText=pattern=>{
    for(const node of document.querySelectorAll('label,legend,.label,.control-label,.field-label')){
      const text=(node.textContent||'').trim().replace(/\s+/g,' ');
      if(!pattern.test(text))continue;
      const panel=node.closest('.card.wide')||node.closest('section.card')||node.closest('.card')||node.closest('.panel')||node.closest('section');
      if(!excludedContextPanel(panel))return panel;
    }
    return null;
  };

  const findContextPanels=()=>{
    // Prefer a distinct, top-level weather card rather than the first
    // incidental 'weather' heading inside a lawn or scientific module.
    const candidates=[...document.querySelectorAll('.card,section.panel,article.panel')].filter(panel=>
      !excludedContextPanel(panel) &&
      !lawnA.contains(panel) && !lawnB.contains(panel) &&
      !panel.contains(lawnA) && !panel.contains(lawnB) &&
      !panel.closest('#profile-control-deck,.tf-collapse-body')
    );
    const title=panel=>{
      const h=panel.querySelector(':scope > h1,:scope > h2,:scope > h3,:scope > h4,:scope > .head h2,:scope > .head h3,:scope > .tf-collapse-toggle .tf-collapse-title,:scope > .tf-collapse-body > .head h2,:scope > .tf-collapse-body > h2');
      return (h?.textContent||'').trim();
    };
    // Actual simulator panel is titled "Site, season & weather laboratory".
    let weather=candidates.find(p=>/site\s*,?\s*season\s*(?:&|and)\s*weather\s*laboratory/i.test(title(p)));
    if(!weather)weather=candidates.find(p=>/^(?:Weather|Weather Conditions|Weather & Climate|Climate|Environmental Conditions|Growing Conditions)\b/i.test(title(p)));
    if(!weather)weather=candidates.find(p=>/\b(?:Weather|Climate)\b/i.test(title(p)) && !/response|effect|history|simulation|evidence/i.test(title(p)));
    if(!weather)weather=panelForControlText(/^(?:Climate profile|Weather pattern|Rain pattern|Temperature|Rainfall|Drought|Heat pattern)$/i);
    let site=candidates.find(p=>/^(?:Site|Site & Turf|Turf Setup|Lawn Setup|Turfgrass Setup)\b/i.test(title(p)));
    if(!site)site=panelForControlText(/^(?:Turf type|Turf species|Grass type|Turfgrass|Species|Sun\s*\/\s*shade|Sun exposure|Shade|Mowing height|Mowing baseline)$/i);
    if(site===weather)site=null;
    if(site)site.classList.add('tf-context-panel','tf-site-context');
    if(weather)weather.classList.add('tf-context-panel','tf-weather-context');
    return {site,weather};
  };

  const findManagementPanel=()=>byId('experiment-controls')?.closest('.card.wide')
    ||byId('experiment-controls')?.closest('section.card')
    ||majorForHeading(/Management|Treatment Controls|Treatments|Applications/i);

  const titleForPanel=panel=>{
    if(panel===lawnA)return 'Lawn A';
    if(panel===lawnB)return 'Lawn B';
    if(panel===deck)return 'Profile Viewer + Time Advance';
    if(panel===timeline)return 'What Changed';
    if(panel.id==='scenario-onboarding')return 'Scenario Quick Start';
    if(panel.id==='scenario-memory')return 'Save & Compare';
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

  const collapseStorageKey=panel=>`turfarium-collapse-v${VERSION}:${keyForPanel(panel)}`;
  const defaultOpenPanel=panel=>panel===lawnA||panel===lawnB||panel===deck||panel===findManagementPanel()||panel===timeline;

  const setCollapsed=(panel,collapsed,save=true)=>{
    const button=panel.querySelector(':scope > .tf-collapse-toggle');
    const body=panel.querySelector(':scope > .tf-collapse-body');
    if(!button||!body)return;
    panel.classList.toggle('tf-panel-collapsed',collapsed);
    button.setAttribute('aria-expanded',String(!collapsed));
    const chevron=button.querySelector('.tf-collapse-chevron');
    if(chevron)chevron.textContent=collapsed?'▸':'▾';
    body.hidden=collapsed;
    if(save){
      try{sessionStorage.setItem(collapseStorageKey(panel),collapsed?'1':'0');}catch(_){ }
    }
  };

  const makeCollapsible=panel=>{
    if(!panel||panel.dataset.tfCollapsible==='1'||panel.closest('.tf-collapse-body'))return;
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
    button.innerHTML='<span class="tf-collapse-title"></span><span class="tf-collapse-chevron" aria-hidden="true">▸</span>';
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

  const deepPanels=()=>[
    majorForHeading(/Soil Physics|Soil Lab|Nutrient Cycling|Soil & Nutrient|Nutrient Detail/i),
    majorForHeading(/Soil Food Web|Biology|Microbial|Microbiology/i),
    majorForHeading(/Seaweed\s+Response\s+Lab/i),
    majorForHeading(/Worm\s+Tea\s+Brewing\s+Lab/i),
    majorForHeading(/Brew\s+Microscope|Microscope\s+Observation/i),
    majorForHeading(/Custom\s+Product|Formulation\s+Studio/i),
    document.querySelector('.evidence-layer')?.closest('.card.wide')||majorForHeading(/Evidence Layer|Experiment Activity|Evidence & Confidence/i),
    majorForHeading(/^Scientific transparency$/i)
  ].filter(Boolean);

  const decorateCollapsibles=()=>{
    const {site,weather}=findContextPanels();
    const panels=[
      deck,lawnA,lawnB,findManagementPanel(),timeline,byId('scenario-onboarding'),weather,site,
      document.querySelector('.tf-replay-bar'),byId('scenario-memory'),byId('diagnostic-lens'),
      ...deepPanels()
    ].filter(Boolean);
    [...new Set(panels)].forEach(makeCollapsible);
  };

  const arrangePrimaryPanels=()=>{
    const scenarios=byId('scenario-onboarding');
    const memory=byId('scenario-memory');
    const management=findManagementPanel();
    const replay=document.querySelector('.tf-replay-bar');
    const diagnostic=byId('diagnostic-lens');
    // Scenario setup is optional; never block the primary layout while it loads.

    if(scenarios)scenarios.classList.add('tf-scenarios-first');
    styleMemory(memory);
    if(management)management.classList.add('tf-treatment-priority');
    lawnA.classList.add('tf-visual-priority');
    lawnB.classList.add('tf-visual-priority');
    if(replay)replay.classList.add('tf-replay-primary');

    // Keep profile controls directly above the two lawn images.
    if(grid.firstElementChild!==deck)grid.prepend(deck);
    let anchor=deck;
    const context=findContextPanels();
    if(context.weather && context.weather!==deck && context.weather!==lawnA && context.weather!==lawnB){
      anchor=appendAfter(anchor,context.weather);
    }
    anchor=appendAfter(anchor,lawnA);
    anchor=appendAfter(anchor,lawnB);
    if(management)anchor=appendAfter(anchor,management);
    anchor=appendAfter(anchor,timeline);
    if(scenarios)anchor=appendAfter(anchor,scenarios);

    const {site,weather}=findContextPanels();
    if(weather && weather!==context.weather)anchor=appendAfter(anchor,weather);
    if(site && site!==context.weather)anchor=appendAfter(anchor,site);
    if(replay)anchor=appendAfter(anchor,replay);
    if(memory)anchor=appendAfter(anchor,memory);
    if(diagnostic)anchor=appendAfter(anchor,diagnostic);

    for(const panel of deepPanels()){
      if(panel===diagnostic||panel===timeline||grid.contains(panel))continue;
      anchor=appendAfter(anchor,panel);
    }

    const transparency=majorForHeading(/^Scientific transparency$/i);
    if(transparency)transparency.classList.add('tf-transparency-last');

    const topAnchor=document.querySelector('.mode-shell')||document.querySelector('header');
    if(topAnchor&&grid.previousElementSibling!==topAnchor)topAnchor.insertAdjacentElement('afterend',grid);
    decorateCollapsibles();
    return true;
  };

  if(intro)intro.classList.add('visual-intro-workspace-moved','visual-intro-without-controls');
  arrangePrimaryPanels();
  requestAnimationFrame(arrangePrimaryPanels);

  let observerTimer=0;
  const observer=new MutationObserver(records=>{
    let relevant=false;
    for(const record of records){
      for(const node of record.addedNodes){
        if(node.nodeType!==1)continue;
        if(node.matches?.('#scenario-onboarding,#scenario-memory,.tf-replay-bar,.card,section')||node.querySelector?.('#scenario-onboarding,#scenario-memory,.tf-replay-bar,label,legend,h2,h3')){
          relevant=true;break;
        }
      }
      if(relevant)break;
    }
    if(!relevant)return;
    clearTimeout(observerTimer);
    observerTimer=setTimeout(arrangePrimaryPanels,55);
  });
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),2600);

  const idle=(fn,timeout=700)=>'requestIdleCallback' in window?requestIdleCallback(fn,{timeout}):setTimeout(fn,220);
  idle(arrangePrimaryPanels,800);

  const loadLivingProfiles=()=>{
    if(!document.querySelector('link[data-living-profiles]')){
      const css=document.createElement('link');
      css.rel='stylesheet';
      css.href=`living-profiles.css?v=${VERSION}`;
      css.dataset.livingProfiles='true';
      document.head.appendChild(css);
    }
    if(!document.querySelector('script[data-living-profiles]')){
      const script=document.createElement('script');
      script.src=`living-profiles.js?v=${VERSION}`;
      script.defer=true;
      script.dataset.livingProfiles='true';
      script.addEventListener('load',()=>requestAnimationFrame(arrangePrimaryPanels),{once:true});
      document.body.appendChild(script);
    }
  };
  idle(loadLivingProfiles,1000);

  const badge=document.querySelector('.build-badge');
  if(badge)badge.textContent='v21.2 · PROFILE + LAWNS';
  const topBadge=document.querySelector('header .badge');
  if(topBadge){
    const mode=(document.documentElement.dataset.audience||'professional');
    topBadge.textContent=`v21.2 · ${mode.charAt(0).toUpperCase()+mode.slice(1)}`;
  }
})();