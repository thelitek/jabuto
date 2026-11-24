# Jabuto — domain glossary

Jabuto is a meditation timer for Android (web later). No account; data stays on the device.

## Terms

**Preset**
A saved session plan: name, warmup duration, meditation duration, start bell, interval bells, end bell. Presets are ordered by the user. Starting a session always starts from a preset.

**Session**
One run of a preset, from the start of warmup until the user ends it. Each session that gets past warmup becomes one **log entry**.

**Warmup**
Optional time before the start bell for settling in. Not meditation: it never counts toward meditation duration or the streak.

**Meditation duration**
The planned time between the start bell and the end bell. Pauses are excluded; warmup and overtime are not part of it. Shown on the preset row on Home.

**Bell**
A sound event in a session. Three roles:
- **Start bell** — ends warmup and begins meditation.
- **Interval bell** — at a point in meditation time, to the second.
- **End bell** — ends planned meditation and begins overtime.

Each role has a **sound** (one of the bundled sounds, or Silent). Start and end bells also have a **strike count** (1–3). All interval bells share one sound and strike once.

**Generator**
Fills a preset's interval bells from an interval ("every 02:30"). Regenerating replaces the whole list, including bells added by hand. With no interval it clears the list.

**Overtime**
Time after the end bell until the user presses End. Shown as `+mm:ss`. Capped at 60 minutes, then the session ends on its own.

**Streak**
The number of consecutive local calendar days, ending today or yesterday, that each have at least one **qualifying session**: a completed session, or one with meditation duration ≥ 60 s.

**Log**
The list of all sessions that got past warmup. The source of truth for the streak. Not shown in the app; included in export.

**Outcome**
How a session ended: `completed` (reached the end bell), `endedEarly` (user ended before the end bell), `interrupted` (app was killed or the device restarted).

**Export file**
A single versioned JSON file with presets and the log. Import replaces both.
