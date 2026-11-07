# Turfarium visual library + performance audit (2026-11-07)

**Status:** Investigation only. No approved BASE images deleted or replaced. No runtime code changed.

## Coordination model: cleanup crew
These are **review workstreams coordinated by the lead assistant**, not independently running autonomous agents. Only the lead approves repository writes.

| Workstream | Scope | Deliverable | Release gate |
|---|---|---|---|
| Asset custodian | Inventory BASE01–BASE88, find alternate locations, identify byte-identical duplicates, preserve approved revisions | SHA/path/size/dimensions manifest | No deletion without provenance and usage checks |
| Visual scientist | Classify season, canopy, moisture, soil structure, roots, visible organisms; distinguish inferred from visible | Versioned metadata schema | No treatment-to-greenup shortcuts |
| Performance reviewer | Scroll profiling, event listeners, observers, intervals, decoding, image payload | Measured before/after metrics | Test midrange Android |
| UX reviewer | Mobile scroll, stage transitions, readability, interaction latency, accessibility | Reproduction checklist | No layout regression |
| Integration reviewer | Map simulation state to assets with deterministic fallbacks | Selector tests and image-load coverage | A/B lawns + replay + five-year scenarios |

## Verified code observations
- `lab.html` loads `turfarium-visual-state-v3-2.js`.
- That script constructs paths like `images/seasons/<season>/state-05-healthy.webp` and falls back to older PNGs; it does **not** reference `assets/turfarium/BASE##/BASE##.webp`.
- When canopy metrics exist, its photo state score is canopyCover 52%, tillerDensity 24%, leafArea 12%, vigor 12%. This score is illustrative, not a calibrated physical prediction.
- `turfarium-stacked-view-v1.js` includes periodic UI synchronization at 1300 ms and several temporary polling intervals; inspect whether periodic work can be event-driven.
- `turfarium-clean-photo.js` and the visual-state script both use MutationObservers. Profile observer callbacks before altering them.
- Expected paths `assets/turfarium/BASE24/BASE24.webp` and `assets/turfarium/BASE88/BASE88.webp` returned 404 through GitHub connector. `BASE69` at its expected path produced a binary decoding error, consistent with a non-text asset but **not** image validation.
- Previous seven-path gap list is a **lead**, not yet a repository-wide confirmed inventory.

## Performance design requirements
1. No LLM call during scroll, animation frames, or image selection. LLM is optional orchestration/explanation, never the deterministic simulation's frame loop.
2. Precompute metadata and index once. Select from cached records using compact numeric state vectors; memoize candidate ranking by quantized state and season.
3. Use thumbnail/previews for browsing; load only the two visible full-size lawn assets and optionally one likely next image per lawn. Decode off critical interaction path where supported.
4. Avoid repeated image downloads via stable URLs, appropriate cache headers and bounded decoded-image memory.
5. Throttle or eliminate recurring DOM scans and MutationObserver feedback loops. Use explicit simulation state-change events.
6. Respect reduced-motion preferences; avoid full-stage repaints or forced synchronous layout during scroll.
7. Measure scroll FPS / long tasks, LCP, image bytes, heap growth, selection latency, and missing asset rates on mobile before claiming improvements.
8. Preserve independent A/B state, replay snapshots, season mapping, and missing-image fallback.

## Asset deletion policy
- First inventory all paths and record blob SHA, dimensions, byte size, source/approval provenance, and references.
- Label candidates `active`, `approved-unintegrated`, `duplicate`, `obsolete`, or `unknown`.
- Never equate `unused today` with `safe to delete`: BASE assets are an intended future dependency.
- Move questionable assets to an archival branch or retain in Git history before any destructive change.
- Delete only after visual review, code reference scan, duplicate verification, and regression tests. Never replace a locked BASE revision with an unverified one.

## Next implementation sequence
1. Produce full repository tree / manifest; locate missing and misnamed BASE assets.
2. Establish browser performance baseline and isolate the scroll bottleneck.
3. Create metadata schema and manifest with file existence validation.
4. Implement selector as a standalone testable module behind a feature flag.
5. Test with A/B lawns, treatment histories, season boundaries, replay and slow networks.
6. Roll out to production only after measurable performance and image-coverage acceptance.
