# BASE image integration — operational contract

## Implemented on development branch
1. `js/base-image-registry.js` registers the expected BASE01–BASE88 WebP paths.
2. `lab.html` loads the registry **before** `turfarium-visual-state-v3-2.js` using ordered deferred scripts.
3. `imageFor(index,season)` first checks `TurfariumBaseLibrary.lookup(season,state)`; when a reviewed mapping exists and the file loads, it selects that BASE asset. Otherwise the existing seasonal/classic image fallback is retained.
4. The registry currently contains **zero reviewed mappings**, by design. Thus existing visuals remain unchanged until condition tags are verified.
5. `base-image-audit.html` checks 88 expected URLs for HTTP and WebP MIME metadata. It is not a pixel-decode or scientific-content test.

## How to activate scientific images safely
For each candidate image, visually inspect its content, verify its filename/path, document its intended condition and season, and add a row to the `reviewed` array in `js/base-image-registry.js`:
`{id:'BASE01',season:'spring',state:'fair'}` **is an illustrative schema example, NOT an approved mapping**.

The selector supports the four seasons and eight visual health states currently defined by the legacy engine. More precise condition mapping (drought, nutrient stress, oxygen stress, treatment, and soil moisture) requires an extended metadata schema and a reviewed mapping policy.

## Tests to run before merging
- Confirm `window.TurfariumBaseLibrary.assets.length===88` and `reviewedCount===0`.
- Confirm the registry loads before the visual engine, with no console errors.
- Run the standalone asset audit against a deployed preview.
- Confirm lawn A and B images continue to load through legacy fallback; test seasonal progression and replay.
- After approving mappings, confirm each selected BASE photo corresponds to its actual depicted condition; test missing-file fallback.
- Complete full simulator and mobile regression tests.

**Status: integration hook implemented, scientific content mapping and end-to-end tests pending. Do not merge.**
