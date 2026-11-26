# 4. IndexedDB on both platforms; a separate native session journal

Status: accepted, 2026-11-26

## Context

Data is small (~5–6 MB after ten years). The goal is few dependencies. The native service must record a session's end even when the WebView is gone.

## Decision

Presets and the log live in IndexedDB on web and in the Android WebView, behind one `Storage` implementation. The Android service writes a small JSON journal file; TypeScript converts it into a log entry and deletes it, including after a crash.

## Consequences

No SQLite plugin and one storage implementation. The data is bound to the WebView origin (Capacitor's default `https://localhost`), which must never change; the warning sits as a comment next to the setting. Device-to-device transfer has to include the WebView's internal storage folder, whose layout belongs to Chromium, so it is verified on a real transfer before v1. Export remains the safety net.
