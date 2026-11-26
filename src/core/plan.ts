import type { BellSetting, Preset } from './preset';
import type { BundledSound } from './sounds';

/** Seconds between strikes of the same bell. */
export const STRIKE_SPACING = 4;
/** How long DND stays on after the last end strike, so the bell rings out undisturbed. */
export const RING_TAIL = 10;
/** Overtime ends the session on its own after this long. */
export const OVERTIME_CAP = 3600;

export type BellRole = 'start' | 'interval' | 'end';

export interface Strike {
  /** Active session seconds (pauses excluded) from the start of warmup. */
  at: number;
  role: BellRole;
  sound: BundledSound;
}

/**
 * Everything a runner needs to execute a session. Times are active session
 * seconds from the start of warmup; pauses shift them in clock time only.
 */
export interface SessionPlan {
  warmupDuration: number;
  meditationDuration: number;
  /** When the end bell sounds and overtime begins. */
  endAt: number;
  /** When the session ends on its own. */
  capAt: number;
  /** When DND is released if the session is still running. */
  dndUntil: number;
  strikes: Strike[];
}

export type Phase =
  | { phase: 'warmup'; remaining: number }
  | { phase: 'sitting'; remaining: number }
  | { phase: 'overtime'; overtime: number }
  | { phase: 'capped'; overtime: number };

function strikesOf(bell: BellSetting, at: number, role: BellRole): Strike[] {
  if (bell.sound === 'silent') return [];
  const sound = bell.sound;
  return Array.from({ length: bell.strikes }, (_, i) => ({
    at: at + i * STRIKE_SPACING,
    role,
    sound,
  }));
}

export function buildPlan(preset: Preset): SessionPlan {
  const w = preset.warmupDuration;
  const endAt = w + preset.meditationDuration;
  const intervalSound = preset.intervalSound;
  const interval: Strike[] =
    intervalSound === 'silent'
      ? []
      : preset.intervalBells.map((b) => ({ at: w + b, role: 'interval', sound: intervalSound }));
  const end = strikesOf(preset.endBell, endAt, 'end');
  const lastEnd = end.at(-1);
  return {
    warmupDuration: w,
    meditationDuration: preset.meditationDuration,
    endAt,
    capAt: endAt + OVERTIME_CAP,
    dndUntil: lastEnd ? lastEnd.at + RING_TAIL : endAt,
    strikes: [...strikesOf(preset.startBell, w, 'start'), ...interval, ...end],
  };
}

/** What to show after `elapsed` active seconds. */
export function phaseAt(plan: SessionPlan, elapsed: number): Phase {
  if (elapsed < plan.warmupDuration)
    return { phase: 'warmup', remaining: plan.warmupDuration - elapsed };
  if (elapsed < plan.endAt) return { phase: 'sitting', remaining: plan.endAt - elapsed };
  if (elapsed < plan.capAt) return { phase: 'overtime', overtime: elapsed - plan.endAt };
  return { phase: 'capped', overtime: OVERTIME_CAP };
}
