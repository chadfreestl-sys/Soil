#!/usr/bin/env python3
"""Build three self-contained source bundles for Gumroad from a checked-out Turfarium repository.

Run: python3 scripts/build_gumroad_editions.py
No external Python dependencies. This creates distributable ZIP files in dist/.
The application is client-side software: packages are copyable and NOT DRM-protected.
"""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import re
import shutil
import tempfile

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
EDITION = {
    "homeowner": ("Homeowner", "$3.99", "homeowner"),
    "technician": ("Technician", "$7.99", "technician"),
    "professional": ("Professional + Research / Lab", "$9.99", "professional"),
}
EXCLUDED_DIRS = {".git", ".github", ".venv", "node_modules", "dist", "scripts", "tests", "__pycache__"}
EXCLUDED_SUFFIXES = {".md", ".py", ".yml", ".yaml", ".map", ".log", ".zip"}
EXCLUDED_NAMES = {"index.html", "biology-beta.html", ".gitignore", ".DS_Store"}

def source_files():
    for path in ROOT.rglob("*"):
        if not path.is_file() or any(part in EXCLUDED_DIRS or part.startswith(".") for part in path.relative_to(ROOT).parts):
            continue
        if path.name in EXCLUDED_NAMES or path.suffix.lower() in EXCLUDED_SUFFIXES:
            continue
        yield path

def build(mode, title, price, fixed_mode):
    with tempfile.TemporaryDirectory() as temporary:
        stage = Path(temporary) / "Turfarium"
        stage.mkdir()
        for src in source_files():
            dst = stage / src.relative_to(ROOT)
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)
        lab = stage / "lab.html"
        audience = stage / "audience-modes.js"
        if not lab.exists() or not audience.exists():
            raise RuntimeError("Missing lab.html or audience-modes.js")
        code = audience.read_text(encoding="utf-8")
        needle = "let mode=(params.get('mode')||localStorage.getItem('lslAudienceMode')||'homeowner').toLowerCase();"
        if needle not in code:
            raise RuntimeError("Audience mode selector changed; inspect before packaging")
        code = code.replace(needle, "let mode='" + fixed_mode + "'; // Edition-specific starting view; client-side, not access control")
        if mode == "professional":
            code = code.replace("let mode='professional'; // Edition-specific starting view; client-side, not access control",
                "let mode=(params.get('mode')==='research'?'research':'professional'); // Both included in Professional purchase")
        audience.write_text(code, encoding="utf-8")
        html = lab.read_text(encoding="utf-8")
        # Relative navigation to the public chooser is misleading inside a purchased package.
        html = html.replace("</head>", '<style>.mode-change{display:none!important}</style></head>', 1)
        lab.write_text(html, encoding="utf-8")
        (stage / "START-HERE.html").write_text(
            '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<title>Turfarium ' + title + '</title><style>body{font:17px system-ui;max-width:720px;margin:40px auto;padding:20px;line-height:1.6;color:#183d2a}a{color:#07643c}</style>'
            '<h1>Turfarium — ' + title + '</h1><p>One-time purchase: ' + price + '. Thank you for supporting Turfarium.</p>'
            '<p><a href="lab.html">Open Turfarium</a></p>'
            '<p>Extract the entire ZIP first. Keep all folders together, including assets and images. Open this file in a modern browser. '
            'Some browser features may require serving the folder through a local HTTP server; if you encounter a blank or incomplete display, '
            'run <code>python3 -m http.server 8000</code> from the extracted Turfarium folder and open <code>http://localhost:8000/START-HERE.html</code>.</p>'
            '<p>This is an educational scenario model, not a validated field forecast or treatment recommendation.</p>'
            + ('<p>Research / Lab view is included: <a href="lab.html?mode=research">Open Research / Lab</a>.</p>' if mode == "professional" else '')
            + '</html>', encoding="utf-8")
        (stage / "LICENSE-AND-NOTES.txt").write_text(
            "Turfarium — " + title + "\nOne-time purchase: " + price + "\n"
            "Personal-use license for one purchaser. Do not redistribute the ZIP or resell copies.\n"
            "You may retain and use this purchased edition indefinitely. No subscription.\n"
            "Software is provided as an educational beta, without a guarantee of agronomic accuracy.\n"
            "The downloaded files are not encrypted or DRM-protected.\n", encoding="utf-8")
        DIST.mkdir(exist_ok=True)
        output = DIST / ("Turfarium-" + mode + "-beta.zip")
        with ZipFile(output, "w", ZIP_DEFLATED, compresslevel=6) as archive:
            for f in sorted(stage.rglob("*")):
                if f.is_file():
                    archive.write(f, f.relative_to(stage.parent))
        with ZipFile(output) as archive:
            bad = archive.testzip()
            assert bad is None, "Corrupt ZIP entry: " + str(bad)
            assert "Turfarium/lab.html" in archive.namelist()
            assert "Turfarium/START-HERE.html" in archive.namelist()
        print(f"Built {output.name} ({output.stat().st_size:,} bytes)")

if __name__ == "__main__":
    for key, args in EDITION.items():
        build(key, *args)
