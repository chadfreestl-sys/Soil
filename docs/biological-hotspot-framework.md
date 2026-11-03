# Turfarium — Biological Hotspot Visualization Framework v1.0

Status: adopted design specification; visualization logic pending simulator integration.

## Purpose
Use subtle, localized **false-color illumination** to teach that soil biological activity is spatially heterogeneous. Glow is a visual metaphor, **not literal bioluminescence**, a measured organism count, or proof of treatment efficacy.

## Four discrete light-intensity levels
| Level | Label | Visual | Interpretation |
|---|---|---|---|
| 0 | Dormant / very low | Almost invisible, no halo | Activity strongly constrained |
| 1 | Low | Faint warm pinpoint, low opacity | Limited potential activity |
| 2 | Moderate | Soft amber localized glow | Favorable conditions for activity |
| 3 | High | Brighter warm gold, restrained small halo | Relative hotspot; not an absolute biological count |

Never illuminate entire root systems uniformly. Vary intensity by location and time, with sparse localized hotspots. Avoid neon, broad halos, and spiderweb-like white hyphae.

## Spatial zones
1. **Rhizosphere:** fine-root vicinity, especially active root tips; driven by root growth, exudation potential, water, oxygen, temperature.
2. **Detritusphere:** decomposing clippings, thatch, organic residues; driven by available substrate, moisture, aeration.
3. **Drilosphere:** earthworm burrow walls and casts; influenced by earthworm activity and local carbon/moisture.
4. **Aggregate / pore microsites:** selected moist, aerated soil aggregates; heterogeneous, not every aggregate lit.
5. **Bulk soil:** mostly low/background activity, with occasional scattered hotspots.

## Drivers and constraints
Recompute independently for each lawn, each zone, and every time advance:
- Soil temperature (seasonal and depth-dependent)
- Soil moisture (too dry OR saturated reduces aerobic activity)
- Oxygen / drainage / compaction
- Available carbon / decomposable organic matter
- Root vitality and fine-root density
- Soil pH and nutrient limitations, where supported
- Management: mowing height and clipping return, irrigation, traffic, core aeration, organic amendments, fertilizer
- Treatments: seaweed extract (Maxicrop), worm tea, compost and other products **only via explicitly modeled, evidence-weighted effects**. No automatic glow boost simply because a product was applied.

## Conceptual scoring (initial prototype, calibrate later)
For each zone calculate normalized potential in [0,1]:
potential = geometric_mean(temperature_suitability, moisture_suitability, oxygen_suitability)
            * substrate_factor * zone_factor
            * management_modifier * evidence_weighted_treatment_modifier

Clamp to [0,1]. Use non-linear suitability curves: both drought and waterlogging depress potential; favorable ranges depend on biological group and soil. Do not infer total microbial abundance directly from potential.

Provisional bins: [0,0.20) => 0; [0.20,0.45) => 1; [0.45,0.75) => 2; [0.75,1] => 3. Add hysteresis or smoothing so lights do not flicker at thresholds. These are illustrative design thresholds, **not field-calibrated measurements**.

## Visual implementation
- Render hotspots as an optional overlay, separate from BASE image assets; image itself remains a natural soil cutaway.
- Keep hotspots small, irregular, spatially anchored to appropriate substrates; use a few dozen at most per full panoramic scene, density adjustable.
- Opacity and radius follow the 4 discrete levels; allow a smooth 0.5–2s transition when time advances.
- Provide a toggle: Biological Hotspots ON/OFF, and a legend: 'Illustrative modeled activity, not direct measurement.'
- Keep mobile rendering efficient (CSS/SVG/canvas overlay), and respect reduced-motion preference.
- A/B lawns must calculate separately and reflect different weather, treatments and management.
- Explain in 'What changed' which drivers increased/decreased each zone and how confident the model is.

## Scientific safeguards
- The glow represents **relative modeled biological activity potential**, not guaranteed microbial growth, pathogen status, or direct detection.
- Some activity occurs without visible hotspots; low light does not imply sterile soil.
- Avoid attributing an observed change to Maxicrop without controls and evidence.
- Separate bacteria/fungi/protozoa/nematode populations and nutrient cycling models from the visualization layer; do not equate brightness to any one organism's abundance.
- Future calibration: soil respiration, temperature/moisture sensors, microscopy, and replicated field observations.

## BASE71
The user approved the **concept** of subdued hotspot illumination around rhizosphere and other microsites. BASE71 image itself is not yet locked; visual overlay and simulator logic are pending implementation.
