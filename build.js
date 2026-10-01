#!/usr/bin/env node
/**
 * DRAFTED UX — build script
 *
 * This site is plain static HTML/CSS/JS with no framework. This script
 * is the one build step: it copies everything into /dist and, while
 * copying HTML/XML/TXT files, swaps placeholder tokens for real values
 * pulled from environment variables (set in the Vercel dashboard, not
 * committed to git):
 *
 *   {{SITE_URL}}       -> process.env.SITE_URL       (no trailing slash)
 *   {{PATREON_URL}}    -> process.env.PATREON_URL
 *   {{CONTACT_EMAIL}}  -> process.env.CONTACT_EMAIL   (HTML-entity encoded)
 *
 * SITE_URL exists so the deployed domain (currently a Vercel-assigned
 * URL, expected to change to a custom domain later) lives in ONE place.
 * When it changes, update the SITE_URL env var in Vercel and redeploy —
 * canonical links, Open Graph/Twitter URLs, robots.txt, and sitemap.xml
 * all pick it up automatically instead of needing a multi-file edit.
 *
 * Because this runs at BUILD time, Vercel serves normal, real tags and
 * links to every visitor and crawler — nothing about SEO, social
 * previews, or link functionality changes. Only the source in git stays
 * free of the real address, URL, and domain.
 *
 * Local development: copy .env.example to .env.local, fill in real
 * values, then run `vercel dev` (Vercel automatically loads
 * .env.local). Without either, this script falls back to obvious
 * placeholder values and prints a warning so a build never silently
 * ships a broken link.
 */

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SRC_DIR = __dirname;
const OUT_DIR = path.join(__dirname, 'dist');

// Top-level files/folders to copy. Listed explicitly (rather than
// copying everything) so build artifacts, .git, node_modules, env
// files, etc. never end up in the deployed output.
const ENTRIES = [
  '404.html',
  'index.html',
  'supporters.html',
  'css',
  'js',
  'img',
  'downloads',
  'favicon-dark.png',
  'favicon-light.png',
  'robots.txt',
  'sitemap.xml'
];

// File types that may contain {{...}} tokens and get text substitution.
// Everything else (images, css, js) is copied byte-for-byte.
const TEXT_EXTENSIONS = new Set(['.html', '.xml', '.txt']);

function getConfig() {
  const siteUrl = process.env.SITE_URL;
  const patreonUrl = process.env.PATREON_URL;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!siteUrl) {
    console.warn(
      '[build] SITE_URL is not set — falling back to a placeholder. ' +
      'Set it in Vercel > Project > Settings > Environment Variables.'
    );
  }
  if (!patreonUrl) {
    console.warn(
      '[build] PATREON_URL is not set — falling back to a placeholder. ' +
      'Set it in Vercel > Project > Settings > Environment Variables.'
    );
  }
  if (!contactEmail) {
    console.warn(
      '[build] CONTACT_EMAIL is not set — falling back to a placeholder. ' +
      'Set it in Vercel > Project > Settings > Environment Variables.'
    );
  }

  return {
    // No trailing slash — templates add "/" themselves where needed.
    siteUrl: (siteUrl || 'https://example.vercel.app').replace(/\/+$/, ''),
    patreonUrl: patreonUrl || 'https://www.patreon.com/YOUR_PAGE',
    contactEmail: contactEmail || 'hello@example.com'
  };
}

// Light anti-scraping measure: HTML-entity-encode every character of
// the email address. Browsers render/parse entities exactly like the
// original characters, so the mailto: link works normally with zero
// JavaScript required — but the address no longer appears in the
// page's raw HTML as plain "name@domain.com" text, which is what most
// basic scrapers pattern-match on. This deters casual harvesting; it
// does not (and cannot) hide the address from someone deliberately
// reading the rendered page or resolving the entities by hand.
function obfuscateEmail(email) {
  return String(email)
    .split('')
    .map(function (ch) { return '&#' + ch.charCodeAt(0) + ';'; })
    .join('');
}

function injectConfig(text, config) {
  return text
    .split('{{SITE_URL}}').join(config.siteUrl)
    .split('{{PATREON_URL}}').join(config.patreonUrl)
    .split('{{CONTACT_EMAIL}}').join(obfuscateEmail(config.contactEmail));
}

// data.js is a large (~1.8MB) pretty-printed JSON array assigned to a
// single const. Re-serializing it without whitespace meaningfully cuts
// page weight on the homepage with zero change in behavior. This only
// fires for that one recognizable shape; anything that doesn't match
// is left completely untouched rather than risking corruption.
const DATA_JS_PATTERN = /^const PROJECT_BRIEFS = (\[[\s\S]*\]);\s*$/;

function minifyDataJs(source) {
  const match = source.match(DATA_JS_PATTERN);
  if (!match) {
    console.warn('[build] js/data.js did not match the expected shape — copying unminified.');
    return source;
  }
  try {
    const data = JSON.parse(match[1]);
    return 'const PROJECT_BRIEFS = ' + JSON.stringify(data) + ';\n';
  } catch (err) {
    console.warn('[build] Could not parse js/data.js as JSON — copying unminified. ' + err.message);
    return source;
  }
}

