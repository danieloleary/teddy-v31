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
| Verify remaining directories | OpenPets and codex-pets.net downloads now match; Awesome Codex Pet source matches | Check remaining older listings without duplicate submissions. Awesome npm installation is untested. | Keep the official download. |
| Finish Lovable maintenance | Existing site is already public; preview changes are in progress | Restore the demo and accurate install copy; verify dependencies, mobile, reduced motion, and creator links. Updated publication needs authorization. | Restore revision `8428987901cb9410b152a922f4191b372bca524e`. |

## Validation and recovery

Local `npm test` passed on October 26, 2026. Browser checks cover paused gaze,
keyboard gaze, reduced motion, and 390px mobile width. These are website checks.
They do not establish native Codex playback.

For website rollback, revert the October maintenance commit and redeploy Pages.
The prior site commit is `579c9c04951c7e21933dd41e15e1937b8496120f`.
For pet installation recovery, follow [the release notes](RELEASE-V5.md).

## Catalog and deployment receipt

GitHub CI and Pages deployment passed for `ff38ee5`. The live player matched
the updated source. Installed Teddy metadata and atlas matched the release.

On October 26, the OpenPets ZIP and codex-pets.net atlas and ZIP contained the
exact release atlas. Awesome Codex Pet's repository package also matched,
with its existing catalog ID preserved. This does not test its npm installer.

Run the read-only network check separately from offline CI:

```sh
python3 scripts/check-catalogs.py
```

The check prints dated JSON, checks stable IDs, format 2, and exact artwork hashes, and
returns a nonzero exit code for an unavailable or mismatched package.

The older `.com` reconciliation request remains open with no comments as of
October 26: [existing issue](https://github.com/BeiXiao/awesome-codex-pets/issues/1).
The `.org` ownership request remains unresolved. No duplicate submissions or
follow-up messages were sent.
