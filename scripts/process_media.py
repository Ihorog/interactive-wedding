#!/usr/bin/env python3
"""
process_media.py — Autonomous media-archive processor for the interactive-wedding project.

Usage:
    python scripts/process_media.py --input /path/to/raw_media [--output public/media] [--manifest public/wedding_manifest.json]

Algorithm:
1. Scan INPUT recursively for supported photo/video files.
2. Sort all files by st_mtime (modification time) — the "story timeline".
3. Split the sorted list into 7 equal time-based chunks, each mapped to a story section.
4. Score every file for sharpness:
   - Photo  → Laplacian variance (cv2.Laplacian)
   - Video  → average Laplacian variance of 10 evenly-spaced sampled frames
5. Select the TOP-30 (LIMIT_PER_SECTION) files per section by sharpness score.
6. Transform selected files:
   - Photo  → EXIF auto-rotate, autocontrast, resize ≤ 2048 px (long edge), save WebP @ 82 %
   - Video  → trim to 15 s, resize to 1920 px width, smart audio:
               * RMS > 0.03  → normalize audio
               * RMS ≤ 0.03  → strip audio (mute)
7. Write output to OUTPUT/<section_slug>/<uuid>.<ext>
8. Generate manifest at MANIFEST path (default: public/wedding_manifest.json).

Requirements:
    pip install opencv-python-headless Pillow moviepy numpy
"""

import argparse
import datetime
import json
import logging
import math
import os
import random
import uuid
from pathlib import Path
from typing import Dict, List, Tuple

import cv2
import numpy as np
from PIL import Image, ImageOps

# ---------------------------------------------------------------------------
# MoviePy version compatibility (detect once at module level)
# ---------------------------------------------------------------------------

try:
    from moviepy import VideoFileClip as _VideoFileClip  # type: ignore  # v2
    _MOVIEPY_V2 = True
except ImportError:
    try:
        from moviepy.editor import VideoFileClip as _VideoFileClip  # type: ignore  # v1
        _MOVIEPY_V2 = False
    except ImportError:
        _VideoFileClip = None  # type: ignore
        _MOVIEPY_V2 = False

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SECTIONS: List[Dict] = [
    {"name": "А якщо",        "slug": "ayakscho"},
    {"name": "Разом",         "slug": "razom"},
    {"name": "Любити",        "slug": "lyubyty"},
    {"name": "Життя",         "slug": "zhyttya"},
    {"name": "По справжньому","slug": "pospravzhnomu"},
    {"name": "Радіти",        "slug": "radity"},
    {"name": "Мріяти",        "slug": "mriyaty"},
]

LIMIT_PER_SECTION = 30          # TOP-N per section
VIDEO_SAMPLE_FRAMES = 10        # frames to sample for video sharpness
PHOTO_MAX_SIDE = 2048           # px — resize long edge
PHOTO_WEBP_QUALITY = 82         # %
VIDEO_MAX_SECONDS = 15          # trim duration
VIDEO_MAX_WIDTH = 1920          # resize width
AUDIO_RMS_THRESHOLD = 0.03      # below → mute; above → normalize

PHOTO_EXTENSIONS = {".jpg", ".jpeg", ".png", ".tiff", ".tif", ".bmp", ".heic", ".heif"}
VIDEO_EXTENSIONS = {".mp4", ".mov", ".avi", ".mkv", ".mts", ".m2ts", ".wmv", ".3gp"}

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Discovery & scanning
# ---------------------------------------------------------------------------


def collect_files(input_dir: Path) -> List[Path]:
    """Recursively collect all supported media files."""
    supported = PHOTO_EXTENSIONS | VIDEO_EXTENSIONS
    files = [
        p for p in input_dir.rglob("*")
        if p.is_file() and p.suffix.lower() in supported
    ]
    log.info("Found %d media files in %s", len(files), input_dir)
    return files


def sort_by_mtime(files: List[Path]) -> List[Path]:
    """Sort files by modification time (ascending)."""
    return sorted(files, key=lambda p: p.stat().st_mtime)


