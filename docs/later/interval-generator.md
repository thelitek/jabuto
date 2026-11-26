# Interval bell generator (postponed)

Agreed during requirements, then taken out of v1 to keep it lean. v1 has only manual Add bell / Remove.
When it comes back, these are the decisions already made:

- Input: an interval in `mm:ss`, or none. Steppers −1:00 / −0:10 / +0:10 / +1:00.
- **Generate** fills the interval bells: first at 1 × interval, then every interval, skipping anything within 5 s of the end.
- Generate replaces the whole list, including bells added by hand. No confirmation (consistent with delete preset).
- Interval "none" + Generate clears the list.
- After generating, the bells are a plain list: each can be removed, more can be added by hand.
- Changing the meditation duration does not regenerate: bells that no longer fit are dropped, nothing is added when it grows.

Layout (preset editor, Interval bells section): `Every  05:00` with **Generate** on the same line, steppers below, then the Sound row, the bell list, Add bell, and the fixed End row. A working version was on the design canvas, board "2 · Preset", before it was removed.
