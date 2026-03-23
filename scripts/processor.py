import os, cv2, json, uuid, datetime
from pathlib import Path
from PIL import Image, ImageOps

SRC = Path(r"D:\OneDrive\mer")
OUT = Path(r"D:\material_wedding")
MANIFEST_OUT = Path("public/wedding_manifest.json")

SECTIONS = ["А якщо", "Разом", "Любити", "Життя", "По справжньому", "Радіти", "Мріяти"]
SECTION_ID_MAP = {
    "А якщо": "ayakscho",
    "Разом": "razom",
    "Любити": "lyubyty",
    "Життя": "zhyttya",
    "По справжньому": "pospravzhnomu",
    "Радіти": "radity",
    "Мріяти": "mriyaty"
}

def process():
    OUT.mkdir(parents=True, exist_ok=True)
    for s in SECTIONS:
        (OUT / s).mkdir(parents=True, exist_ok=True)

    exts = {'.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov'}
    files = sorted(
        [f for f in SRC.rglob('*') if f.suffix.lower() in exts],
        key=lambda x: x.stat().st_mtime
    )
    chunk = max(1, len(files) // len(SECTIONS))
    manifest_items = []

    for i, f in enumerate(files):
        sec = SECTIONS[min(i // chunk, len(SECTIONS) - 1)]
        is_vid = f.suffix.lower() in {'.mp4', '.mov'}

        if not is_vid:
            name = f"ci_{uuid.uuid4().hex[:8]}.webp"
            try:
                with Image.open(f) as im:
                    im = ImageOps.exif_transpose(im)
                    im = ImageOps.autocontrast(im)
                    im.thumbnail((2048, 2048), Image.LANCZOS)
                    im.save(OUT / sec / name, "WEBP", quality=82, method=6)
            except Exception as e:
                print(f"[SKIP] {f.name}: {e}")
                continue
        else:
            name = f"ci_{uuid.uuid4().hex[:8]}.mp4"
            try:
                cap = cv2.VideoCapture(str(f))
                fps = cap.get(cv2.CAP_PROP_FPS) or 30
                max_frames = int(fps * 15)
                fourcc = cv2.VideoWriter_fourcc(*'mp4v')
                ret, frame = cap.read()
                if not ret:
                    cap.release()
                    continue
                h, w = frame.shape[:2]
                out_vid = cv2.VideoWriter(str(OUT / sec / name), fourcc, fps, (w, h))
                count = 0
                while ret and count < max_frames:
                    out_vid.write(frame)
                    ret, frame = cap.read()
                    count += 1
                cap.release()
                out_vid.release()
            except Exception as e:
                print(f"[SKIP] {f.name}: {e}")
                continue

        manifest_items.append({
            "section": sec,
            "file": name,
            "type": "video" if is_vid else "image"
        })
        print(f"[OK] {sec}/{name}")

    manifest = {
        "_version": "1.0.0",
        "_generated": datetime.datetime.utcnow().isoformat() + "Z",
        "sections": SECTIONS,
        "items": manifest_items
    }

    MANIFEST_OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(MANIFEST_OUT, "w", encoding="utf-8") as mf:
        json.dump(manifest, mf, indent=2, ensure_ascii=False)

    print(f"\n[DONE] {len(manifest_items)} items → {MANIFEST_OUT}")

if __name__ == "__main__":
    process()
