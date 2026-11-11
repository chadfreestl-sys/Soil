# Turfarium stabilization audit — 2026-11-10

## Safety
Work on `turfarium/stabilization-2026-11-10` only until integration and regression tests pass. Preserve the existing main branch and all scientific images. Do not remove old assets until usage is traced.

## Verified from current repository
- `index.html` is a landing page, not the simulator runtime; it links to `lab.html`.
- `lab.html` loads 27 external JavaScript modules (including the legacy visual-state module).
- `turfarium-visual-state-v3-2.js` defines eight turf-health image states with old `images/file_*.png` candidates.
- `turfarium-build-status.js` currently reports build `25.0.0` and tests layout elements; the HTML references it with query version `25.1.0`. This is a version-label mismatch, not necessarily a runtime failure.
- The visual-state module itself warns that its photographs are illustrative rather than validated predictions.

## Required integration gates
1. Inventory every script loaded by `lab.html`, its global exports, DOM hooks, and dependencies. Identify competing image writers before modifying.
2. Locate the authoritative BASE01–BASE88 manifest; verify each asset's exact repository path, nonempty file content, and browser-loadable URL.
3. Establish a single visual-state selector that maps simulation state to images; define deterministic fallbacks and preserve the illustrative disclaimer.
4. Verify tall-fescue-only configuration throughout species selectors, mowing logic, treatment menus, saved states, and five-year scenarios.
5. Run unit and browser smoke tests: initialization, advancing time, repeat applications, two-lawn comparison, save/load, image transitions, missing assets, and mobile layout.
6. Update build/version labels together and document rollback instructions.

## Known risks / not yet verified
- The 88-image library may exist without being connected to the active visual-state engine.
- The active script chain is large and potentially overlapping; no scripts should be deleted on the basis of filename alone.
- No full browser simulation or 88-image network audit has yet been executed.

## Acceptance criteria
- No broken image requests for all supported states.
- Exactly one authoritative state-to-image decision per lawn per timestep.
- Reproducible five-year runs with no exceptions and documented model assumptions.
- No golf-specific inputs or other active turf species.
- Main branch remains untouched until reviewed.
