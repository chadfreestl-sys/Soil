# Turfarium stabilization handoff

**Branch:** `turfarium/stabilization-2026-11-10`  
**PR:** #4 (draft; do not merge yet)  
**Production:** unchanged

## Files introduced
- `docs/STABILIZATION_AUDIT_2026-11-10.md` — architecture findings and integration gates.
- `docs/SCIENTIFIC_CONTRIBUTION_AND_RELEASE_GATES.md` — scientific scope and validation requirements.
- `js/base-image-audit.js` — read-only network metadata checks for expected BASE01–BASE88 WebP URLs.
- `base-image-audit.html` — standalone browser UI for the asset audit.
- `rhizosphere-lab.html` — standalone educational sandbox powered by `js/food-web.js`.

## Existing files modified
- `turfarium-build-status.js` — build label aligned to `25.1.0`.
- `turfarium-visual-state-v3-2.js` — removed warm-season dormancy calculations in visual filters; **legacy photo selection remains active**.

## Browser verification procedure
1. Preview the branch on a web server (do not open the HTML with `file://`).
2. Open `base-image-audit.html`, run the check, record all failures. Confirm WebP responses; investigate any MIME mismatch or missing file.
3. Open `rhizosphere-lab.html`. Advance 30 days, change one control, reset, and verify no JavaScript errors. Check narrow mobile viewport and keyboard controls.
4. Open `lab.html`. Check both lawn panels, time advancement, repeat treatments, replay, save/load, five-year scenario and mobile layouts.
5. Review `lab.html` and all dependent modules for remaining non-fescue species and golf-only treatments. Do not delete modules based only on names.
6. Build a **reviewed** BASE metadata manifest before changing the visual engine. An asset being present does not establish which condition it depicts.
7. Record test results and merge only after the above pass.

## Current known limitations
- No complete browser run has been performed in this workstream.
- No authoritative BASE-to-simulation-state mapping is installed.
- The rhizosphere lab is a standalone teaching prototype; it is not a live soil cross-section or synchronized with lawn A/B.
- Model outputs are illustrative indices and should not be represented as measured organism counts or field-validated forecasts.
- Audit checks HTTP response and WebP MIME type, not image decode, visual quality, or semantic accuracy.

## Release status
**Not release-ready.** Keep PR #4 in draft and preserve main until verified.
