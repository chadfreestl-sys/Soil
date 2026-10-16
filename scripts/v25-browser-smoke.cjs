/* Browser-based regression checks against isolated v25 branch. */
const { chromium }=require('playwright');
const {spawn}=require('child_process');
const fs=require('fs');
const path=require('path');
const assert=require('assert');
const out=path.resolve('browser-results');fs.mkdirSync(out,{recursive:true});
const server=spawn('python3',['-m','http.server','8765','--bind','127.0.0.1'],{stdio:'ignore'});
const report=[];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function run(){
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const [name,viewport] of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]]){
   const page=await browser.newPage({viewport});
   const errors=[];
   page.on('pageerror',e=>errors.push(String(e).slice(0,250)));
   await page.goto('http://127.0.0.1:8765/lab.html',{waitUntil:'domcontentloaded',timeout:90000});
   await page.waitForTimeout(3500);
   const status=await page.evaluate(()=>{
    const id=x=>document.getElementById(x);
    const w=id('experiment-controls'),a=id('lawn-a-panel'),b=id('lawn-b-panel');
    return {
      overview:!!id('v25-overview'),lawnA:!!a,lawnB:!!b,
      historyA:!!id('v25-history-A'),historyB:!!id('v25-history-B'),
      metricsA:!!id('v25-metrics-A'),metricsB:!!id('v25-metrics-B'),
      weatherClosed:!!w?.classList.contains('tf-panel-collapsed'),
      viewportWidth:document.documentElement.clientWidth,
      scrollWidth:document.documentElement.scrollWidth,
      weatherToggle:!!w?.querySelector(':scope > .tf-collapse-toggle'),
      timeButtons:id('profile-control-deck')?.querySelectorAll('button').length||0,
      jsLoaded:!!document.querySelector('script[src*="v25-workspace.js"]')
    };
   });
   const screenshot=path.join(out,name+'.png');
   await page.screenshot({path:screenshot,fullPage:true,animations:'disabled',timeout:30000});
   const required=['overview','lawnA','lawnB','historyA','historyB','metricsA','metricsB','weatherClosed','weatherToggle','jsLoaded'];
   const missing=required.filter(k=>!status[k]);
   if(status.scrollWidth>status.viewportWidth+12)missing.push('horizontal-overflow');
   if(status.timeButtons<1)missing.push('time-controls');
   if(status.weatherToggle){
     await page.locator('#experiment-controls > .tf-collapse-toggle').click();
     await page.waitForTimeout(250);
     const expanded=await page.locator('#experiment-controls > .tf-collapse-toggle').getAttribute('aria-expanded');
     if(expanded!=='true')missing.push('weather-open-interaction');
   }
   if(status.historyA){
     await page.locator('#v25-history-A > button').click();
     const expanded=await page.locator('#v25-history-A > button').getAttribute('aria-expanded');
     if(expanded!=='true')missing.push('history-A-open-interaction');
   }
   report.push({name,status,missing,errors:errors.slice(0,12)});
   await page.close();
  }
 }finally{await browser.close();}
}
(async()=>{
 try{
  await sleep(1400);await run();
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(report,null,2));
  for(const row of report)console.log(row.name,JSON.stringify(row));
  if(report.some(x=>x.missing.length))process.exitCode=1;
 }catch(e){console.error(e);fs.writeFileSync(path.join(out,'error.txt'),String(e.stack||e));process.exitCode=1;}
 finally{server.kill();}
})();
