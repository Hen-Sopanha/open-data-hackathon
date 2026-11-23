# SrovSafe: Flood Early Warning (demo website)

Hackathon prototype for **Open Data X AI Venture Hackathon 1.0**. SrovSafe forecasts flood risk per
district and turns it into free Khmer alerts for rice farmers and risk data for lenders and insurers.

> **All data in this app is mock data.** It is shaped like the real model output so it can be swapped later.

## Run it

Requires Node.js 18+ (tested with Node 24).

```bash
npm install
npm run dev
```

Open http://localhost:5173. Add `?lang=km` to any URL to open the app in Khmer
(e.g. http://localhost:5173/replay?lang=km). The **EN | ខ្មែរ** toggle in the navbar also switches language.

Internet is needed while running: fonts come from Google Fonts and the map background from Esri.

## Pages

| Route | Page | What it shows |
| --- | --- | --- |
| `/` | Dashboard | District risk map (Prey Veng, Kandal, Kampong Cham) and a side panel with 10-day forecast, reasons and farmer action |
| `/replay` | 2025 Replay | 1 Sep – 15 Oct 2025: predicted risk vs. satellite-observed flooding, with play button and per-district timeline |
| `/alert` | Farmer Alert | Phone mock-up with the Khmer chat alert for the selected district |
| `/partners` | Partners | Portfolio exposure for lenders/insurers: cards, sortable table, chart, CSV export |

## Data

All components read data only through [`src/data/api.js`](src/data/api.js):
`getDistricts()`, `getForecast()`, `getReplay()`, `getActions()`, `getDrivers()`, `getPortfolio()`.
To use real model output or an API, replace the bodies of those functions and keep the same return shapes
(documented in the file).

| File | Content |
| --- | --- |
| `src/data/districts.geojson` | 34 district boundaries, ids are official codes (e.g. `KH1407`) |
| `src/data/risk_forecast.json` | Current forecast (generated 2026-11-23) |
| `src/data/replay_2025.json` | Daily predicted risk + observed flooding, 1 Sep – 15 Oct 2025 |
| `src/data/actions.json` | Fixed list of farmer actions (EN + KM) |
| `src/data/drivers.json` | Explanation of each risk driver (EN + KM) with its data source |
| `src/data/partner_portfolio.json` | Mock clients and portfolio value per district |

Risk levels: Low < 35% ≤ Medium < 65% ≤ High.
Partner "exposure this week" = portfolio value × highest probability in the next 7 days, counted only when that peak is ≥ 35%.

### Regenerating data

```bash
# District boundaries from the HDX COD-AB file (Cambodia ADM2, 2018)
node scripts/build-districts.mjs raw/khm_admin_boundaries.geojson/khm_admin2.geojson src/data/districts.geojson

# Mock forecast, replay and portfolio (deterministic: same output every run)
node scripts/generate-mock.mjs
```

Boundary source: HDX "Cambodia – Subnational Administrative Boundaries" (COD-AB).

## Khmer text

All Khmer strings are drafts and listed in [`KHMER_TO_REVIEW.md`](KHMER_TO_REVIEW.md) for a native speaker.
UI text lives in [`src/i18n/km.json`](src/i18n/km.json); district names in `scripts/build-districts.mjs`;
month and weekday names in `src/components/risk.js`.

After editing the review list, check what still differs from the app:

```bash
node scripts/check-khmer.mjs
```

## Project structure

```
src/
  routes/      Dashboard, Replay, AlertPreview, Partners
  components/  Navbar, LanguageToggle, RiskMap, Legend, DistrictPanel, DateSlider, ReplayChart,
               PhoneMock, ChatBubble, SummaryCards, PortfolioTable, ExposureChart, ...
  data/        mock JSON / GeoJSON, api.js, useData.js
  i18n/        en.json, km.json, I18nContext.jsx
  state/       SelectionContext.jsx (district shared between Dashboard and Farmer Alert)
  styles/      global.css (colour tokens incl. risk colours)
scripts/       data build + Khmer check scripts
```

Stack: Vite, React, react-router-dom, Leaflet + react-leaflet, Recharts. Plain CSS / CSS modules.
