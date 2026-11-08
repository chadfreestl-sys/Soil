#!/usr/bin/env node
/**
 * Turfarium BASE library auditor. Read-only; Node 18+.
 * Usage: node scripts/audit-base-library.mjs [repo-root]
 * Walks the checkout (not GitHub API); does not delete or move anything.
 */
import {readdir, stat, readFile} from 'node:fs/promises';
import {join, relative, resolve, sep} from 'node:path';
import {createHash} from 'node:crypto';

const root=resolve(process.argv[2]||'.');
const expected=n=>'assets/turfarium/BASE'+String(n).padStart(2,'0')+'/BASE'+String(n).padStart(2,'0')+'.webp';
const files=[];
async function walk(dir){
 for(const e of await readdir(dir,{withFileTypes:true})){
  if(e.name==='.git'||e.name==='node_modules')continue;
  const p=join(dir,e.name);
  if(e.isDirectory())await walk(p);
  else if(e.isFile())files.push(relative(root,p).split(sep).join('/'));
 }
}
await walk(root);
const assets=files.filter(p=>/\.(webp|png|jpe?g|avif)$/i.test(p));
const byLower=new Map();
for(const p of files){const k=p.toLowerCase();byLower.set(k,[...(byLower.get(k)||[]),p]);}
const entries=[];
for(const p of assets){
 const data=await readFile(join(root,p));
 const hash=createHash('sha256').update(data).digest('hex');
 const name=p.match(/BASE[\s_-]?0?(\d{1,3})/i);
 entries.push({path:p,bytes:data.length,sha256:hash,baseNumber:name?Number(name[1]):null});
}
const groups=entries.reduce((a,e)=>{(a[e.sha256]??=[]).push(e);return a;},{});
const duplicates=Object.values(groups).filter(g=>g.length>1);
const missing=[];
for(let n=1;n<=88;n++){
 const path=expected(n);
 if(!files.includes(path))missing.push({number:n,expected:path,caseVariants:byLower.get(path.toLowerCase())||[],alternateCandidates:entries.filter(e=>e.baseNumber===n).map(e=>e.path)});
}
const textFiles=files.filter(p=>/\.(html|js|mjs|css|json)$/i.test(p));
const references=[];
for(const p of textFiles){
 const source=await readFile(join(root,p),'utf8');
 const matches=[...source.matchAll(/(?:assets\/turfarium\/)?BASE\d{1,3}(?:\/BASE\d{1,3}\.webp)?|images\/seasons\/|turfarium-visual-state-v3-2\.js/g)];
 if(matches.length)references.push({path:p,matches:matches.length,samples:[...new Set(matches.map(m=>m[0]))].slice(0,12)});
}
const report={repoRoot:root,expected:88,foundAtExpectedPaths:88-missing.length,missing,assetCount:assets.length,baseNamedAssets:entries.filter(e=>e.baseNumber!==null).length,duplicateGroups:duplicates,assets:entries,references};
console.log(JSON.stringify(report,null,2));
if(missing.length)process.exitCode=2;
