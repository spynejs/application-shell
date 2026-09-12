// Grammar wiring assertions — proves the installed @spynejs/grammar and this
// repo's agent-facing docs agree. Runs ahead of the browser suite (npm test).
//
// The package ships a machine-readable manifest; the docs hardcode a
// stackVersion in prose. Nothing else checks that they match, and a version
// bump that moves the payload or the stackVersion leaves AGENTS.md/CLAUDE.md
// quietly lying to every agent that reads them.

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkgDir = path.join(root, 'node_modules/@spynejs/grammar');
const read = (p) => fs.readFileSync(p, 'utf8');

const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });

// 0. package present
if (!fs.existsSync(path.join(pkgDir, 'manifest.json'))) {
  console.error('FAIL  @spynejs/grammar is not installed (run npm install)');
  process.exit(1);
}
const manifest = JSON.parse(read(path.join(pkgDir, 'manifest.json')));
const pkgVersion = JSON.parse(read(path.join(pkgDir, 'package.json'))).version;

// 1. every manifest file exists
const missing = (manifest.files ?? []).filter((f) => !fs.existsSync(path.join(pkgDir, f.path)));
check('manifest files all present', missing.length === 0,
  missing.length ? `${missing.length} missing, e.g. ${missing[0].path}` : `${manifest.files.length} files`);

// 2. counts match the payload on disk
const kindCount = (kind) => (manifest.files ?? []).filter((f) => f.kind === kind).length;
const dirCount = (dir) => fs.existsSync(path.join(pkgDir, 'grammar', dir))
  ? fs.readdirSync(path.join(pkgDir, 'grammar', dir)).filter((f) => f.endsWith('.md')).length
  : -1;
const cards = dirCount('cards');
const records = dirCount('records');
check('manifest counts match payload',
  cards === manifest.counts?.cards && records === manifest.counts?.records,
  `cards ${cards}/${manifest.counts?.cards}, records ${records}/${manifest.counts?.records}, manifest kinds card=${kindCount('card')} record=${kindCount('record')}`);

// 3. entry points resolve
const badEntries = Object.entries(manifest.entry ?? {}).filter(([, p]) => !fs.existsSync(path.join(pkgDir, p)));
check('manifest entry points resolve', badEntries.length === 0,
  badEntries.length ? badEntries.map(([k, p]) => `${k}→${p}`).join(', ') : Object.keys(manifest.entry ?? {}).join(', '));

// 4. payload directory is where the docs say it is (moved to grammar/ at 0.3.0)
check('payload lives at grammar/', fs.existsSync(path.join(pkgDir, 'grammar/trees.md')), `package ${pkgVersion}`);

// 5. stackVersion: package spec vs this repo's docs
const stackRe = /stackVersion:?\s*(v\d+-r\d+)/;
const specVersion = read(path.join(pkgDir, manifest.entry?.spec ?? 'grammar/00-agent-spec.md')).match(stackRe)?.[1];
for (const doc of ['AGENTS.md', 'CLAUDE.md']) {
  const claimed = read(path.join(root, doc)).match(stackRe)?.[1];
  check(`${doc} stackVersion matches installed grammar`, Boolean(specVersion) && claimed === specVersion,
    `doc says ${claimed ?? '(none)'}, package says ${specVersion ?? '(none)'}`);
}

// 6. framework compatibility: installed spyne satisfies the grammar's declared range
const spyneVersion = JSON.parse(read(path.join(root, 'node_modules/spyne/package.json'))).version;
const range = manifest.frameworkCompat?.spynejs ?? '';
const parse = (v) => v.replace(/^[^\d]*/, '').split('.').map(Number);
const gte = (a, b) => { for (let i = 0; i < 3; i += 1) { const d = (a[i] ?? 0) - (b[i] ?? 0); if (d) return d > 0; } return true; };
let compatOk = null;
if (/^>=/.test(range)) compatOk = gte(parse(spyneVersion), parse(range));
else if (/^\^/.test(range)) { const r = parse(range); const v = parse(spyneVersion); compatOk = v[0] === r[0] && gte(v, r); }
check('installed spyne satisfies frameworkCompat', compatOk === true,
  `spyne ${spyneVersion} vs "${range}"${compatOk === null ? ' (range form not understood)' : ''}`);

// 7. no stale references to the retired package name in tracked source
const self = path.relative(root, fileURLToPath(import.meta.url));
const tracked = execSync('git ls-files', { cwd: root, encoding: 'utf8' }).split('\n')
  .filter((f) => /\.(js|mjs|json|md|html)$/.test(f) && !f.startsWith('node_modules/') && f !== self);
const stale = tracked.filter((f) => /@spynejs\/kb\b/.test(read(path.join(root, f))));
check('no @spynejs/kb references in tracked source', stale.length === 0, stale.join(', ') || `${tracked.length} files scanned`);

// report
let failed = 0;
for (const r of results) {
  if (!r.ok) failed += 1;
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? ` — ${r.detail}` : ''}`);
}
console.log(`\n@spynejs/grammar ${pkgVersion} (${specVersion ?? 'no stackVersion'}): ${results.length - failed}/${results.length} checks passed`);
process.exit(failed ? 1 : 0);
