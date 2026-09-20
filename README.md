# Teddy, an animated bear for Codex

Teddy is my chief of staff. He joins calls and has presented at conferences
with me. This is his little desktop counterpart: a free animated bear for Codex.

If you already know Teddy, you’ll recognize the glasses, navy cardigan, and
very serious little tablet. The pet keeps you company while you build; it
doesn’t include Teddy’s chief-of-staff tools or meeting capabilities.

Made by Dan O’Leary.

Follow my work on [X](https://x.com/danieloleary), connect on
[LinkedIn](https://www.linkedin.com/in/danieloleary), or explore what I build on
[GitHub](https://github.com/danieloleary).

[Meet Teddy and try the animations](https://danieloleary.github.io/teddy-v31/)
· [Download Teddy 5.0](downloads/teddy-5.0.0.zip)

![Teddy with his tablet](v5/assets/portrait.webp)

## What’s in 5.0

- Softer anime eyes, gentle blinks, and a relaxed resting smile.
- Nine moods, including a wave, a small hop, tablet tapping, and a glasses adjustment.
- Sixteen looks with head turns in every direction.
- A floating site pet: tap to wave, drag to move, pause, or hide him.
- An interactive preview with nine moods, pointer attention, keyboard and touch
  controls, and reduced-motion support.
- A silent [20-second animation demo](v5/assets/teddy-demo.mp4) with captions,
  a transcript, and a download.

The download contains only the pet artwork and its metadata. It needs no extra
account, subscription, model, or server. Codex must support custom pet format 2.

## Add Teddy to Codex

1. Download [Teddy 5.0](downloads/teddy-5.0.0.zip).
2. On the [site](https://danieloleary.github.io/teddy-v31/), open **How to add Teddy
   to Codex** and copy the install message.
3. Paste the message into Codex with the ZIP attached. It asks Codex to verify
   the download and preserve your existing Teddy before installing.
4. Choose **Teddy 5.0** in the pet selector.

## Checks and recovery

Artwork passed atlas validation, three independent blind-direction reviews,
and final visual review. The package reproduced byte-for-byte and passed
installation and recovery tests. The interactive preview was tested in isolated
WebKit. Native playback in Codex remains unverified; browser checks do not prove
native behavior.

See [release notes and rollback steps](RELEASE-V5.md) and the
[download manifest](downloads/release.json).

V5 archive SHA-256:
`b1fdcb32cbc57cf19df2e6a895878537179a1ff440f357c5234a1ffe52af8e73`

V5 atlas SHA-256:
`204197ee622933d46df0aaf175b2378776dc24842ae4d0172feb3bef3422f973`

The stable [main download](downloads/teddy-codex-buddy.zip) now serves 5.0.

Package SHA-256: `b1fdcb32cbc57cf19df2e6a895878537179a1ff440f357c5234a1ffe52af8e73`

## Classic Teddy

The [classic page](index-v4.html), V4 assets, and
[original download](downloads/teddy-4.0.0.zip) remain available.
Third-party directories may still show earlier versions.

- V4 Package SHA-256: `0186465198683f4eea7e6011ee731a25b199276e8ff829ec2bf31fc93e89d32b`
- V4 Spritesheet SHA-256: `c9e0da13b6bdeed6ffefecebf0633621c90aa042ca02b3b7224b62806642304a`

## Project checks

Use Node.js for site and animation checks. Package tests also need Python 3
with Pillow installed.

```sh
npm run codex:check
npm run codex:check:v5
npm run test:animation
python3 -m unittest discover -s scripts/tests -p 'test_*.py'
```

Made by [Dan O’Leary](https://github.com/danieloleary).
