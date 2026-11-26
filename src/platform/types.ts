import type { BundledSound, LogEntry, Preset, SessionPlan, SessionRecord } from '../core';

export type Theme = 'system' | 'light' | 'dark';

export interface Settings {
  theme: Theme;
  dnd: boolean;
  vibrate: boolean;
}

export const DEFAULT_SETTINGS: Settings = { theme: 'system', dnd: true, vibrate: false };

export interface Storage {
  /** Null on the very first launch, before anything was saved. */
  loadPresets(): Promise<Preset[] | null>;
  savePresets(presets: Preset[]): Promise<void>;
  loadLog(): Promise<LogEntry[]>;
  addLogEntry(entry: LogEntry): Promise<void>;
  /** Import: replaces presets and the whole log in one transaction. */
  replaceAll(presets: Preset[], log: LogEntry[]): Promise<void>;
  loadSettings(): Promise<Settings>;
  saveSettings(settings: Settings): Promise<void>;
}

export interface StartRequest {
  sessionId: string;
  startedAt: string;
  preset: Preset;
  plan: SessionPlan;
  dnd: boolean;
  vibrate: boolean;
}

/** One line at the top of the session screen. */
export type Notice = 'volumeOff' | 'dndMuting' | null;

export interface Snapshot {
  request: StartRequest;
  /** Active seconds since the start of warmup, pauses excluded. */
  elapsed: number;
  paused: boolean;
  notice: Notice;
}

export interface Runner {
  /** Must be called from a user gesture (audio unlock on the web). */
  start(request: StartRequest): Promise<void>;
  pause(): void;
  resume(): void;
  /** Ends the running session at the user's request. */
  stop(): Promise<SessionRecord | null>;
  /** Called on every state change and regularly while a session runs; null when idle. */
  subscribe(listener: (snapshot: Snapshot | null) => void): () => void;
  /** Called once when the session ends on its own (overtime cap). */
  onFinished(listener: (record: SessionRecord) => void): () => void;
  /** A session still running from before the app was opened (Android). */
  active(): Promise<Snapshot | null>;
  /** A session that died with the app (Android journal), to be logged as interrupted. */
  recover(): Promise<SessionRecord | null>;
  /** Plays one strike of a sound; resolves when it has finished or was stopped. */
  preview(sound: BundledSound): Promise<void>;
  stopPreview(): void;
}

export interface Files {
  save(name: string, text: string): Promise<void>;
  /** The chosen file's text, or null if the person cancelled. */
  open(): Promise<string | null>;
}

export type Access = 'granted' | 'denied';

export interface Device {
  /** DND and notifications exist only on Android. */
  native: boolean;
  dndAccess(): Promise<Access>;
  requestDndAccess(): Promise<Access>;
  requestNotifications(): Promise<Access>;
  /** Android's back button or gesture; the web uses the browser's history instead. */
  onBack?(fn: () => void): void;
  /** Leaves the app (Back on the first screen). */
  exit?(): void;
}

export interface Platform {
  storage: Storage;
  runner: Runner;
  files: Files;
  device: Device;
}
