/* Turfarium scenario laboratory: separate research trajectories, never overwrites live lawn state. */
(()=>{'use strict';
function init(){const api=window.TurfariumFiveYearScenarios;if(!api||document.getElementById('tf-scenario-lab'))return;
 const anchor=document.querySelector('#lawn-b-panel');if(!anchor)return;
 const section=document.createElement('section');section.id='tf-scenario-lab';section.style.cssText='margin:22px 0;padding:18px;background:#f1f6ee;border:1px solid #b7cbb3;border-radius:14px;color:#193b2b;overflow-x:auto';
 const title=document.createElement('h3');title.textContent='Five-year progression stress test';title.style.margin='0 0 8px';section.append(title);
 const desc=document.createElement('p');desc.textContent='Research sandbox only — shared March baseline and estimated seasonal conditions. Does not change Lawn A or B treatments, photos, or saved history. Indices are hypothetical, not field predictions.';section.append(desc);
 const table=document.createElement('table');table.style.cssText='border-collapse:collapse;width:100%;min-width:480px;font-size:.82rem';const head=document.createElement('thead');const tr=document.createElement('tr');['Day','Conventional canopy','Biological canopy','Stressed canopy','Conventional roots','Biological roots','Stressed roots'].forEach(x=>{const th=document.createElement('th');th.textContent=x;th.style.cssText='padding:8px 5px;text-align:left;border-bottom:2px solid #94b19c';tr.append(th)});head.append(tr);table.append(head);
 const body=document.createElement('tbody'),data=api.compare();data.checkpoints.forEach((day,i)=>{const row=document.createElement('tr');const a=data.conventional[i],b=data.biological[i],c=data.stressed[i];[day,a.canopy,b.canopy,c.canopy,a.roots,b.roots,c.roots].forEach((v,j)=>{const cell=document.createElement('td');cell.textContent=j?String(Math.round(v)):String(v);cell.style.cssText='padding:7px 5px;border-bottom:1px solid #d2e1d1';row.append(cell)});body.append(row)});table.append(body);section.append(table);anchor.insertAdjacentElement('afterend',section);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
