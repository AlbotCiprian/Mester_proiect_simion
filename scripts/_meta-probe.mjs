/**
 * QA helper (not part of the build): prints dimensions, orientation, weight and
 * metadata presence for every image in a directory. Used to verify that owner
 * originals carry no EXIF/GPS before they are published (spec 16).
 *
 * Usage: node scripts/_meta-probe.mjs "docs/poze/poze reale"
 */
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = process.argv[2] ?? "docs/poze/poze reale";
const files = readdirSync(dir)
  .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
  .sort((a, b) => (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0));

for (const f of files) {
  const p = path.join(dir, f);
  try {
    const m = await sharp(p).metadata();
    const rotated = m.orientation !== undefined && m.orientation >= 5;
    const w = rotated ? m.height : m.width;
    const h = rotated ? m.width : m.height;
    const meta = [m.exif && "exif", m.icc && "icc", m.iptc && "iptc", m.xmp && "xmp"]
      .filter(Boolean)
      .join(",");
    console.log(
      `${f.padEnd(10)} ${String(w).padStart(5)}x${String(h).padEnd(5)} ${m.format} ` +
        `${String(Math.round(statSync(p).size / 1024)).padStart(4)}KB ` +
        `ratio=${(w / h).toFixed(2)} ${w > h ? "LANDSCAPE" : w < h ? "PORTRAIT" : "SQUARE"} ` +
        `meta=${meta || "none"}`,
    );
  } catch (e) {
    console.log(f, "ERR", e.message);
  }
}
