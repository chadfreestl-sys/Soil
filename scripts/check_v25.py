#!/usr/bin/env python3
"""Read-only v25 checks: catches broken wiring before any public deployment."""
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1]
html = (root / "lab.html").read_text(encoding="utf-8")
errors = []
warnings = []

def check(condition, message):
    if not condition:
        errors.append(message)

for identifier in (
    "lawn-a-panel", "lawn-b-panel", "experiment-controls",
    "timeline-workflow", "metricA", "metricB", "rateInfoA", "rateInfoB"
):
    check(bool(re.search(r'\bid\s*=\s*["\']' + re.escape(identifier) + r'["\']', html)),
          f"Missing engine/UI anchor: {identifier}")

check("layout-tools.js" in html, "Missing primary layout script")
for file in ("weather-first-v23.js", "treatment-history-v23-6.js",
             "turfarium-details-v24.js"):
    check(file in html, f"Missing existing panel controller: {file}")

# Catch literal escaped newline sequences injected by the old publishing workflow.
for line_no, line in enumerate(html.splitlines(), 1):
    if re.search(r'(?:\\n){3,}', line):
        warnings.append(f"Line {line_no}: repeated literal \\n text; inspect visible UI")

for match in re.finditer(r'<(?:script|link)\b[^>]*?(?:src|href)\s*=\s*["\']([^"\']+)["\']', html, re.I):
    url = match.group(1)
    if url.startswith(("http:", "https:", "//", "data:", "#")):
        continue
    path = url.split("?", 1)[0].split("#", 1)[0].lstrip("/")
    if path and not (root / path).is_file():
        warnings.append(f"Local resource not found: {path}")

for key in ("A", "B"):
    check(f"'lawn-'+key.toLowerCase()" not in "", "") if False else None
for script_name in ("treatment-history-v23-6.js", "turfarium-details-v24.js"):
    script = (root / script_name).read_text(encoding="utf-8")
    check("aria-expanded" in script and "hidden" in script,
          f"Collapsible panel behavior missing: {script_name}")

print("Turfarium v25 static quality gate")
print(f"HTML: {len(html):,} characters")
for message in warnings[:30]:
    print("WARNING:", message)
for message in errors:
    print("ERROR:", message)
if errors:
    sys.exit(1)
print(f"PASS: {len(errors)} errors; {len(warnings)} warnings (review warnings before release)")
