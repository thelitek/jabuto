import { computed, signal } from '@preact/signals-core';
import {
  buildPlan,
  defaultPreset,
  logEntryFor,
  parseImport,
  serialiseExport,
  exportFileName,
  streak,
  today,
  toLocalIso,
  type ImportResult,
  type LogEntry,
  type Preset,
  type SessionRecord,
} from '../core';
import { DEFAULT_SETTINGS, type Platform, type Settings, type Snapshot } from '../platform';
import { back, navigate, setGuard } from './router';

let platform: Platform;

export const presets = signal<Preset[]>([]);
export const log = signal<LogEntry[]>([]);
export const settings = signal<Settings>(DEFAULT_SETTINGS);
export const session = signal<Snapshot | null>(null);
/** Shown on the session screen after a back gesture. */
export const confirmingEnd = signal(false);
/** Whether DND access was refused (Android only). */
export const dndDenied = signal(false);
/** A one-line explanation shown before a system permission prompt. */
export const explanation = signal<{ text: string; answer: (ok: boolean) => void } | null>(null);

function explain(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    explanation.value = {
      text,
      answer: (ok) => {
        explanation.value = null;
        resolve(ok);
      },
    };
  });
}

const day = signal(today());
export const currentStreak = computed(() => streak(log.value, day.value));

export function getPlatform(): Platform {
  return platform;
}

export async function init(p: Platform) {
  platform = p;
  const { storage, runner } = p;
  const [stored, entries, s] = await Promise.all([
    storage.loadPresets(),
    storage.loadLog(),
    storage.loadSettings(),
  ]);
  settings.value = s;
  log.value = entries;
  if (stored === null) {
    presets.value = [defaultPreset(crypto.randomUUID())];
    await storage.savePresets(presets.value);
  } else {
    presets.value = stored;
  }
  if (p.device.native) dndDenied.value = s.dnd && (await p.device.dndAccess()) === 'denied';

  const lost = await runner.recover();
  if (lost) await record(lost);

  runner.subscribe((snap) => (session.value = snap));
  runner.onFinished((rec) => void finish(rec));
  const running = await runner.active();
  if (running) {
    session.value = running;
    guardSession();
    navigate({ name: 'session' }, { replace: true });
  }

  p.device.onBack?.(() => {
    if (explanation.value) explanation.value.answer(false);
    else if (confirmingEnd.value) keepSitting();
    else if (!back()) p.device.exit?.();
  });

  // Keep "today" current for the streak when the app stays open past midnight.
  setInterval(() => (day.value = today()), 60_000);
  document.addEventListener('visibilitychange', () => (day.value = today()));
}

async function record(rec: SessionRecord) {
  const entry = logEntryFor(rec);
  if (!entry) return;
  await platform.storage.addLogEntry(entry);
  log.value = [...log.value, entry];
}

async function finish(rec: SessionRecord | null) {
  setGuard(null);
  confirmingEnd.value = false;
  if (rec) await record(rec);
  navigate({ name: 'home' }, { replace: true });
}

function guardSession() {
  setGuard((to) => {
    if (to.name === 'session') return true;
    confirmingEnd.value = true;
    return false;
  });
}

// Presets

async function savePresets(next: Preset[]) {
  presets.value = next;
  await platform.storage.savePresets(next);
}

export function findPreset(id: string): Preset | undefined {
  return presets.value.find((p) => p.id === id);
}

export function updatePreset(preset: Preset) {
  void savePresets(presets.value.map((p) => (p.id === preset.id ? preset : p)));
}

export function createPreset(): Preset {
  const preset = defaultPreset(crypto.randomUUID());
  void savePresets([...presets.value, preset]);
  return preset;
}

export function deletePreset(id: string) {
  void savePresets(presets.value.filter((p) => p.id !== id));
}

export function reorderPresets(ids: string[]) {
  const byId = new Map(presets.value.map((p) => [p.id, p]));
  const next = ids.map((id) => byId.get(id)).filter((p): p is Preset => p !== undefined);
  if (next.length === presets.value.length) void savePresets(next);
}

// Settings

export function updateSettings(patch: Partial<Settings>) {
  settings.value = { ...settings.value, ...patch };
  void platform.storage.saveSettings(settings.value);
}

export async function setDnd(on: boolean) {
  updateSettings({ dnd: on });
  if (!platform.device.native) return;
  dndDenied.value = on && (await platform.device.dndAccess()) === 'denied';
}

export async function grantDnd() {
  dndDenied.value = (await platform.device.requestDndAccess()) === 'denied';
}

// Sessions

const PERMISSIONS_ASKED = 'jabuto.permissionsAsked';

/** First session start on Android: ask for DND access, then notifications. */
async function askPermissionsOnce() {
  const { device } = platform;
  if (!device.native) return;
  let asked = false;
  try {
    asked = localStorage.getItem(PERMISSIONS_ASKED) === '1';
    localStorage.setItem(PERMISSIONS_ASKED, '1');
  } catch {
    /* storage unavailable: ask again next time */
  }
  if (asked) return;
  if (settings.value.dnd && (await device.dndAccess()) === 'denied') {
    const ok = await explain(
      'Jabuto turns on Do Not Disturb from warmup to the end bell. Allow it on the next screen.',
    );
    dndDenied.value = !ok || (await device.requestDndAccess()) === 'denied';
  }
  if (await explain('Jabuto shows the time left, Pause and End in a notification while you sit.')) {
    await device.requestNotifications();
  }
}

export async function startSession(preset: Preset) {
  const { runner } = platform;
  const request = {
    sessionId: crypto.randomUUID(),
    startedAt: toLocalIso(new Date()),
    preset,
    plan: buildPlan(preset),
    dnd: settings.value.dnd,
    vibrate: settings.value.vibrate,
  };
  // Android asks for permissions before the first session. The web runner needs
  // the tap itself to unlock audio, so there it must start before any await.
  if (platform.device.native) await askPermissionsOnce();
  await runner.start(request);
  guardSession();
  navigate({ name: 'session' });
}

export function pauseSession() {
  platform.runner.pause();
}

export function resumeSession() {
  platform.runner.resume();
}

export async function endSession() {
  await finish(await platform.runner.stop());
}

export function keepSitting() {
  confirmingEnd.value = false;
}

// Import / export

export async function exportData() {
  await platform.files.save(exportFileName(), serialiseExport(presets.value, log.value));
}

export async function readImport(): Promise<ImportResult | null> {
  const text = await platform.files.open();
  return text === null ? null : parseImport(text);
}

export async function applyImport(result: Extract<ImportResult, { ok: true }>) {
  await platform.storage.replaceAll(result.presets, result.sessions);
  presets.value = result.presets;
  log.value = [...result.sessions].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
}
