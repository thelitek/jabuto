import type { BundledSound, SessionRecord, Strike } from '../core';
import type { Runner, Snapshot, StartRequest } from './types';

interface Running {
  request: StartRequest;
  /** performance.now() at the start of warmup. */
  t0: number;
  pausedMs: number;
  pauseStart: number | null;
  /** Strikes handed to the audio clock and not yet played, cancelled on pause. */
  scheduled: AudioBufferSourceNode[];
  vibrations: number[];
}

/** Strikes scheduled so far; read by the end-to-end tests. */
export const scheduledStrikes: Strike[] = [];
(globalThis as { __jabuto?: unknown }).__jabuto = { scheduledStrikes };

const ext = () =>
  typeof Audio !== 'undefined' && new Audio().canPlayType('audio/ogg; codecs="vorbis"')
    ? 'ogg'
    : 'mp3';

/**
 * Runs sessions in the browser. Bells are scheduled up front on the Web Audio
 * clock, which keeps time while the page's timers are throttled; the display is
 * derived from performance.now() whenever the page is awake. A screen wake lock
 * keeps the screen on during a session.
 */
export function createWebRunner(): Runner {
  let ctx: AudioContext | null = null;
  const buffers = new Map<BundledSound, Promise<AudioBuffer | null>>();
  let running: Running | null = null;
  let ticker: ReturnType<typeof setInterval> | null = null;
  let wakeLock: WakeLockSentinel | null = null;
  let previewing: AudioBufferSourceNode | null = null;
  const listeners = new Set<(s: Snapshot | null) => void>();
  const finishedListeners = new Set<(r: SessionRecord) => void>();

  function audio(): AudioContext {
    if (!ctx) {
      ctx = new AudioContext();
      // Safari: treat bells as media, not affected by the silent switch.
      const session = (navigator as { audioSession?: { type: string } }).audioSession;
      if (session) session.type = 'playback';
    }
    void ctx.resume();
    return ctx;
  }

  function buffer(sound: BundledSound): Promise<AudioBuffer | null> {
    let b = buffers.get(sound);
    if (!b) {
      const context = audio();
      b = fetch(new URL(`sounds/${sound}.${ext()}`, document.baseURI))
        .then((r) => r.arrayBuffer())
        .then((data) => context.decodeAudioData(data))
        .catch(() => null);
      buffers.set(sound, b);
    }
    return b;
  }

  const now = () => performance.now();

  function elapsed(r: Running): number {
    const paused = r.pausedMs + (r.pauseStart === null ? 0 : now() - r.pauseStart);
    return (now() - r.t0 - paused) / 1000;
  }

  function snapshot(): Snapshot | null {
    if (!running) return null;
    return {
      request: running.request,
      elapsed: elapsed(running),
      paused: running.pauseStart !== null,
      notice: null,
    };
  }

  function emit() {
    const s = snapshot();
    for (const l of listeners) l(s);
    if (running && s && s.elapsed >= running.request.plan.capAt) finish('cap');
  }

  function schedule(r: Running) {
    const context = audio();
    const from = elapsed(r);
    for (const strike of r.request.plan.strikes) {
      if (strike.at < from - 0.05) continue;
      void buffer(strike.sound).then((b) => {
        if (!b || running !== r || r.pauseStart !== null) return;
        const delay = strike.at - elapsed(r);
        if (delay < -0.25) return;
        const source = context.createBufferSource();
        source.buffer = b;
        source.connect(context.destination);
        source.start(context.currentTime + Math.max(0, delay));
        r.scheduled.push(source);
        scheduledStrikes.push(strike);
        if (r.request.vibrate && 'vibrate' in navigator) {
          r.vibrations.push(
            window.setTimeout(() => navigator.vibrate(200), Math.max(0, delay) * 1000),
          );
        }
      });
    }
  }

  function unschedule(r: Running) {
    // Strikes already ringing finish naturally; only future ones are cancelled.
    const t = ctx?.currentTime ?? 0;
    for (const s of r.scheduled) {
      try {
        s.stop(t);
      } catch {
        /* already ended */
      }
    }
    r.scheduled = [];
    for (const v of r.vibrations) clearTimeout(v);
    r.vibrations = [];
  }

  async function lockScreen() {
    try {
      wakeLock = (await navigator.wakeLock?.request('screen')) ?? null;
    } catch {
      wakeLock = null;
    }
  }

  function onVisibility() {
    if (document.visibilityState === 'visible' && running) {
      void lockScreen();
      emit();
    }
  }

  function record(r: Running, ending: SessionRecord['ending']): SessionRecord {
    const { request } = r;
    return {
      id: request.sessionId,
      startedAt: request.startedAt,
      preset: request.preset,
      plan: request.plan,
      activeSeconds: Math.min(elapsed(r), request.plan.capAt),
      pauseDuration: (r.pausedMs + (r.pauseStart === null ? 0 : now() - r.pauseStart)) / 1000,
      ending,
    };
  }

  function teardown() {
    if (running) unschedule(running);
    running = null;
    if (ticker) clearInterval(ticker);
    ticker = null;
    void wakeLock?.release().catch(() => {});
    wakeLock = null;
    document.removeEventListener('visibilitychange', onVisibility);
    emit();
  }

  function finish(ending: SessionRecord['ending']): SessionRecord | null {
    if (!running) return null;
    const rec = record(running, ending);
    teardown();
    if (ending === 'cap') for (const l of finishedListeners) l(rec);
    return rec;
  }

  return {
    async start(request) {
      audio();
      if (running) teardown();
      running = {
        request,
        t0: now(),
        pausedMs: 0,
        pauseStart: null,
        scheduled: [],
        vibrations: [],
      };
      scheduledStrikes.length = 0;
      schedule(running);
      ticker = setInterval(emit, 200);
      document.addEventListener('visibilitychange', onVisibility);
      await lockScreen();
      emit();
    },

    pause() {
      if (!running || running.pauseStart !== null) return;
      running.pauseStart = now();
      unschedule(running);
      emit();
    },

    resume() {
      if (!running || running.pauseStart === null) return;
      running.pausedMs += now() - running.pauseStart;
      running.pauseStart = null;
      schedule(running);
      emit();
    },

    async stop() {
      return finish('user');
    },

    subscribe(listener) {
      listeners.add(listener);
      listener(snapshot());
      return () => listeners.delete(listener);
    },

    onFinished(listener) {
      finishedListeners.add(listener);
      return () => finishedListeners.delete(listener);
    },

    async active() {
      return snapshot();
    },

    async recover() {
      // A closed tab loses its session; there is nothing to recover on the web.
      return null;
    },

    async preview(sound) {
      this.stopPreview();
      const context = audio();
      const b = await buffer(sound);
      if (!b) return;
      const source = context.createBufferSource();
      source.buffer = b;
      source.connect(context.destination);
      previewing = source;
      await new Promise<void>((resolve) => {
        source.onended = () => resolve();
        source.start();
      });
      if (previewing === source) previewing = null;
    },

    stopPreview() {
      try {
        previewing?.stop();
      } catch {
        /* not started */
      }
      previewing = null;
    },
  };
}
