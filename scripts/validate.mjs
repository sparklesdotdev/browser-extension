import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  await readFile(path.join(projectRoot, "manifest.json"), "utf8")
);

assert.equal(manifest.manifest_version, 3);
assert.equal(manifest.chrome_url_overrides.newtab, "newtab.html");
assert.equal(manifest.homepage_url, "https://sparkles.dev");
assert.deepEqual(manifest.permissions, ["storage"]);

const requiredFiles = [
  "newtab.html",
  "newtab.css",
  "newtab.js",
  "popup.html",
  "popup.css",
  "popup.js",
  "shared.js",
  "assets/brand/sparklesdev-logo.svg",
  "assets/wallpapers/paper-parade.webp",
  "assets/wallpapers/after-dark.webp",
  "assets/wallpapers/sky-assembly.webp",
  "assets/wallpapers/garden-giggle.webp",
  "assets/icons/icon-16.png",
  "assets/icons/icon-32.png",
  "assets/icons/icon-48.png",
  "assets/icons/icon-128.png"
];

await Promise.all(
  requiredFiles.map((file) => access(path.join(projectRoot, file)))
);

console.log(`Validated Manifest V3 extension with ${requiredFiles.length} assets.`);
