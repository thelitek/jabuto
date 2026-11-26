import { describe, expect, it } from 'vite-plus/test';
import type { LogEntry } from './log';
import { qualifies, streak } from './streak';

const entry = (startedAt: string, over: Partial<LogEntry> = {}): LogEntry => ({
  id: startedAt,
  startedAt,
  presetId: null,
  preset: {
    name: 'Sit',
    warmupDuration: 0,
    meditationDuration: 600,
    startBell: { sound: 'bowl', strikes: 1 },
    intervalBells: [],
    intervalSound: 'small-bell',
    endBell: { sound: 'bowl', strikes: 1 },
  },
  warmupDuration: 0,
  meditationDuration: 600,
  pauseDuration: 0,
  overtimeDuration: 0,
  outcome: 'completed',
  ...over,
});

describe('qualifies', () => {
  it('counts completed sessions', () => {
    expect(qualifies(entry('2026-11-26T07:00:00+01:00', { meditationDuration: 30 }))).toBe(true);
  });

  it('counts unfinished sessions with at least a minute of meditation', () => {
    expect(
      qualifies(
        entry('2026-11-26T07:00:00+01:00', { outcome: 'endedEarly', meditationDuration: 60 }),
      ),
    ).toBe(true);
    expect(
      qualifies(
        entry('2026-11-26T07:00:00+01:00', { outcome: 'interrupted', meditationDuration: 59 }),
      ),
    ).toBe(false);
  });
});

describe('streak', () => {
  const today = '2026-11-26';

  it('is zero without sessions', () => {
    expect(streak([], today)).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    const log = [
      entry('2026-11-24T21:00:00+01:00'),
      entry('2026-11-25T07:00:00+01:00'),
      entry('2026-11-26T07:00:00+01:00'),
      entry('2026-11-26T19:00:00+01:00'),
    ];
    expect(streak(log, today)).toBe(3);
  });

  it('still shows a streak ending yesterday', () => {
    const log = [entry('2026-11-24T07:00:00+01:00'), entry('2026-11-25T07:00:00+01:00')];
    expect(streak(log, today)).toBe(2);
  });

  it('is broken by a missed day', () => {
    const log = [entry('2026-11-23T07:00:00+01:00'), entry('2026-11-26T07:00:00+01:00')];
    expect(streak(log, today)).toBe(1);
    expect(streak([entry('2026-11-24T07:00:00+01:00')], today)).toBe(0);
  });

  it('ignores sessions that do not qualify', () => {
    const log = [
      entry('2026-11-25T07:00:00+01:00'),
      entry('2026-11-26T07:00:00+01:00', { outcome: 'endedEarly', meditationDuration: 20 }),
    ];
    expect(streak(log, today)).toBe(1);
  });

  it('uses the day the session was recorded on, not UTC', () => {
    const log = [entry('2026-11-25T23:30:00-08:00'), entry('2026-11-26T00:30:00+09:00')];
    expect(streak(log, today)).toBe(2);
  });
});
