# Jabuto — technical overview

Status: agreed 2026-11-26. Requirements: [`requirements.md`](requirements.md). Decisions with reasons: [`adr/`](adr/).

## Shape

```
src/core       pure TypeScript: presets, session plan, streak, log reconciliation, import/export + migrations
src/ui         light-DOM custom elements, one per screen; router; signals-based state
src/platform   adapters behind interfaces: Runner, Storage, Files
               ├─ web/        JS runner on the Web Audio clock, IndexedDB, download / <input type=file>
               └─ capacitor/  SessionPlugin bridge, IndexedDB (in the WebView), plugin save/open dialogs
android/       Capacitor project + the Kotlin SessionPlugin
docs/          requirements, glossary, ADRs, manual device checklist
```

## Runtime dependencies

- `@capacitor/core`, `@capacitor/android` (Capacitor 8)
- `@preact/signals-core`
- Our own Kotlin `SessionPlugin`

No UI framework, no templating library, no other Capacitor plugins.

## Session flow

1. On start, `core` turns the preset into a **session plan**: an ordered list of events in meditation time.
2. A **runner** executes it and reports state (phase, remaining, paused):
   - **Android:** `SessionPlugin` starts a `mediaPlayback` foreground service with a partial wake lock, counts on `SystemClock.elapsedRealtime()`, plays bells with SoundPool on the media stream (transient audio focus with ducking), shows the ongoing notification (remaining time, Pause/Resume, End session), and owns the DND rule.
   - **Web:** bells are scheduled up front on the Web Audio clock (`source.start(t)`), rescheduled on pause; the display is derived from the audio clock every frame and on `visibilitychange`; Screen Wake Lock keeps the screen on; `navigator.audioSession.type = "playback"` on Safari.
3. The UI only renders what the runner reports, so the notification, back gesture and End behave the same whether or not the WebView exists.

## DND

App-owned `AutomaticZenRule` "Jabuto session", interruption filter that lets alarms and media through. Activated at warmup start, deactivated after the end bell. Never touches the user's own DND, so their previous state is preserved by construction. minSdk 29 (Android 10). If the user's own DND blocks media, the session screen says "Do Not Disturb is muting bells" (the volume notice wins if both apply).

## Storage

- **Presets + log:** IndexedDB on both platforms, one implementation. Origin stays Capacitor's default `https://localhost`; changing it would empty the database and break device-to-device transfer. That warning lives as a comment next to the setting in `capacitor.config.ts`.
- **Session journal (Android):** one JSON file written by the service on every state change (start, pause, phase). TypeScript reads it via `getJournal()`, writes the log entry, then `clearJournal()`. On launch, a leftover journal becomes an `interrupted` entry and the DND rule is deactivated.
- **Backup:** cloud backup off; device-to-device transfer includes the WebView's IndexedDB, excludes the journal (`data_extraction_rules.xml`). Must be verified on a real transfer before v1.

## UI

- One light-DOM custom element per screen; a ~30-line router on `history.pushState` (back gesture works) with a single swap function, so View Transitions can be added later.
- State in `@preact/signals-core`; screens build DOM once from `<template>`s and bind nodes with `effect`. User text only via `textContent`.
- Static feel: bundled, preloaded Inter Tight; splash stays until Home is drawn with real data; reserved slots for notices; `tnum` numerals; no transitions.

## Tooling

- Vite+ (`vp`): dev server, build, Vitest, Oxlint, Oxfmt. Exact version pinned.
- Playwright for the web build, using `page.clock` to fast-forward sessions.
- TypeScript strict.

## Testing

- Test-first for `src/core`.
- Kotlin unit tests for the service timing, written after.
- Playwright against the web build on every push.
- `docs/device-checklist.md`: screen off 30 min, DND on/off and user DND blocking media, volume 0, killed process, reboot, device-to-device transfer.

## Release

- Conventional commits. release-please with `bump-minor-pre-major`; start at 0.1.0; `Release-As: 1.0.0` footer when v1 is ready.
- `versionCode = major×10000 + minor×100 + patch`; CI fails if minor or patch ≥ 100.
- On release: signed APK attached to the GitHub Release (key in GitHub Secrets); web build deployed to GitHub Pages.
- On every push: lint, unit tests, Playwright, debug APK.
- Play Store later: code already meets its rules (foreground service type, Data safety, no data collection).
