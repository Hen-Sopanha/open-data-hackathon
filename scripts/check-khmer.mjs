// Compare the Khmer text in KHMER_TO_REVIEW.md with what the app actually uses.
// Reports rows where the reviewer's text differs from km.json / actions.json / drivers.json / districts.geojson.
// Usage: node scripts/check-khmer.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

const km = JSON.parse(read('src/i18n/km.json'));
const actions = Object.fromEntries(JSON.parse(read('src/data/actions.json')).map((a) => [a.id, a.km]));
const drivers = Object.fromEntries(JSON.parse(read('src/data/drivers.json')).map((d) => [d.id, d.km]));
const geo = JSON.parse(read('src/data/districts.geojson')).features.map((f) => f.properties);
const names = {};
for (const p of geo) {
  names[p.district_id] = p.name_km;
  names[p.province_id] = p.province_km;
}

const lookup = (key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), km);

let section = '';
const diffs = [];
for (const line of read('KHMER_TO_REVIEW.md').split(/\r?\n/)) {
  if (line.startsWith('## ')) section = line;
  const cells = line.split('|').map((c) => c.trim());
  if (cells.length < 5 || cells[1] === 'Key' || cells[1] === 'id' || cells[1] === 'Code' || cells[1].startsWith('---')) continue;
  const [key, , reviewed] = [cells[1], cells[2], cells[3]];
  let current;
  if (section.includes('actions')) current = actions[key];
  else if (section.includes('drivers')) current = drivers[key];
  else if (section.includes('names')) current = names[key];
  else current = lookup(key);
  if (typeof current !== 'string') continue;
  // in the list, line breaks inside chat messages are written as a literal \n
  const reviewedText = reviewed.replace(/\\n/g, '\n');
  // footer rows are abbreviated with … in the list
  if (reviewed.endsWith('…') && current.startsWith(reviewed.slice(0, -1).trim())) continue;
  if (reviewedText !== current) diffs.push({ section, key, app: current, review: reviewed });
}

if (!diffs.length) console.log('No differences: KHMER_TO_REVIEW.md matches the app.');
for (const d of diffs) console.log(`${d.key}\n   app:    ${d.app}\n   review: ${d.review}`);
