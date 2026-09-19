#!/usr/bin/env python3
"""Build and verify a deterministic two-file Teddy package; install with recovery.

No network, subprocesses, executable package contents, or implicit home writes.
An install requires an explicit destination and the expected archive digest.
"""
import argparse
import hashlib
import io
import json
import os
from pathlib import Path
import shutil
import stat
import tempfile
import zipfile
from PIL import Image

FILES = {"teddy/pet.json", "teddy/spritesheet.webp"}
LIMIT = 20 * 1024 * 1024

def digest(data):
    return hashlib.sha256(data).hexdigest()

def encode(value):
    return (json.dumps(value, indent=2, ensure_ascii=False) + "\n").encode()

def validate_files(files):
    if set(files) != FILES:
        raise ValueError("Package must contain only teddy/pet.json and teddy/spritesheet.webp")
    pet = json.loads(files["teddy/pet.json"])
    if set(pet) != {"id", "displayName", "description", "spriteVersionNumber", "spritesheetPath"}:
        raise ValueError("Unexpected or missing pet metadata")
    if pet["id"] != "teddy" or pet["spritesheetPath"] != "spritesheet.webp":
        raise ValueError("Unsafe pet id or spritesheet path")
    if type(pet["spriteVersionNumber"]) is not int or pet["spriteVersionNumber"] != 2:
        raise ValueError("Teddy 5 requires sprite format 2")
    for key in ("displayName", "description"):
        if not isinstance(pet[key], str) or not pet[key].strip() or len(pet[key]) > 500:
            raise ValueError("Invalid pet text metadata")
    with Image.open(io.BytesIO(files["teddy/spritesheet.webp"])) as image:
        if image.format != "WEBP" or image.size != (1536, 2288) or getattr(image, "n_frames", 1) != 1:
            raise ValueError("Expected a static 1536x2288 WebP atlas")
        if "A" not in image.getbands():
            raise ValueError("Atlas requires transparency")
        image.load()
    return pet

def verify(archive, expected):
    raw = Path(archive).read_bytes()
    if len(raw) > LIMIT or digest(raw) != expected.lower():
        raise ValueError("Archive size or SHA-256 does not match")
    with zipfile.ZipFile(io.BytesIO(raw)) as z:
        entries = z.infolist()
        if len(entries) != 2 or {i.filename for i in entries} != FILES:
            raise ValueError("Unexpected, duplicate, missing, or unsafe archive paths")
        for info in entries:
            mode = info.external_attr >> 16
            if stat.S_ISLNK(mode) or (stat.S_IFMT(mode) not in (0, stat.S_IFREG)):
                raise ValueError("Archive contains a non-regular file")
            if info.flag_bits & 1 or info.file_size > LIMIT:
                raise ValueError("Encrypted or oversized entry")
        files = {i.filename: z.read(i) for i in entries}
    validate_files(files)
    return files

