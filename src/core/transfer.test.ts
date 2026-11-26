import { describe, expect, it } from 'vite-plus/test';
import { defaultPreset } from './preset';
import type { LogEntry } from './log';
import { APP_ID, exportFileName, parseImport, serialiseExport, SCHEMA_VERSION } from './transfer';

const presets = [
  defaultPreset('p1'),
  { ...defaultPreset('p2'), name: 'Evening', intervalBells: [120] },
];
const { id: _id, ...snapshot } = defaultPreset('x');
const sessions: LogEntry[] = [
  {
    id: 's1',
    startedAt: '2026-11-26T07:00:00+01:00',
    presetId: 'p1',
    preset: snapshot,
    warmupDuration: 0,
    meditationDuration: 600,
    pauseDuration: 0,
    overtimeDuration: 12,
    outcome: 'completed',
  },
];

const now = new Date(2026, 10, 26, 8, 15, 0);

describe('export', () => {
  it('wraps presets and sessions in a versioned envelope', () => {
    const file = JSON.parse(serialiseExport(presets, sessions, now));
    expect(file.schemaVersion).toBe(SCHEMA_VERSION);
    expect(file.app).toBe(APP_ID);
    expect(file.exportedAt).toMatch(/^2026-11-26T08:15:00/);
    expect(file.presets).toEqual(presets);
    expect(file.sessions).toEqual(sessions);
  });

  it('names the file after the local date', () => {
    expect(exportFileName(now)).toBe('jabuto-2026-11-26.json');
  });
});

describe('import', () => {
  it('round-trips an export', () => {
    const result = parseImport(serialiseExport(presets, sessions, now));
    expect(result).toEqual({ ok: true, presets, sessions });
  });

  it('rejects text that is not JSON', () => {
    expect(parseImport('not json')).toEqual({ ok: false, reason: 'invalid' });
  });

  it('rejects files from another app', () => {
    const text = JSON.stringify({
      ...JSON.parse(serialiseExport(presets, sessions, now)),
      app: 'x',
    });
    expect(parseImport(text)).toEqual({ ok: false, reason: 'otherApp' });
  });

  it('rejects files from a newer version', () => {
    const file = {
      ...JSON.parse(serialiseExport(presets, sessions, now)),
      schemaVersion: SCHEMA_VERSION + 1,
    };
    expect(parseImport(JSON.stringify(file))).toEqual({ ok: false, reason: 'newerVersion' });
  });

  it('rejects malformed presets or sessions as a whole', () => {
    const file = JSON.parse(serialiseExport(presets, sessions, now));
    file.presets[1].meditationDuration = 'long';
    expect(parseImport(JSON.stringify(file))).toEqual({ ok: false, reason: 'invalid' });

    const file2 = JSON.parse(serialiseExport(presets, sessions, now));
    file2.sessions[0].outcome = 'maybe';
    expect(parseImport(JSON.stringify(file2))).toEqual({ ok: false, reason: 'invalid' });
  });

  it('rejects unknown sounds and bells outside the meditation', () => {
    const file = JSON.parse(serialiseExport(presets, sessions, now));
    file.presets[0].startBell.sound = 'trumpet';
    expect(parseImport(JSON.stringify(file)).ok).toBe(false);

    const file2 = JSON.parse(serialiseExport(presets, sessions, now));
    file2.presets[1].intervalBells = [9999];
    expect(parseImport(JSON.stringify(file2)).ok).toBe(false);
  });

  it('rejects duplicate preset ids', () => {
    const file = JSON.parse(serialiseExport([presets[0]!, presets[0]!], [], now));
    expect(parseImport(JSON.stringify(file)).ok).toBe(false);
  });
});
