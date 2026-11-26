import { describe, expect, it } from 'vite-plus/test';
import { defaultPreset, type Preset } from './preset';
import { buildPlan, OVERTIME_CAP, phaseAt, RING_TAIL, STRIKE_SPACING } from './plan';

const preset = (over: Partial<Preset> = {}): Preset => ({ ...defaultPreset('p1'), ...over });

describe('buildPlan', () => {
  it('places bells in session time: warmup first, then meditation', () => {
    const plan = buildPlan(
      preset({
        warmupDuration: 30,
        meditationDuration: 1200,
        intervalBells: [300, 600],
        startBell: { sound: 'bowl', strikes: 1 },
        endBell: { sound: 'deep-bell', strikes: 1 },
      }),
    );
    expect(plan.strikes.map((s) => [s.at, s.role])).toEqual([
      [30, 'start'],
      [330, 'interval'],
      [630, 'interval'],
      [1230, 'end'],
    ]);
    expect(plan.endAt).toBe(1230);
  });

  it('spreads multiple strikes of one bell', () => {
    const plan = buildPlan(
      preset({
        meditationDuration: 600,
        startBell: { sound: 'bowl', strikes: 2 },
        endBell: { sound: 'bowl', strikes: 3 },
      }),
    );
    expect(plan.strikes.map((s) => s.at)).toEqual([
      0,
      STRIKE_SPACING,
      600,
      600 + STRIKE_SPACING,
      600 + 2 * STRIKE_SPACING,
    ]);
  });

  it('leaves out silent bells', () => {
    const plan = buildPlan(
      preset({
        intervalBells: [300],
        intervalSound: 'silent',
        startBell: { sound: 'silent', strikes: 3 },
      }),
    );
    expect(plan.strikes.map((s) => s.role)).toEqual(['end', 'end', 'end']);
  });

  it('keeps DND until the end bell has rung out', () => {
    const plan = buildPlan(
      preset({ meditationDuration: 600, endBell: { sound: 'bowl', strikes: 3 } }),
    );
    expect(plan.dndUntil).toBe(600 + 2 * STRIKE_SPACING + RING_TAIL);
  });

  it('ends DND at the end time when the end bell is silent', () => {
    const plan = buildPlan(
      preset({ meditationDuration: 600, endBell: { sound: 'silent', strikes: 1 } }),
    );
    expect(plan.dndUntil).toBe(600);
  });

  it('caps overtime at 60 minutes', () => {
    const plan = buildPlan(preset({ warmupDuration: 10, meditationDuration: 600 }));
    expect(plan.capAt).toBe(610 + OVERTIME_CAP);
  });
});

describe('phaseAt', () => {
  const plan = buildPlan(preset({ warmupDuration: 30, meditationDuration: 1200 }));

  it('counts down warmup', () => {
    expect(phaseAt(plan, 0)).toEqual({ phase: 'warmup', remaining: 30 });
    expect(phaseAt(plan, 12)).toEqual({ phase: 'warmup', remaining: 18 });
  });

  it('counts down meditation after the start bell', () => {
    expect(phaseAt(plan, 30)).toEqual({ phase: 'sitting', remaining: 1200 });
    expect(phaseAt(plan, 108)).toEqual({ phase: 'sitting', remaining: 1122 });
  });

  it('counts up overtime after the end bell', () => {
    expect(phaseAt(plan, 1230)).toEqual({ phase: 'overtime', overtime: 0 });
    expect(phaseAt(plan, 1364)).toEqual({ phase: 'overtime', overtime: 134 });
  });

  it('is capped once overtime reaches its limit', () => {
    expect(phaseAt(plan, plan.capAt)).toEqual({ phase: 'capped', overtime: OVERTIME_CAP });
  });

  it('skips warmup when it is zero', () => {
    const noWarmup = buildPlan(preset({ warmupDuration: 0, meditationDuration: 600 }));
    expect(phaseAt(noWarmup, 0)).toEqual({ phase: 'sitting', remaining: 600 });
  });
});
