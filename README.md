# Jabuto

A meditation timer for Android (web later). No account; presets and the session log stay on the device and move between devices through export and import.

- [Functional requirements](docs/requirements.md)
- [Technical overview](docs/technical-overview.md)
- [Domain glossary](CONTEXT.md)
- [Architecture decisions](docs/adr/)

## Development

Requires Node 22+. For Android also JDK 21 and the Android SDK.

```bash
npm install
npx vp dev            # web app at http://localhost:5173
npx vp check          # format, lint, type check
npx vp test           # unit tests
npx vp run android:sync && (cd android && ./gradlew assembleDebug)
```

Commits follow [Conventional Commits](https://www.conventionalcommits.org/); release-please turns them into versions and the changelog.

## Releases and previews

- Every pull request gets a debug APK (CI artifact) and a web preview at `https://thelitek.github.io/jabuto/pr-preview/pr-<n>/`.
- Merging the release PR tags a version, deploys the web build to `https://thelitek.github.io/jabuto/` and attaches a signed APK when the signing secrets are set: `JABUTO_KEYSTORE_BASE64`, `JABUTO_KEYSTORE_PASSWORD`, `JABUTO_KEY_ALIAS`, `JABUTO_KEY_PASSWORD`.
