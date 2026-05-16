# Teddy Codex Buddy

Teddy is a calm, dapper Codex buddy co-designed with OpenClaw: round glasses, a navy cardigan, a tiny iPad mini, and a warm cream sticker outline.

![Teddy, your tiny Codex buddy](assets/teddy-social-card.png)

This repo hosts the public landing page and share-safe download package:

- Site: `https://danieloleary.github.io/teddy-v31/`
- Download: `downloads/teddy-v3-1-outline-polish-codex-pet.zip`
- Package hash: `c13cf4b0a2900b00b8f42b2e3587b0631630678cebdf51476e61973cdcbda599`
- Spritesheet hash: `320be4f11d6ce14288e2756f972f2909231032259f5c297fd35271923efc8e64`

## Install Teddy

1. Download `teddy-v3-1-outline-polish-codex-pet.zip`.
2. Unzip it.
3. Open the unzipped `teddy` folder.
4. Copy `pet.json` and `spritesheet.webp` into:

```text
~/.codex/pets/teddy/
```

5. Restart Codex if Teddy does not appear right away.
6. Select `Teddy` in Codex pets.

## Tell Codex To Install It

Paste this into Codex after downloading the ZIP:

```text
Install the Teddy Codex pet from this ZIP.
Unzip it, copy pet.json and spritesheet.webp into ~/.codex/pets/teddy/,
then verify the installed spritesheet hash matches the package manifest.
```

## Package Contents

The ZIP includes:

- `pet.json`
- `spritesheet.webp`
- `README.md`
- `contact-sheet.png`
- `dark-before-after-spotcheck.png`
- `installed-validation.json`
- `manifest.json`

Only `pet.json` and `spritesheet.webp` are needed for installation. The rest are preview and proof files.

## Validation

- Atlas: `1536x1872`
- Grid: `8x9`
- Cell: `192x208`
- Format: `WEBP`
- Mode: `RGBA`
- Transparent RGB residue: `0`
- Errors: `[]`
- Warnings: `[]`

## Source

The full production run is retained in the author's local Teddy archive. The public package is path-sanitized and contains only install assets, previews, validation proof, and hashes.
