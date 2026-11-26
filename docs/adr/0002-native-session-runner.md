# 2. Session timing runs natively on Android, on the audio clock on web

Status: accepted, 2026-11-26

## Context
Bells must ring on time with the screen off. WebView and browser timers are throttled or suspended in the background.

## Decision
Pure TypeScript computes a session plan. On Android a `mediaPlayback` foreground service with a partial wake lock executes it on `SystemClock.elapsedRealtime()`. On web, all bells are scheduled up front on the Web Audio clock, with Screen Wake Lock keeping the screen on. The UI only displays runner state.

## Consequences
No exact-alarm permission is needed: the running service keeps the process alive. The web version is reliable only while the tab is visible on iOS, which the requirements accept. The plan logic is tested once, in TypeScript.