# ---------------------------------------------------------------------------
# Sharpness scoring
# ---------------------------------------------------------------------------


def laplacian_variance(gray: np.ndarray) -> float:
    """Return Laplacian variance (sharpness indicator)."""
    return float(cv2.Laplacian(gray, cv2.CV_64F).var())


def score_photo(path: Path) -> float:
    """Compute sharpness score for a photo using Laplacian variance."""
    try:
        img = cv2.imread(str(path), cv2.IMREAD_GRAYSCALE)
        if img is None:
            return 0.0
        return laplacian_variance(img)
    except Exception as exc:  # noqa: BLE001
        log.debug("score_photo error %s: %s", path.name, exc)
        return 0.0


def score_video(path: Path) -> float:
    """Compute average sharpness score across VIDEO_SAMPLE_FRAMES random frames."""
    try:
        cap = cv2.VideoCapture(str(path))
        if not cap.isOpened():
            return 0.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total_frames < 1:
            cap.release()
            return 0.0
        n = max(1, min(VIDEO_SAMPLE_FRAMES, total_frames))
        sample_indices = sorted(random.sample(range(total_frames), n))
        scores: List[float] = []
        for idx in sample_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
            ret, frame = cap.read()
            if not ret:
                continue
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            scores.append(laplacian_variance(gray))
        cap.release()
        return float(np.mean(scores)) if scores else 0.0
    except Exception as exc:  # noqa: BLE001
        log.debug("score_video error %s: %s", path.name, exc)
        return 0.0


def score_file(path: Path) -> float:
    """Dispatch sharpness scoring based on file type."""
    if path.suffix.lower() in PHOTO_EXTENSIONS:
        return score_photo(path)
    return score_video(path)


# ---------------------------------------------------------------------------
# Section assignment (temporal chunking)
# ---------------------------------------------------------------------------


