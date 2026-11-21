# Turfarium v25 — release audit (2026-11-21)

## Scope
Inspected main branch `lab.html`, production regression workflow, and latest treatment regression contracts after PR #141. This is a source-level audit; **not** a completed live-browser or full CI run.

## Confirmed issue corrected
- `tests/treatment-feedback.test.cjs` still asserted the exact old rejection text `Not applied: this generic material needs a dry mass rate`, which PR #141 intentionally removed when enabling generic liquid treatments. This stale assertion would cause the `node-contracts` job to fail. Updated to assert the new supported-unit failure message.

## Findings / release gates
- **PASS (source inspection):** `applyDose` now has a liquid-volume proxy and guards nutrient-grade mass conversion behind `r.lbPerK!==null`.
- **PASS (source inspection):** application error messages are retained; the treatment options include all five organic products used in the manual test.
- **OPEN:** No completed workflow or CI status was returned for merge commit `391a026a89977353cd6bb0f4514c2bdf9d7ec5a7`. Absence of returned results is not proof of no run; inspect Actions directly.
- **OPEN:** Full 400-scenario browser suite must run on the **current** main commit. Older 400/400 evidence predates changes.
- **OPEN:** On-device visual A/B interpolation, photo loading, replay, save/load, and refresh/deployment still need end-to-end verification.
- **OPEN:** Existing Node contracts include text-presence assertions, which do not demonstrate actual DOM application behavior.
- **CAUTION:** Generic liquid dose factors are illustrative; do not market as product-label dose-response predictions.

## Go/no-go
**Internal beta: GO** with disclosure. **Public paid launch: NO-GO** until latest CI, live treatment matrix, mobile image, and save/replay checks pass.

## Acceptance criteria
1. CI `node-contracts` green on latest main.
2. `longitudinal-browser` green on latest main with saved 400-case report.
3. Every visible treatment option: select default, apply, feedback success, history record, correct A/B isolation, no JS exception.
4. Day 0/30/90/180/365/1825: stable values, images, replay, save/load across refresh and mobile.
5. Product descriptions clearly distinguish conceptual response proxies from validated field rates.
