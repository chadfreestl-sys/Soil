# BASE01–BASE88 repository path verification — 2026-11-10

Checked each of the 88 expected image paths using GitHub's file API against branch `turfarium/stabilization-2026-11-10`.

- **87 / 88 paths found.**
- **Missing:** `assets/turfarium/BASE64/BASE64.webp` — GitHub returned HTTP 404.
- All other expected paths (BASE01–BASE63 and BASE65–BASE88) returned file metadata.

This verifies repository presence, **not** browser delivery, WebP decoding, visual content, file integrity, or scientific condition mapping.

## Required fix
Locate the approved BASE64 source image, verify its identity, and upload it to `assets/turfarium/BASE64/BASE64.webp`. Do not substitute a different numbered image or generate a replacement without explicit approval.

## Remaining release gates
1. Restore BASE64 and repeat 88-path check.
2. Run `base-image-audit.html` on deployed preview for HTTP/MIME checks.
3. Review and annotate all 88 images using `base-image-review.html`.
4. Promote approved metadata into `js/base-image-registry.js`; presently **zero** reviewed runtime mappings.
5. Run browser regression on `lab.html`, rhizosphere lab, replay, saved states, treatment history, seasonal and five-year progression, mobile layout.

**Do not merge draft PR #4 until these are resolved.**
