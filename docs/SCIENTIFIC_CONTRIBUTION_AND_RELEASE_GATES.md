# Turfarium — scientific contribution and release readiness (2026-11-10)

## What Turfarium can contribute
Turfarium is a scenario-based educational model for tall fescue in St. Louis-area clay soils. Its distinctive contribution is connecting treatment decisions, weather, management, soil conditions, biological indicators, turf response, and an illustrative image sequence in one repeatable timeline. A two-lawn comparison can make management tradeoffs visible. Its five-year horizon can teach delayed effects and the importance of follow-up applications, mowing, irrigation, and seasonal timing.

## Claims we can responsibly make
- **Educational systems model**, not a validated agronomic forecasting instrument.
- Image states are illustrations, not photographs of an observed experimental plot after a given treatment.
- Microbial guild loads are modeled proxies; without lab assays they are not measured populations.
- Soil nutrient deficiencies require field context and preferably soil/tissue testing; yellow turf is not uniquely diagnostic.
- Treatment effects and environmental interactions should be labeled as assumptions or literature-supported hypotheses until calibrated against field data.
- The tool must not imply product efficacy, pesticide safety, or application legality without reference to the current product label and applicable law.

## Scientific verification roadmap
1. Version and document the state variables, units, update equations, and bounds.
2. Build an image metadata manifest: BASE id, season, stressor, treatment context, severity, soil moisture, canopy status, root status, and scientific reviewer note. Do not infer these labels from filenames alone.
3. Test monotonicity and counterfactuals (e.g. added irrigation reduces water stress only when drainage permits; overwatering increases oxygen stress).
4. Calibrate against independently collected tall-fescue field observations: canopy cover, NDVI/color, clipping yield, soil moisture, infiltration, soil test values, and optional microscopy.
5. Run repeated simulations with identical starting conditions to confirm deterministic output; test 0/30/60/90/180/540-day and 5-year transitions.
6. Evaluate accessibility, mobile rendering, missing-image fallback, save/load, and two-lawn comparison.

## Release blockers found
- Active visual-state engine still selects legacy seasonal/classic photos, not BASE01–BASE88.
- Asset audit exists but has not been run in a real browser against deployed branch assets.
- The full 27-script runtime and remaining species/golf-related UI paths have not been regression tested.
- No evidence yet of field calibration or predictive validation.

## Release decision
**HOLD MERGE.** Keep pull request #4 as a draft. Only merge after browser audit, scientifically reviewed image manifest, and core regression suite pass. Do not describe Turfarium as completed or validated before those gates.
