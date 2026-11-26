/// <reference types="node" />
/**
 * Synthesises the placeholder bell sounds into public/sounds/ as OGG and MP3.
 * Own work, released as CC0 (see SOUNDS.md). Requires ffmpeg.
 *
 *   vpx scripts/synth-bells.ts
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const RATE = 44100;

interface Partial {
  /** Frequency in Hz. */
  f: number;
  /** Relative amplitude. */
  a: number;
  /** Seconds to fall to 1/e. */
  decay: number;
  /** Beating: a second partial this many Hz above. */
  beat?: number;
}

interface Bell {
  id: string;
  seconds: number;
  attack: number;
  partials: Partial[];
}

const BELLS: Bell[] = [
  {
    id: 'bowl',
    seconds: 12,
    attack: 0.004,
    partials: [
      { f: 196, a: 1, decay: 5.5, beat: 0.9 },
      { f: 196 * 2.71, a: 0.55, decay: 3.6, beat: 1.4 },
      { f: 196 * 5.13, a: 0.25, decay: 1.8 },
      { f: 196 * 8.21, a: 0.1, decay: 0.9 },
    ],
  },
  {
    id: 'small-bell',
    seconds: 6,
    attack: 0.002,
    partials: [
      { f: 1046, a: 1, decay: 1.8 },
      { f: 1046 * 2.0, a: 0.45, decay: 1.1 },
      { f: 1046 * 2.92, a: 0.3, decay: 0.7 },
      { f: 1046 * 4.16, a: 0.15, decay: 0.4 },
    ],
  },
  {
    id: 'deep-bell',
    seconds: 12,
    attack: 0.003,
    partials: [
      { f: 98 * 0.5, a: 0.7, decay: 6, beat: 0.4 },
      { f: 98, a: 1, decay: 4.5 },
      { f: 98 * 1.19, a: 0.6, decay: 3.2 },
      { f: 98 * 1.5, a: 0.4, decay: 2.4 },
      { f: 98 * 2.0, a: 0.5, decay: 2 },
      { f: 98 * 2.51, a: 0.2, decay: 1.2 },
    ],
  },
  {
    id: 'chime',
    seconds: 5,
    attack: 0.002,
    partials: [
      { f: 1318, a: 1, decay: 1.6 },
      { f: 1318 * 2.76, a: 0.35, decay: 0.8 },
      { f: 1318 * 5.4, a: 0.12, decay: 0.35 },
    ],
  },
  {
    id: 'wood',
    seconds: 1,
    attack: 0.001,
    partials: [
      { f: 620, a: 1, decay: 0.06 },
      { f: 620 * 1.58, a: 0.6, decay: 0.04 },
      { f: 620 * 2.33, a: 0.3, decay: 0.025 },
    ],
  },
];

function render(bell: Bell): Float32Array {
  const n = Math.round(bell.seconds * RATE);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const env = Math.min(1, t / bell.attack);
    let v = 0;
    for (const p of bell.partials) {
      const amp = p.a * Math.exp(-t / p.decay);
      v += amp * Math.sin(2 * Math.PI * p.f * t);
      if (p.beat) v += amp * 0.6 * Math.sin(2 * Math.PI * (p.f + p.beat) * t);
    }
    out[i] = v * env;
  }
  // Short fade-out so the file never ends on a click, then normalise to -1 dBFS.
  const fade = Math.round(0.05 * RATE);
  for (let i = 0; i < fade; i++) out[n - 1 - i]! *= i / fade;
  const peak = out.reduce((m, v) => Math.max(m, Math.abs(v)), 0);
  const gain = 0.891 / peak;
  return out.map((v) => v * gain);
}

function wav(samples: Float32Array): Buffer {
  const data = Buffer.alloc(samples.length * 2);
  samples.forEach((v, i) =>
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), i * 2),
  );
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  return Buffer.concat([header, data]);
}

const tmp = mkdtempSync(join(tmpdir(), 'bells-'));
try {
  for (const bell of BELLS) {
    const src = join(tmp, `${bell.id}.wav`);
    writeFileSync(src, wav(render(bell)));
    const out = join('public', 'sounds', bell.id);
    const ff = ['-y', '-loglevel', 'error', '-i', src, '-map_metadata', '-1'];
    execFileSync('ffmpeg', [...ff, '-c:a', 'libvorbis', '-q:a', '5', `${out}.ogg`]);
    execFileSync('ffmpeg', [...ff, '-c:a', 'libmp3lame', '-q:a', '3', `${out}.mp3`]);
    console.log(`${out}.ogg, ${out}.mp3`);
  }
} finally {
  rmSync(tmp, { recursive: true });
}
