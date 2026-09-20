"""Frame the existing V5 demo for social feeds with visible creator credit."""
from pathlib import Path
import subprocess
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "social/v5/teddy-5.0-dan-square.mp4"
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Georgia.ttf", 72)
credit = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 38)
follow = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 30)
decoder = subprocess.Popen([
    "ffmpeg", "-v", "error", "-i", str(ROOT / "v5/assets/teddy-demo.mp4"),
    "-vf", "scale=1080:608", "-f", "rawvideo", "-pix_fmt", "rgb24", "-",
], stdout=subprocess.PIPE)
encoder = subprocess.Popen([
    "ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
    "-s", "1080x1080", "-r", "30", "-i", "-", "-an", "-c:v", "libx264",
    "-crf", "22", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(OUTPUT),
], stdin=subprocess.PIPE)
frame_bytes = 1080 * 608 * 3
count = 0
try:
    while True:
        data = decoder.stdout.read(frame_bytes)
        if not data:
            break
        if len(data) != frame_bytes:
            raise RuntimeError("Incomplete source frame")
        frame = Image.new("RGB", (1080, 1080), "#fff8ed")
        frame.paste(Image.frombytes("RGB", (1080, 608), data), (0, 220))
        draw = ImageDraw.Draw(frame)
        draw.text((70, 85), "Meet Teddy 5.0", font=title, fill="#27332e")
        draw.text((70, 885), "Made by Dan O’Leary", font=credit, fill="#27332e")
        draw.text((70, 945), "Follow @danieloleary", font=follow, fill="#405942")
        encoder.stdin.write(frame.tobytes())
        count += 1
finally:
    decoder.stdout.close()
    encoder.stdin.close()
    decode_result = decoder.wait()
    encode_result = encoder.wait()
if decode_result or encode_result or count != 600:
    raise RuntimeError(f"Render failed: decoder={decode_result}, encoder={encode_result}, frames={count}")
print(f"Rendered {count} frames: {OUTPUT}")