function copyRecursive(srcPath, destPath, config) {
  const stat = fs.statSync(srcPath);

  if (stat.isDirectory()) {
    fs.mkdirSync(destPath, { recursive: true });
    fs.readdirSync(srcPath).forEach(function (child) {
      copyRecursive(path.join(srcPath, child), path.join(destPath, child), config);
    });
    return;
  }

  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  const ext = path.extname(srcPath).toLowerCase();
  const base = path.basename(srcPath);

  if (TEXT_EXTENSIONS.has(ext)) {
    const text = fs.readFileSync(srcPath, 'utf8');
    fs.writeFileSync(destPath, injectConfig(text, config), 'utf8');
  } else if (base === 'data.js') {
    fs.writeFileSync(destPath, minifyDataJs(fs.readFileSync(srcPath, 'utf8')), 'utf8');
  } else {
    fs.copyFileSync(srcPath, destPath);
  }
}


// Reference screenshots live in img/<ticketId>/. A static site can't list
// a folder from the browser, so this writes js/references.js — a map of
// ticketId -> image file names — for the "Show reference" button to read.
// A brief only gets that button if its folder exists (and has images).
// Runs before the copy step so the fresh manifest is what gets deployed.
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.avif']);

function generateReferences() {
  const imgDir = path.join(SRC_DIR, 'img');
  const refs = {};

  if (fs.existsSync(imgDir)) {
    fs.readdirSync(imgDir).sort().forEach(function (folder) {
      const folderPath = path.join(imgDir, folder);
      if (!fs.statSync(folderPath).isDirectory()) return;
      const files = fs.readdirSync(folderPath)
        .filter(function (f) { return IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()); })
        .sort(function (a, b) { return a.localeCompare(b, undefined, { numeric: true }); });
      if (files.length) refs[folder] = files;
    });
  }

  fs.writeFileSync(
    path.join(SRC_DIR, 'js', 'references.js'),
    'const REFERENCE_IMAGES = ' + JSON.stringify(refs, null, 2) + ';\n',
    'utf8'
  );

  generateReferenceZips(refs);
}

// "Download all" in the reference slider links to a ready-made ZIP per
// ticket: downloads/<ticketId>-reference.zip, built here from img/<ticketId>/.
// Building at build time (rather than in the browser) means the button is a
// plain download link, so it also works when index.html is opened straight
// from disk, where browsers block the fetch() calls a client-side zip needs.
// Small self-contained ZIP writer (deflate via Node's zlib, no dependencies).
const CRC_TABLE = (function () {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// Fixed timestamp (2026-01-01 00:00) so rebuilding gives byte-identical
// ZIPs and git doesn't show them as changed every time.
const ZIP_DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;
const ZIP_DOS_TIME = 0;

function createZip(files) {
  const chunks = [];
  const central = [];
  let offset = 0;

  files.forEach(function (file) {
    const name = Buffer.from(file.name, 'utf8');
    const crc = crc32(file.data);
    const deflated = zlib.deflateRawSync(file.data, { level: 9 });
    const useDeflate = deflated.length < file.data.length; // PNGs often don't shrink
    const body = useDeflate ? deflated : file.data;
    const method = useDeflate ? 8 : 0;

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);              // version needed
    local.writeUInt16LE(0x0800, 6);          // flags: UTF-8 file names
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(ZIP_DOS_TIME, 10);
    local.writeUInt16LE(ZIP_DOS_DATE, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(file.data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);

    const entry = Buffer.alloc(46);
    entry.writeUInt32LE(0x02014b50, 0);
    entry.writeUInt16LE(20, 4);              // version made by
    entry.writeUInt16LE(20, 6);              // version needed
    entry.writeUInt16LE(0x0800, 8);
    entry.writeUInt16LE(method, 10);
    entry.writeUInt16LE(ZIP_DOS_TIME, 12);
    entry.writeUInt16LE(ZIP_DOS_DATE, 14);
    entry.writeUInt32LE(crc, 16);
    entry.writeUInt32LE(body.length, 20);
    entry.writeUInt32LE(file.data.length, 24);
    entry.writeUInt16LE(name.length, 28);
    entry.writeUInt32LE(offset, 42);         // local header offset
    central.push(Buffer.concat([entry, name]));

    chunks.push(local, name, body);
    offset += local.length + name.length + body.length;
  });

  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);

  return Buffer.concat(chunks.concat([centralBuf, end]));
}

function generateReferenceZips(refs) {
  const dir = path.join(SRC_DIR, 'downloads');
  fs.rmSync(dir, { recursive: true, force: true }); // drop zips for removed folders
  const ids = Object.keys(refs);
  if (!ids.length) return;
  fs.mkdirSync(dir, { recursive: true });

  ids.forEach(function (id) {
    const files = refs[id].map(function (file) {
      return { name: file, data: fs.readFileSync(path.join(SRC_DIR, 'img', id, file)) };
    });
    fs.writeFileSync(path.join(dir, id + '-reference.zip'), createZip(files));
  });
}

function build() {
  const config = getConfig();
  generateReferences();

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  ENTRIES.forEach(function (entry) {
    const src = path.join(SRC_DIR, entry);
    if (!fs.existsSync(src)) return;
    copyRecursive(src, path.join(OUT_DIR, entry), config);
  });

  console.log('[build] Done — output in ./dist');
}

build();
