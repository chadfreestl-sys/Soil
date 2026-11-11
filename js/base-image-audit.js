/* Turfarium scientific image library diagnostics.
 * Read-only. Does not alter image selection or load 88 full-size photographs.
 * Run in browser console: await TurfariumAssetAudit.run()
 */
(()=>{'use strict';
const root='assets/turfarium/';
const path=n=>root+'BASE'+String(n).padStart(2,'0')+'/BASE'+String(n).padStart(2,'0')+'.webp';
async function check(n){
 const url=path(n);
 try{
  let response=await fetch(url,{method:'HEAD',cache:'no-store'});
  if(response.status===405||response.status===501)response=await fetch(url,{method:'GET',headers:{Range:'bytes=0-31'},cache:'no-store'});
  return {id:'BASE'+String(n).padStart(2,'0'),url,ok:response.ok,status:response.status,contentType:response.headers.get('content-type')||'',bytes:response.headers.get('content-length')||''};
 }catch(e){return {id:'BASE'+String(n).padStart(2,'0'),url,ok:false,error:String(e)}}
}
async function run({concurrency=6}={}){
 const count=Math.max(1,Math.min(12,Math.floor(Number(concurrency)||6)));
 const results=new Array(88);let next=1;
 await Promise.all(Array.from({length:count},async()=>{while(next<=88){const n=next++;results[n-1]=await check(n)}}));
 const failures=results.filter(x=>!x.ok);
 const report={checkedAt:new Date().toISOString(),total:88,passed:88-failures.length,failed:failures.length,failures,results};
 window.TurfariumAssetAudit.lastReport=report;
 console.table(results.map(({id,status,ok,contentType})=>({id,status,ok,contentType})));
 console.info('[Turfarium] BASE image audit:',report.passed+'/88 available');
 return report;
}
window.TurfariumAssetAudit=Object.freeze({run,path,get lastReport(){return window.__tfBaseAuditReport||null},set lastReport(v){window.__tfBaseAuditReport=v}});
})();
