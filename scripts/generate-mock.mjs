// Generate the MOCK model output in src/data/ (deterministic: same output every run).
//   risk_forecast.json     current 10-day forecast (dashboard)
//   replay_2025.json       daily predicted risk + observed flooding, 1 Sep – 15 Oct 2025
//   partner_portfolio.json mock MFI / insurer clients per district
//
// Usage: node scripts/generate-mock.mjs
// All numbers are FAKE. They only exist to make the demo story visible.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');
const districts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'districts.geojson'), 'utf8')).features.map(
  (f) => f.properties.district_id
);

// ---------- helpers ----------
function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20251123);
const between = (a, b) => a + (b - a) * rand();
const clamp = (x, a = 0.02, b = 0.97) => Math.min(b, Math.max(a, x));
const r2 = (x) => Math.round(x * 100) / 100;

// Same thresholds the UI legend describes
export const levelOf = (p) => (p >= 0.65 ? 'high' : p >= 0.35 ? 'medium' : 'low');

function addDays(iso, n) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// ---------- 1. current forecast ----------
const GENERATED_AT = '2026-11-23';

const CURRENT_HIGH = ['KH1407', 'KH0804', 'KH0806', 'KH0308', 'KH1412']; // Peam Ro, Kaoh Thum, Lvea Aem, Kaoh Soutin, Sithor Kandal
const CURRENT_MEDIUM = ['KH1406', 'KH1408', 'KH0805', 'KH0807', 'KH0803', 'KH0314', 'KH0307', 'KH1401', 'KH0810', 'KH0802'];
// Medium districts with a different action, so the panel isn't repetitive
const MEDIUM_ACTION = {
  KH1401: 'delay_transplant',
  KH0802: 'contact_lender',
  KH0307: 'contact_lender',
};

function forecastDistrict(id) {
  const level = CURRENT_HIGH.includes(id) ? 'high' : CURRENT_MEDIUM.includes(id) ? 'medium' : 'low';
  let p0;
  let shape; // probability multiplier per forecast day 1..10
  if (level === 'high') {
    p0 = between(0.7, 0.88);
    const peak = 2 + Math.floor(rand() * 3); // peak on day 2-4, then recede
    shape = (d) => (d <= peak ? 1 + 0.03 * d : 1 + 0.03 * peak - 0.07 * (d - peak));
  } else if (level === 'medium') {
    p0 = between(0.4, 0.6);
    const rising = rand() < 0.4;
    shape = (d) => (rising ? 1 + 0.05 * Math.min(d, 4) - 0.04 * Math.max(0, d - 6) : 1 - 0.035 * d);
  } else {
    p0 = between(0.06, 0.28);
    shape = (d) => 1 - 0.02 * d;
  }

  const forecast = [];
  for (let d = 1; d <= 10; d++) {
    const p = r2(clamp(p0 * shape(d) + between(-0.03, 0.03)));
    forecast.push({ date: addDays(GENERATED_AT, d), risk_level: levelOf(p), probability: p });
  }

  let drivers;
  if (level === 'high') {
    drivers = ['upstream_discharge_rising', rand() < 0.5 ? 'mekong_level_high' : 'rain_3day_high', 'low_lying_floodplain'];
  } else if (level === 'medium') {
    drivers = [rand() < 0.5 ? 'upstream_discharge_rising' : 'soil_saturated', 'rain_forecast_high'];
  } else {
    drivers = ['river_levels_falling', 'little_rain'];
  }

  const action_id =
    level === 'high' ? (rand() < 0.65 ? 'harvest_early' : 'move_inputs') : level === 'medium' ? MEDIUM_ACTION[id] ?? 'move_inputs' : 'monitor';

  return { district_id: id, risk_level: levelOf(r2(p0)), probability: r2(p0), drivers, forecast, action_id };
}

// Make sure the headline level always matches the scripted list (thresholds are 0.35 / 0.65)
const forecastOut = {
  generated_at: GENERATED_AT,
  _demo: 'MOCK DATA, not real model output',
  districts: districts.map(forecastDistrict),
};

// ---------- 2. replay 2025 ----------
const REPLAY_START = '2025-09-01';
const REPLAY_DAYS = 45; // 1 Sep – 15 Oct 2025

