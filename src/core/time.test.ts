import { describe, expect, it } from 'vite-plus/test';
import { addDays, formatClock, formatOvertime, localDay, parseClock, toLocalIso } from './time';

describe('formatClock', () => {
  it('shows minutes and seconds below an hour', () => {
    expect(formatClock(0)).toBe('00:00');
    expect(formatClock(150)).toBe('02:30');
    expect(formatClock(3599)).toBe('59:59');
  });

  it('adds hours from one hour up', () => {
    expect(formatClock(3600)).toBe('1:00:00');
    expect(formatClock(10800)).toBe('3:00:00');
  });

  it('rounds fractional seconds up so a countdown never shows 00:00 early', () => {
    expect(formatClock(0.2)).toBe('00:01');
  });
});

describe('formatOvertime', () => {
  it('prefixes a plus sign', () => {
    expect(formatOvertime(134)).toBe('+02:14');
  });

  it('rounds down so overtime starts at +00:00', () => {
    expect(formatOvertime(0.9)).toBe('+00:00');
  });
});

describe('local dates', () => {
  it('writes ISO 8601 with the local UTC offset', () => {
    const date = new Date(2026, 10, 26, 7, 5, 9);
    const iso = toLocalIso(date);
    expect(iso).toMatch(/^2026-11-26T07:05:09[+-]\d{2}:\d{2}$/);
    expect(new Date(iso).getTime()).toBe(date.getTime());
  });

  it('takes the calendar day as written, in the offset it was recorded in', () => {
    expect(localDay('2026-11-26T23:30:00+09:00')).toBe('2026-11-26');
    expect(localDay('2026-11-26T00:10:00-05:00')).toBe('2026-11-26');
  });

  it('moves days across month and year ends', () => {
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  });
});

describe('parseClock', () => {
  it('reads m:ss and h:mm:ss', () => {
    expect(parseClock('2:30')).toBe(150);
    expect(parseClock('02:30')).toBe(150);
    expect(parseClock('1:00:00')).toBe(3600);
    expect(parseClock(' 90:00 ')).toBe(5400);
  });

  it('reads a plain number as minutes', () => {
    expect(parseClock('20')).toBe(1200);
  });

  it('rejects anything else', () => {
    expect(parseClock('')).toBeNull();
    expect(parseClock('2:75')).toBeNull();
    expect(parseClock('1:60:00')).toBeNull();
    expect(parseClock('abc')).toBeNull();
    expect(parseClock('1:2:3:4')).toBeNull();
  });
});
