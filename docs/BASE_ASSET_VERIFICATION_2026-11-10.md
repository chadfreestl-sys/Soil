# BASE01–BASE88 repository verification — corrected

**Result: 88 / 88 approved numbered assets located in the repository** on both `main` and the stabilization branch.

- BASE01–BASE63: `assets/turfarium/BASE##/BASE##.webp`
- **BASE64: `assets/turfarium/BASE64/BASE64.png` (PNG, not WebP)**
- BASE65–BASE88: `assets/turfarium/BASE##/BASE##.webp`

The original 87/88 finding was caused by an incorrect assumption that every image used WebP. The exact BASE64 file is present. Git history identifies commit `23261ff184e059673e31f38ffc501a711c6e96b6`, titled **"Rename and organize BASE64 PNG reference"**. The PNG blob SHA is `7aaf4c7c25d10c64e9113f663a8f858e17053cec` on both branches.

**No image was lost, regenerated, replaced, or converted.**

The development branch's `js/base-image-registry.js` and `js/base-image-audit.js` now use the correct PNG path and expected MIME for BASE64.

## Verification scope and remaining gates
GitHub metadata confirms all 88 files exist; this does **not** prove browser delivery, successful pixel decoding, scientific accuracy, or image-to-condition mapping. The standalone browser audit still needs to run on a deployed preview. Human image review and full simulator regression remain pending.

**Do not merge PR #4 before browser tests and scientifically reviewed runtime mappings are completed.**
