(()=>{
  'use strict';

  const run=()=>{
    document.body.classList.add('turfarium-v20');

    if(!document.querySelector('link[data-turfarium-icon]')){
      const icon=document.createElement('link');
      icon.rel='icon';
      icon.type='image/svg+xml';
      icon.href='turfarium-mark.svg';
      icon.dataset.turfariumIcon='true';
      document.head.appendChild(icon);
    }

    if(!document.querySelector('link[data-turfarium-v207]')){
      const theme=document.createElement('link');
      theme.rel='stylesheet';
      theme.href='turfarium-v20-7.css?v=20.7';
      theme.dataset.turfariumV207='true';
      document.head.appendChild(theme);
    }

    const rawMode=(document.documentElement.dataset.audience||new URLSearchParams(location.search).get('mode')||'').toLowerCase();
    const modeLabel=rawMode==='research'?'Research / Lab':rawMode?rawMode.charAt(0).toUpperCase()+rawMode.slice(1):'';
    document.title=modeLabel?`Turfarium | ${modeLabel}`:'Turfarium | Interactive Turf Ecosystem Simulator';

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
      landingVersion.textContent='Interactive turf ecosystem simulator · v20.7';
    }

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

    document.querySelectorAll('.tf-v20-intro,.tf-v20-chip').forEach(el=>el.remove());

    const shell=document.querySelector('.mode-shell');
    if(shell){
      const kicker=shell.querySelector('.mode-kicker');
      if(kicker) kicker.textContent=modeLabel?`${modeLabel} view`:'Audience view';
      const note=shell.querySelector('.audience-mode-note');
      if(note) note.remove();
    }

    const buildBadge=document.querySelector('.build-badge');
    if(buildBadge) buildBadge.textContent='v20.7 · TURFARIUM';
    const topBadge=document.querySelector('header .badge');
    if(topBadge) topBadge.textContent=`v20.7${modeLabel?` · ${modeLabel}`:''}`;

    const scenarios=document.getElementById('scenario-onboarding');
    const scenarioKicker=scenarios?.querySelector('.scenario-kicker');
    if(scenarioKicker) scenarioKicker.textContent='Quick start';
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
