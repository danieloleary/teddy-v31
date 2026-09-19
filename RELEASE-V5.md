# Teddy 5.0

September 19, 2026. Anime-inspired artwork, nine moods, sixteen looks, and an
interactive website preview. The bear, glasses, navy cardigan, and tablet stay.

## Verification status

The artwork passed geometry and transparency validation, three independent
blind-direction reviews, and final visual review. All reviewers agreed on the
look directions. Minor scale variation at the look-loop boundary and the jump's
extra headroom were reviewed and accepted.

Two package builds produced identical bytes. Fresh installation, V4 upgrade,
interrupted replacement, and restoration passed with the exact download.
Ten package/recovery tests and three animation-mapping tests cover the tooling.

The preview was tested in isolated WebKit: every animation frame, all sixteen
pointer sectors, direction buttons, keyboard, touch emulation, pause, reduced
motion, narrow layout, missing artwork, no JavaScript, and clipboard denial.
Hidden-tab handling used a simulated visibility transition.

**Native playback in Codex remains unverified.** Actual Safari and Chromium
comparison and native work-state transitions are still open. Website tests do
not establish native behavior. Third-party directory listings may show an older
version. No launch film is included.

## Download

[Download Teddy 5.0](downloads/teddy-5.0.0.zip), 2,304,162 bytes.
The ZIP contains only:

- `teddy/pet.json`
- `teddy/spritesheet.webp`

The atlas is a 1536×2288 WebP with `spriteVersionNumber: 2`.
No executable, model, account, or service ships inside the download.

Archive SHA-256:
`b1fdcb32cbc57cf19df2e6a895878537179a1ff440f357c5234a1ffe52af8e73`

Atlas SHA-256:
`204197ee622933d46df0aaf175b2378776dc24842ae4d0172feb3bef3422f973`

[release.json](downloads/release.json) records the archive and individual file
hashes. The ZIP hash is external to avoid a self-referential manifest.

## Install and recover

The site’s **Copy install message** button provides instructions for Codex,
including the expected ZIP hash and backup handling.

For a command-line installation from this repository, use Python 3 with Pillow
installed. The existing pets directory must be a real directory, not a symlink.

```sh
python3 scripts/release.py install downloads/teddy-5.0.0.zip b1fdcb32cbc57cf19df2e6a895878537179a1ff440f357c5234a1ffe52af8e73 "$HOME/.codex/pets/teddy"
```

The helper checks the hash, archive paths, metadata, and image geometry before
replacement. It stages and verifies both files together, preserves unrelated
regular files, and saves an existing Teddy under
`pets/.teddy-recovery/teddy.pre-v5`. It refuses to overwrite an existing backup.
The nested location prevents the backup from appearing as another pet.

A handled failure restores the original directory. After a machine or process
interruption, restore the saved pair with:

```sh
python3 scripts/release.py restore "$HOME/.codex/pets/teddy"
```

Restoration retains the V5 candidate under
`pets/.teddy-recovery/teddy.v5-restored-away`. Reselect Teddy or reload Codex if
it caches the art. Native refresh behavior has not been witnessed.

## Previous version

[Classic Teddy](index-v4.html), its assets, and the
[V4 download](downloads/teddy-codex-buddy.zip) remain available.
To restore the previous landing page locally, copy `index-v4.html` over
`index.html`. Publishing that rollback is a separate action.
