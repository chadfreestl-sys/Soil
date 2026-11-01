#!/usr/bin/env python3
"""Install Turfarium BASE WebP images from uploaded ZIPs, retaining ZIPs for audit."""
import hashlib, io, json, re, zipfile
from pathlib import Path
root=Path(__file__).resolve().parents[1]
packages=sorted(root.glob("Turfarium_BASE*_GitHub_Upload.zip"))+sorted(root.glob("Turfarium_BASE*_Revision_GitHub_Upload.zip"))+sorted(root.glob("Turfarium_BASE*_Final_GitHub_Upload.zip"))
selected={}
for pkg in packages:
    match=re.search(r"BASE(\d{2})",pkg.name,re.I)
    if not match: continue
    n=match.group(1)
    with zipfile.ZipFile(pkg) as z:
        candidates=[p for p in z.namelist() if Path(p).name.lower()==f"base{n}.webp"]
        if len(candidates)!=1:
            print(f"SKIP {pkg.name}: expected exactly one BASE{n}.webp, found {len(candidates)}")
            continue
        data=z.read(candidates[0])
        if not (len(data)>1000 and data[:4]==b"RIFF" and data[8:12]==b"WEBP"):
            print(f"SKIP {pkg.name}: invalid WebP")
            continue
        selected[n]=(pkg.name,data)
records=[]
for n,(pkg,data) in sorted(selected.items()):
    dest=root/f"assets/turfarium/BASE{n}/BASE{n}.webp"
    dest.parent.mkdir(parents=True,exist_ok=True)
    old=hashlib.sha256(dest.read_bytes()).hexdigest() if dest.exists() else None
    new=hashlib.sha256(data).hexdigest()
    if old!=new: dest.write_bytes(data)
    records.append(dict(base=f"BASE{n}",source=pkg,sha256=new,previous_sha256=old,changed=old!=new))
report=root/"assets/turfarium/zip-install-audit.json"
report.write_text(json.dumps(records,indent=2)+"\n")
print(json.dumps(records,indent=2))