def assign_sections(
    sorted_files: List[Path],
) -> Dict[str, List[Tuple[Path, float]]]:
    """
    Divide sorted_files into 7 equal chunks and score each file.
    Returns {section_slug: [(path, score), ...]}
    """
    n = len(sorted_files)
    num_sections = len(SECTIONS)
    chunk_size = math.ceil(n / num_sections) if n > 0 else 0

    section_map: Dict[str, List[Tuple[Path, float]]] = {
        s["slug"]: [] for s in SECTIONS
    }

    for i, path in enumerate(sorted_files):
        section_idx = min(i // chunk_size, num_sections - 1) if chunk_size > 0 else 0
        slug = SECTIONS[section_idx]["slug"]
        score = score_file(path)
        section_map[slug].append((path, score))
        if (i + 1) % 100 == 0:
            log.info("Scored %d / %d files …", i + 1, n)

    return section_map


# ---------------------------------------------------------------------------
# Selection
# ---------------------------------------------------------------------------


def select_top(
    section_map: Dict[str, List[Tuple[Path, float]]],
    limit: int = LIMIT_PER_SECTION,
) -> Dict[str, List[Path]]:
    """Keep TOP-<limit> files per section by sharpness score."""
    result: Dict[str, List[Path]] = {}
    for slug, items in section_map.items():
        top = sorted(items, key=lambda x: x[1], reverse=True)[:limit]
        result[slug] = [p for p, _ in top]
        log.info("Section %-15s → selected %d / %d files", slug, len(result[slug]), len(items))
    return result


# ---------------------------------------------------------------------------
# Photo transformation
# ---------------------------------------------------------------------------


def _resize_keep_aspect(img: Image.Image, max_side: int) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_side:
        return img
    if w >= h:
        new_w = max_side
        new_h = round(h * max_side / w)
    else:
        new_h = max_side
        new_w = round(w * max_side / h)
    return img.resize((new_w, new_h), Image.LANCZOS)


def process_photo(src: Path, dst: Path) -> bool:
    """
    Transform a photo:
      1. EXIF auto-rotate (ImageOps.exif_transpose)
      2. Autocontrast
      3. Resize ≤ PHOTO_MAX_SIDE px (long edge)
      4. Save as WebP @ PHOTO_WEBP_QUALITY %
    Returns True on success.
    """
    try:
        with Image.open(src) as img:
            img = ImageOps.exif_transpose(img)
            img = img.convert("RGB")
            img = ImageOps.autocontrast(img)
            img = _resize_keep_aspect(img, PHOTO_MAX_SIDE)
            dst.parent.mkdir(parents=True, exist_ok=True)
            img.save(dst, format="WEBP", quality=PHOTO_WEBP_QUALITY, method=4)
        return True
    except Exception as exc:  # noqa: BLE001
        log.warning("process_photo SKIP %s: %s", src.name, exc)
        return False


# ---------------------------------------------------------------------------
# Audio helpers
# ---------------------------------------------------------------------------


def _compute_rms(audio_array: np.ndarray) -> float:
    """Compute RMS energy of an audio array (float)."""
    return float(np.sqrt(np.mean(audio_array.astype(np.float64) ** 2)))


# ---------------------------------------------------------------------------
# Video transformation
# ---------------------------------------------------------------------------


def process_video(src: Path, dst: Path) -> bool:
    """
    Transform a video:
      1. Trim to first VIDEO_MAX_SECONDS seconds
      2. Resize width to VIDEO_MAX_WIDTH (height auto, even)
      3. Smart audio:
           RMS > AUDIO_RMS_THRESHOLD → normalize
           RMS ≤ AUDIO_RMS_THRESHOLD → mute (strip audio)
      4. Encode H.264 MP4

    Returns True on success.
    """
    if _VideoFileClip is None:
        log.error("MoviePy is not installed. Run: pip install moviepy")
        return False

    clip = None
    try:
        dst.parent.mkdir(parents=True, exist_ok=True)
        clip = _VideoFileClip(str(src), audio=True)

        # 1. Trim
        duration = min(clip.duration, VIDEO_MAX_SECONDS)
        clip = clip.subclipped(0, duration) if _MOVIEPY_V2 else clip.subclip(0, duration)

        # 2. Resize
        orig_w = clip.w
        if orig_w > VIDEO_MAX_WIDTH:
            scale = VIDEO_MAX_WIDTH / orig_w
            new_w = VIDEO_MAX_WIDTH
            new_h = int(clip.h * scale)
            new_h = new_h if new_h % 2 == 0 else new_h + 1  # ensure even height
            clip = clip.resized((new_w, new_h)) if _MOVIEPY_V2 else clip.resize((new_w, new_h))

        # 3. Smart audio
        audio = clip.audio
        if audio is not None:
            audio_arr = audio.to_soundarray(fps=22050)
            rms = _compute_rms(audio_arr)
            if rms > AUDIO_RMS_THRESHOLD:
                # Normalize: scale so RMS reaches a reasonable level
                target_rms = 0.1
                gain = target_rms / (rms + 1e-9)
                gain = min(gain, 10.0)  # safety cap
                clip = clip.with_volume_scaled(gain) if _MOVIEPY_V2 else clip.volumex(gain)
                log.debug("Audio normalized (gain=%.2f, rms=%.4f) for %s", gain, rms, src.name)
            else:
                # Mute — strip audio track
                clip = clip.without_audio()
                log.debug("Audio muted (rms=%.4f) for %s", rms, src.name)

        clip.write_videofile(
            str(dst),
            codec="libx264",
            audio_codec="aac",
            preset="fast",
            ffmpeg_params=["-crf", "23"],
            logger=None,
        )
        clip.close()
        return True
    except Exception as exc:  # noqa: BLE001
        log.warning("process_video SKIP %s: %s", src.name, exc)
        if clip is not None:
            try:
                clip.close()
            except Exception:  # noqa: BLE001
                pass
        return False


# ---------------------------------------------------------------------------
# Output + manifest
# ---------------------------------------------------------------------------


def _media_type(path: Path) -> str:
    return "video" if path.suffix.lower() in VIDEO_EXTENSIONS else "image"


def process_and_build_manifest(
    selected: Dict[str, List[Path]],
    output_dir: Path,
) -> List[Dict]:
    """
    For each selected file: transform it and collect manifest entry.
    Returns list of manifest dicts.
    """
    manifest: List[Dict] = []

    section_lookup = {s["slug"]: s["name"] for s in SECTIONS}

    for slug, paths in selected.items():
        section_name = section_lookup[slug]
        section_dir = output_dir / slug
        section_dir.mkdir(parents=True, exist_ok=True)

        for src in paths:
            file_uuid = str(uuid.uuid4())
            media_type = _media_type(src)

            if media_type == "image":
                out_ext = ".webp"
                dst = section_dir / f"{file_uuid}{out_ext}"
                ok = process_photo(src, dst)
            else:
                out_ext = ".mp4"
                dst = section_dir / f"{file_uuid}{out_ext}"
                ok = process_video(src, dst)

            if ok:
                manifest.append({
                    "section": section_name,
                    "slug": slug,
                    "file": dst.name,
                    "type": media_type,
                    "original": src.name,
                })
                log.info("✓ %s → %s/%s", src.name, slug, dst.name)
            else:
                log.warning("✗ Skipped: %s", src.name)

    return manifest


def write_manifest(manifest: List[Dict], manifest_path: Path) -> Path:
    """Serialize manifest to the given manifest_path as { items: [...] }."""
    full_manifest = {
        "_version": "1.0.0",
        "_generated": datetime.datetime.utcnow().isoformat() + "Z",
        "_comment": "Generated by scripts/process_media.py — do not edit manually",
        "sections": [s["name"] for s in SECTIONS],
        "items": manifest,
    }
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    with open(manifest_path, "w", encoding="utf-8") as fh:
        json.dump(full_manifest, fh, ensure_ascii=False, indent=2)
    log.info("Manifest written → %s (%d entries)", manifest_path, len(manifest))
    return manifest_path


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Automated media-archive processor for the interactive-wedding project."
    )
    parser.add_argument(
        "--input", "-i",
        required=True,
        type=Path,
        help="Path to the directory containing raw media files (recursive scan).",
    )
    parser.add_argument(
        "--output", "-o",
        default=Path("public/media"),
        type=Path,
        help="Path to the output directory for processed media (default: public/media).",
    )
    parser.add_argument(
        "--manifest", "-m",
        default=Path("public/wedding_manifest.json"),
        type=Path,
        help="Path for the manifest JSON file (default: public/wedding_manifest.json).",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=LIMIT_PER_SECTION,
        help=f"Maximum files to select per section (default: {LIMIT_PER_SECTION}).",
    )
    parser.add_argument(
        "--seed",
        type=int,
        default=42,
        help="Random seed for reproducible video frame sampling (default: 42).",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Enable DEBUG-level logging.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)

    random.seed(args.seed)

    input_dir: Path = args.input.resolve()
    output_dir: Path = args.output.resolve()
    manifest_path: Path = args.manifest.resolve()

    if not input_dir.is_dir():
        log.error("Input directory does not exist: %s", input_dir)
        raise SystemExit(1)

    output_dir.mkdir(parents=True, exist_ok=True)
    log.info("Input   : %s", input_dir)
    log.info("Output  : %s", output_dir)
    log.info("Manifest: %s", manifest_path)

    # Step 1 — discover
    files = collect_files(input_dir)
    if not files:
        log.warning("No supported media files found in %s", input_dir)
        raise SystemExit(0)

    # Step 2 — sort by mtime (story timeline)
    files = sort_by_mtime(files)

    # Step 3 — assign to sections + score
    log.info("Scoring %d files across %d sections …", len(files), len(SECTIONS))
    section_map = assign_sections(files)

    # Step 4 — select TOP-N per section
    selected = select_top(section_map, limit=args.limit)

    # Step 5 — transform + build manifest
    log.info("Transforming selected files …")
    manifest = process_and_build_manifest(selected, output_dir)

    # Step 6 — write manifest
    write_manifest(manifest, manifest_path)

    total = len(manifest)
    log.info("Done. %d files processed → %s", total, output_dir)


if __name__ == "__main__":
    main()
