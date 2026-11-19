/* Turfarium Phase 3: the single authoritative mobile comparison layout. */
(()=>{'use strict';
const mobileQuery=window.matchMedia('(max-width:700px)');
const css=document.createElement('style');
css.id='tf-phase3-mobile-layout-style';
css.textContent=`
@media(max-width:700px){
  /* Only the compact introduction belongs above the comparison on phones. */
  .mode-shell.tf-mode-hero-v3,.visual-intro{display:none!important}
  /* Hide the older homeowner hero without suppressing the compact comparison. */
  .mode-shell:not(#tf-mobile-intro){display:none!important}
  #tf-mobile-intro{display:block!important;width:100%!important;box-sizing:border-box!important;margin:0 0 8px!important;padding:9px 12px!important;border:1px solid #cad9c9!important;border-radius:12px!important;background:#f3f8ef!important;color:#204332!important;font-size:13px!important;line-height:1.35!important}
  #tf-mobile-intro p{margin:0!important}#tf-mobile-intro details{margin-top:4px!important}#tf-mobile-intro summary{cursor:pointer!important;font-weight:800!important;color:#20523b!important}

  /* The legacy desktop hosts stay alive for state and calculations, but have no mobile layout authority. */
  .simulation-grid.tf-primary-workspace>#lawn-a-panel,.simulation-grid.tf-primary-workspace>#lawn-b-panel,
  .simulation-grid.tf-primary-workspace>#tf-playback-strip,.simulation-grid.tf-primary-workspace>#timeline-workflow{display:none!important}

  #tf-stacked-lawns{overflow-anchor:none!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;width:100%!important;max-width:100%!important;min-width:0!important;grid-column:1/-1!important;margin:0 0 12px!important;gap:8px!important}
  #tf-stacked-lawns>*{width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important}
  #tf-stacked-lawns .tf-lawn-visual{min-height:0!important;height:auto!important;overflow-anchor:none!important;display:block!important;margin:0!important;padding:8px!important;border:1px solid #c5d8c7!important;border-radius:13px!important;background:#f4f8f2!important}
  /* Day-zero cards must shrink to their actual contents, not retain legacy
     photo-panel minimum heights or empty placeholder spacing. */
  #tf-stacked-lawns .tf-lawn-visual{min-height:0!important;height:max-content!important;align-self:start!important}
  #tf-stacked-lawns .tf-lawn-visual>.tf-photo-stat-strip{margin:6px 2px 0!important}
  #tf-stacked-lawns .tf-lawn-visual>.tf-visual-indicator{display:none!important}
  #tf-stacked-lawns .tf-lawn-visual>div:empty:not(.photo-stage){display:none!important}
  #tf-stacked-lawns .tf-lawn-title{position:static!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:8px!important;margin:0 0 6px!important;padding:1px 3px!important;background:transparent!important;border:0!important;box-shadow:none!important;color:#173e2d!important;font-size:15px!important;font-weight:850!important;line-height:1.25!important;pointer-events:auto!important}
  #tf-stacked-lawns .tf-lawn-title span{color:#173e2d!important;text-shadow:none!important}
  #tf-stacked-lawns .photo-stage{display:block!important;position:relative!important;width:100%!important;height:auto!important;min-height:0!important;aspect-ratio:21/9!important;margin:0!important;overflow:hidden!important}
  #tf-stacked-lawns .photo-stage img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important}
  #tf-stacked-lawns .photo-stage canvas{position:absolute!important;inset:0!important;width:100%!important;height:100%!important}

  /* Lawn A -> one shared progression station -> Lawn B. */
  #tf-mobile-progression{display:flex!important;flex-direction:column!important;gap:7px!important;margin:0!important;padding:9px!important;border:1px solid #b9cfc0!important;border-radius:13px!important;background:#f5f8f2!important}
  #tf-stacked-quick-progress{display:block!important;margin:0!important}
  #tf-stacked-quick-progress .tf-strip-time{display:block!important;width:100%!important;margin:0!important;padding:0!important}
  #tf-stacked-quick-progress .tf-strip-label{display:block!important;margin:0 0 5px!important;color:#173e2d!important;font-size:13px!important;font-weight:850!important}
  #tf-stacked-quick-progress .row{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:5px!important;width:100%!important;margin:0!important;padding:0!important}
  #tf-stacked-quick-progress button{width:100%!important;min-width:0!important;min-height:42px!important;margin:0!important;padding:7px 2px!important;border:1px solid #9fbda7!important;border-radius:9px!important;background:#fff!important;color:#173e2d!important;font-size:12px!important;font-weight:800!important;white-space:normal!important}
  #tf-mobile-progression>#tf-season-display{position:static!important;display:flex!important;width:100%!important;max-width:100%!important;margin:0!important;padding:10px 8px!important;box-sizing:border-box!important;z-index:auto!important}
  #tf-stacked-lawns #tf-what-changed-details{display:none!important}
  #tf-stacked-replay{display:block!important;margin:0!important;padding:7px!important;border:1px solid #c5d8c7!important;border-radius:10px!important;background:#fff!important}
  #tf-stacked-replay:empty{display:none!important}
  #tf-stacked-replay .tf-history-replay,#tf-stacked-replay .tf-replay-bar{display:flex!important;align-items:center!important;flex-wrap:wrap!important;gap:6px!important;width:100%!important;margin:0!important;padding:0!important;border:0!important;background:transparent!important}
  #tf-stacked-replay button{min-height:38px!important;padding:6px 9px!important}
  #tf-stacked-replay input[type=range]{flex:1 1 90px!important;min-width:70px!important;max-width:none!important}
  #tf-stacked-replay .tf-replay-note{flex:1 1 100%!important;font-size:11px!important}

  /* Live treatment nodes are moved here; calculations and listeners remain attached. */
  #tf-mobile-treatments{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:7px!important;margin:0!important}
  .tf-mobile-treatment{display:block!important;width:100%!important;margin:0!important;border:1px solid #b7cbb3!important;border-radius:12px!important;background:#f2f7ef!important;overflow:hidden!important}
  .tf-mobile-treatment>summary{display:list-item!important;padding:12px 13px!important;cursor:pointer!important;color:#183e2c!important;font-size:15px!important;font-weight:850!important;line-height:1.3!important}
  .tf-mobile-treatment:not([open])>.tf-mobile-treatment-body{display:none!important}
  .tf-mobile-treatment-body{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:8px!important;padding:9px 11px 12px!important}
  .tf-mobile-treatment-body>*{width:100%!important;max-width:100%!important;min-width:0!important;box-sizing:border-box!important;margin:0!important}
  .tf-mobile-treatment-body .row{display:grid!important;grid-template-columns:minmax(0,1fr)!important;gap:7px!important}
  .tf-mobile-treatment-body select,.tf-mobile-treatment-body input,.tf-mobile-treatment-body button{width:100%!important;max-width:100%!important;min-width:0!important}
  /* Android native material menus must remain interactive and above neighboring layers. */
  .tf-mobile-treatment[open]{position:relative!important;z-index:30!important;overflow:visible!important}
  .tf-mobile-treatment[open] .tf-mobile-treatment-body{position:relative!important;z-index:31!important;pointer-events:auto!important}
  .tf-mobile-treatment-body select{display:block!important;position:relative!important;z-index:32!important;pointer-events:auto!important;touch-action:manipulation!important;opacity:1!important;visibility:visible!important;appearance:auto!important;-webkit-appearance:menulist!important;min-height:46px!important;background:#fff!important;color:#173e2d!important}
  .tf-mobile-treatment-body .rate-grid{grid-template-columns:minmax(0,1fr)!important}
  /* Stable tap-based picker avoids Android native select popup cancellation. */
  .tf-mobile-treatment-body select[id^="treat"]{position:absolute!important;width:1px!important;height:1px!important;opacity:0!important;pointer-events:none!important}
  .tf-material-picker{display:block!important;width:100%!important}
  .tf-material-picker>summary{display:list-item!important;cursor:pointer!important;padding:12px!important;background:#fff!important;color:#173e2d!important;border:1px solid #9fbda7!important;border-radius:9px!important;font-weight:800!important}
  .tf-material-options{max-height:310px!important;overflow-y:auto!important;background:#fff!important;border:1px solid #9fbda7!important;border-radius:9px!important;padding:5px!important}
  .tf-material-options button{display:block!important;width:100%!important;min-height:44px!important;margin:2px 0!important;text-align:left!important;background:#fff!important;color:#173e2d!important;border:0!important;border-bottom:1px solid #ddd!important}
  .tf-material-options button[aria-pressed="true"]{background:#d7ead9!important;font-weight:900!important}


  #tf-mobile-what-changed{grid-column:1/-1!important;order:-997!important;display:block!important;width:100%!important;margin:0!important;border:1px solid #b7cbb3!important;border-radius:12px!important;background:#f2f7ef!important;overflow:hidden!important}
  #tf-mobile-what-changed>summary{display:list-item!important;padding:13px!important;cursor:pointer!important;color:#183e2c!important;font-size:16px!important;font-weight:900!important;line-height:1.3!important}
  #tf-mobile-what-changed .tf-mobile-change-content{padding:0 12px 12px!important;color:#183e2c!important}
  #tf-mobile-what-changed:not([open]) .tf-mobile-change-content{display:none!important}
  /* Consistent finish for the lower mobile dashboard without moving live controls. */
  #tf-mobile-what-changed{box-shadow:0 4px 14px rgba(23,61,42,.07)!important;border-radius:15px!important;background:#f8fbf5!important;padding:7px!important}
  #tf-mobile-what-changed>summary{background:#e6f1e5!important;border-radius:10px!important;padding:14px 15px!important}
  #tf-mobile-what-changed>summary::marker{color:#226b49}
  #scenario-memory,#diagnostic-lens,#tf-history-card-a,#tf-history-card-b{border-radius:15px!important;box-shadow:0 4px 14px rgba(23,61,42,.06)!important}
  #scenario-memory.tf-panel-collapsed,#diagnostic-lens.tf-panel-collapsed,#tf-history-card-a.tf-panel-collapsed,#tf-history-card-b.tf-panel-collapsed{padding:8px!important}
  #scenario-memory .tf-collapse-toggle,#diagnostic-lens .tf-collapse-toggle,#tf-history-card-a .tf-collapse-toggle,#tf-history-card-b .tf-collapse-toggle{min-height:52px!important;border-radius:11px!important;font-weight:850!important}

  /* Guided experiment hierarchy: visual grouping only; no moving controls or altering events. */
  #tf-mobile-treatments{padding:13px!important;border:1px solid #b9d6c2!important;border-left:4px solid #23865d!important;border-radius:17px!important;background:linear-gradient(145deg,#f5fbf4,#e9f5ec)!important;box-shadow:0 6px 19px rgba(18,76,46,.08)!important;gap:9px!important}
  #tf-mobile-treatments::before{content:'TAKE ACTION  /  TREAT YOUR LAWNS';display:block!important;font-size:12px!important;font-weight:900!important;letter-spacing:.075em!important;line-height:1.5!important;color:#16623e!important;padding:2px 5px 5px!important}
  #tf-mobile-treatments .tf-mobile-treatment{background:#fff!important;border:1px solid #c3d7c5!important;box-shadow:0 2px 7px rgba(25,70,44,.05)!important}
  #tf-mobile-treatments .tf-mobile-treatment>summary{min-height:47px!important;display:list-item!important}
  .simulation-grid.tf-primary-workspace>#lawn-a-panel{border-top:4px solid #468a92!important}
  .simulation-grid.tf-primary-workspace>#lawn-b-panel{border-top:4px solid #468a92!important}
  .simulation-grid.tf-primary-workspace>#lawn-a-panel::before{content:'MEASURE  /  LAWN PERFORMANCE';display:block!important;font-size:12px!important;font-weight:900!important;letter-spacing:.075em!important;color:#276a74!important;margin:0 0 8px!important;padding:2px 5px!important}
  #tf-mobile-what-changed{border-left:4px solid #468a92!important;background:#f0f8f6!important}
  #tf-mobile-what-changed::before{content:'UNDERSTAND  /  WHAT CHANGED';display:block!important;font-size:11px!important;font-weight:900!important;letter-spacing:.075em!important;color:#276a74!important;padding:7px 9px 2px!important}
  #scenario-memory{border-left:4px solid #c39850!important;background:#faf8f1!important}
  #scenario-memory::before{content:'SAVE YOUR EXPERIMENT';display:block!important;font-size:11px!important;font-weight:900!important;letter-spacing:.075em!important;color:#7b5a29!important;padding:4px 7px 8px!important}
  #diagnostic-lens{border-left:4px solid #879b91!important}
  #diagnostic-lens::before{content:'ADVANCED  /  DIAGNOSTICS';display:block!important;font-size:11px!important;font-weight:900!important;letter-spacing:.075em!important;color:#526d61!important;padding:4px 7px 8px!important}
  #tf-mobile-treatments .tf-mobile-treatment:focus-within,#tf-mobile-what-changed:focus-within,#scenario-memory:focus-within{outline:2px solid #2e8a60!important;outline-offset:2px!important}
  /* No global empty-card suppression: preserve live module hosts and controls. */
  #tf-live-change-card-v5{display:none!important}
}
@media(min-width:701px){#tf-stacked-lawns,#tf-mobile-intro{display:none!important}}
`;
document.head.appendChild(css);

const byId=id=>document.getElementById(id);

function ensureCompactIntro(view){
 let intro=byId('tf-mobile-intro');
 if(!intro){
  intro=document.createElement('section');intro.id='tf-mobile-intro';
  intro.innerHTML='<p><strong>Compare two lawns.</strong> Treat, advance time and see what changes.</p><details><summary>How Turfarium works</summary><p>Apply different management choices to Lawn A and Lawn B, then advance the shared clock to compare modeled responses.</p></details>';
 }
 // The setup layout owns the top-level order: header -> intro -> setup -> lawns.
 // Do not repeatedly pull intro back in front of the lawn view during remounts.
 const setup=byId('tf-top-start-stack');
 if(setup&&setup.isConnected){
  if(intro.nextElementSibling!==setup)setup.insertAdjacentElement('beforebegin',intro);
 }else if(view.parentElement&&!intro.isConnected){
  view.parentElement.insertBefore(intro,view);
 }
}

function ensureLawnCard(view,key,stage){
 let card=byId('tf-mobile-lawn-'+key.toLowerCase());
 if(!card){
  card=document.createElement('section');card.id='tf-mobile-lawn-'+key.toLowerCase();card.className='tf-lawn-visual';
  const title=document.createElement('div');title.className='tf-lawn-title';
  title.innerHTML='<span>Lawn '+key+' · '+(key==='A'?'Conventional':'Biological')+'</span><span id="tf-stack-day-'+key+'">Day 0</span>';
  card.appendChild(title);
 }
 if(stage.parentElement!==card)card.appendChild(stage);
 if(card.parentElement!==view)view.appendChild(card);
 return card;
}

function ensureProgression(view,afterCard){
 let station=byId('tf-mobile-progression');
 if(!station){station=document.createElement('section');station.id='tf-mobile-progression';station.setAttribute('aria-label','Shared time, season and replay controls');}
 if(station.parentElement!==view)afterCard.insertAdjacentElement('afterend',station);
 let advance=byId('tf-stacked-quick-progress');
 if(!advance){advance=document.createElement('div');advance.id='tf-stacked-quick-progress';advance.setAttribute('aria-label','Shared time advance controls');station.appendChild(advance);}
 let replay=byId('tf-stacked-replay');
 if(!replay){replay=document.createElement('div');replay.id='tf-stacked-replay';replay.setAttribute('aria-label','Shared replay controls');station.appendChild(replay);}
 if(advance.parentElement!==station)station.prepend(advance);
 if(replay.parentElement!==station)station.appendChild(replay);
 return {station,advance,replay};
}

function placeLiveProgression(parts){
 let time=parts.advance.querySelector('.tf-strip-time')||document.querySelector('#tf-playback-strip .tf-strip-time');
 if(!time){time=document.createElement('div');time.className='tf-strip-time';}
 if(time&&time.parentElement!==parts.advance)parts.advance.appendChild(time);
 const steps=document.querySelector('#profile-control-deck .profile-step-row')||document.querySelector('.profile-step-row');
 if(time&&steps&&steps.parentElement!==time)time.appendChild(steps);
 const season=byId('tf-season-display');
 if(season&&season.parentElement!==parts.station)parts.advance.insertAdjacentElement('afterend',season);
 const liveReplay=document.querySelector('#tf-playback-strip > .tf-history-replay')||document.querySelector('#tf-playback-strip .tf-replay-bar')||document.querySelector('.tf-history-replay:not(.tf-history-replay-local)')||document.querySelector('.tf-replay-bar');
 if(liveReplay&&!parts.replay.contains(liveReplay))parts.replay.appendChild(liveReplay);
 if(parts.advance.parentElement!==parts.station)parts.station.prepend(parts.advance);
 if(season&&season.parentElement!==parts.station)parts.station.appendChild(season);
 if(parts.replay.parentElement!==parts.station)parts.station.appendChild(parts.replay);
}

function treatmentNodes(key){
 const select=byId('treat'+key),feedback=byId('feedback'+key);
 // The treatment-layout helper removes the initial "Ready to apply" feedback
 // node as redundant copy. The selector row is the required live anchor;
 // feedback remains optional so that cleanup cannot suppress the whole drawer.
 if(!select)return [];
 const row=select.closest('.row');
 const rate=byId('rate'+key)?.closest('.rate-studio');
 const product=byId('productInfo'+key);
 const history=byId('history'+key)?.closest('.recent-applications');
 // Keep the original live treatment-history widget alongside Apply Treatment.
 // Previously it was left behind in the hidden desktop panel.
 return [row,rate,product,feedback,history].filter(Boolean);
}

// Native Android select menus can be interrupted when a live row is reparented.
// Preserve the selected material and avoid moving an active selector.
// Tap-based mobile material picker. Original <select> and application listeners
// remain authoritative; choosing an option updates the real input and fires change.
function ensureMaterialPicker(key,body){
 const select=byId('treat'+key);
 if(!select||!body)return;
 let picker=byId('tf-material-picker-'+key);
 if(!picker){
  picker=document.createElement('details');
  picker.id='tf-material-picker-'+key;
  picker.className='tf-material-picker';
  const summary=document.createElement('summary');
  summary.textContent='Choose material';
  const options=document.createElement('div');
  options.className='tf-material-options';
  picker.append(summary,options);
  select.insertAdjacentElement('afterend',picker);
 }
 const summary=picker.querySelector('summary');
 const options=picker.querySelector('.tf-material-options');
 const render=()=>{
  const selected=select.selectedOptions[0];
  summary.textContent='Material: '+(selected?.textContent?.trim()||'Choose material');
  options.replaceChildren();
  for(const option of select.options){
   if(option.disabled||option.value==='customPlaceholder')continue;
   const button=document.createElement('button');
   button.type='button';
   button.textContent=option.textContent;
   button.dataset.value=option.value;
   button.setAttribute('aria-pressed',String(select.value===option.value));
   button.addEventListener('click',()=>{
    select.value=option.value;
    select.dispatchEvent(new Event('change',{bubbles:true}));
    picker.open=false;
    render();
   });
   options.appendChild(button);
  }
 };
 if(!picker.dataset.tfPickerBound){
  picker.dataset.tfPickerBound='1';
  picker.addEventListener('toggle',()=>{if(picker.open)render();});
  select.addEventListener('change',render);
 }
 render();
}

function ensureTreatments(view,afterCard){
 let dock=byId('tf-mobile-treatments');
 if(!dock){dock=document.createElement('section');dock.id='tf-mobile-treatments';dock.setAttribute('aria-label','Lawn treatment controls');}
 if(dock.parentElement!==view)afterCard.insertAdjacentElement('afterend',dock);
 for(const key of ['A','B']){
  let drawer=byId('tf-mobile-treatment-'+key);
  if(!drawer){
   drawer=document.createElement('details');drawer.id='tf-mobile-treatment-'+key;drawer.className='tf-mobile-treatment';
   drawer.open=false;
   const summary=document.createElement('summary');summary.textContent='Lawn '+key+' · '+(key==='A'?'Conventional':'Biological')+' Treatments';
   const body=document.createElement('div');body.className='tf-mobile-treatment-body';
   const label=document.createElement('strong');label.textContent='Apply a treatment to Lawn '+key;body.appendChild(label);
   drawer.append(summary,body);
  }
  const body=drawer.querySelector('.tf-mobile-treatment-body');
  // Mount original controls once. Repeated DOM moves cancel Android's native
  // material picker and can interrupt the original treatment handlers.
  if(!drawer.dataset.tfControlsMounted){
   const nodes=treatmentNodes(key);
   if(nodes.length){
    for(const node of nodes)body.appendChild(node);
    drawer.dataset.tfControlsMounted='1';
   }
  }
  ensureMaterialPicker(key,body);
  // Keep drawers usable even when another module temporarily relocates a live control.
  drawer.hidden=false;
  if(drawer.parentElement!==dock)dock.appendChild(drawer);
 }
 return dock;
}

function ensureWhatChanged(view,dock){
 let panel=byId('tf-mobile-what-changed');
 if(!panel){
  panel=document.createElement('details');panel.id='tf-mobile-what-changed';
  panel.open=false;
  panel.innerHTML='<summary>What Changed</summary><div class="tf-mobile-change-content"></div>';
 }
 // Place the report after the two collapsed lawn statistics panels, outside the photo/treatment stack.
 const lawnB=byId('lawn-b-panel');
 if(lawnB && (panel.parentElement!==lawnB.parentElement || panel.previousElementSibling!==lawnB))lawnB.insertAdjacentElement('afterend',panel);
 // Keep the independent five-year research sandbox immediately below What Changed.
 // Move its existing section, never recreate the table or change simulator state.
 const fiveYear=byId('tf-scenario-lab');
 if(fiveYear && panel.nextElementSibling!==fiveYear)panel.insertAdjacentElement('afterend',fiveYear);
 const source=byId('changeReport'),target=panel.querySelector('.tf-mobile-change-content');
 const sync=()=>{if(source&&target&&target.innerHTML!==source.innerHTML)target.innerHTML=source.innerHTML;};
 sync();
 if(source&&!panel.dataset.tfReportBound){
  panel.dataset.tfReportBound='1';
  new MutationObserver(sync).observe(source,{subtree:true,childList:true,characterData:true});
  window.addEventListener('turfarium:time-advanced',event=>{
   const report=event.detail?.changeReport;
   if(report&&target){
    target.innerHTML='<h3>What changed since the last advance?</h3><p class="subtle"></p><div class="change-grid"></div><div class="next-actions"></div>';
    target.querySelector('.subtle').textContent=report.period||'';
    target.querySelector('.change-grid').innerHTML=report.grid||'';
    target.querySelector('.next-actions').textContent=report.next||'';
   }else sync();
  });
 }
 return panel;
}

// Photo-stage status is internal visual-engine diagnostics, not homeowner content.
// Remove only leaf-level status lines, preserving the photo and vigor summary.
function hidePhotoDiagnostics(){
 const view=byId('tf-stacked-lawns');if(!view)return;
 const walker=document.createTreeWalker(view,NodeFilter.SHOW_TEXT);
 const matches=[];let node;
 while((node=walker.nextNode())){
  if(!/^\\s*Photo stage:\\s*/i.test(node.textContent||''))continue;
  const el=node.parentElement;
  if(el&&el.children.length===0&&el.style.display!=='none')matches.push(el);
 }
 for(const el of matches)el.style.setProperty('display','none','important');
}

function syncDays(){
 for(const key of ['A','B']){
  const source=byId('day'+key),target=byId('tf-stack-day-'+key);
  if(source&&target&&target.textContent!==source.textContent)target.textContent=source.textContent;
 }
}

let layoutParts=null;
let remountQueued=false;
let mounting=false;
function mount(){
 if(!mobileQuery.matches||mounting)return false;
 mounting=true;
 try{
 const grid=document.querySelector('.simulation-grid.tf-primary-workspace')||document.querySelector('.simulation-grid');
 const panelA=byId('lawn-a-panel'),panelB=byId('lawn-b-panel');
 const stageA=document.querySelector('.photo-stage[data-tf-lawn-key="A"]')||panelA?.querySelector('.photo-stage');
 const stageB=document.querySelector('.photo-stage[data-tf-lawn-key="B"]')||panelB?.querySelector('.photo-stage');
 if(!grid||!stageA||!stageB)return false;
 let view=byId('tf-stacked-lawns');
 if(!view){view=document.createElement('section');view.id='tf-stacked-lawns';view.setAttribute('aria-label','Mobile lawn comparison');}
 const header=document.querySelector('main>header,main header');
 if(!view.isConnected){if(header)header.insertAdjacentElement('afterend',view);else grid.insertBefore(view,grid.firstElementChild);}
 ensureCompactIntro(view);
 const cardA=ensureLawnCard(view,'A',stageA);
 const progression=ensureProgression(view,cardA);
 const cardB=ensureLawnCard(view,'B',stageB);
 if(cardB.previousElementSibling!==progression.station)progression.station.insertAdjacentElement('afterend',cardB);
 const dock=ensureTreatments(view,cardB);
 const changes=ensureWhatChanged(view,dock);
 // Never reappend already-mounted drawers: DOM moves dismiss native Android select menus.
 const ordered=[cardA,progression.station,cardB,dock];
 for(let i=0;i<ordered.length;i++){
  const node=ordered[i];
  if(node.parentElement!==view||node.previousElementSibling!==(i?ordered[i-1]:null)){
   view.insertBefore(node,i?ordered[i-1].nextSibling:view.firstChild);
  }
 }
 placeLiveProgression(progression);
 syncDays();
 hidePhotoDiagnostics();
 layoutParts=progression;
 return true;
 }finally{mounting=false;}
}

function start(){
 if(!mobileQuery.matches)return;
 if(!mount()){
  let attempts=0;const timer=setInterval(()=>{if(mount()||++attempts>30)clearInterval(timer);},250);
 }
 [250,700,1400,2800,5000].forEach(delay=>setTimeout(()=>{if(mobileQuery.matches)mount();},delay));
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.addEventListener('load',start,{once:true});
window.addEventListener('turfarium:time-advanced',()=>{syncDays();if(layoutParts)placeLiveProgression(layoutParts);hidePhotoDiagnostics();});
// Do not observe every text mutation in the entire document. The visual engine
// updates captions frequently; a global observer creates needless DOM churn.

mobileQuery.addEventListener?.('change',event=>{if(event.matches)start();});
new MutationObserver(records=>{
 if(!mobileQuery.matches||remountQueued)return;
 const moved=records.some(record=>[...record.addedNodes].some(node=>node.nodeType===1&&(
  node.matches?.('.profile-step-row,.tf-replay-bar,.tf-history-replay,#tf-season-display,#tf-what-changed-details')||
  node.querySelector?.('.profile-step-row,.tf-replay-bar,.tf-history-replay,#tf-season-display,#tf-what-changed-details')
 )));
 if(!moved)return;
 remountQueued=true;
 requestAnimationFrame(()=>{remountQueued=false;mount();});
}).observe(document.documentElement,{childList:true,subtree:true});
})();
