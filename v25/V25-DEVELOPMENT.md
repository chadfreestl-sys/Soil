# Turfarium v25 — development workflow

## Protected baseline
- Public production: `main` (the working Lawn A/B, weather, profile, rates, metrics and history layout).
- Development: `turfarium-v25-development`.
- **Do not commit interface experiments to `main`.** Changes to this branch do not publish to the production GitHub Pages site.
- The legacy publish workflow is restricted to pushes on `main` on this branch.

## Why we're doing this
The v20–v24 interface accumulated overlapping DOM reordering and style overrides. The screenshot of repeated literal `\\n` characters indicates that the old publishing workflow may have inserted escaped newlines into the HTML. The new workflow should make defects detectable before release.

## v25 milestones
1. **Inventory and freeze**: document current panel IDs and existing controllers; verify their dependencies.
2. **One layout owner**: replace overlapping layout reorderers with one tested controller, without touching treatment, timeline or soil computation code.
3. **Mobile-first polish**: compact audience banner, readable lawn imagery, expandable application settings, soil metrics and separate histories.
4. **Browser QA**: test Homeowner, Technician, Professional and Research/Lab at 360px and desktop; test apply treatment, advance time, reopen panels, and refresh.
5. **Release**: merge into `main` only after manual browser acceptance and a successful quality gate.

## Local quality gate
Run `python3 scripts/check_v25.py`. This is read-only. Warnings are not silently fixed.

## Non-negotiable invariants
- Weather Lab comes first and starts closed.
- Profile Viewer + Time Advance comes next and starts open.
- Lawn A and Lawn B remain prominent.
- Application Rate & Settings, Soil Metrics and Treatment History are independently collapsible for each lawn.
- Both histories retain their original DOM nodes so engine updates continue to work.
- No changes to numerical simulation logic without a separate review.
- No production changes until v25 is visually verified.

## Known issue to investigate
The old publish workflow uses Python HTML string replacements containing literal backslash-n sequences. Do not rerun it against development HTML; remove any existing visible escape sequences as part of the controlled HTML cleanup.

## Phase 2 implementation (v25.1)
- `v25-workspace.js` is the single extension controller for weather placement, independent Treatment History A/B, Application Rate & Settings, Soil Metrics, and Lawn Overview shortcuts.
- `layout-tools.js` remains responsible for the core profile/timeline layout and base accordion until we can test its complete replacement.
- `v25-workspace.css` handles compact responsive styling.
- The `v25-assemble.yml` workflow rewires **only development `lab.html`**, removing the three competing legacy extension scripts from that page. No simulation engine code is modified.
- The v25 static checker verifies script wiring and panel anchors; it does **not** prove visual correctness or simulation behavior.
- Remaining work: investigate two pre-existing literal `\\n` warnings, browser QA, and an isolated hosted preview. Do not merge before these pass.
