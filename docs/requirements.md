# Jabuto — functional requirements

Status: agreed 2026-11-24. Terms are defined in [`CONTEXT.md`](../CONTEXT.md).
Screens: design canvas "Jabuto — Meditation Timer" (claude.ai artifact `6KUVL181ZMNpsMssGVvnX1`).

## 1. Scope

- Meditation timer. No account, no server, no analytics.
- Platform: Android first. Web later, built from the same web frontend, with known limitations (§10).
- Package ID `net.litynski.jabuto`. Display name "Jabuto"; the name is not shown on the Home screen.
- Interface in English only; strings are hardcoded. Localisation is out of scope.
- Visual language: typography and horizontal rules only. Themes: System (default), Light, Dark.

## 2. Presets

- Fields: name, warmup duration, meditation duration, start bell, interval bells, end bell.
- Name: required, not unique, max 24 characters.
- Meditation duration: 0:30 – 3:00:00, set to the second. Steppers ±1:00 / ±5:00; exact value by typing.
- Warmup duration: 0 – 10:00, set to the second. Steppers ±0:10 / ±1:00.
- First launch ships one preset: 10:00, no warmup, start and end bell, no interval bells. "New preset" starts from the same values.
- Home row shows name and meditation duration only (`mm:ss`, or `h:mm:ss` from one hour).
- Deleting a preset (inside the preset editor) needs no confirmation.
- No limit on the number of presets.

### 2.1 Bells

- Each role (start, interval, end) picks a sound from the bundled set (≤ 5) or Silent.
- Start and end bell: strike count 1–3. Interval bells: one strike, one shared sound.
- Sound picker: tapping a name selects it without playing; a separate Play control previews it (Play / Stop).
- Optional vibration with every bell: one global setting.

### 2.2 Interval bells

- Interval bells are a plain list of times, each to the second (e.g. 02:30, 05:00, 07:30).
- An interval generator ("every 02:30") is postponed; see [`later/interval-generator.md`](later/interval-generator.md).
- **Remove:** any single bell can be removed.
- **Add bell:** opens an `mm:ss` input prefilled with the midpoint of the largest gap.
- A bell cannot be edited; remove it and add another.
- No bell may fall within 5 s of the end. Shortening the meditation duration drops bells that no longer fit; lengthening it adds nothing.

## 3. Home

- Shows the current streak (large numeral, "days in a row") and the preset list.
- Tapping a preset starts a session immediately. No confirmation, no quick sit without a preset.
- Link to Setup.
- Small "Edit" at the bottom switches to **edit mode**:
  - each row gets a drag handle and an "Edit" link to the preset editor;
  - "New preset" row appears (only in edit mode);
  - tapping a row does not start a session;
  - "Done" saves the new order; "Cancel" discards it. Leaving the screen any other way saves it.

## 4. Session

### 4.1 Timeline

`warmup → start bell → meditation (interval bells) → end bell → overtime`

- Warmup is skipped when its duration is 0; the start bell then sounds at once.
- After the end bell, time keeps counting as overtime (`+mm:ss`, no label) until the user presses End.
- Overtime is capped at 60:00; at the cap the session ends on its own as `completed`.

### 4.2 Screen

- Large remaining time; small label "Warmup" / "Sitting" / "Paused" (no label in overtime).
- Controls: Pause/Resume and End. In overtime only End.
- End is a single normal press at any point. It ends the session and returns to Home, where the streak is already updated. No summary screen.
- Pause is allowed in warmup and meditation, not in overtime. Bells keep their position in meditation time (a pause shifts them in clock time). No pause limit. DND stays on while paused.
- Back gesture shows "End session?" with **Keep sitting** / **End**.
- The screen may turn off and lock; bells must still sound on time.

### 4.3 Background and notification

- The session keeps running when the app is in the background or the screen is locked.
- Ongoing notification shows remaining time with Pause/Resume and End session. End session from the notification ends at once.
- If the app is killed or the device restarts mid-session, the session is logged as `interrupted` and DND is restored on the next launch.

## 5. Sound and volume

- Bells play on the **media** stream and follow the system media volume. No in-app volume.
- Ringer mode (silent / vibrate) is not changed or overridden by the app, and it does not mute bells.
- If media volume is 0, the top of the session screen shows "Media volume is off". The line disappears when volume is raised during the session.
- Vibration with bells only if the global vibration setting is on.

## 6. Do Not Disturb

