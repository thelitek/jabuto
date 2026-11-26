/// <reference types="node" />
/**
 * Renders the launcher icon ("Ja" in Inter Tight Bold, black on white, left-aligned
 * and vertically centred in the adaptive-icon safe zone) into the Android mipmaps.
 *
 *   vpx scripts/render-icons.ts
 */
import { chromium } from '@playwright/test';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RES = 'android/app/src/main/res';
const DENSITIES = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 } as const;
const font = readFileSync('public/fonts/inter-tight-700.woff2').toString('base64');

type Kind = 'foreground' | 'square' | 'round';

/** Draws on a canvas of `size` px; returns PNG data as base64. Runs in the page. */
function draw(kind: Kind, size: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const c = canvas.getContext('2d')!;
  // Adaptive icons are 108 dp with a 72 dp visible area; legacy icons show just that area.
  const unit = kind === 'foreground' ? size / 108 : size / 72;
  const origin = kind === 'foreground' ? 0 : -18 * unit;
  if (kind !== 'foreground') {
    c.fillStyle = '#fff';
    c.beginPath();
    if (kind === 'round') c.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    else c.roundRect(0, 0, size, size, size * 0.18);
    c.fill();
  }
  // Square inscribed in the 66 dp safe circle; the text is 62 % of its width.
  const sq = 66 / Math.SQRT2;
  const sqMin = (108 - sq) / 2;
  c.font = '700 100px IT';
  const m = c.measureText('Ja');
  const width = m.actualBoundingBoxRight + m.actualBoundingBoxLeft;
  const fontSize = (100 * sq * 0.62) / width;
  const k = fontSize / 100;
  const x = sqMin - m.actualBoundingBoxLeft * k;
  const baseline = 54 + (m.actualBoundingBoxAscent * k) / 2;
  c.font = `700 ${fontSize * unit}px IT`;
  c.fillStyle = '#000';
  c.fillText('Ja', origin + x * unit, origin + baseline * unit);
  return canvas.toDataURL('image/png').split(',')[1]!;
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(
  `<style>@font-face{font-family:IT;font-weight:700;src:url(data:font/woff2;base64,${font})}</style>`,
);
await page.evaluate(() => document.fonts.load('700 100px IT'));
await page.addScriptTag({ content: `globalThis.draw = ${draw.toString()}` });

for (const [density, scale] of Object.entries(DENSITIES)) {
  const out = (name: string, kind: Kind, dp: number) =>
    page
      .evaluate(([k, s]) => (globalThis as any).draw(k, s), [kind, Math.round(dp * scale)] as [
        Kind,
        number,
      ])
      .then((b64) => {
        writeFileSync(join(RES, `mipmap-${density}`, name), Buffer.from(b64, 'base64'));
      });
  await out('ic_launcher_foreground.png', 'foreground', 108);
  await out('ic_launcher_monochrome.png', 'foreground', 108);
  await out('ic_launcher.png', 'square', 48);
  await out('ic_launcher_round.png', 'round', 48);
}
await browser.close();
console.log('Icons written to', RES);
