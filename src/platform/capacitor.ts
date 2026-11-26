import { registerPlugin, type PluginListenerHandle } from '@capacitor/core';
import type { BundledSound, SessionRecord } from '../core';
import { createIdbStorage } from './idb';
import type { Access, Notice, Platform, Runner, Snapshot, StartRequest } from './types';

interface NativeRecord {
  request: StartRequest;
  activeSeconds: number;
  pauseDuration: number;
  ending: SessionRecord['ending'];
}

interface Tick {
  elapsed?: number;
  paused?: boolean;
  notice?: Notice;
  request?: StartRequest;
}

interface SessionPlugin {
  start(options: { request: StartRequest }): Promise<void>;
  pause(): Promise<void>;
  resume(): Promise<void>;
  stop(): Promise<{ record?: NativeRecord }>;
  state(): Promise<Tick>;
  recover(): Promise<{ record?: NativeRecord }>;
  clearJournal(): Promise<void>;
  preview(options: { sound: BundledSound }): Promise<void>;
  stopPreview(): Promise<void>;
  dndAccess(): Promise<{ access: Access }>;
  requestDndAccess(): Promise<{ access: Access }>;
  requestNotifications(): Promise<{ access: Access }>;
  saveFile(options: { name: string; text: string }): Promise<{ saved: boolean }>;
  openFile(): Promise<{ text?: string }>;
  exit(): Promise<void>;
  ready(): Promise<void>;
  addListener(event: 'tick', fn: (t: Tick) => void): Promise<PluginListenerHandle>;
  addListener(
    event: 'finished',
    fn: (e: { record: NativeRecord }) => void,
  ): Promise<PluginListenerHandle>;
  addListener(event: 'back', fn: () => void): Promise<PluginListenerHandle>;
}

export const Session = registerPlugin<SessionPlugin>('Session');

function toRecord(r: NativeRecord): SessionRecord {
  return {
    id: r.request.sessionId,
    startedAt: r.request.startedAt,
    preset: r.request.preset,
    plan: r.request.plan,
    activeSeconds: r.activeSeconds,
    pauseDuration: r.pauseDuration,
    ending: r.ending,
  };
}

/**
 * The Android runner: the native service keeps time and rings the bells; this side
 * only mirrors its state. Between the service's ticks (about one a second) the
 * display is advanced locally so the numerals change on the second.
 */
function createNativeRunner(): Runner {
  let request: StartRequest | null = null;
  let last: { elapsed: number; at: number; paused: boolean; notice: Notice } | null = null;
  let frame: ReturnType<typeof setInterval> | null = null;
  const listeners = new Set<(s: Snapshot | null) => void>();
  const finished = new Set<(r: SessionRecord) => void>();

  const snapshot = (): Snapshot | null => {
    if (!request || !last) return null;
    const drift = last.paused ? 0 : (performance.now() - last.at) / 1000;
    return { request, elapsed: last.elapsed + drift, paused: last.paused, notice: last.notice };
  };
  const emit = () => {
    const s = snapshot();
    for (const l of listeners) l(s);
  };
  const stopFrames = () => {
    if (frame) clearInterval(frame);
    frame = null;
  };
  const clear = () => {
    request = null;
    last = null;
    stopFrames();
    emit();
  };
  const update = (t: Tick) => {
    if (t.request) request = t.request;
    if (t.elapsed === undefined) {
      clear();
      return;
    }
    last = {
      elapsed: t.elapsed,
      at: performance.now(),
      paused: !!t.paused,
      notice: t.notice ?? null,
    };
    if (!frame) frame = setInterval(emit, 200);
    emit();
  };

  void Session.addListener('tick', update);
  void Session.addListener('finished', async ({ record }) => {
    clear();
    const rec = toRecord(record);
    for (const l of finished) l(rec);
    await Session.clearJournal();
  });
  // Coming back to the app: the WebView may have been asleep, so ask for the real state.
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && request) update(await Session.state());
  });

  return {
    async start(req) {
      request = req;
      last = { elapsed: 0, at: performance.now(), paused: false, notice: null };
      await Session.start({ request: req });
      if (!frame) frame = setInterval(emit, 200);
      emit();
    },
    pause: () => void Session.pause(),
    resume: () => void Session.resume(),
    async stop() {
      const { record } = await Session.stop();
      clear();
      return record ? toRecord(record) : null;
    },
    subscribe(listener) {
      listeners.add(listener);
      listener(snapshot());
      return () => listeners.delete(listener);
    },
    onFinished(listener) {
      finished.add(listener);
      return () => finished.delete(listener);
    },
    async active() {
      const t = await Session.state();
      if (!t.request) return null;
      update(t);
      return snapshot();
    },
    async recover() {
      const { record } = await Session.recover();
      return record ? toRecord(record) : null;
    },
    preview: (sound) => Session.preview({ sound }),
    stopPreview: () => void Session.stopPreview(),
  };
}

export async function createCapacitorPlatform(): Promise<Platform> {
  return {
    storage: await createIdbStorage(),
    runner: createNativeRunner(),
    files: {
      async save(name, text) {
        await Session.saveFile({ name, text });
      },
      async open() {
        return (await Session.openFile()).text ?? null;
      },
    },
    device: {
      native: true,
      dndAccess: async () => (await Session.dndAccess()).access,
      requestDndAccess: async () => (await Session.requestDndAccess()).access,
      requestNotifications: async () => (await Session.requestNotifications()).access,
      onBack: (fn) => void Session.addListener('back', fn),
      exit: () => void Session.exit(),
      ready: () => void Session.ready(),
    },
  };
}
