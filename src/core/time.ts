const pad = (n: number) => String(n).padStart(2, '0');

function clock(total: number): string {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/** Remaining or planned time: `mm:ss`, or `h:mm:ss` from one hour. */
export function formatClock(seconds: number): string {
  return clock(Math.max(0, Math.ceil(seconds)));
}

/** Time past the end bell: `+mm:ss`. */
export function formatOvertime(seconds: number): string {
  return '+' + clock(Math.max(0, Math.floor(seconds)));
}

/** ISO 8601 with the device's UTC offset, e.g. `2026-11-26T07:05:09+01:00`. */
export function toLocalIso(date: Date): string {
  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const abs = Math.abs(offset);
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  );
}

/** The calendar day a timestamp was recorded on, in the offset it carries. */
export function localDay(iso: string): string {
  return iso.slice(0, 10);
}

/** Today's calendar day on this device. */
export function today(now: Date = new Date()): string {
  return localDay(toLocalIso(now));
}

export function addDays(day: string, days: number): string {
  const date = new Date(`${day}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
