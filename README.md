# Teddy, a Little Bear Pet for Codex

Meet Teddy, a tiny animated bear buddy for your Codex screen. Teddy is calm, dapper, and built by [Dan O'Leary](https://github.com/danieloleary), co-designed with Teddy and OpenClaw: round glasses, a navy cardigan, a tiny iPad mini, and softer little work moods.

[![Teddy waving in front of Codex](assets/teddy-social-card.png)](https://danieloleary.github.io/teddy-v31/)

## Download

- Landing page: [danieloleary.github.io/teddy-v31](https://danieloleary.github.io/teddy-v31/)
- Friend-ready ZIP: [downloads/teddy-codex-buddy.zip](downloads/teddy-codex-buddy.zip)
- Teddy repo: [github.com/danieloleary/teddy-v31](https://github.com/danieloleary/teddy-v31)
- Dan on X: [@danieloleary](https://x.com/danieloleary)
- Dan's GitHub: [github.com/danieloleary](https://github.com/danieloleary)
- Built with Codex: [openai.com/codex](https://openai.com/codex/)
- Package SHA-256: `0186465198683f4eea7e6011ee731a25b199276e8ff829ec2bf31fc93e89d32b`
- Spritesheet SHA-256: `c9e0da13b6bdeed6ffefecebf0633621c90aa042ca02b3b7224b62806642304a`

## Verified Package

- Release: `4.0.0`
- Last verified: `2026-05-17T18:21:28Z`
- Package validation: `1536x1872 WEBP RGBA`, transparent residue `0`, errors `[]`, warnings `[]`
- Proof: [manifest](assets/manifest.json), [validation](assets/installed-validation.json), [security review](security_best_practices_report.md)

## What's New

Teddy now has calmer timing and softer little work moods while keeping the same dapper bear identity.

## Teddy Around The Web

- Live on Codex Pet Gallery, V4 refresh pending: [codex-pet.org/pets/teddy](https://codex-pet.org/pets/teddy)
- Live on Codex Pets, V4 refresh pending: [codex-pets.net/#/pets/teddy](https://codex-pets.net/#/pets/teddy)
- Live and V4 verified on OpenPets: [openpets.dev/pets/teddy-0bd28606](https://openpets.dev/pets/teddy-0bd28606)
- Merged into Awesome Codex Pet: [legeling/awesome-codex-pet#5](https://github.com/legeling/awesome-codex-pet/pull/5)
- Pending on codex-pet.com as `teddy`
- Submitted to Pumpex Pets for approval

## Install Teddy

1. Download `teddy-codex-buddy.zip`.
2. Unzip it.
3. Open the unzipped `teddy` folder.
4. Copy `pet.json` and `spritesheet.webp` into `~/.codex/pets/teddy/`.
5. Restart Codex if Teddy does not appear right away.
6. Select `Teddy` in Codex pets.

## Tell Codex To Install It

Paste this into Codex:

```text
Please install Teddy, my tiny Codex buddy, from:
https://danieloleary.github.io/teddy-v31/downloads/teddy-codex-buddy.zip

Back up any existing ~/.codex/pets/teddy folder, download and unzip the ZIP,
copy only pet.json and spritesheet.webp into ~/.codex/pets/teddy/,
then verify the installed spritesheet SHA-256 is:
c9e0da13b6bdeed6ffefecebf0633621c90aa042ca02b3b7224b62806642304a

If verification fails, restore the backup.
```

## Teddy Moves

![Teddy mood board showing nine cozy animation moods](assets/site/motion-wardrobe.png)

## Repo Map

- `index.html`, `styles.css`, `script.js`: the public landing page.
- `downloads/teddy-codex-buddy.zip`: the share-safe install package.
- `assets/pet.json` and `assets/spritesheet.webp`: the two files Codex needs.
- `assets/site/`: landing-page images and README visuals.
- `social/`: ready-to-post Teddy images and GIFs for X, LinkedIn, and launch articles.
- `assets/manifest.json` and `assets/installed-validation.json`: proof files for the curious.

## Codex Check

Before shipping a change, Codex can run one small project check:

```bash
npm run codex:check
```

It verifies required files, local page references, package hashes, `pet.json`, and basic static-page safety.

## Package Contents

The ZIP includes:

- `pet.json`
- `spritesheet.webp`
- `README.md`
- `contact-sheet.png`
- `installed-validation.json`
- `manifest.json`
- `previews/`

Only `pet.json` and `spritesheet.webp` are needed for installation. The rest are previews, validation proof, and hashes.

## Validation

- Atlas: `1536x1872`
- Grid: `8x9`
- Cell: `192x208`
- Format: `WEBP`
- Mode: `RGBA`
- Transparent RGB residue: `0`
- Errors: `[]`
- Warnings: `[]`

<details>
<summary>Build story visual</summary>

![Teddy build architecture and stats](assets/site/teddy-build-story-card.png)

</details>

## Source

The full production run is retained in the author's local Teddy archive. The public package is path-sanitized and contains only install assets, previews, validation proof, and hashes.
