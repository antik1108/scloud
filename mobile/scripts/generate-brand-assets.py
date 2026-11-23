"""Generates Lumio's placeholder brand assets (a four-point sparkle) into mobile/assets.

Pure standard library (zlib + struct) so it runs anywhere:  python3 scripts/generate-brand-assets.py
Replace with designer-made assets before launch; keep the same filenames.
"""
import os
import struct
import zlib

ASSETS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")
BACKGROUND = (0x0E, 0x0E, 0x10)
ACCENT = (0xB7, 0x9C, 0xFF)
WHITE = (0xFF, 0xFF, 0xFF)
SAMPLES = 3  # supersampling per axis for anti-aliasing


def sparkle_coverage(size, radius_ratio):
    """Coverage (0..1) per pixel of a four-point star: |x|^p + |y|^p <= 1 with p < 1."""
    p = 0.55
    r = size * radius_ratio
    c = size / 2
    cov = []
    step = 1 / SAMPLES
    for y in range(size):
        row = []
        for x in range(size):
            hits = 0
            for sy in range(SAMPLES):
                dy = abs((y + (sy + 0.5) * step - c) / r)
                if dy > 1:
                    continue
                for sx in range(SAMPLES):
                    dx = abs((x + (sx + 0.5) * step - c) / r)
                    if dx <= 1 and dx**p + dy**p <= 1:
                        hits += 1
            row.append(hits / (SAMPLES * SAMPLES))
        cov.append(row)
    return cov


def write_png(path, size, pixel):
    """pixel(x, y) -> (r, g, b, a). Writes an 8-bit RGBA PNG."""
    raw = bytearray()
    for y in range(size):
        raw.append(0)
        for x in range(size):
            raw.extend(pixel(x, y))

    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    png += chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(png)
    print("wrote", os.path.relpath(path))


def mix(a, b, t):
    return tuple(round(a[i] * (1 - t) + b[i] * t) for i in range(3))


def on_background(size, radius_ratio, color):
    cov = sparkle_coverage(size, radius_ratio)
    return lambda x, y: (*mix(BACKGROUND, color, cov[y][x]), 255)


def transparent(size, radius_ratio, color):
    cov = sparkle_coverage(size, radius_ratio)
    return lambda x, y: (*color, round(255 * cov[y][x]))


def main():
    jobs = [
        ("icon.png", 1024, on_background(1024, 0.34, ACCENT)),
        ("splash-icon.png", 512, transparent(512, 0.48, ACCENT)),
        ("android-icon-foreground.png", 512, transparent(512, 0.22, ACCENT)),
        ("android-icon-background.png", 512, lambda x, y: (*BACKGROUND, 255)),
        ("android-icon-monochrome.png", 432, transparent(432, 0.22, WHITE)),
        ("favicon.png", 48, on_background(48, 0.4, ACCENT)),
    ]
    for name, size, pixel in jobs:
        write_png(os.path.join(ASSETS, name), size, pixel)


if __name__ == "__main__":
    main()
