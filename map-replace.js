/**
 * Builds inline jp-map SVG from Geolonia map-full.svg (prefecture groups → jp-region wrappers)
 * and replaces <object id="jpMapObject">…</object> in index.html.
 */
const fs = require("fs");
const path = require("path");

const root = __dirname;
const mapPath = path.join(root, "image", "map-full.svg");
const htmlPath = path.join(root, "index.html");

/** Tohoku prefectures and Hokkaido are separate interactive regions (see MAP_STAYS keys). */
const REGION_ORDER = ["tohoku", "hokkaido", "kanto", "chubu", "kansai", "chugoku_shikoku", "kyushu"];

const LABELS = {
  tohoku: "Tohoku Region",
  hokkaido: "Hokkaido",
  kanto: "Tokyo & Around",
  chubu: "Mt.Fuji/Hakone & Around / Gifu/Nagano & Around",
  kansai: "Kyoto/Osaka & Around",
  chugoku_shikoku: "Hiroshima & Around / Okayama/Naoshima & Around",
  kyushu: "Kyushu",
};

function regionKeyForClasses(classStr) {
  const c = classStr.replace(/\s+/g, " ");
  if (/\bhokkaido\b/.test(c) && /\bprefecture\b/.test(c)) return "hokkaido";
  if (/\btohoku\b/.test(c) && /\bprefecture\b/.test(c)) return "tohoku";
  if (/\bkanto\b/.test(c) && /\bprefecture\b/.test(c)) return "kanto";
  if (/\bchubu\b/.test(c) && /\bprefecture\b/.test(c)) return "chubu";
  if (/\bkinki\b/.test(c) && /\bprefecture\b/.test(c)) return "kansai";
  if ((/\bchugoku\b/.test(c) || /\bshikoku\b/.test(c)) && /\bprefecture\b/.test(c)) return "chugoku_shikoku";
  if (/\bkyushu-okinawa\b/.test(c) && /\bprefecture\b/.test(c)) return "kyushu";
  return null;
}

function stripGeoloniaPaint(block) {
  return block
    .replace(/\sstroke-linejoin="round"/g, "")
    .replace(/\sfill-rule="nonzero"/g, "")
    .replace(/\sfill="#EEEEEE"/g, "")
    .replace(/\sstroke="#000000"/g, "")
    .replace(/\sstroke-width="1\.0"/g, "");
}

let svg = fs.readFileSync(mapPath, "utf8").replace(/^<\?xml[^>]*>\s*/i, "");

const blockRe = /<g[^>]*class="[^"]*\bprefecture\b[^"]*"[^>]*>[\s\S]*?<\/g>/g;
const blocks = [...svg.matchAll(blockRe)].map((m) => m[0]);
if (blocks.length !== 47) {
  console.warn("Expected 47 prefecture groups, got:", blocks.length);
}

const byRegion = {};
for (const key of REGION_ORDER) byRegion[key] = [];

for (const block of blocks) {
  const cm = block.match(/class="([^"]*)"/);
  if (!cm) continue;
  const key = regionKeyForClasses(cm[1]);
  if (key) byRegion[key].push(stripGeoloniaPaint(block));
}

let inner = "";
for (const key of REGION_ORDER) {
  const parts = byRegion[key];
  if (!parts.length) continue;
  inner += `\n      <g class="jp-region" data-region="${key}" tabindex="0" role="button" aria-label="${LABELS[key]}" style="pointer-events: all;">`;
  inner += parts.join("");
  inner += "</g>";
}

const titleM = svg.match(/<title>[\s\S]*?<\/title>/);
const descM = svg.match(/<desc>[\s\S]*?<\/desc>/);
const meta = [titleM ? titleM[0] : "", descM ? descM[0] : ""].filter(Boolean).join("\n  ");

const newSvg = `<svg id="jpMapInline" class="jp-map" viewBox="0 0 1000 1000" role="img" aria-label="Clickable Japan map" xmlns="http://www.w3.org/2000/svg" style="pointer-events:all;">
  ${meta}
  <g transform="matrix(1.028807, 0, 0, 1.028807, -47.544239, -28.806583)">
    <g transform="matrix(1, 0, 0, 1, 6, 18)">${inner}
    </g>
  </g>
</svg>`;

let html = fs.readFileSync(htmlPath, "utf8");
const objectRe = /<object[\s\S]*?id="jpMapObject"[\s\S]*?<\/object>/;
const inlineRe = /<svg id="jpMapInline"[\s\S]*?<\/svg>/;
if (objectRe.test(html)) {
  html = html.replace(objectRe, newSvg.trim());
} else if (inlineRe.test(html)) {
  html = html.replace(inlineRe, newSvg.trim());
} else {
  console.error("No jpMapObject <object> or jpMapInline <svg> block found in index.html");
  process.exit(1);
}
fs.writeFileSync(htmlPath, html, "utf8");
console.log(
  "Updated inline jp-map SVG (" + blocks.length + " prefectures → " + REGION_ORDER.length + " interactive regions)."
);