// Scenario per district.
//   flood:       risk turns High `lead` days before observed flooding starts on day `start`
//   false_alarm: risk turns High for a few days, no flood observed
//   missed:      flood observed but the model only reached Medium
//   medium:      a bump to Medium, no flood
//   quiet:       stays Low
// Day index 0 = 1 Sep. Late Sep 2025 flooding: day 17 = 18 Sep, day 29 = 30 Sep.
const SCENARIOS = {
  KH1407: { type: 'flood', start: 19, dur: 14, lead: 5 }, // Peam Ro
  KH1406: { type: 'flood', start: 21, dur: 11, lead: 4 }, // Peam Chor
  KH1412: { type: 'flood', start: 22, dur: 10, lead: 4 }, // Sithor Kandal
  KH1408: { type: 'flood', start: 24, dur: 9, lead: 3 }, // Pea Reang
  KH0804: { type: 'flood', start: 20, dur: 13, lead: 5 }, // Kaoh Thum
  KH0806: { type: 'flood', start: 22, dur: 11, lead: 4 }, // Lvea Aem
  KH0805: { type: 'flood', start: 25, dur: 8, lead: 3 }, // Leuk Daek
  KH0807: { type: 'flood', start: 26, dur: 7, lead: 3 }, // Mukh Kampul
  KH0308: { type: 'flood', start: 18, dur: 12, lead: 4 }, // Kaoh Soutin
  KH0314: { type: 'flood', start: 23, dur: 9, lead: 4 }, // Srei Santhor
  KH1401: { type: 'missed', start: 27, dur: 6 }, // Ba Phnum: rain-driven flood the model under-predicted
  KH0307: { type: 'false_alarm', start: 15, dur: 4 }, // Kang Meas
  KH0802: { type: 'false_alarm', start: 28, dur: 3 }, // Kien Svay
  KH0803: { type: 'medium', start: 20, dur: 10 }, // Khsach Kandal
  KH0810: { type: 'medium', start: 24, dur: 8 }, // S'ang
  KH0315: { type: 'medium', start: 19, dur: 7 }, // Stueng Trang
  KH1409: { type: 'medium', start: 22, dur: 6 }, // Preah Sdach
  KH0306: { type: 'medium', start: 23, dur: 6 }, // Kampong Siem
};

// Smooth step from 0 to 1 over `width` days centred on `at`
const ramp = (d, at, width) => 1 / (1 + Math.exp(-(d - at) / (width / 4)));

function replayDistrict(id) {
  const sc = SCENARIOS[id] ?? { type: 'quiet' };
  const base = between(0.06, 0.2);
  const rows = [];
  for (let d = 0; d < REPLAY_DAYS; d++) {
    let p = base;
    let observed = false;
    if (sc.type === 'flood') {
      const highFrom = sc.start - sc.lead; // first High day
      const end = sc.start + sc.dur;
      const up = ramp(d, highFrom - 1.5, 4); // cross 0.65 right around highFrom
      const down = 1 - ramp(d, end - 1, 5);
      p = base + (between(0.84, 0.93) - base) * up * down;
      observed = d >= sc.start && d < end;
    } else if (sc.type === 'missed') {
      const up = ramp(d, sc.start - 3, 5);
      const down = 1 - ramp(d, sc.start + sc.dur, 5);
      p = base + (0.55 - base) * up * down;
      observed = d >= sc.start && d < sc.start + sc.dur;
    } else if (sc.type === 'false_alarm') {
      const up = ramp(d, sc.start, 2);
      const down = 1 - ramp(d, sc.start + sc.dur, 2);
      p = base + (0.74 - base) * up * down;
    } else if (sc.type === 'medium') {
      const up = ramp(d, sc.start, 4);
      const down = 1 - ramp(d, sc.start + sc.dur, 4);
      p = base + (0.52 - base) * up * down;
    }
    p = r2(clamp(p + between(-0.025, 0.025)));
    rows.push({ date: addDays(REPLAY_START, d), district_id: id, risk_level: levelOf(p), probability: p, observed_flood: observed });
  }
  return rows;
}

const replayRows = districts.flatMap(replayDistrict).sort((a, b) => a.date.localeCompare(b.date) || a.district_id.localeCompare(b.district_id));

// ---------- 3. partner portfolio ----------
const portfolio = districts.map((id) => {
  const clients = Math.round(between(120, 900) / 10) * 10;
  const avgLoan = between(1500, 3500);
  return { district_id: id, clients, value_usd: Math.round((clients * avgLoan) / 1000) * 1000 };
});

// ---------- write ----------
const write = (name, data) => fs.writeFileSync(path.join(DATA_DIR, name), JSON.stringify(data, null, 1) + '\n');
write('risk_forecast.json', forecastOut);
write('replay_2025.json', replayRows);
write('partner_portfolio.json', portfolio);

// ---------- sanity report ----------
const count = (lvl) => forecastOut.districts.filter((d) => d.risk_level === lvl).length;
console.log(`Forecast: ${count('high')} high, ${count('medium')} medium, ${count('low')} low`);
for (const [id, sc] of Object.entries(SCENARIOS)) {
  if (sc.type !== 'flood' && sc.type !== 'missed' && sc.type !== 'false_alarm') continue;
  const rows = replayRows.filter((r) => r.district_id === id);
  const firstHigh = rows.findIndex((r) => r.risk_level === 'high');
  const firstFlood = rows.findIndex((r) => r.observed_flood);
  console.log(
    `  ${id} ${sc.type.padEnd(11)} firstHigh=${firstHigh < 0 ? '-' : rows[firstHigh].date} firstFlood=${firstFlood < 0 ? '-' : rows[firstFlood].date}` +
      (firstHigh >= 0 && firstFlood >= 0 ? ` lead=${firstFlood - firstHigh}d` : '')
  );
}
console.log(`Replay rows: ${replayRows.length}, portfolio rows: ${portfolio.length}`);
