# ThaeDomnam: Flood Early Warning Demo Website (Project Context for Claude Code)

> **Read this whole file before writing any code.**
> This is a **hackathon prototype** for a 2–3 minute demo video, not a production app.
> Optimise for: it works, it looks clean, it is easy to screen-record.

---

## 0. Working rules for Claude Code (IMPORTANT)

1. **Ask before deciding.** If something is not specified in this file, STOP and ask me
   (the team lead) before choosing. Examples: provinces to show, colours/branding,
   adding a new library, changing the folder structure, deployment.
2. **Ask the "Open questions" in Section 9 first**, before scaffolding the project.
3. Work in **small steps**. After each step, tell me what you did and how to see it
   (`npm run dev`), then wait for my go-ahead before the next big step.
4. Use **mock data only** (see Section 5). Do not call external APIs at runtime.
   Shape the data so we can swap in real model output later without changing components.
5. Keep dependencies minimal. Do not add a library not listed in Section 3 without asking.
6. If you need a file from the internet (e.g. district boundaries GeoJSON) and can't
   download it, tell me exactly which file and URL, and I will download it for you.
7. Never invent statistics for display text. Use the figures in Section 8 or placeholders
   marked `TODO` that I will fill in.

---

## 1. Project summary

- **Hackathon:** Open Data X AI Venture Hackathon 1.0 (MPTC, Cambodia). Theme: Environment & Natural Resources.
- **Product:** SrovSafe (working name). It predicts flood risk per district 3–10 days ahead
  using open data (CHIRPS rainfall, GloFAS river discharge, MRC water levels,
  Sentinel-1 satellite flood maps) and a machine learning model, then:
  - sends **free Khmer alerts with crop advice** to rice farmers via a Telegram bot
  - sells the **same risk data** to microfinance institutions (MFIs), crop insurers and NGOs.
- **This website** is the visual demo of that product for judges.
- **Deadline:** the prototype video must be recorded by **24 Nov 2026**. Keep scope tight.

---

## 2. Pages / features (in priority order)

Build in this order. Each one should work before starting the next.

### 2.1 Risk map dashboard (home page), MUST HAVE
- Full-width Leaflet map of the selected provinces, districts drawn as polygons.
- Each district is coloured by risk level:
  - Low = green, Medium = amber, High = red (use accessible, not neon, shades).
- Click a district to open a **side panel** with:
  - district + province name (English and Khmer)
  - risk level + probability (e.g. "High · 78%")
  - forecast for the next 10 days (small bar or line chart, or simple coloured day boxes)
  - "Why": the top 2–3 drivers (e.g. "Upstream river discharge rising", "120 mm rain in last 3 days")
  - recommended farmer action (from a fixed list, see Section 5)
- Legend for the risk levels and a "last updated" date.

### 2.2 2025 flood replay, MUST HAVE
- A **date slider** (plus a Play button) covering e.g. **1 Sep – 15 Oct 2025**.
- As the date moves, the map recolours using the model's predicted risk for that date.
- Toggle/overlay: **"Actual flooding (satellite)"**, which shows which districts were really
  flooded on that date (hatched pattern or outline), so viewers can see that
  **risk turned High several days before the flood appeared.**
- A small caption that updates, e.g.
  "12 Sep 2025: 3 districts at High risk · flooding observed 4 days later".
- This is the **key moment of the demo video**, so make it smooth.

### 2.3 Farmer alert preview, MUST HAVE
- A **mock phone screen** (CSS frame) showing a Telegram-style chat:
  - bot message with the alert in **Khmer** (text only, **no voice/audio needed**)
  - an optional English translation line underneath (toggleable)
  - a farmer's follow-up question bubble + bot reply (e.g. "Should I harvest now?")
- Content changes based on the selected district's risk level.
- Must look like a chat, but **do not copy Telegram's logo or exact branding**;
  use a generic chat style.

### 2.4 Partner / insurer view, MUST HAVE
- Page for MFIs and insurers.
- A **portfolio table**: client groups by district with columns such as
  District · Province · # Borrowers/Policies · Loan/Insured value (USD) · Risk level · Exposure this week.
- Summary cards on top: total clients, clients in High-risk districts, % of portfolio exposed.
- A small bar chart of exposure by risk level.
- Button "Export CSV" (client-side CSV download of the table).
- All numbers are **mock** and clearly labelled "Demo data".

---

## 3. Tech stack (decided)

| Area | Choice |
| --- | --- |
| Build tool | Vite |
| Framework | React (JavaScript or TypeScript, **ask me which** before starting) |
| Map | Leaflet + react-leaflet |
| Charts | One small library only, e.g. Recharts (ask before adding anything else) |
| Styling | Plain CSS or CSS modules (ask if you want Tailwind) |
| Routing | react-router-dom (4 routes: `/`, `/replay`, `/alert`, `/partners`) |
| i18n | Simple custom context + JSON dictionaries (no heavy i18n library unless I approve) |
| Fonts | Inter (Latin) + Noto Sans Khmer (Khmer) |
| Data | Static JSON / GeoJSON in `src/data/` |

---

## 4. Language: bilingual toggle (English / Khmer)

- A toggle in the top navbar: **EN | ខ្មែរ**. Default: English.
- All UI strings live in `src/i18n/en.json` and `src/i18n/km.json`.
- Switching language changes **the whole UI**: nav, labels, legend, panel, table headers, captions.
- District and province names come from the data in both languages (`name_en`, `name_km`).
- Use **Noto Sans Khmer** for Khmer text; check that line height doesn't clip Khmer vowels.
- Khmer strings you write should be marked with `"_review": true` comments or listed in
  a `KHMER_TO_REVIEW.md` file, so a native speaker on the team can check them.

