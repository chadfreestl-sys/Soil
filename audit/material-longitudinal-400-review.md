# Turfarium — 400 longitudinal scenarios: response-quality audit

Source: `audit/material-longitudinal-400-results.json` (400 passing runs, 25 material types × 16 starting conditions, day 30/90/180).

## Findings requiring scientific/model review

1. **No modeled downstream response in the recorded outputs:** Dethatching, lime, sulfur, potassium and phosphate had exactly zero mean treated-minus-control differences in vigor, biology, root mass, canopy and visual score at day 180. This does **not** prove no chemical change; the chosen starting conditions and outputs may not trigger nutrient or pH limitation.
2. **Delayed nitrogen response:** Urea mean vigor differences were 0.000 at day 30 and 90, then +12.772 at day 180; ammonium sulfate was 0.000, -0.005, then +7.142; moderate mineral N was 0.000, 0.000, then +4.140. Inspect nitrogen-status coupling and possible timing discontinuities.
3. **High-N pulse:** Mean vigor difference was -2.220 at day 30, -2.921 at day 90, then +9.584 at day 180, while canopy remained -0.155 points at day 180. Check whether this rebound is intended and whether the photographic score could imply improvement unsupported by canopy cover.
4. **Water response:** Irrigation averaged -2.115 vigor and -0.915 root mass at days 30 and 180 respectively (different checkpoint metrics); wetting agents averaged -0.457 vigor at day 90. Check baseline moisture and whether excess-water/oxygen stress explains these directions.
5. **Visual sensitivity:** Many treatments produce no category-score difference at day 180 despite biological differences; this can be correct for discrete imagery but requires visual QA.

## Selected material means (16 cases per material)

| Material | Vigor Δ day 30 | Vigor Δ day 90 | Vigor Δ day 180 | Biology Δ day 180 | Root Δ day 180 | Visual score Δ day 180 |
|---|---:|---:|---:|---:|---:|---:|
| Compost | +0.885 | +1.773 | +1.420 | +4.530 | +0.009 | +0.313 |
| Urea | 0.000 | 0.000 | +12.772 | -0.012 | +0.833 | +1.313 |
| High N | -2.220 | -2.921 | +9.584 | -0.843 | -0.159 | +1.063 |
| Irrigation | -2.115 | -1.329 | +0.023 | -0.411 | -0.915 | +0.563 |
| Molasses | +0.491 | +1.230 | +1.143 | +3.722 | -0.015 | +0.188 |
| Microbial inoculant | +0.025 | +0.009 | +0.002 | +0.005 | 0.000 | 0.000 |
| Potassium | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 |

All differences are conceptual simulation indices, **not field-calibrated effect sizes**. The 400-pass report validates numerical boundedness and execution, **not** the correctness of treatment-specific response directions. The test's visual score is a mathematical proxy, not a pixel inspection of the photographs.

## Follow-up acceptance criteria

- Identify whether soil nutrient and pH limitation gates are intentionally dormant at the tested baselines; add deficient and adequate soil-condition contrasts.
- Trace the daily N uptake/release and tissue N sufficiency time series for the delayed N response.
- Confirm water treatments under dry, adequate and saturated starting conditions.
- Compare canopy-cover and photographic category changes at all checkpoints, including cases where vigor changes but canopy does not.
- Add agronomic direction-of-effect assertions only where the underlying evidence supports them; avoid hard-coding positive outcomes for biostimulants.
