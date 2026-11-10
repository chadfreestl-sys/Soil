# Turfarium integration and species coverage audit — 2026-11-09

## Confirmed from source
- `lab.html` exposes 12 species: Tall fescue, Fine fescue, Kentucky bluegrass, Perennial ryegrass, Creeping bentgrass, Zoysia, Bermudagrass, St. Augustinegrass, Centipedegrass, Bahiagrass, Buffalograss, Seashore paspalum.
- The lab contains species-specific pH guidance and growth-habit/root/thatch/seasonal response code. These are simplified illustrative models, not cultivar-calibrated.
- The 88 canonical BASE images were developed principally as **tall fescue**. Their presence does NOT constitute botanical visual coverage for the other 11 species.
- `images/seasons/<season>/state-*.webp` are seasonal state artwork; do not assume species-specific morphology without inspecting each asset.
- Experimental selector v4 now requires explicit `species` on both the image record and selection state and refuses cross-species substitution. The current BASE manifest has no calibrated `species` or `conditions`, so it intentionally selects nothing.
- Existing production UI remains untouched. No benchmark or CI run is claimed.

## Critical integration gates
1. Create a species taxonomy and growth-habit mapping shared by lab calculations and visual selection. Preserve the 12 existing display names and add a normalized species key.
2. Annotate each verified image with a verified depicted species. Do not infer an image's species from its ID; confirm whether mixed turf or weeds appear.
3. Add representative imagery for other species **before** enabling species-specific BASE rendering. Prioritize Kentucky bluegrass, perennial ryegrass, zoysia and bermudagrass; distinguish rhizomes, stolons, bunch habit, blade width and seasonal dormancy.
4. Establish treatment/environment manifestation metadata and explicit state calibration (soil moisture, compaction, canopy, root vigor, temperature, treatment timing) per image.
5. Test five-year timelines, seasonal transitions, per-lawn independence, treatment history, save/replay, visual fallbacks and Android scroll performance.
6. Preserve production visual engine and keep v4 behind a feature flag until all tests and user approval. When species art is absent, show an honest generic diagram or explanatory state, not mislabeled fescue artwork.

## Test status
- Selector tests committed but not confirmed executed in CI.
- Asset auditor committed but full artifact report not reviewed.
- End-to-end visual integration and mobile profiling pending.
