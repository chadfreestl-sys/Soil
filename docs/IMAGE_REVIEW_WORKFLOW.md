# Scientific image classification workflow

The BASE01–BASE88 catalog is available at `image-library.html`. The review workbench is `base-image-review.html`.

1. Run `base-image-audit.html` against a deployed preview; confirm all 88 paths return the expected image MIME. BASE64 is PNG, all other numbered files are WebP.
2. Open `base-image-review.html` and inspect the actual pixels of each image. The approval checkbox remains disabled until the current image loads.
3. Record the visibly depicted condition, applicable season, health state **only if supported**, and evidence/limitations. The image number alone is not a condition label.
4. Export the JSON to retain work across devices. Import restores notes but **clears approvals**, requiring the image to be inspected again. Browser localStorage is not a shared database.
5. After scientific review, separately prepare and peer-check the runtime mapping manifest. The active registry intentionally contains zero approved mappings; fallback seasonal imagery remains in use.
6. Test the mapped condition against actual simulation scenarios, including drought, waterlogging, seasonal transition, recovery and replay. Never claim scientific accuracy solely from a matching illustration.

## Current gates
- All 88 assets exist in GitHub (BASE64 is PNG); browser delivery and decoding still require real deployed testing.
- Human scientific classification and runtime mapping remain incomplete.
- Cross-browser tests, full simulation regression, Gumroad licensing and production deployment remain pending.
- The AI integration is disabled in the standalone browser edition.
- Cloudflare production on `main` is unchanged; work is confined to the stabilization branch.
