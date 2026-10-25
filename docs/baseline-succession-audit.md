# Turfarium — Causal Baseline Succession Audit (2026-10-24)

Status: audit and implementation specification; no changes to running simulation in this commit.

## Objective
A no-treatment modern turf-type tall fescue lawn maintained at 3.5 inches, with mowing directions alternated and clippings returned, can thicken in favorable seasons without being forced toward perfection. Distinguish apparent coverage from living turf cover, and short-term physiology from durable structure. Identical A/B inputs must produce identical outputs.

## Confirmed code observations
- `lab.html:make()` initializes `rootDepth:9`, `rootMass:25`, but has no separate canopy cover, tiller density, carbohydrate reserve, or leaf-orientation state.
- `lab.html:daily(s)` updates `rootDepth` mainly from temperature, aeration, salinity and species maximum; `rootMass` mainly from temperature, aeration, moisture-dependent seaweed response and a fixed daily subtraction. Neither equation explicitly uses mowing height or retained leaf area.
- `lab.html:env(s)` calculates vigor using biology, pathogens, oxygen, temperature, moisture, nitrogen, pH and salts. It is not a direct measurement of visible canopy condition.
- `lab.html:TurfariumVisualSnapshot` exports vigor, biology, worms, disease, oxygen, structure, compaction, salts and rootMass, but not actual ground cover or canopy density.
- `turfarium-visual-state-v3-2.js:scoreFrom(s)` combines those variables directly to select one of eight photos. Underground changes can therefore advance photographs without corresponding visible canopy change.
- `lab.html:record()` stores replay snapshots; `reset()` clears `history` but does not explicitly clear `window.TurfariumRecordedFrames`.

## Causal dependencies (proposed; coefficients not validated)
| State | Primary drivers | Constraints | Response time | Observable output |
|---|---|---|---|---|
| Leaf orientation | recent mowing direction, wheel/deck displacement, recovery | stiffness, hydration, growth | hours–days | stripes, apparent canopy closure |
| Retained leaf area | mowing height/frequency, canopy growth, leaf loss | species, shade, heat, drought | immediate–weeks | light interception |
| Carbohydrate reserve | canopy photosynthesis less respiration, mowing recovery and growth costs | sunlight, temperature, water, nutrition | days–months | delayed growth capacity |
| Physiological condition | water status, heat, nutrient access, disease | root function, soil oxygen | hours–weeks | color, wilting |
| Tiller density | carbon availability, season, cultivar, crown health | stress, space, competition | weeks–months | lasting thickness |
| Living turf cover | surviving crowns, tiller expansion, recruitment, overseeding | gap size, weeds, establishment | months–years | rooted turf occupancy |
| Root biomass | allocated carbon, temperature, oxygen, water, nutrient status | compaction, pathogens, energy | weeks–months | uptake capacity |
| Root depth | elongation at active tips, soil profile suitability | compaction, anaerobic zones, drought, temperature | weeks–seasons | depth distribution |
| Soil biology | substrate, moisture, oxygen, temperature, trophic interactions | salinity, disturbance | days–years | indirect nutrient/structure effects |
| Soil structure/OM | roots, fauna, amendments, decomposition, disturbance | texture, traffic, climate | seasons–years | infiltration, pore connectivity |

## Required model invariants
1. No direct microbe/worm/soil-score shortcut to higher photo states.
2. Canopy can appear fuller without new rooted ground cover; these states must differ.
3. Repeated low mowing can reduce reserve and rooting potential; 3.5-inch mowing must not grant an unconditional bonus.
4. Root mass and depth are distinct, constrained states. Root depth must not simply scale linearly with mowing height.
5. Summer heat/drought can halt or reverse growth; fall can permit recovery. No automatic improvement with time.
6. Mowing direction changes orientation immediately; long-term photosynthetic/tillering gains remain a hypothesis, not a hard-coded guaranteed bonus.
7. Treatments improve outcomes only if relevant limitations are relieved.
8. Same initial states and management, without treatment, should remain identical across A and B.
9. Replay/reset must not mix snapshots from separate runs.

## Implementation order
1. Add explicit baseline canopy and energy state, with backwards-compatible defaults.
2. Connect actual mowing settings to retained leaf area, mowing stress and carbohydrate budget. Audit existing mowing UI wiring before editing.
3. Drive root mass, root depth and tiller changes from energy plus season/soil constraints; include respiration and recovery costs.
4. Export visible canopy states in snapshots and replay history.
5. Update visual scoring to primarily reflect living cover, canopy density, color/stress, weeds and season; retain graceful fallback for older snapshots.
6. Add repeatable test cases: identical untreated A/B; 3.5 vs 1.5 inches; alternating vs fixed direction; summer drought; fall recovery; overseeding; amendment without limiting factor.
7. Calibrate rates to peer-reviewed turfgrass data and label uncertain coefficients illustrative.

## Evidence labels
- Established qualitative relationship: excessive close mowing reduces retained leaf area and can impair root development.
- Plausible but unquantified: higher mowing supports better canopy persistence and reserve accumulation in tall fescue under suitable conditions.
- Hypothesis requiring validation: alternating mowing directions increases whole-canopy photosynthesis and long-term tillering, beyond mechanical and appearance effects.
- Not validated: all numerical growth rates, recovery ceilings, and photo thresholds currently used by Turfarium.

## Acceptance test for baseline
March start, modern tall fescue, 65% living cover, thin areas, 3.5-inch mowing, alternating direction, returned clippings, no inputs: spring color/leaf-area changes may precede tillering; cover closes slowly; summer heat may arrest/reverse improvement; fall recovery depends on surviving crowns/reserves; no guaranteed 'elite' image at day 90. Compare with low-mowed control while holding all other inputs constant.
