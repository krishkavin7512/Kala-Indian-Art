"""Append a version query to local .css/.js references in every HTML page
so browsers always fetch the latest build. Run before each deploy."""
import pathlib, re, time

ROOT = pathlib.Path(__file__).resolve().parent.parent
v = str(int(time.time()))
for page in ROOT.rglob("*.html"):
    if "node_modules" in page.parts:
        continue
    s = page.read_text(encoding="utf-8")
    s2 = re.sub(r'((?:src|href)="(?:\.\./)?assets/[^"?]+\.(?:js|css))(?:\?v=\d+)?"', lambda m: f'{m.group(1)}?v={v}"', s)
    if s2 != s:
        page.write_text(s2, encoding="utf-8")
        print("versioned", page.relative_to(ROOT))
