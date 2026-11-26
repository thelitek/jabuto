# 7. Conventional commits, release-please, semver-derived versionCode

Status: accepted, 2026-11-26

## Decision

- Conventional commits. release-please with `bump-minor-pre-major`, starting at 0.1.0; v1 is cut with a `Release-As: 1.0.0` commit footer.
- `versionCode = major×10000 + minor×100 + patch`; CI fails if minor or patch reaches 100.
- A release attaches a signed APK to the GitHub Release and deploys the web build to GitHub Pages. Every push runs lint, unit tests, Playwright and a debug build.

## Consequences

Versions and changelog follow from commit messages. Going to 1.0.0 is an explicit act. The installed build's version is readable from its versionCode. Play Store distribution can come later without code changes.
