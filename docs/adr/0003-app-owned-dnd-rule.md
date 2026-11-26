# 3. DND through an app-owned AutomaticZenRule; minSdk 29

Status: accepted, 2026-11-26

## Context

Requirements: DND on from warmup to the end bell, then the user's previous state restored. Since Android 15, apps targeting API 35 can no longer change global DND; `setInterruptionFilter` is turned into an implicit app rule anyway.

## Decision

Use an explicit `AutomaticZenRule` "Jabuto session" that lets alarms and media through, activated and deactivated with `setAutomaticZenRuleState`. minSdk 29 (Android 10), where this API exists.

## Consequences

The user's own DND is never touched, so "restore the previous state" holds by construction, and the rule shows by name in system settings. If the user's own DND blocks media, Android applies the stricter policy and bells are silent; the session screen says so. Phones older than Android 10 are not supported.
