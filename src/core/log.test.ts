import { describe, expect, it } from 'vite-plus/test';
import { defaultPreset, type Preset } from './preset';
import { buildPlan } from './plan';
import { logEntryFor, type SessionRecord } from './log';

const preset: Preset = { ...defaultPreset('p1'), warmupDuration: 30, meditationDuration: 1200 };
const plan = buildPlan(preset);

const record = (over: Partial<SessionRecord>): SessionRecord => ({
  id: 's1',
  startedAt: '2026-11-26T07:00:00+01:00',
  preset,
  plan,
  activeSeconds: 0,
  pauseDuration: 0,
  ending: 'user',
  ...over,
});

describe('logEntryFor', () => {
  it('logs nothing for a session abandoned during warmup', () => {
    expect(logEntryFor(record({ activeSeconds: 29 }))).toBeNull();
  });

  it('splits active time into warmup, meditation and overtime', () => {
    const entry = logEntryFor(record({ activeSeconds: 30 + 1200 + 134, pauseDuration: 40 }));
    expect(entry).toMatchObject({
      id: 's1',
      startedAt: '2026-11-26T07:00:00+01:00',
      presetId: 'p1',
      warmupDuration: 30,
      meditationDuration: 1200,
      pauseDuration: 40,
      overtimeDuration: 134,
      outcome: 'completed',
    });
    expect(entry?.preset.name).toBe(preset.name);
  });

  it('is endedEarly when the user ends before the end bell', () => {
    expect(logEntryFor(record({ activeSeconds: 30 + 500 }))).toMatchObject({
      meditationDuration: 500,
      overtimeDuration: 0,
      outcome: 'endedEarly',
    });
  });

  it('is interrupted when the app died before the end bell', () => {
    expect(logEntryFor(record({ activeSeconds: 30 + 500, ending: 'interrupted' }))?.outcome).toBe(
      'interrupted',
    );
  });

  it('is completed once the end bell was reached, however it ended', () => {
    expect(logEntryFor(record({ activeSeconds: 30 + 1200, ending: 'interrupted' }))?.outcome).toBe(
      'completed',
    );
  });

  it('rounds to whole seconds and caps overtime', () => {
    const entry = logEntryFor(record({ activeSeconds: 30 + 1200 + 99999.6, pauseDuration: 3.4 }));
    expect(entry?.overtimeDuration).toBe(3600);
    expect(entry?.pauseDuration).toBe(3);
  });

  it('keeps the preset snapshot without the id', () => {
    const entry = logEntryFor(record({ activeSeconds: 100 }));
    expect(entry?.preset).not.toHaveProperty('id');
  });
});
