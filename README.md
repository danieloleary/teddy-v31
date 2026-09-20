# Teddy 5.0 for Codex

I’m Dan O’Leary. Teddy is my chief of staff. He joins calls and has presented at conferences
with me. I made this free animated version of him for Codex.

[Try Teddy](https://danieloleary.github.io/teddy-v31/) ·
[Download 5.0](downloads/teddy-5.0.0.zip) ·
[Stable download](downloads/teddy-codex-buddy.zip)

![Teddy with his tablet](v5/assets/portrait.webp)

Anime eyes, nine moods, sixteen directions to look. Try the floating pet on the site, or
watch the captioned [20-second demo](v5/assets/teddy-demo.mp4).

The download contains Teddy’s artwork and pet settings. Chief-of-staff tools and meeting features
aren’t included. No extra account, subscription, or model is needed.
Requires Codex custom pet format 2.

## Install

1. Download the ZIP.
2. On the [site](https://danieloleary.github.io/teddy-v31/#home), select
   **How to add Teddy to Codex**, then **Copy install message**.
3. Paste into Codex with the ZIP attached. The instructions verify the package
   and back up your existing Teddy.
4. Choose **Teddy 5.0** in the pet selector.

Package, recovery, and browser checks passed. **Native Codex playback remains
unverified.** Some directories still serve older versions.

[Release notes and recovery](RELEASE-V5.md) · [File hashes](downloads/release.json)

Package SHA-256: `b1fdcb32cbc57cf19df2e6a895878537179a1ff440f357c5234a1ffe52af8e73`

V5 atlas SHA-256: `204197ee622933d46df0aaf175b2378776dc24842ae4d0172feb3bef3422f973`

## Classic Teddy

[Classic site](index-v4.html) · [V4 download](downloads/teddy-4.0.0.zip)

V4 Package SHA-256: `0186465198683f4eea7e6011ee731a25b199276e8ff829ec2bf31fc93e89d32b`

V4 Spritesheet SHA-256: `c9e0da13b6bdeed6ffefecebf0633621c90aa042ca02b3b7224b62806642304a`

## Development

Requires Node.js and Python 3 with Pillow.

```sh
npm run codex:check
npm run codex:check:v5
npm run test:animation
python3 -m unittest discover -s scripts/tests -p 'test_*.py'
```

Made by Dan O’Leary. [GitHub](https://github.com/danieloleary) ·
[X](https://x.com/danieloleary) · [LinkedIn](https://www.linkedin.com/in/danieloleary)
