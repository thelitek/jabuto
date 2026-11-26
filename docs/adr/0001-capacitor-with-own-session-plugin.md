# 1. Capacitor with one in-house Kotlin plugin

Status: accepted, 2026-11-26

## Context

The frontend is web technology. On Android the app needs a background service, DND control and a notification with actions. A Trusted Web Activity can do none of these; Tauri mobile has a thinner Android plugin ecosystem.

## Decision

Capacitor 8. Everything native lives in one in-house Kotlin `SessionPlugin`: foreground service, bell playback, DND rule, notification, session journal, save/open file dialogs. No community plugins.

## Consequences

Existing plugins don't fit: local notifications follow notification volume and DND (our own rule would mute them) and can't pause; background-runner runs roughly every 15 minutes; foreground-service plugins keep the process alive but leave timing in throttled JS; no maintained plugin handles app-owned DND rules. We own a few hundred lines of Kotlin instead of several dependencies.
