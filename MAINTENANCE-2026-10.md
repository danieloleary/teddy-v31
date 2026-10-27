# October 2026 maintenance

Teddy 5.0 keeps the approved artwork and download. The October 26 audit found
that Codex 26.1021.31345 still accepts format 2 with a 1536 × 2288 atlas.
The app updater reports this installation is up to date.

Evidence comes from the installed app's manifest schema and sprite dimensions,
not a native playback test. Native playback remains unverified.

## Changes

- Paused previews accept deliberate gaze changes by button and keyboard.
  Reduced motion still stops automatic animation and pointer following.
- `npm test` runs package checks, three animation tests, and 10 recovery tests.
- GitHub Actions runs that command for pushes and pull requests with Node 24
  and Python 3.14. The website has no npm runtime dependencies to upgrade.

The package, atlas, recovery copies, and creator credit are unchanged.

## Remaining acceptance checks

| Task | Dependency | Acceptance and testing gate | Rollback |
| --- | --- | --- | --- |
| Verify native Codex playback | Permitted native observation | Select installed Teddy; observe nine moods and gaze, reload and confirm selection. File inspection cannot pass this gate. | Use the restore command in the release notes. |
| Reconcile catalog downloads | Fresh reads from each existing listing | Compare extracted atlas and format against `downloads/release.json`; preserve listing IDs. | Keep the known official download; do not resubmit duplicates. |
| Finish Lovable release | Preview audit and publication authorization | Verify mobile, reduced motion, video, download, and creator links before publishing. | Restore the prior saved Lovable revision. |

## Validation and recovery

Local `npm test` passed on October 26, 2026. Browser checks cover paused gaze,
keyboard gaze, reduced motion, and 390px mobile width. These are website checks.
They do not establish native Codex playback.

For website rollback, revert the October maintenance commit and redeploy Pages.
The prior site commit is `579c9c04951c7e21933dd41e15e1937b8496120f`.
For pet installation recovery, follow [the release notes](RELEASE-V5.md).
