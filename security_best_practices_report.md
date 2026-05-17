# Teddy Codex Buddy Landing Page Security Review

## Executive Summary

Status: passed after fixes. Rechecked for the Teddy calmer-timing public package on 2026-05-17.

The Teddy Codex Buddy public landing page is a static GitHub Pages site with no backend, auth, forms, analytics, third-party scripts, or network calls. The active review found no committed secrets and no DOM XSS sinks. Two public-sharing issues were fixed before release hardening was considered complete: local absolute paths were removed from public metadata and a restrictive static-page CSP/referrer baseline was added.

## Findings Fixed

### S-001: Public Package Metadata Exposed Local Machine Paths

- Rule ID: JS-DATA-001
- Severity: Medium
- Location: `assets/manifest.json:8`, `assets/manifest.json:9`, `assets/installed-validation.json:3`, `README.md:63`
- Evidence: the first published package metadata included absolute local home-directory paths.
- Impact: no credential or secret was exposed, but the public package unnecessarily disclosed local username and production-run layout.
- Fix: sanitized source/install metadata to generic public values in `assets/manifest.json:8`, `assets/manifest.json:9`, `assets/installed-validation.json:3`, and `README.md:63`; rebuilt the downloadable ZIP with the same sanitized metadata.
- Mitigation: keep the production provenance in the private local Teddy archive; publish only install assets, previews, validation proof, and hashes.
- False positive notes: `~/.codex/pets/teddy` remains intentionally documented because it is the generic install destination friends need.

### S-002: No Static-Page Security Policy Was Visible In The Repo

- Rule ID: JS-CSP-001
- Severity: Low
- Location: `index.html:5`
- Evidence: the original page did not declare a CSP in HTML, and GitHub Pages does not expose custom project security headers from this repo.
- Impact: the page has very little attack surface, but a restrictive policy reduces blast radius if future edits accidentally add unsafe content.
- Fix: added an early CSP meta tag at `index.html:5` allowing only same-origin scripts, styles, images, and no forms, frames, workers, fonts, media, objects, or network connections. Added a strict referrer policy at `index.html:9`.
- Mitigation: if this page moves behind a configurable CDN later, prefer real HTTP security headers over meta CSP. Meta CSP cannot enforce every header-only directive.
- False positive notes: this is defense-in-depth for a static page, not a critical vulnerability.

## Passing Checks

- Secrets scan: no known GitHub token prefixes, private key markers, AWS key markers, password/token/secret assignments, absolute local home path, or local username string remains in app/package content.
- ZIP metadata scan: no absolute local home path or local username string remains inside `teddy/manifest.json` or `teddy/installed-validation.json`.
- DOM sink scan: no common HTML-injection, code-execution, event-handler, cross-window, browser-storage, or dynamic-navigation sink pattern was found in app code.
- Third-party surface: no external scripts, styles, iframes, fonts, or CDN assets.
- Package integrity: ZIP test passed; current friend-ready ZIP is `downloads/teddy-codex-buddy.zip`, and package SHA-256 is `89b41988144d5a334dcce667556e8d8f16fd2932c42bfdd40d114eca7e063023`.

## Residual Risk

GitHub Pages is static hosting, so repository-level code cannot set full HTTP security headers. The current CSP is meta-delivered and intentionally conservative. The remaining practical risk is future content drift: adding third-party scripts, forms, URL-param rendering, or untrusted HTML would require a new review.
