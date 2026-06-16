/**
 * Generates public/og.png (1200×630) from the horizontal logo so social cards
 * use a bundled, on-brand image — no CDN, no live text/font dependency (the
 * wordmark is already vector paths in the source SVG).
 *
 * Run: pnpm gen:og
 */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const raw = await readFile(resolve(root, 'src/assets/logo/logo-horizontal.svg'), 'utf8');

// Pull the inner markup out of the source <svg>, drop the white backdrop rect,
// and recolor the navy ink to white so it reads on a dark card.
const inner = raw
  .replace(/^[\s\S]*?<svg[^>]*>/, '')
  .replace(/<\/svg>\s*$/, '')
  .replace(/<rect[^>]*fill="white"[^>]*\/>/i, '')
  .replaceAll('#2B2D42', '#FFFFFF');

const W = 1200;
const H = 630;
const logoW = 980; // source viewBox is 1920×1080
const scale = logoW / 1920;
const logoH = 1080 * scale;
const tx = (W - logoW) / 2;
const ty = (H - logoH) / 2;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="0%" r="120%">
      <stop offset="0%" stop-color="#2B2D42"/>
      <stop offset="100%" stop-color="#15161f"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <g transform="translate(${tx} ${ty}) scale(${scale})">${inner}</g>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(resolve(root, 'public/og.png'));
console.log('✓ public/og.png generated (1200×630)');
