import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const requiredFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "README.md",
  "downloads/teddy-codex-buddy.zip",
  "assets/pet.json",
  "assets/spritesheet.webp",
  "assets/teddy-social-card.png",
  "assets/site/hero-teddy.webp",
  "assets/site/motion-wardrobe.png"
];

const failures = [];
const notes = [];

function fail(message) {
  failures.push(message);
}

function pass(message) {
  notes.push(`ok  ${message}`);
}

function projectPath(path) {
  return join(root, path);
}

function readText(path) {
  return readFileSync(projectPath(path), "utf8");
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(projectPath(path))).digest("hex");
}

for (const file of requiredFiles) {
  if (!existsSync(projectPath(file))) {
    fail(`Missing required file: ${file}`);
  }
}

if (failures.length === 0) {
  pass("required Teddy site and package files exist");
}

let index = "";
let readme = "";
try {
  index = readText("index.html");
  readme = readText("README.md");
} catch (error) {
  fail(`Could not read core files: ${error.message}`);
}

if (index) {
  const localRefs = [...index.matchAll(/\b(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((ref) => !ref.startsWith("#"))
    .filter((ref) => !/^(?:https?:|mailto:|tel:)/.test(ref))
    .map((ref) => ref.split("#")[0].split("?")[0])
    .filter(Boolean);

  for (const ref of localRefs) {
    if (!existsSync(projectPath(ref))) {
      fail(`Broken local page reference: ${ref}`);
    }
  }

  if (!index.includes("connect-src 'none'")) {
    fail("CSP should keep connect-src locked to 'none'");
  }

  if (/\son[a-z]+=/i.test(index)) {
    fail("Inline event handler found in index.html");
  }

  if (/<script(?![^>]*\bsrc=)/i.test(index)) {
    fail("Inline script tag found in index.html");
  }

  if (!failures.some((item) => item.includes("reference"))) {
    pass("all local page references resolve");
  }
  pass("basic static-page security checks completed");
}

try {
  JSON.parse(readText("assets/pet.json"));
  pass("pet.json parses cleanly");
} catch (error) {
  fail(`pet.json is not valid JSON: ${error.message}`);
}

if (readme) {
  const packageHash = sha256("downloads/teddy-codex-buddy.zip");
  const spriteHash = sha256("assets/spritesheet.webp");

  if (!readme.includes(`Package SHA-256: \`${packageHash}\``)) {
    fail("README package SHA-256 does not match downloads/teddy-codex-buddy.zip");
  }

  if (!readme.includes(`Spritesheet SHA-256: \`${spriteHash}\``)) {
    fail("README spritesheet SHA-256 does not match assets/spritesheet.webp");
  }

  pass("README hashes match the downloadable package and spritesheet");
}

const imageRefs = [...index.matchAll(/\b(?:src|href)="([^"]+\.(?:png|webp|svg|jpg|jpeg|gif)(?:\?[^"]*)?)"/gi)]
  .map((match) => match[1].split("?")[0]);

for (const ref of imageRefs) {
  const ext = extname(ref).toLowerCase();
  if (![".png", ".webp", ".svg", ".jpg", ".jpeg", ".gif"].includes(ext)) {
    fail(`Unexpected image type: ${ref}`);
  }
}

if (imageRefs.length > 0) {
  pass(`${imageRefs.length} page image references checked`);
}

if (failures.length > 0) {
  console.error("Teddy Codex check failed:");
  for (const failure of failures) {
    console.error(`no  ${failure}`);
  }
  process.exit(1);
}

console.log("Teddy Codex check passed:");
for (const note of notes) {
  console.log(note);
}
