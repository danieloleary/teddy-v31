# Teddy 5.0

September 19, 2026. Anime eyes, nine moods, sixteen looks.

Package, recovery, artwork, and WebKit preview checks passed. **Native Codex
playback remains unverified.** Browser tests don’t establish native behavior.
Some directories still serve older versions.

## Download

[Download 5.0](downloads/teddy-5.0.0.zip), 2,304,162 bytes. Contains only
`teddy/pet.json` and `teddy/spritesheet.webp`: format 2, 1536×2288 WebP.
No executable, model, account, or service is included.

Archive SHA-256:
`b1fdcb32cbc57cf19df2e6a895878537179a1ff440f357c5234a1ffe52af8e73`

Atlas SHA-256:
`204197ee622933d46df0aaf175b2378776dc24842ae4d0172feb3bef3422f973`

Individual file hashes: [release.json](downloads/release.json).

## Install and recover

Use **Copy install message** on the [site](https://danieloleary.github.io/teddy-v31/#home).
It includes verification and backup instructions.

For command-line installation, use Python 3 with Pillow from this repository.
The existing pets directory must not be a symlink.

```sh
python3 scripts/release.py install downloads/teddy-5.0.0.zip b1fdcb32cbc57cf19df2e6a895878537179a1ff440f357c5234a1ffe52af8e73 "$HOME/.codex/pets/teddy"
```

The helper validates and stages both files, preserves unrelated regular files,
and backs up Teddy at `pets/.teddy-recovery/teddy.pre-v5`. It never overwrites
that backup. Handled failures restore the original directory.

After an interrupted installation, restore the backup:

```sh
python3 scripts/release.py restore "$HOME/.codex/pets/teddy"
```

The displaced V5 copy stays at `pets/.teddy-recovery/teddy.v5-restored-away`.
Reselect Teddy or reload Codex if artwork is cached. Native refresh is unverified.

[Classic site](index-v4.html) and [V4 download](downloads/teddy-4.0.0.zip) remain
available. For a local site rollback, copy `index-v4.html` to `index.html`.
Publishing that rollback is separate.

## Website demo

Tap Teddy to wave; drag or use arrow keys to move him. Pause and Hide are
available. Reduced motion starts him still. Playing the video pauses the pets.

The silent, captioned demo uses V5 artwork, not native Codex footage. It loads
on play: H.264, 1280×720, 20 seconds, 731,669 bytes. A poster, transcript, and
video download are available on the site.
