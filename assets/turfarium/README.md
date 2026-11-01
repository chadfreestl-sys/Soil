# Turfarium image asset workflow

## Approved images

BASE01–BASE20 have been approved. The consolidated source archive is `Turfarium_Master_BASE01-20_Verified.zip` (currently held outside GitHub). The repository's `assets/turfarium-image-manifest.json` records approval metadata. **The image binaries have not yet been committed.**

## Going forward

1. Generate one image at a time, then visually review scientific fidelity.
2. On explicit approval, retain the exact original PNG and create an optimized WebP.
3. Record file SHA-256, pixel dimensions, image ID, title, approval status and source filename in the manifest.
4. Commit both images under `assets/turfarium/BASE##/BASE##.png` and `assets/turfarium/BASE##/BASE##.webp`, plus the updated manifest, in the same Git commit. Confirm the files are visible in the GitHub repository before saying the push succeeded.
5. Prefer Git LFS for large PNGs when supported by the deployment workflow; otherwise consider storing only optimized WebPs in the deployed site and archiving full-resolution PNGs separately.
6. Never mark an image as present in GitHub solely because its metadata was committed.

## Backfill

BASE01–BASE20 image binaries remain to be pushed. The current archive is approximately 79 MB and contains both PNG and WebP versions.
