import type { SoundId } from './sounds';

export type Strikes = 1 | 2 | 3;

export interface BellSetting {
  sound: SoundId;
  strikes: Strikes;
}

/** All durations and bell times are whole seconds. Interval bells are in meditation time. */
export interface Preset {
  id: string;
  name: string;
  warmupDuration: number;
  meditationDuration: number;
  startBell: BellSetting;
  intervalBells: number[];
  intervalSound: SoundId;
  endBell: BellSetting;
}

export const LIMITS = {
  nameMax: 24,
  meditationMin: 30,
  meditationMax: 3 * 3600,
  warmupMax: 600,
  /** A bell may not sit this close to the end bell. */
  endGap: 5,
} as const;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(v)));

export function defaultPreset(id: string): Preset {
  return {
    id,
    name: 'Sit',
    warmupDuration: 0,
    meditationDuration: 600,
    startBell: { sound: 'bowl', strikes: 1 },
    intervalBells: [],
    intervalSound: 'small-bell',
    endBell: { sound: 'bowl', strikes: 3 },
  };
}

/** Trimmed name, or null when empty or too long. */
export function normaliseName(name: string): string | null {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= LIMITS.nameMax ? trimmed : null;
}

export function bellFits(at: number, meditationDuration: number): boolean {
  return Number.isInteger(at) && at > 0 && at < meditationDuration - LIMITS.endGap;
}

export function setMeditationDuration(preset: Preset, seconds: number): Preset {
  const meditationDuration = clamp(seconds, LIMITS.meditationMin, LIMITS.meditationMax);
  return {
    ...preset,
    meditationDuration,
    intervalBells: preset.intervalBells.filter((b) => bellFits(b, meditationDuration)),
  };
}

export function setWarmupDuration(preset: Preset, seconds: number): Preset {
  return { ...preset, warmupDuration: clamp(seconds, 0, LIMITS.warmupMax) };
}

/** Midpoint of the largest gap between start, bells and end, or null if no bell fits. */
export function suggestBell(bells: readonly number[], meditationDuration: number): number | null {
  const points = [0, ...bells, meditationDuration];
  let best: number | null = null;
  let widest = 0;
  for (let i = 1; i < points.length; i++) {
    const from = points[i - 1]!;
    const gap = points[i]! - from;
    const at = Math.round(from + gap / 2);
    if (gap > widest && bellFits(at, meditationDuration) && !bells.includes(at)) {
      widest = gap;
      best = at;
    }
  }
  return best;
}

export function addBell(preset: Preset, at: number): Preset {
  if (!bellFits(at, preset.meditationDuration) || preset.intervalBells.includes(at)) return preset;
  return { ...preset, intervalBells: [...preset.intervalBells, at].sort((a, b) => a - b) };
}

export function removeBell(preset: Preset, at: number): Preset {
  return { ...preset, intervalBells: preset.intervalBells.filter((b) => b !== at) };
}
