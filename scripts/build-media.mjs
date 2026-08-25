/**
 * Publishes owner-supplied originals into public/images/proiecte/.
 *
 * Deliberately does NOT re-encode: the originals are already messenger-compressed
 * JPEGs (<=1280px). A second lossy pass would only add artifacts — next/image
 * does the responsive resize + AVIF/WebP conversion at request time.
 *
 * What it does do:
 * - strips any metadata block (EXIF/GPS/IPTC) — belt and braces, spec 16
 * - fails loudly on a missing source instead of publishing a broken path
 * - prints a table so the mapping stays auditable
 *
 * Usage: node scripts/build-media.mjs
 */
import { mkdir, copyFile, stat, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import sharp from "sharp";
import ffmpeg from "ffmpeg-static";
import { allPhotos, OUT_DIR, SRC_NEW, walkthrough, heroStills } from "./media-catalog.mjs";

const root = process.cwd();
let failed = 0;

async function hasMetadata(file) {
  const m = await sharp(file).metadata();
  return Boolean(m.exif || m.icc || m.iptc || m.xmp);
}

// Fresh directory every run: the catalog is the single source of truth, so a
// renamed entry must not leave an orphan behind in public/.
if (existsSync(path.join(root, OUT_DIR))) {
  await rm(path.join(root, OUT_DIR), { recursive: true, force: true });
}

const rows = [];
for (const p of allPhotos) {
  const src = path.join(root, p.srcDir, p.src);
  const out = path.join(root, p.out);
  if (!existsSync(src)) {
    console.error(`MISSING SOURCE: ${p.srcDir}/${p.src}`);
    failed++;
    continue;
  }
  await mkdir(path.dirname(out), { recursive: true });

  if (await hasMetadata(src)) {
    // Re-encode only when there is metadata to remove.
    await sharp(src).jpeg({ quality: 88, mozjpeg: true }).toFile(out);
  } else {
    await copyFile(src, out);
  }

  const meta = await sharp(out).metadata();
  const { size } = await stat(out);
  rows.push({
    source: `${p.srcDir.split("/").pop()}/${p.src}`,
    published: p.url,
    px: `${meta.width}x${meta.height}`,
    kb: Math.round(size / 1024),
    stage: p.stage,
  });
}

console.table(rows);
console.log(`\n${rows.length} photos published, ${failed} failed.`);

// ── Hero stills ────────────────────────────────────────────────────────────
// Cropped to each breakpoint's aspect, then resampled with lanczos3 + a light
// unsharp pass. The desktop tile is a 1.67x upscale of a 960px source: that is
// the ceiling of what the owner supplied, and doing it offline with a good
// kernel beats letting the browser stretch the original. See D-006.
{
  const heroOut = path.join(root, heroStills.outDir);
  await rm(heroOut, { recursive: true, force: true });
  await mkdir(heroOut, { recursive: true });

  const srcPath = path.join(root, heroStills.source);
  for (const variant of [heroStills.desktop, heroStills.mobile]) {
    const img = sharp(srcPath);
    const { width: iw, height: ih } = await img.metadata();
    const box = variant.width / variant.height;
    const cw = iw / ih > box ? Math.round(ih * box) : iw;
    const ch = iw / ih > box ? ih : Math.round(iw / box);
    await img
      .extract({
        left: Math.round((iw - cw) / 2),
        top: Math.round((ih - ch) * variant.focalY),
        width: cw,
        height: ch,
      })
      .resize(variant.width, variant.height, { kernel: "lanczos3" })
      .sharpen({ sigma: 0.8, m1: 0.4, m2: 0.7 })
      .webp({ quality: 82 })
      .toFile(path.join(heroOut, variant.file));
    const { size } = await stat(path.join(heroOut, variant.file));
    console.log(
      `hero  ${variant.file}  ${variant.width}x${variant.height}  ${Math.round(size / 1024)}KB  ` +
        `(crop ${cw}x${ch}, ${(variant.width / cw).toFixed(2)}x)`,
    );
  }
}

// ── Walkthrough clip ───────────────────────────────────────────────────────
// -an drops the audio track, -map_metadata -1 drops creation_time and the
// Core Media handler strings, +faststart moves the moov atom to the front.
{
  const vidOut = path.join(root, walkthrough.outDir);
  const vidSrc = path.join(root, SRC_NEW, walkthrough.src);
  if (!existsSync(vidSrc)) {
    console.error(`MISSING VIDEO SOURCE: ${vidSrc}`);
    failed++;
  } else {
    await rm(vidOut, { recursive: true, force: true });
    await mkdir(vidOut, { recursive: true });
    const mp4 = path.join(vidOut, walkthrough.mp4);

    execFileSync(ffmpeg, [
      "-hide_banner", "-loglevel", "error",
      "-ss", String(walkthrough.startSeconds),
      "-t", String(walkthrough.durationSeconds),
      "-i", vidSrc,
      "-an",
      "-map_metadata", "-1",
      "-c:v", "libx264", "-profile:v", "high", "-preset", "slow", "-crf", "26",
      "-pix_fmt", "yuv420p",
      "-movflags", "+faststart",
      "-y", mp4,
    ]);

    // Poster must match the video's pixel dimensions exactly, or the crossfade
    // from poster to first frame jumps on play (spec 29 §11).
    const rawPoster = path.join(vidOut, "_poster.png");
    execFileSync(ffmpeg, [
      "-hide_banner", "-loglevel", "error",
      "-ss", String(walkthrough.posterAtSeconds),
      "-i", mp4,
      "-frames:v", "1",
      "-y", rawPoster,
    ]);
    await sharp(rawPoster).webp({ quality: 82 }).toFile(path.join(vidOut, walkthrough.poster));
    await rm(rawPoster, { force: true });

    const v = await stat(mp4);
    const pm = await sharp(path.join(vidOut, walkthrough.poster)).metadata();
    const p = await stat(path.join(vidOut, walkthrough.poster));
    console.log(
      `video ${walkthrough.mp4}  ${Math.round(v.size / 1024)}KB  ·  ` +
        `${walkthrough.poster}  ${pm.width}x${pm.height}  ${Math.round(p.size / 1024)}KB`,
    );
  }
}

if (failed) process.exit(1);
