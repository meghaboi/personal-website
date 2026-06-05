/**
 * OG Image Generator — meghaboi.qzz.io
 *
 * Usage:
 *   node generate-og.js --essay "07" --category "MARKETS" --line1 "$1.77 TRILLION" --line2 "ON VIBES" --out "trillion-on-vibes.png"
 *
 * Output goes to ../og/<filename>.png
 *
 * Design:
 *   - 1200x630, cream background (#FFFDF5), black dot grid
 *   - Top-left: yellow rotated label (ESSAY XX // CATEGORY)
 *   - Top-right: 3 circles (coral, yellow, purple) in triangle cluster
 *   - Line 1: solid black bold text
 *   - Line 2: outlined text (white fill, thick black stroke)
 *   - Bottom-left: yellow label (BY MEGHANADH // MEGHABOI.QZZ.IO)
 */

const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const essay    = getArg('--essay',    '07');
const category = getArg('--category', 'MARKETS');
const line1    = getArg('--line1',    '$1.77 TRILLION');
const line2    = getArg('--line2',    'ON VIBES');
const outFile  = getArg('--out',      'og-output.png');

// ── Canvas setup ──────────────────────────────────────────────────────────────
const W = 1200;
const H = 630;
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// ── Background ────────────────────────────────────────────────────────────────
ctx.fillStyle = '#FFFDF5';
ctx.fillRect(0, 0, W, H);

// ── Dot grid ──────────────────────────────────────────────────────────────────
ctx.fillStyle = 'rgba(0,0,0,0.18)';
const DOT_GAP = 22;
const DOT_R   = 1.4;
for (let x = DOT_GAP; x < W; x += DOT_GAP) {
  for (let y = DOT_GAP; y < H; y += DOT_GAP) {
    ctx.beginPath();
    ctx.arc(x, y, DOT_R, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Rounded rect path helper */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Draw a yellow pill label, optionally rotated */
function drawLabel(text, x, y, rotation = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.font = 'bold 20px Arial';
  const tw = ctx.measureText(text).width;
  const pad = 14;
  const bw = tw + pad * 2;
  const bh = 40;

  roundRect(ctx, 0, 0, bw, bh, 5);
  ctx.fillStyle = '#F5CF1B';
  ctx.fill();
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#111111';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText(text, pad, bh / 2);

  ctx.restore();
}

/** Draw the 3-circle cluster (coral top-left, yellow top-right, purple bottom-center) */
function drawCircles(cx, cy) {
  const R   = 48;
  const gap = 8; // overlap gap

  const positions = [
    { x: cx - R - gap / 2, y: cy - R / 2, color: '#F0706A' }, // coral, top-left
    { x: cx + gap / 2,     y: cy - R / 2, color: '#F5CF1B' }, // yellow, top-right
    { x: cx - R / 2,       y: cy + R / 2 + 4, color: '#A89AC9' }, // purple, bottom-center
  ];

  positions.forEach(({ x, y, color }) => {
    ctx.beginPath();
    ctx.arc(x + R, y + R, R, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 5;
    ctx.stroke();
  });
}

/** Auto-size font so text fits within maxWidth */
function fitFont(text, maxWidth, maxSize, weight = 'bold') {
  let size = maxSize;
  ctx.font = `${weight} ${size}px Arial`;
  while (ctx.measureText(text).width > maxWidth && size > 40) {
    size -= 2;
    ctx.font = `${weight} ${size}px Arial`;
  }
  return size;
}

// ── Layout constants ───────────────────────────────────────────────────────────
const PAD       = 52;
const MAX_TW    = W - PAD * 2 - 160; // leave room for circles on right

// ── Top-left label ─────────────────────────────────────────────────────────────
drawLabel(`ESSAY ${essay} // ${category}`, PAD, 44, -0.03);

// ── Top-right circles ──────────────────────────────────────────────────────────────
drawCircles(W - 230, -4);

// ── Title text ────────────────────────────────────────────────────────────────
const size1 = fitFont(line1, MAX_TW, 148, 'bold');
const size2 = fitFont(line2, MAX_TW, 148, 'bold');
const titleSize = Math.min(size1, size2);

const lineH    = titleSize * 1.08;
const totalH   = lineH * 2;
const startY   = (H - totalH) / 2 + titleSize * 0.18;

// Line 1 — solid black
ctx.font = `bold ${titleSize}px Arial`;
ctx.textBaseline = 'top';
ctx.textAlign = 'left';
ctx.fillStyle = '#111111';
ctx.fillText(line1, PAD, startY);

// Line 2 — outlined (white fill, thick black stroke) — the signature style
ctx.font = `bold ${titleSize}px Arial`;
ctx.textBaseline = 'top';
ctx.lineWidth = titleSize * 0.085;
ctx.lineJoin = 'round';
ctx.strokeStyle = '#111111';
ctx.strokeText(line2, PAD, startY + lineH);
ctx.fillStyle = '#FFFDF5';
ctx.fillText(line2, PAD, startY + lineH);

// ── Bottom-left label ─────────────────────────────────────────────────────────
drawLabel('BY MEGHANADH // MEGHABOI.QZZ.IO', PAD, H - 44 - 40, 0.0);

// ── Save ──────────────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, '..', 'og');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, outFile);
const buffer  = canvas.toBuffer('image/png');
fs.writeFileSync(outPath, buffer);

console.log(`✓ OG image saved → og/${outFile}`);
console.log(`  Essay    : ${essay}`);
console.log(`  Category : ${category}`);
console.log(`  Line 1   : ${line1}`);
console.log(`  Line 2   : ${line2}`);