def build(atlas, output, config):
    release = json.loads(Path(config).read_text())
    pet = {key: release[key] for key in ("id", "displayName", "description", "spriteVersionNumber", "spritesheetPath")}
    files = {"teddy/pet.json": encode(pet), "teddy/spritesheet.webp": Path(atlas).read_bytes()}
    validate_files(files)
    output = Path(output)
    output.mkdir(parents=True, exist_ok=True)
    archive = output / f"teddy-{release['version']}.zip"
    stream = io.BytesIO()
    with zipfile.ZipFile(stream, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for name, content in sorted(files.items()):
            entry = zipfile.ZipInfo(name, (2026, 9, 18, 0, 0, 0))
            entry.create_system = 3
            entry.external_attr = (stat.S_IFREG | 0o644) << 16
            entry.compress_type = zipfile.ZIP_DEFLATED
            z.writestr(entry, content, compresslevel=9)
    raw = stream.getvalue()
    archive.write_bytes(raw)
    receipt = {"version": release["version"], "spriteVersionNumber": 2,
               "archive": archive.name, "bytes": len(raw), "sha256": digest(raw),
               "files": {name: {"sha256": digest(data), "bytes": len(data)} for name, data in files.items()}}
    (output / "release.json").write_bytes(encode(receipt))
    (output / (archive.name + ".sha256")).write_text(f"{digest(raw)}  {archive.name}\n")
    verify(archive, digest(raw))
    return receipt

def checked_destination(destination):
    dest = Path(destination).absolute()
    # Refuse symlink traversal, including a linked parent; explicit real paths work.
    if any(p.is_symlink() for p in [dest, *dest.parents]):
        raise ValueError("Destination must not traverse symlinks")
    if dest.exists() and not dest.is_dir():
        raise ValueError("Destination is not a directory")
    if dest.exists():
        if any(p.is_symlink() or not p.is_file() for p in dest.iterdir()):
            raise ValueError("Existing pet directory contains non-regular files")
    return dest

def install(archive, expected, destination, failpoint=None):
    files = verify(archive, expected)
    dest = checked_destination(destination)
    if not dest.parent.is_dir():
        raise ValueError("Destination parent must already exist")
    had_old = dest.exists()
    if had_old and not all((dest / name).is_file() for name in ("pet.json", "spritesheet.webp")):
        raise ValueError("Existing pet must contain both files before a recoverable upgrade")
    original_hashes = {name: digest((dest / name).read_bytes()) for name in ("pet.json", "spritesheet.webp")} if had_old else None
    # Codex discovers immediate children of pets/. Nest staging and recovery
    # one level deeper so neither can appear as an additional selectable pet.
    recovery_root = dest.parent / ".teddy-recovery"
    if recovery_root.is_symlink() or (recovery_root.exists() and not recovery_root.is_dir()):
        raise ValueError("Recovery root must be a real directory")
    recovery = recovery_root / (dest.name + ".pre-v5")
    if recovery.exists() or recovery.is_symlink():
        raise ValueError(f"Recovery directory already exists; preserved at {recovery}")
    recovery_root.mkdir(exist_ok=True)
    stage = Path(tempfile.mkdtemp(prefix=dest.name + ".stage-", dir=recovery_root))
    moved_old = False
    promoted = False
    try:
        if had_old:
            shutil.copytree(dest, stage, dirs_exist_ok=True)
        for name, data in files.items():
            target = stage / Path(name).name
            with target.open("wb") as f:
                f.write(data); f.flush(); os.fsync(f.fileno())
        validate_files({"teddy/" + Path(n).name: (stage / Path(n).name).read_bytes() for n in files})
        if failpoint == "before-replace":
            raise OSError("simulated failure before replacement")
        if had_old:
            dest.rename(recovery); moved_old = True
        if failpoint == "after-backup":
            raise OSError("simulated interruption after backup")
        stage.rename(dest); promoted = True
        for name, data in files.items():
            if (dest / Path(name).name).read_bytes() != data:
                raise OSError("Installed bytes did not match")
    except BaseException:
        if promoted:
            dest.rename(stage)
        if moved_old:
            recovery.rename(dest)
        raise
    finally:
        if stage.exists():
            shutil.rmtree(stage)
    return {"installed": str(dest), "backup": str(recovery) if had_old else None,
            "backup_files": original_hashes,
            "sha256": expected, "files": {Path(k).name: digest(v) for k, v in files.items()}}

def restore(destination):
    dest = checked_destination(destination)
    recovery_root = dest.parent / ".teddy-recovery"
    recovery = checked_destination(recovery_root / (dest.name + ".pre-v5"))
    retained = recovery_root / (dest.name + ".v5-restored-away")
    if not recovery.is_dir() or retained.exists() or retained.is_symlink():
        raise ValueError("Missing backup or retained candidate already exists")
    if not all((recovery / name).is_file() for name in ("pet.json", "spritesheet.webp")):
        raise ValueError("Backup does not contain both pet files")
    old_hashes = {name: digest((recovery / name).read_bytes()) for name in ("pet.json", "spritesheet.webp")}
    had_candidate = dest.exists()
    if had_candidate:
        dest.rename(retained)
    try:
        recovery.rename(dest)
    except BaseException:
        if had_candidate:
            retained.rename(dest)
        raise
    return {"restored": str(dest), "retained_candidate": str(retained) if had_candidate else None, "files": old_hashes}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    b = sub.add_parser("build"); b.add_argument("atlas"); b.add_argument("output"); b.add_argument("--config", default="v5/release.json")
    for cmd in ("verify", "install"):
        p = sub.add_parser(cmd); p.add_argument("archive"); p.add_argument("sha256")
        if cmd == "install": p.add_argument("destination")
    p = sub.add_parser("restore"); p.add_argument("destination")
    args = parser.parse_args()
    if args.command == "build": result = build(args.atlas, args.output, args.config)
    elif args.command == "verify": result = {"ok": True, "files": {k: digest(v) for k, v in verify(args.archive, args.sha256).items()}}
    elif args.command == "install": result = install(args.archive, args.sha256, args.destination)
    else: result = restore(args.destination)
    print(json.dumps(result, indent=2))
