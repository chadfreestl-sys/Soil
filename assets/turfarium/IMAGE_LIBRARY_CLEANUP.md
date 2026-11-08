# Turfarium BASE image library — v1 cleanup checkpoint

**Status: development branch only. Not production-ready.**

## Inventory rules
- The manifest at `assets/turfarium/base-manifest.v1.json` contains 88 expected IDs, not 88 verified files.
- `status: "path-verified"` means a file was read from GitHub at that path. It does **not** prove byte-for-byte identity with the approved image export.
- `approved: true` records the user's approval of the scenario/revision; a SHA comparison remains necessary before claiming exact artifact identity.
- Unknown scenarios remain `null`; never infer season, moisture, biology, or root state from numbering.
- BASE24 and BASE34 are unresolved. Compaction and root-zone recovery are *proposals*, not historical facts.
- BASE64 exists as a PNG; do not delete or replace it before verified WebP conversion.
- Never delete, rename, or overwrite images based only on duplicate appearance or missing metadata.

## Selection safeguards
The experimental `turfarium-image-selector-v4.js` selects only records with:
1. `approved === true`
2. `status === "path-verified"`
3. A nonempty `src`
4. Explicit, nonempty calibrated `conditions`

As the manifest currently has no calibrated conditions, **the selector intentionally returns no image**. Existing production visual engine must remain the fallback until metadata is validated and integration is tested.

## Performance acceptance gates
- Audit scroll handlers, layout thrashing, large DOM updates, image decode and memory usage on a midrange Android phone.
- Do not run LLM inference, file probing, or image scoring during scroll/animation frames.
- Lazy-load offscreen assets, prefetch only the likely next visual, use stable image dimensions, and avoid decoding multiple full-size images concurrently.
- Profile actual FPS, long tasks, LCP, CLS, network bytes and memory before claiming speed improvements.
- Test image transitions, 0/30/60/90/180/540-day states, five-year timeline, and independent lawn panels.
- Keep all cleanup on the development branch until verified and explicitly approved for production.

## Next work
1. Audit all BASE01–88 paths, including alternate extensions, and compare binary SHAs with approved exports when available.
2. Recover historical assignments for BASE24/BASE34, or approve replacement scenarios explicitly.
3. Calibrate each image's `conditions` using observed visual traits and scientifically plausible state boundaries.
4. Run mobile performance benchmarks, integrate the selector behind a feature flag, and compare against the current v3 renderer.
5. Create a reviewable deletion list with references and rollback plan; do not delete assets without evidence they are unused.
