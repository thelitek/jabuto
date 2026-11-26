import type { LogEntry, Preset } from '../core';
import { DEFAULT_SETTINGS, type Settings, type Storage } from './types';

const DB = 'jabuto';
const VERSION = 1;

function request<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

function open(): Promise<IDBDatabase> {
  const req = indexedDB.open(DB, VERSION);
  req.onupgradeneeded = () => {
    const db = req.result;
    db.createObjectStore('kv');
    db.createObjectStore('log', { keyPath: 'id' });
  };
  return request(req);
}

/** Presets (one ordered list), settings and the log, all in IndexedDB. */
export async function createIdbStorage(): Promise<Storage> {
  const db = await open();
  // Ask the browser not to evict our data under storage pressure. Best effort.
  void navigator.storage?.persist?.();

  const get = async <T>(key: string): Promise<T | undefined> =>
    request(db.transaction('kv').objectStore('kv').get(key)) as Promise<T | undefined>;

  const put = async (key: string, value: unknown) => {
    const tx = db.transaction('kv', 'readwrite');
    tx.objectStore('kv').put(value, key);
    await done(tx);
  };

  return {
    loadPresets: async () => (await get<Preset[]>('presets')) ?? null,
    savePresets: (presets) => put('presets', presets),
    loadLog: async () => {
      const all = await request(db.transaction('log').objectStore('log').getAll());
      return (all as LogEntry[]).sort((a, b) => a.startedAt.localeCompare(b.startedAt));
    },
    addLogEntry: async (entry) => {
      const tx = db.transaction('log', 'readwrite');
      tx.objectStore('log').put(entry);
      await done(tx);
    },
    replaceAll: async (presets, log) => {
      const tx = db.transaction(['kv', 'log'], 'readwrite');
      tx.objectStore('kv').put(presets, 'presets');
      const store = tx.objectStore('log');
      store.clear();
      for (const entry of log) store.put(entry);
      await done(tx);
    },
    loadSettings: async () => ({
      ...DEFAULT_SETTINGS,
      ...(await get<Partial<Settings>>('settings')),
    }),
    saveSettings: (settings) => put('settings', settings),
  };
}
