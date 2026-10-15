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

  // Keep the controls directly above the paired lawn images.
  grid.insertBefore(deck,lawnA);

  // Put save/restore/compare immediately beside the live workflow instead of elsewhere on the page.
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

  // Keep the detailed before/after report below the paired lawns so it follows visual inspection.
  lawnB.insertAdjacentElement('afterend',timeline);
  timeline.classList.add('timeline-report-only');

  // Move the complete live workspace directly below the selected audience view.
  // Quick starts and deeper setup remain available immediately below it.
  const topAnchor=modeShell||header;
  if(topAnchor) topAnchor.insertAdjacentElement('afterend',grid);

  // Its controls now live in the primary workspace, so the old intro block is redundant.
  if(intro) intro.classList.add('visual-intro-workspace-moved','visual-intro-without-controls');

  const badge=document.querySelector('.build-badge');
  if(badge)badge.textContent='v20.4 · WORKSPACE';
  const topBadge=document.querySelector('header .badge');
  if(topBadge){
    const mode=(document.documentElement.dataset.audience||'professional');
    topBadge.textContent=`v20.4 · ${mode.charAt(0).toUpperCase()+mode.slice(1)}`;
  }
})();
