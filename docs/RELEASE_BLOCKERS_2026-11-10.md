# Release blocker audit — 2026-11-10

## Concrete fixes completed on stabilization branch
- The visual snapshot now passes the model's actual `site.moist` value as `moisture`. Previously the new drought/waterlogging classifier had no moisture input and could not detect those conditions through the normal snapshot bridge.
- The shared species selector exposes only **Tall fescue**.
- Visible starting and A/B mowing inputs now specify a 2.5–4.5 inch range.
- Golf-labeled material options (`humicgolf`, `crf`, `foliarN`, `golfwet`) were removed from the main simulator HTML option menus.

## Important remaining engineering limitations
- The legacy simulation code still contains definitions and branches for other grass species and golf-specific material IDs. Hiding UI options does **not** remove the underlying implementation, validate restored saved states, or constrain every secondary control.
- HTML input min/max alone does not enforce bounds for scripts, imported state, or programmatic changes. Runtime input validation is still required.
- Stress thresholds in the visual engine are heuristic indices, not calibrated measurements. Their semantics must be checked against the `site.moist`, `oxygenReserve`, and `comp` scales.
- BASE imagery still has zero scientifically approved runtime mappings.
- No full five-year numerical regression, end-to-end browser test, HTTP image audit on a preview deployment, or mobile acceptance test has been completed.
- Production `main` is unchanged; no commercial launch or access control is configured.

## Release gate
Do not merge this branch to production until the remaining controls are enforced at the model boundary, five-year simulations and save/restore pass, and scientific image mapping is independently reviewed.
