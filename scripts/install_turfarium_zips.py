#!/usr/bin/env python3
"""Audit Turfarium upload ZIPs and stage unambiguous WebP candidates.

Default is DRY RUN. Use --install only after reviewing the JSON report.
Never deletes originals or upload archives. Conflicting ZIPs require review.
"""
import argparse
import hashlib
import json
import re
import zipfile
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RX = re.compile(r"Turfarium_BASE(\d{2})_.*GitHub_Upload\.zip$", re.I)
WEBP = re.compile(r"BASE(\d{2})\.webp$", re.I)

def digest(data):
    return hashlib.sha256(data).hexdigest()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--install", action="store_true", help="Install only unambiguous packages")
    parser.add_argument("--approved-manifest", type=Path, help="JSON mapping BASE## to approved SHA-256")
    args = parser.parse_args()
    if args.install and not args.approved_manifest:
        parser.error("--install requires --approved-manifest with independently verified SHA-256 values")
    candidates = defaultdict(list)
    approvals = json.loads(args.approved_manifest.read_text()) if args.approved_manifest else {}
    errors = []
    for archive in sorted(ROOT.glob("Turfarium_BASE*GitHub_Upload.zip")):
        match = RX.fullmatch(archive.name)
        if not match:
            errors.append({"archive": archive.name, "reason": "unexpected filename"})
            continue
        number = match.group(1)
        try:
            with zipfile.ZipFile(archive) as z:
                matches = [p for p in z.namelist() if WEBP.fullmatch(Path(p).name) and WEBP.fullmatch(Path(p).name).group(1) == number]
                if len(matches) != 1:
                    errors.append({"archive": archive.name, "reason": "missing or ambiguous BASE image", "matches": matches})
                    continue
                data = z.read(matches[0])
                if len(data) < 1000 or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
                    errors.append({"archive": archive.name, "reason": "invalid WebP signature"})
                    continue
                candidates[number].append({"archive": archive.name, "entry": matches[0], "sha256": digest(data), "bytes": len(data)})
        except (OSError, zipfile.BadZipFile, RuntimeError) as exc:
            errors.append({"archive": archive.name, "reason": str(exc)})
    report = {"mode": "install" if args.install else "dry-run", "images": [], "errors": errors}
    for number, options in sorted(candidates.items()):
        hashes = {item["sha256"] for item in options}
        target = ROOT / f"assets/turfarium/BASE{number}/BASE{number}.webp"
        old_hash = digest(target.read_bytes()) if target.exists() else None
        approved = approvals.get(f"BASE{number}")
        status = "conflict-review-required" if len(hashes) > 1 else "unverified-approval"
        if approved and approved in hashes:
            status = "ready"
        elif approved:
            status = "approved-checksum-not-found"
        item = {"base": f"BASE{number}", "target": str(target.relative_to(ROOT)), "existing_sha256": old_hash, "candidates": options, "status": status}
        if args.install and status == "ready":
            selected = next(p for p in options if p["sha256"] == approved)
            source = ROOT / selected["archive"]
            with zipfile.ZipFile(source) as z:
                data = z.read(selected["entry"])
            if old_hash != digest(data):
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(data)
            item["status"] = "installed-and-verified" if digest(target.read_bytes()) == digest(data) else "verification-failed"
        report["images"].append(item)
    output = ROOT / "assets/turfarium/zip-install-audit.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2))
    if errors or any(i["status"] in ("conflict-review-required", "verification-failed", "approved-checksum-not-found") for i in report["images"]):
        raise SystemExit(2)

if __name__ == "__main__":
    main()
