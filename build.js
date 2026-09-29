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

function build() {
  const config = getConfig();

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
