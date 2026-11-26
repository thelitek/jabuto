import { bellFits, LIMITS, type BellSetting, type Preset } from './preset';
import type { LogEntry, Outcome } from './log';
import { SOUND_IDS } from './sounds';
import { toLocalIso, today } from './time';

export const APP_ID = 'net.litynski.jabuto';
export const SCHEMA_VERSION = 1;

export interface ExportFile {
  schemaVersion: number;
  app: string;
  exportedAt: string;
  presets: Preset[];
  sessions: LogEntry[];
}

export type ImportResult =
  | { ok: true; presets: Preset[]; sessions: LogEntry[] }
  | { ok: false; reason: 'invalid' | 'otherApp' | 'newerVersion' };

/**
 * Upgrades a file one schema version at a time. Key n turns version n into n + 1.
 * Empty until the format changes for the first time.
 */
const MIGRATIONS: Record<number, (file: Record<string, unknown>) => Record<string, unknown>> = {};

export function serialiseExport(presets: Preset[], sessions: LogEntry[], now = new Date()): string {
  const file: ExportFile = {
    schemaVersion: SCHEMA_VERSION,
    app: APP_ID,
    exportedAt: toLocalIso(now),
    presets,
    sessions,
  };
  return JSON.stringify(file, null, 2);
}

export function exportFileName(now = new Date()): string {
  return `jabuto-${today(now)}.json`;
}

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isInt = (v: unknown, min: number, max: number): v is number =>
  Number.isInteger(v) && (v as number) >= min && (v as number) <= max;
const isStr = (v: unknown): v is string => typeof v === 'string' && v.length > 0;
const OUTCOMES: readonly Outcome[] = ['completed', 'endedEarly', 'interrupted'];
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)$/;

function isBell(v: unknown): v is BellSetting {
  return isObj(v) && SOUND_IDS.includes(v.sound as never) && isInt(v.strikes, 1, 3);
}

function isPresetBody(v: Obj): boolean {
  const name = v.name;
  return (
    typeof name === 'string' &&
    name.trim() === name &&
    name.length > 0 &&
    name.length <= LIMITS.nameMax &&
    isInt(v.warmupDuration, 0, LIMITS.warmupMax) &&
    isInt(v.meditationDuration, LIMITS.meditationMin, LIMITS.meditationMax) &&
    isBell(v.startBell) &&
    isBell(v.endBell) &&
    SOUND_IDS.includes(v.intervalSound as never) &&
    Array.isArray(v.intervalBells) &&
    v.intervalBells.every((b) => bellFits(b as number, v.meditationDuration as number))
  );
}

function isPreset(v: unknown): v is Preset {
  return isObj(v) && isStr(v.id) && isPresetBody(v);
}

function isLogEntry(v: unknown): v is LogEntry {
  return (
    isObj(v) &&
    isStr(v.id) &&
    typeof v.startedAt === 'string' &&
    ISO.test(v.startedAt) &&
    (v.presetId === null || isStr(v.presetId)) &&
    isObj(v.preset) &&
    isPresetBody(v.preset) &&
    isInt(v.warmupDuration, 0, LIMITS.warmupMax) &&
    isInt(v.meditationDuration, 0, LIMITS.meditationMax) &&
    isInt(v.pauseDuration, 0, Number.MAX_SAFE_INTEGER) &&
    isInt(v.overtimeDuration, 0, 3600) &&
    OUTCOMES.includes(v.outcome as Outcome)
  );
}

/** Validates a whole file. Nothing is imported unless everything is valid. */
export function parseImport(text: string): ImportResult {
  let file: unknown;
  try {
    file = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'invalid' };
  }
  if (!isObj(file)) return { ok: false, reason: 'invalid' };
  if (file.app !== APP_ID) return { ok: false, reason: 'otherApp' };
  if (!isInt(file.schemaVersion, 1, Number.MAX_SAFE_INTEGER))
    return { ok: false, reason: 'invalid' };
  if (file.schemaVersion > SCHEMA_VERSION) return { ok: false, reason: 'newerVersion' };

  let current: Obj = file;
  for (let v = file.schemaVersion; v < SCHEMA_VERSION; v++) {
    const migrate = MIGRATIONS[v];
    if (!migrate) return { ok: false, reason: 'invalid' };
    current = migrate(current);
  }

  const { presets, sessions } = current;
  if (!Array.isArray(presets) || !presets.every(isPreset)) return { ok: false, reason: 'invalid' };
  if (!Array.isArray(sessions) || !sessions.every(isLogEntry))
    return { ok: false, reason: 'invalid' };
  if (new Set(presets.map((p) => p.id)).size !== presets.length)
    return { ok: false, reason: 'invalid' };
  return { ok: true, presets, sessions };
}
