# Turfarium physiology implementation and release gate — 2026-11-10

## Implemented
The **separate hypothesis-based five-year scenario sandbox** now tracks:
- `canopy`: visible green canopy index.
- `dormancy`: reversible stress-related loss of green canopy, not mortality.
- `reserves`: conceptual carbohydrate reserve index.
- `survival`: fraction of living crowns on a 0–100 index. Loss is irreversible without a separate reseeding mechanism (not implemented).
- `roots` and food-web indices as before.

The model uses 15-day integration steps. Stress can suppress green canopy before killing crowns; prolonged severe stress plus reserve depletion can reduce crown survival. After restoration of suitable conditions, surviving crowns can regreen. **Coefficients are illustrative hypotheses, not calibrated turf physiology or measured probabilities.**

## Repeatable regression results
43/43 automated assertions passed for six 1,825-day sandbox scenarios. Tests include numeric bounds, determinism, survival nonincrease, and directional stress/recovery comparisons.

## Critical distinction
The main interactive Lawn A/B engine in `lab.html` now has **a separate conceptual integration** of `crownSurvival`, `dormancyIndex`, and `severeStressDays`, initialized in `make()` and updated in `daily()`. The live model does not share the scenario engine's coefficients, and cross-engine agreement has NOT been demonstrated. Snapshot and canopy readout expose the new state. Browser testing, state migration, persistence and stress/recovery trajectory validation are still outstanding.

## Remaining launch blockers
1. Verify crown survival/dormancy in interactive Lawn A/B state and persistence without breaking existing history/replay; inspect canopy recovery dynamics and ensure no unintended cap/lock-in.
2. Run complete interactive treatment, timeline, reset, save/restore, and replay browser tests on preview deployment.
3. Scientifically approve and map BASE imagery; currently no reviewed runtime mappings.
4. Audit treatment dose units, evidence tiers, boundary behavior, seasonality and soil biological response against reliable field research.
5. Validate Android and desktop performance and accessibility.
6. Configure secure paid access, Gumroad fulfillment and licensing. A purchase link alone does not restrict the public static site.
7. Review Cloudflare static assets publishing surface and verify production deployment strategy.
8. Keep `main` untouched until acceptance criteria pass.
