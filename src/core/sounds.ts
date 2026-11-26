/** Bundled bell sounds. Placeholders until the final recordings are chosen (see SOUNDS.md). */
export const SOUNDS = [
  { id: 'bowl', name: 'Bowl' },
  { id: 'small-bell', name: 'Small bell' },
  { id: 'deep-bell', name: 'Deep bell' },
  { id: 'chime', name: 'Chime' },
  { id: 'wood', name: 'Wood' },
] as const;

export type BundledSound = (typeof SOUNDS)[number]['id'];
export type SoundId = BundledSound | 'silent';

export const SOUND_IDS: readonly SoundId[] = ['silent', ...SOUNDS.map((s) => s.id)];

export function soundName(id: SoundId): string {
  return id === 'silent' ? 'Silent' : (SOUNDS.find((s) => s.id === id)?.name ?? id);
}
