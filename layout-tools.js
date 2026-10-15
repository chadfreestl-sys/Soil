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

  const deck=document.createElement('section');
  deck.id='profile-control-deck';
  deck.className='card wide profile-control-deck';
  deck.innerHTML=`
    <div class="profile-deck-label">
      <span class="profile-deck-kicker">LIVE PROFILE CONTROLS</span>
      <strong>View the soil, advance time, then inspect both lawns.</strong>
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

  // Put the controls directly over the paired lawn images.
  grid.insertBefore(deck,lawnA);

  // Keep the detailed before/after report below the paired lawns so it follows the visual inspection.
  lawnB.insertAdjacentElement('afterend',timeline);
  timeline.classList.add('timeline-report-only');

  if(intro){
    intro.classList.add('visual-intro-without-controls');
    const copy=intro.querySelector(':scope > div:first-child');
    if(copy){
      const p=copy.querySelector('p');
      if(p)p.textContent='Matched weather. Different management histories. Use the controls directly above Lawn A and Lawn B.';
    }
  }

  const badge=document.querySelector('.build-badge');
  if(badge)badge.textContent='v19.6.1 · PROFILE WORKFLOW';
  const topBadge=document.querySelector('header .badge');
  if(topBadge){
    const mode=(document.documentElement.dataset.audience||'professional');
    topBadge.textContent=`v19.6.1 · ${mode.charAt(0).toUpperCase()+mode.slice(1)}`;
  }
  document.title=document.title.replace('v19.6','v19.6.1');
})();
