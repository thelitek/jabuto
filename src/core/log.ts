import type { Preset } from './preset';
import { OVERTIME_CAP, type SessionPlan } from './plan';

export type Outcome = 'completed' | 'endedEarly' | 'interrupted';

/** One finished session. Durations are whole seconds. */
export interface LogEntry {
  id: string;
  /** Start of warmup, ISO 8601 with the device's UTC offset. */
  startedAt: string;
  /** Null once the preset has been deleted. */
  presetId: string | null;
  /** The preset as it was when the session started. */
  preset: Omit<Preset, 'id'>;
  warmupDuration: number;
  /** Pauses and overtime excluded. */
  meditationDuration: number;
  pauseDuration: number;
  overtimeDuration: number;
  outcome: Outcome;
}

/** What a runner knows when a session stops (on Android: the journal). */
export interface SessionRecord {
  id: string;
  startedAt: string;
  preset: Preset;
  plan: SessionPlan;
  /** Seconds the session ran, pauses excluded. */
  activeSeconds: number;
  pauseDuration: number;
  /** `user`: End was pressed; `cap`: overtime ran out; `interrupted`: the app or phone died. */
  ending: 'user' | 'cap' | 'interrupted';
}

const between = (v: number, min: number, max: number) =>
  Math.round(Math.min(max, Math.max(min, v)));

/** The log entry for a stopped session, or null if it never got past warmup. */
export function logEntryFor(record: SessionRecord): LogEntry | null {
  const { plan, activeSeconds } = record;
  if (activeSeconds < plan.warmupDuration) return null;
  const reachedEnd = activeSeconds >= plan.endAt;
  const { id: presetId, ...snapshot } = record.preset;
  return {
    id: record.id,
    startedAt: record.startedAt,
    presetId,
    preset: snapshot,
    warmupDuration: plan.warmupDuration,
    meditationDuration: between(activeSeconds - plan.warmupDuration, 0, plan.meditationDuration),
    pauseDuration: Math.round(Math.max(0, record.pauseDuration)),
    overtimeDuration: between(activeSeconds - plan.endAt, 0, OVERTIME_CAP),
    outcome: reachedEnd
      ? 'completed'
      : record.ending === 'interrupted'
        ? 'interrupted'
        : 'endedEarly',
  };
}
