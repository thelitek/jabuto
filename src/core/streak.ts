import type { LogEntry } from './log';
import { addDays, localDay } from './time';

/** Seconds of meditation that make an unfinished session count for its day. */
export const QUALIFYING_MEDITATION = 60;

export function qualifies(entry: LogEntry): boolean {
  return entry.outcome === 'completed' || entry.meditationDuration >= QUALIFYING_MEDITATION;
}

/**
 * Consecutive qualifying days ending today. If today has nothing yet, a run
 * ending yesterday still counts: the day is not over.
 */
export function streak(log: readonly LogEntry[], today: string): number {
  const days = new Set(log.filter(qualifies).map((e) => localDay(e.startedAt)));
  let day = days.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (days.has(day)) {
    count++;
    day = addDays(day, -1);
  }
  return count;
}
