import { createIdbStorage } from './idb';
import type { Device, Platform } from './types';
import { webFiles } from './web-files';
import { createWebRunner } from './web-runner';

export * from './types';

const webDevice: Device = {
  native: false,
  dndAccess: async () => 'denied',
  requestDndAccess: async () => 'denied',
  requestNotifications: async () => 'denied',
};

export async function createPlatform(): Promise<Platform> {
  return {
    storage: await createIdbStorage(),
    runner: createWebRunner(),
    files: webFiles,
    device: webDevice,
  };
}
