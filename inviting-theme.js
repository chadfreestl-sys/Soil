(()=>{
  'use strict';

  document.body.classList.add('nature-studio','turfarium-v20');
  const mode=(document.documentElement.dataset.audience||'professional').toLowerCase();
  const copy={
    homeowner:{title:'See what your lawn is telling you.',desc:'Read the visible clues, compare what is happening below the surface, then test one change at a time.'},
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
    shell.classList.add('tf-mode-hero-v3');
    const info=copy[mode]||copy.professional;
    const label=mode==='research'?'Research / Lab':mode.charAt(0).toUpperCase()+mode.slice(1);
    shell.innerHTML=`
      <div class="tf-mode-hero-copy">
        <div class="tf-mode-hero-kicker"><span class="tf-mode-hero-dot"></span>${label} view</div>
        <strong class="tf-mode-hero-title">${info.title}</strong>
        <p class="tf-mode-hero-desc">${info.desc}</p>
      </div>
      <details class="tf-mode-hero-details">
        <summary><span>How to use this view</span><small>Optional guide</small></summary>
        <div class="tf-mode-hero-bottom">
          <div class="tf-mode-hero-steps" aria-label="How to use this view">
            <div><span>1</span><b>Notice</b><small>Start with the lawn, roots and current conditions.</small></div>
            <div><span>2</span><b>Compare</b><small>Use Lawn A and B to isolate one management choice.</small></div>
            <div><span>3</span><b>Advance</b><small>Move time forward and see what actually changed.</small></div>
          </div>
          <div class="tf-mode-hero-side">
            <div class="tf-mode-hero-mark" aria-hidden="true"><img src="turfarium-icon.svg" alt=""></div>
            <div class="tf-mode-hero-note"><strong>Same ecosystem engine</strong><span>This view changes the amount of detail shown—not the underlying simulation.</span></div>
            <a class="mode-change" href="./">Change audience</a>
          </div>
        </div>
      </details>`;

    if(!document.getElementById('tf-mode-hero-v3-style')){
      const style=document.createElement('style');
      style.id='tf-mode-hero-v3-style';
      style.textContent=`
        .mode-shell.tf-mode-hero-v3{display:block!important;padding:20px 22px!important;margin:0 0 18px!important;background:linear-gradient(120deg,#f8fbf4 0%,#edf5e9 58%,#f7efe2 100%)!important;border:1px solid #c5d7c2!important;border-radius:22px!important;box-shadow:0 12px 28px rgba(46,73,52,.10)!important}
        .tf-mode-hero-copy{min-width:0}.tf-mode-hero-kicker{display:flex;align-items:center;gap:8px;text-transform:uppercase;letter-spacing:.13em;font-size:.68rem;font-weight:900;color:#52705e}.tf-mode-hero-dot{width:8px;height:8px;border-radius:50%;background:#4c8b61;box-shadow:0 0 0 4px rgba(76,139,97,.12)}
        .tf-mode-hero-title{display:block;margin:7px 0 7px;color:#173f2b!important;font-size:clamp(1.45rem,3vw,2.35rem)!important;line-height:1.03!important;letter-spacing:-.04em!important;font-weight:900!important}.tf-mode-hero-desc{margin:0!important;max-width:820px;color:#536b5e!important;font-size:.96rem!important;line-height:1.5!important}
        .tf-mode-hero-details{margin-top:14px;border-top:1px solid #cfddcc;padding-top:10px}.tf-mode-hero-details>summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:8px 2px;color:#315941;font-weight:900}.tf-mode-hero-details>summary::-webkit-details-marker{display:none}.tf-mode-hero-details>summary:after{content:'▸';font-size:1rem;color:#557060;transition:transform .15s ease}.tf-mode-hero-details[open]>summary:after{transform:rotate(90deg)}.tf-mode-hero-details>summary small{margin-left:auto;color:#7a897f!important;font-size:.68rem;font-weight:700}
        .tf-mode-hero-bottom{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(220px,.7fr);gap:18px;align-items:stretch;padding-top:10px}.tf-mode-hero-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px}.tf-mode-hero-steps>div{position:relative;padding:11px 11px 11px 43px;background:rgba(255,255,252,.78);border:1px solid #d1dfce;border-radius:14px;min-width:0}.tf-mode-hero-steps>div>span{position:absolute;left:10px;top:11px;width:24px;height:24px;border-radius:8px;display:grid;place-items:center;background:#e2efe0;color:#285b3c;font-size:.73rem;font-weight:900}.tf-mode-hero-steps b{display:block;color:#2d513d;font-size:.82rem}.tf-mode-hero-steps small{display:block;margin-top:2px;color:#6a7d72!important;font-size:.68rem;line-height:1.35}
        .tf-mode-hero-side{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:14px;background:rgba(255,253,247,.7);border:1px solid #d3ddcd;border-radius:17px;text-align:center}.tf-mode-hero-mark{width:58px;height:58px;border-radius:18px;display:grid;place-items:center;background:linear-gradient(145deg,#e9f4e6,#d8ead5);border:1px solid #bfd0bb;box-shadow:0 7px 17px rgba(47,80,55,.11)}.tf-mode-hero-mark img{width:46px;height:46px}.tf-mode-hero-note strong{display:block;color:#315941;font-size:.82rem}.tf-mode-hero-note span{display:block;margin-top:3px;color:#708078;font-size:.69rem;line-height:1.35}.tf-mode-hero-side .mode-change{width:100%;text-align:center;text-decoration:none;font-size:.74rem;font-weight:850;padding:9px 11px}
        @media(max-width:760px){.mode-shell.tf-mode-hero-v3{padding:16px!important}.tf-mode-hero-title{font-size:1.65rem!important}.tf-mode-hero-bottom{grid-template-columns:1fr;gap:10px}.tf-mode-hero-steps{grid-template-columns:1fr}.tf-mode-hero-steps>div{padding-top:10px;padding-bottom:10px}.tf-mode-hero-side{display:grid;grid-template-columns:50px 1fr;align-items:center;text-align:left;padding:10px 12px}.tf-mode-hero-mark{width:50px;height:50px;border-radius:14px;grid-row:1 / span 2}.tf-mode-hero-mark img{width:40px;height:40px}.tf-mode-hero-side .mode-change{grid-column:2;width:auto;justify-self:start;padding:7px 10px}.tf-mode-hero-note span{font-size:.66rem}.tf-mode-hero-details>summary small{display:none}}
      `;
      document.head.appendChild(style);
    }
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