- Global setting in Setup, on by default.
- DND is switched on at the start of warmup and released when the end bell finishes (or when the session ends earlier).
- On release, the DND state from before the app changed it is restored exactly (if the user already had DND on, it stays on).
- The app's DND mode must still let its own bells (media) through.
- Web: not available.

## 7. Permissions

- Requested on the first session start, one at a time, each with a one-line explanation, then the session starts:
  1. DND access (system settings screen).
  2. Notifications (Android 13+).
- DND refused: sessions run without DND; Setup shows "DND access not granted" with a Grant link.
- Notifications refused: sessions run without the notification.

## 8. Streak and log

### 8.1 Streak

- A local calendar day qualifies if it has a session that is `completed` or has `meditationDuration ≥ 60 s`. Warmup and overtime do not count toward the 60 s.
- Streak = consecutive qualifying days ending today; if today has no qualifying session yet, a streak ending yesterday is still shown.
- No freezes or grace days. Home shows only the current streak.
- The streak is always derived from the log, never stored separately.

### 8.2 Log

- One entry per session that got past warmup. Sessions abandoned during warmup are not logged.
- Not shown in the app (no history or statistics screens in v1).
- Entry fields (durations in integer seconds):

| Field                | Type                     | Notes                                                                      |
| -------------------- | ------------------------ | -------------------------------------------------------------------------- |
| `id`                 | UUID                     |                                                                            |
| `startedAt`          | ISO 8601 with UTC offset | start of warmup                                                            |
| `presetId`           | UUID or null             | null once the preset is deleted                                            |
| `preset`             | object                   | snapshot: name, warmupDuration, meditationDuration, bells, sounds, strikes |
| `warmupDuration`     | int                      | actual                                                                     |
| `meditationDuration` | int                      | actual; pauses and overtime excluded                                       |
| `pauseDuration`      | int                      | total                                                                      |
| `overtimeDuration`   | int                      | 0–3600                                                                     |
| `outcome`            | enum                     | `completed` \| `endedEarly` \| `interrupted`                               |

## 9. Data: storage, export, import, backup

- Data stays on the device. No cloud sync.
- **Export:** presets (with ids, in display order) and the log; settings are not exported. Delivered via the system share/save sheet as `jabuto-YYYY-MM-DD.json`.
- File envelope:

```json
{
  "schemaVersion": 1,
  "app": "net.litynski.jabuto",
  "exportedAt": "2026-11-24T08:15:00+01:00",
  "presets": [],
  "sessions": []
}
```

- **Import:** replaces all presets and the whole log after one confirmation ("Replace N presets and M sessions?"). All or nothing.
  - Accepted: `app` matches and `schemaVersion` ≤ current (older versions are migrated step by step).
  - Rejected with one line of text, nothing changed: invalid file, other `app`, newer `schemaVersion`.
- **Android backup:** Google cloud backup **off**. Device-to-device transfer (new phone setup) **on** for the database.
- Expected size: ~0.5 KB per log entry; ~5–6 MB after ten years of three sessions a day.

## 10. Web (later)

- Same features except DND.
- Bells are reliable only while the tab stays in the foreground; the app says so.
- Closing the tab loses the running session.
- Data in browser storage with a persistent-storage request; export is the only safety net.

## 11. Setup screen

- Theme: System / Light / Dark.
- Session: Do Not Disturb (on/off, "From warmup to the end bell", plus the not-granted state); Vibrate with bells (on/off).
- Data: Export, Import.
- Licences.
- Footer: "No account. Everything stays on this device."

## 12. Launcher icon

- "Ja" in Inter Tight, black on a solid white ground, left-aligned with generous padding (in the manner of JetBrains product icons).
- Adaptive icon (foreground inside the 66 dp safe zone) plus a monochrome themed variant.

## 13. Licences

- Bell sounds: ≤ 5, chosen by the owner. Until then, placeholder bells synthesised in the repo (own work, CC0). Final sounds: CC0 preferred; CC BY 3.0/4.0 allowed when clearly better. Never NC, ND or Sampling+. Source URL, author and licence of each sound recorded in `SOUNDS.md`.
- Typeface: Inter Tight, SIL Open Font License 1.1.
- Licences screen lists sounds, typeface and all bundled open-source libraries with full licence texts.

## 14. Out of scope for v1

Interval bell generator (designed, postponed); screen transitions; history and statistics screens; streak freezes; sync or accounts; cloud backup; quick sit without a preset; per-bell sounds for interval bells; editing a single bell's time; localisation.
