/**
 * QA helper (not part of the build): renders every catalog photo exactly as the
 * portfolio grid will crop it (aspect 3/4 + object-cover + the catalog `focal`),
 * then lays the results out on labelled contact sheets so the crops can be
 * eyeballed before the content layer is wired up.
 *
 * Usage: node scripts/_preview-crops.mjs <outDir> [aspectW] [aspectH]
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { allPhotos } from "./media-catalog.mjs";

const outDir = process.argv[2];
const aspectW = Number(process.argv[3] ?? 3);
const aspectH = Number(process.argv[4] ?? 4);
if (!outDir) throw new Error("usage: node scripts/_preview-crops.mjs <outDir> [w] [h]");

const TILE_W = 260;
const TILE_H = Math.round((TILE_W * aspectH) / aspectW);
const COLS = 5;
const PER_SHEET = 10;
const LABEL_H = 22;

/** Replicates CSS object-fit:cover + object-position for a fixed-ratio box. */
async function coverCrop(file, focal) {
  const img = sharp(path.resolve(file));
  const { width: iw, height: ih } = await img.metadata();
  const [fxRaw, fyRaw] = focal.split(/\s+/);
  const fx = parseFloat(fxRaw) / 100;
  const fy = parseFloat(fyRaw) / 100;

  const boxRatio = aspectW / aspectH;
  const imgRatio = iw / ih;

  let cw, ch;
  if (imgRatio > boxRatio) {
    ch = ih;
    cw = Math.round(ih * boxRatio);
  } else {
    cw = iw;
    ch = Math.round(iw / boxRatio);
  }
  const left = Math.round((iw - cw) * fx);
  const top = Math.round((ih - ch) * fy);

  return img
    .extract({ left, top, width: cw, height: ch })
    .resize(TILE_W, TILE_H, { fit: "fill" })
    .jpeg({ quality: 82 })
    .toBuffer();
}

await mkdir(outDir, { recursive: true });

const sheets = [];
for (let i = 0; i < allPhotos.length; i += PER_SHEET) {
  sheets.push(allPhotos.slice(i, i + PER_SHEET));
}

let n = 0;
for (const [sheetIdx, group] of sheets.entries()) {
  const rows = Math.ceil(group.length / COLS);
  const W = COLS * TILE_W;
  const H = rows * (TILE_H + LABEL_H);

  const composites = [];
  for (const [i, p] of group.entries()) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = col * TILE_W;
    const y = row * (TILE_H + LABEL_H);
    composites.push({ input: await coverCrop(p.out, p.focal), left: x, top: y + LABEL_H });

    const label = `${n + i + 1}. ${p.project} · ${p.file}`.slice(0, 46);
    const svg = `<svg width="${TILE_W}" height="${LABEL_H}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#111"/>
      <text x="4" y="15" font-family="monospace" font-size="11" fill="#eee">${label
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")}</text></svg>`;
    composites.push({ input: Buffer.from(svg), left: x, top: y });
  }
  n += group.length;

  const file = path.join(outDir, `sheet-${sheetIdx + 1}.jpg`);
  await sharp({ create: { width: W, height: H, channels: 3, background: "#111" } })
    .composite(composites)
    .jpeg({ quality: 84 })
    .toFile(file);
  console.log(file);
}

await writeFile(
  path.join(outDir, "index.txt"),
  allPhotos.map((p, i) => `${i + 1}\t${p.project}\t${p.file}\t${p.focal}\t${p.stage}`).join("\n"),
);
