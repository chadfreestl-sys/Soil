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
check("v25-workspace.js" in html, "Unified v25 workspace script is not loaded")
check("v25-workspace.css" in html, "Unified v25 workspace stylesheet is not loaded")
for legacy in ("weather-first-v23.js", "treatment-history-v23-6.js", "turfarium-details-v24.js"):
    check(not re.search(r'<script[^>]*' + re.escape(legacy), html, re.I),
          f"Competing legacy controller still loaded: {legacy}")

# Regression: the layout controller must never reopen Weather on every reorder.
layout_js = (root / "layout-tools.js").read_text(encoding="utf-8")
weather_fn = layout_js.split("const putWeatherFirst=()=>", 1)
check(len(weather_fn) == 2, "Weather positioning function missing")
if len(weather_fn) == 2:
    weather_body = weather_fn[1].split("const arrangePrimaryPanels=()=>", 1)[0]
    check("panel.classList.remove('tf-panel-collapsed')" not in weather_body,
          "Weather reorder code forcibly reopens the panel")
    check("tfV25WeatherDefault" in weather_body,
          "Weather initial closed state is not protected")

# The single workspace extension owns weather, histories, details and overview.
workspace_js = (root / "v25-workspace.js").read_text(encoding="utf-8")
for marker in ("function weather()", "function histories()", "function details()", "function overview()"):
    check(marker in workspace_js, f"Unified controller missing: {marker}")
check("'.recent-applications'" in workspace_js,
      "Treatment histories must reuse the original live records")
check("aria-expanded" in workspace_js and "hidden" in workspace_js,
      "Unified controller must support accessible collapsed panels")

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
