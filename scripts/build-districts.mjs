// Build src/data/districts.geojson from the HDX COD-AB Cambodia ADM2 file.
// - keeps only Prey Veng, Kandal, Kampong Cham
// - simplifies polygons (Ramer-Douglas-Peucker) and rounds coordinates so the file stays small
// - adds Khmer names (DRAFT, listed in KHMER_TO_REVIEW.md for review)
//
// Usage: node scripts/build-districts.mjs <input adm2 geojson> <output geojson>

import fs from 'node:fs';

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error('Usage: node scripts/build-districts.mjs <input> <output>');
  process.exit(1);
}

const PROVINCES = {
  KH03: { en: 'Kampong Cham', km: 'កំពង់ចាម' },
  KH08: { en: 'Kandal', km: 'កណ្ដាល' },
  KH14: { en: 'Prey Veng', km: 'ព្រៃវែង' },
};

// DRAFT Khmer district names, to be checked by a native speaker
const KM_NAMES = {
  KH0301: 'បាធាយ',
  KH0302: 'ចំការលើ',
  KH0303: 'ជើងព្រៃ',
  KH0305: 'កំពង់ចាម',
  KH0306: 'កំពង់សៀម',
  KH0307: 'កងមាស',
  KH0308: 'កោះសូទិន',
  KH0313: 'ព្រៃឈរ',
  KH0314: 'ស្រីសន្ធរ',
  KH0315: 'ស្ទឹងត្រង់',
  KH0801: 'កណ្ដាលស្ទឹង',
  KH0802: 'កៀនស្វាយ',
  KH0803: 'ខ្សាច់កណ្ដាល',
  KH0804: 'កោះធំ',
  KH0805: 'លើកដែក',
  KH0806: 'ល្វាឯម',
  KH0807: 'មុខកំពូល',
  KH0808: 'អង្គស្នួល',
  KH0809: 'ពញាឮ',
  KH0810: 'ស្អាង',
  KH0811: 'តាខ្មៅ',
  KH1401: 'បាភ្នំ',
  KH1402: 'កំចាយមារ',
  KH1403: 'កំពង់ត្របែក',
  KH1404: 'កញ្ជ្រៀច',
  KH1405: 'មេសាង',
  KH1406: 'ពាមជរ',
  KH1407: 'ពាមរក៍',
  KH1408: 'ពារាំង',
  KH1409: 'ព្រះស្ដេច',
  KH1410: 'ព្រៃវែង',
  KH1411: 'ពោធិ៍រៀង',
  KH1412: 'ស៊ីធរកណ្ដាល',
  KH1413: 'ស្វាយអន្ទរ',
};

const TOLERANCE = 0.0015; // degrees (~150 m), invisible at province zoom
const DECIMALS = 5;

function perpDist(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
  const tc = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + tc * dx), p[1] - (a[1] + tc * dy));
}

function rdp(points, tol) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let maxD = 0;
    let idx = -1;
    for (let i = s + 1; i < e; i++) {
      const d = perpDist(points[i], points[s], points[e]);
      if (d > maxD) {
        maxD = d;
        idx = i;
      }
    }
    if (maxD > tol && idx > 0) {
      keep[idx] = 1;
      stack.push([s, idx], [idx, e]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const round = (n) => Number(n.toFixed(DECIMALS));

function simplifyRing(ring) {
  const s = rdp(ring, TOLERANCE).map(([x, y]) => [round(x), round(y)]);
  return s.length >= 4 ? s : null; // drop rings that collapse
}

function simplifyPolygon(poly) {
  const rings = poly.map(simplifyRing);
  if (!rings[0]) return null; // outer ring collapsed: drop the polygon (tiny islet)
  return rings.filter(Boolean);
}

function simplifyGeometry(g) {
  if (g.type === 'Polygon') {
    return { type: 'Polygon', coordinates: simplifyPolygon(g.coordinates) ?? g.coordinates };
  }
  if (g.type === 'MultiPolygon') {
    const polys = g.coordinates.map(simplifyPolygon).filter(Boolean);
    return { type: 'MultiPolygon', coordinates: polys.length ? polys : g.coordinates };
  }
  throw new Error(`Unexpected geometry ${g.type}`);
}

const src = JSON.parse(fs.readFileSync(inPath, 'utf8'));
const features = src.features
  .filter((f) => PROVINCES[f.properties.adm1_pcode])
  .map((f) => {
    const p = f.properties;
    const prov = PROVINCES[p.adm1_pcode];
    if (!KM_NAMES[p.adm2_pcode]) throw new Error(`Missing Khmer name for ${p.adm2_pcode} ${p.adm2_name}`);
    return {
      type: 'Feature',
      properties: {
        district_id: p.adm2_pcode,
        name_en: p.adm2_name,
        name_km: KM_NAMES[p.adm2_pcode],
        province_id: p.adm1_pcode,
        province_en: prov.en,
        province_km: prov.km,
      },
      geometry: simplifyGeometry(f.geometry),
    };
  })
  .sort((a, b) => a.properties.district_id.localeCompare(b.properties.district_id));

const out = {
  type: 'FeatureCollection',
  _source: 'HDX COD-AB Cambodia ADM2 (valid_on 2018-10-04), simplified',
  features,
};
fs.writeFileSync(outPath, JSON.stringify(out));
console.log(`Wrote ${features.length} districts to ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(0)} KB)`);