---

## 5. Mock data (shape it like the real model output)

Put everything in `src/data/`. Keep it realistic but **clearly fake**.

### 5.1 `districts.geojson`
- District polygons for the selected provinces (see Open questions).
- Each feature's `properties`:
```json
{ "district_id": "KH-PV-01", "name_en": "…", "name_km": "…", "province_en": "Prey Veng", "province_km": "ព្រៃវែង" }
```
- If real boundaries can't be downloaded, tell me. As a last resort (with my OK) use
  simplified placeholder polygons.

### 5.2 `risk_forecast.json`: current forecast (for the dashboard)
```json
{
  "generated_at": "2026-11-23",
  "districts": [
    {
      "district_id": "KH-PV-01",
      "risk_level": "high",
      "probability": 0.78,
      "drivers": ["upstream_discharge_rising", "rain_3day_high"],
      "forecast": [ { "date": "2026-11-24", "risk_level": "medium", "probability": 0.52 } ],
      "action_id": "harvest_early"
    }
  ]
}
```

### 5.3 `replay_2025.json`: daily predicted risk + observed flooding
```json
[
  { "date": "2025-09-10", "district_id": "KH-PV-01", "risk_level": "high", "probability": 0.81, "observed_flood": false },
  { "date": "2025-09-14", "district_id": "KH-PV-01", "risk_level": "high", "probability": 0.90, "observed_flood": true }
]
```
- Make the story visible: in several districts risk should rise to High **3–5 days before**
  `observed_flood` becomes true. Include 1–2 false alarms and 1 missed flood, so it looks honest.

### 5.4 `actions.json`: fixed list of farmer actions (the LLM may only pick from these)
```json
[
  { "id": "harvest_early", "en": "Harvest early if the grain is mature.", "km": "…" },
  { "id": "delay_transplant", "en": "Delay transplanting by about one week.", "km": "…" },
  { "id": "move_inputs", "en": "Move seed and fertiliser to higher ground.", "km": "…" },
  { "id": "contact_lender", "en": "Contact your lender early if you expect losses.", "km": "…" },
  { "id": "monitor", "en": "No action needed. Keep monitoring alerts.", "km": "…" }
]
```

### 5.5 `drivers.json`: human-readable explanation for each driver id (EN + KM).

### 5.6 `partner_portfolio.json`: mock MFI/insurer clients per district
```json
[ { "district_id": "KH-PV-01", "clients": 420, "value_usd": 1260000 } ]
```

**Important:** components must read data only through a small `src/data/api.js`
(e.g. `getForecast()`, `getReplay()`, `getPortfolio()`), so we can later replace the mock
JSON with real model output or a FastAPI endpoint by changing one file.

---

## 6. Suggested folder structure

```
src/
  main.jsx / App.jsx
  routes/        Dashboard.jsx, Replay.jsx, AlertPreview.jsx, Partners.jsx
  components/    Navbar, LanguageToggle, RiskMap, DistrictPanel, Legend,
                 DateSlider, PhoneMock, ChatBubble, PortfolioTable, SummaryCards
  data/          *.json, districts.geojson, api.js
  i18n/          en.json, km.json, I18nContext.jsx
  styles/
```
(Ask before deviating significantly.)

---

## 7. Design guidelines

- Clean, calm, "government/NGO data product" look. White/light background, one accent colour.
- Risk colours must be consistent everywhere (map, badges, table, charts).
- Readable at 1080p screen recording: base font ≥ 16px, clear labels.
- Desktop first (1440×900 for recording). It shouldn't break on a laptop screen; mobile is optional.
- Navbar: logo text "SrovSafe", links Dashboard · 2025 Replay · Farmer Alert · Partners, language toggle.
- Footer: "Prototype · Demo data · Open Data X AI Venture Hackathon 1.0".
- No real organisation logos (MPTC, Telegram, MFIs, insurers). Text names only where needed.

---

## 8. Facts allowed on screen (from our project brief)

Use only these for any explanatory text; otherwise use `TODO` placeholders.
- Late Sep 2025: flooding affected 20,000+ families and 10,000+ ha of rice across nine provinces.
- Of Cambodia's 40 insurers, only one offers crop insurance.
- Data sources: CHIRPS, Open-Meteo, GloFAS (Copernicus), MRC Data Portal, Sentinel-1.
- Model results (accuracy, lead time): **TODO** (fill in from our backtest).

---

## 9. Open questions: ask me these BEFORE starting

1. JavaScript or TypeScript?
2. Which 2–3 provinces should the map show? (Default proposal: Prey Veng, Kandal, Kampong Cham.)
3. Accent colour / any branding preferences? Do we have a logo?
4. Plain CSS or Tailwind?
5. Do you already have the district boundaries GeoJSON, or should I tell you where to download it?
6. Will this be deployed (e.g. Vercel/Netlify) or only run locally for recording?
7. Exact date range for the 2025 replay?

---

## 10. Definition of done (for the demo)

- [ ] `npm install && npm run dev` runs with no errors
- [ ] Dashboard: coloured district map, clickable panel with forecast, drivers, action
- [ ] Replay: slider + play button, recolouring map, "actual flooding" overlay, caption
- [ ] Farmer alert: phone mock with Khmer chat messages tied to selected district
- [ ] Partners: summary cards, portfolio table, exposure chart, CSV export
- [ ] EN / ខ្មែរ toggle switches the whole UI; Khmer renders correctly
- [ ] All data read through `src/data/api.js`
- [ ] `README.md` with run instructions and a `KHMER_TO_REVIEW.md` list
