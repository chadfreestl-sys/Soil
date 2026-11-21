# Production release gate

Turfarium is an **educational, uncalibrated simulation**, not a predictive turf prescription engine.

## Required release checks
1. GitHub Actions **Turfarium production regression gate** passes on the release commit: all `tests/*.test.cjs` contracts and 400 browser longitudinal scenarios.
2. Confirm nutrient deficiency contrasts (P, K, pH), nitrogen pool trajectories and saturation/drought cases in the diagnostic artifact. A numerical pass alone does **not** establish agronomic realism.
3. Verify both lawns visually on mobile at day 0, 30, 90, 180 and after save/load/replay. Check actual seasonal images and 404s, not only a numerical proxy.
4. Confirm no browser console errors, missing images, navigation jumps or spontaneous scrolling.
5. Validate checkout/access flow and distribution links before selling.

## Open scientific review
- Delayed nitrogen benefit and large 180-day vigor rebound.
- Wet-condition irrigation penalty and drought-specific response.
- High nitrogen vigor versus actual canopy divergence.
- Material-dose test coverage: longitudinal matrix calls `apply()` at illustrative reference strength, **not the user-facing `applyDose()` path**. Dose-specific longitudinal integration still required.
- 400-case visual score is a duplicate mathematical proxy, not a test of actual image selection.
- Existing P/K/pH growth gates use heuristic thresholds; they require agronomic review before calibration claims.

**Release decision: NOT YET VERIFIED** until the above checks are confirmed against the final commit. Do not present prior passing reports as certification of subsequent changes.
