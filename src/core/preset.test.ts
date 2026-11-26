import { describe, expect, it } from 'vite-plus/test';
import {
  addBell,
  bellFits,
  defaultPreset,
  LIMITS,
  normaliseName,
  removeBell,
  setMeditationDuration,
  setWarmupDuration,
  suggestBell,
  type Preset,
} from './preset';

const preset = (over: Partial<Preset> = {}): Preset => ({ ...defaultPreset('p1'), ...over });

describe('defaultPreset', () => {
  it('is 10 minutes, no warmup, start and end bell, no interval bells', () => {
    const p = defaultPreset('id-1');
    expect(p.id).toBe('id-1');
    expect(p.meditationDuration).toBe(600);
    expect(p.warmupDuration).toBe(0);
    expect(p.intervalBells).toEqual([]);
    expect(p.startBell.sound).not.toBe('silent');
    expect(p.endBell.sound).not.toBe('silent');
  });
});

describe('normaliseName', () => {
  it('trims and accepts up to 24 characters', () => {
    expect(normaliseName('  Morning ')).toBe('Morning');
    expect(normaliseName('x'.repeat(24))).toBe('x'.repeat(24));
  });

  it('rejects empty and overlong names', () => {
    expect(normaliseName('   ')).toBeNull();
    expect(normaliseName('x'.repeat(25))).toBeNull();
  });
});

describe('durations', () => {
  it('clamps meditation to 0:30 – 3:00:00', () => {
    expect(setMeditationDuration(preset(), 10).meditationDuration).toBe(LIMITS.meditationMin);
    expect(setMeditationDuration(preset(), 99999).meditationDuration).toBe(LIMITS.meditationMax);
  });

  it('clamps warmup to 0 – 10:00', () => {
    expect(setWarmupDuration(preset(), -5).warmupDuration).toBe(0);
    expect(setWarmupDuration(preset(), 700).warmupDuration).toBe(600);
  });

  it('drops bells that no longer fit when shortened, adds nothing when lengthened', () => {
    const p = preset({ meditationDuration: 1200, intervalBells: [300, 600, 900] });
    expect(setMeditationDuration(p, 605).intervalBells).toEqual([300]);
    expect(setMeditationDuration(p, 2400).intervalBells).toEqual([300, 600, 900]);
  });
});

describe('bellFits', () => {
  it('needs to be after the start and more than 5 s before the end', () => {
    expect(bellFits(0, 600)).toBe(false);
    expect(bellFits(1, 600)).toBe(true);
    expect(bellFits(594, 600)).toBe(true);
    expect(bellFits(595, 600)).toBe(false);
  });
});

describe('suggestBell', () => {
  it('suggests the midpoint of the largest gap', () => {
    expect(suggestBell([], 600)).toBe(300);
    expect(suggestBell([300], 1200)).toBe(750);
    expect(suggestBell([100, 500], 600)).toBe(300);
  });

  it('rounds to whole seconds', () => {
    expect(suggestBell([], 31)).toBe(16);
  });

  it('returns null when nothing fits', () => {
    expect(suggestBell([], 6)).toBeNull();
  });
});

describe('addBell / removeBell', () => {
  it('keeps bells sorted and unique', () => {
    let p = preset({ meditationDuration: 1200, intervalBells: [600] });
    p = addBell(p, 150);
    p = addBell(p, 900);
    p = addBell(p, 600);
    expect(p.intervalBells).toEqual([150, 600, 900]);
  });

  it('ignores bells that do not fit', () => {
    const p = preset({ meditationDuration: 600 });
    expect(addBell(p, 598).intervalBells).toEqual([]);
    expect(addBell(p, 2.5).intervalBells).toEqual([]);
  });

  it('removes a single bell', () => {
    const p = preset({ meditationDuration: 1200, intervalBells: [300, 600, 900] });
    expect(removeBell(p, 600).intervalBells).toEqual([300, 900]);
  });
});
