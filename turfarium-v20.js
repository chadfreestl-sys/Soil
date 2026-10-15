(()=>{
  'use strict';

  const run=()=>{
    document.body.classList.add('turfarium-v20');

    // Shared favicon / browser identity.
    if(!document.querySelector('link[data-turfarium-icon]')){
      const icon=document.createElement('link');
      icon.rel='icon';
      icon.type='image/svg+xml';
      icon.href='turfarium-mark.svg';
      icon.dataset.turfariumIcon='true';
      document.head.appendChild(icon);
    }

    const rawMode=(document.documentElement.dataset.audience||new URLSearchParams(location.search).get('mode')||'').toLowerCase();
    const modeLabel=rawMode==='research'?'Research / Lab':rawMode?rawMode.charAt(0).toUpperCase()+rawMode.slice(1):'';
    document.title=modeLabel?`Turfarium | ${modeLabel}`:'Turfarium | Interactive Turf Ecosystem Simulator';

    // Landing-page emblem.
    const landingMark=document.querySelector('.brand .mark');
    if(landingMark && !landingMark.querySelector('img')){
      landingMark.textContent='';
      const img=document.createElement('img');
      img.src='turfarium-mark.svg';
      img.alt='';
      img.setAttribute('aria-hidden','true');
      landingMark.appendChild(img);
    }

    const landingName=document.querySelector('.brand h1');
    if(landingName) landingName.textContent='Turfarium';

    const landingVersion=document.querySelector('.brand p');
    if(landingVersion && /simulator|v19|v20/i.test(landingVersion.textContent||'')){
      landingVersion.textContent='Interactive turf ecosystem simulator · v20';
    }

    // Simulator header lockup. Keeps existing header controls/badges intact.
    const h1=document.querySelector('header h1');
    if(h1 && !document.querySelector('header .tf-brand-lockup')){
      const lock=document.createElement('div');
      lock.className='tf-brand-lockup';

      const mark=document.createElement('span');
      mark.className='tf-brand-mark';
      mark.innerHTML='<img src="turfarium-mark.svg" alt="">';

      const words=document.createElement('span');
      words.className='tf-brand-words';
      const name=document.createElement('span');
      name.className='tf-brand-name';
      name.textContent='Turfarium';
      const sub=document.createElement('span');
      sub.className='tf-brand-sub';
      sub.textContent='Interactive Turf Ecosystem Simulator';
      words.append(name,sub);
      lock.append(mark,words);
      h1.replaceWith(lock);
    } else if(h1){
      h1.textContent='Turfarium';
    }

    // A compact identity statement above the working sequence.
    const scenarios=document.getElementById('scenario-onboarding');
    const shell=document.querySelector('.mode-shell');
    if(scenarios && !document.querySelector('.tf-v20-intro')){
      const intro=document.createElement('section');
      intro.className='tf-v20-intro';
      intro.setAttribute('aria-label','Turfarium introduction');
      intro.innerHTML=`
        <div class="tf-v20-intro-main">
          <div class="tf-v20-kicker">Turfarium · Interactive Turf Ecosystem Simulator</div>
          <h2>Science with warmth.</h2>
          <p>See the system. Change the inputs. Watch it respond. Follow the turf, roots, water, nutrients and biology together as management decisions play out through time.</p>
        </div>
        <div class="tf-v20-pillars" aria-label="Turfarium workflow">
          <div class="tf-v20-pillar"><span>🌿</span><strong>Explore systems</strong></div>
          <div class="tf-v20-pillar"><span>◫</span><strong>Adjust inputs</strong></div>
          <div class="tf-v20-pillar"><span>↗</span><strong>See impacts</strong></div>
          <div class="tf-v20-pillar"><span>🌱</span><strong>Learn forward</strong></div>`;
      const anchor=shell && shell.nextSibling ? shell.nextSibling : scenarios;
      scenarios.parentNode.insertBefore(intro,anchor===scenarios?scenarios:anchor);
    }

    // Make the existing audience shell feel like part of the brand rather than a warning panel.
    if(shell && !shell.querySelector('.tf-v20-chip')){
      const chip=document.createElement('span');
      chip.className='tf-v20-chip';
      chip.textContent='Same ecosystem engine · audience-adjusted view';
      const copy=shell.querySelector('.mode-copy')||shell;
      copy.appendChild(chip);
    }

    // Version identity while preserving the user's selected audience.
    const buildBadge=document.querySelector('.build-badge');
    if(buildBadge) buildBadge.textContent='v20 · TURFARIUM';
    const topBadge=document.querySelector('header .badge');
    if(topBadge) topBadge.textContent=`v20${modeLabel?` · ${modeLabel}`:''}`;

    // A few labels are intentionally simple and action-oriented.
    const scenarioHead=scenarios?.querySelector('h2');
    if(scenarioHead) scenarioHead.textContent='Choose a scenario';
    const diagnostic=document.getElementById('diagnostic-lens');
    const diagnosticHead=diagnostic?.querySelector('h2');
    if(diagnosticHead) diagnosticHead.textContent='What may be holding the lawn back right now?';

    const profile=document.querySelector('.profile-control-deck');
    const profileStrong=profile?.querySelector('.profile-deck-label strong');
    if(profileStrong) profileStrong.textContent='Profile Viewer + Time Advance';
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',run,{once:true});
  else run();
})();
