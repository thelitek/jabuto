# Device checklist

Run on a real Android phone before each release that touches `android/` or the runner. Use the debug APK from the PR's CI run, or the signed APK from the release. Note the phone, Android version and build in the PR.

## Install and first launch

- [ ] Fresh install: the splash shows only the background colour, then Home appears with the streak and the "Sit" preset. No white flash in dark mode, no layout jump.
- [ ] Launcher icon: "Ja" left-aligned in circle, squircle and rounded-square launchers; themed (monochrome) icon on Android 13+.

## First session and permissions

- [ ] Tap "Sit": an explanation sheet comes before the DND settings screen. Granting returns to the app and the session starts.
- [ ] A second explanation comes before the notification prompt (Android 13+).
- [ ] With access refused: the session runs without DND; Setup shows "DND access not granted" with Grant.

## Timing with the screen off

- [ ] Preset with warmup 0:30, length 20:00, bells at 05:00, 10:00, 15:00. Start, lock the screen, leave the phone for the full session. Each bell rings on time (within a second), the end bell strikes as many times as set.
- [ ] Overtime: unlock after the end bell, the screen shows `+mm:ss`.
- [ ] Pause for two minutes in the middle: the later bells move by two minutes.
- [ ] Leave a session in overtime for over an hour: it ends on its own and the streak counts it.

## Sound and volume

- [ ] Ringer on silent, media volume up: bells ring.
- [ ] Media volume at 0: "Media volume is off" at the top of the session screen; turning volume up removes it.
- [ ] Music playing in another app: it dips during each bell and comes back.
- [ ] Vibrate with bells on: each strike vibrates.

## Do Not Disturb

- [ ] DND on in Setup: the DND icon appears at warmup start and goes away after the end bell has rung out. Quick Settings names "Jabuto session" (Android 15+).
- [ ] Turn on your own DND before a session: it is still on after the session.
- [ ] Your own DND blocking media: the session screen says "Do Not Disturb is muting bells".

## Notification

- [ ] Shows the preset name, Warmup/Sitting with a countdown, Overtime counting up.
- [ ] Pause/Resume from the notification works and the app reflects it.
- [ ] End session from the notification ends the session; opening the app shows the updated streak.

## Leaving and dying

- [ ] Back gesture during a session: "End session?" with Keep sitting / End.
- [ ] Switch to another app during a session and back: the time is right.
- [ ] Swipe the app away during a session: the session keeps running (notification stays), bells ring.
- [ ] Force-stop the app (Settings → Apps → Force stop) mid-session: on the next launch the session is in the log as interrupted (streak counts it if ≥ 1 min of meditation) and DND is off.
- [ ] Restart the phone mid-session: same as force-stop.

## Data

- [ ] Export: the system save dialog suggests `jabuto-YYYY-MM-DD.json`; the file opens as JSON.
- [ ] Import that file on another phone (or after clearing app data): presets, order and streak come back.
- [ ] Import a non-Jabuto file: one line of error, nothing changes.
- [ ] Device-to-device transfer (new phone setup, "copy apps and data"): presets and streak arrive on the new phone.
- [ ] Settings → Google → Backup: Jabuto has no cloud backup data.

## Look

- [ ] Light, dark and system themes; status bar and gesture bar readable in both.
- [ ] Largest system font size: nothing overlaps or is cut off on Home, Preset, Session.
- [ ] TalkBack: every control is announced with a meaningful name.
