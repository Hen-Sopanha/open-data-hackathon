# Demo video: recording script (≈ 2:45)

## Before recording

- Browser window **1440 × 900**, zoom 100%, bookmarks bar hidden. Internet on (fonts + map).
- `npm run dev`, open http://localhost:5173.
- Open each page once beforehand so the map tiles are cached.
- To restart the replay from 1 Sep, refresh `/replay`.
- Keyboard: on the replay slider, ← / → move one day.

Numbers marked **TODO** must come from our backtest. Don't say any other statistics on camera.

## Script

| Time | Screen | Action | Voice-over (suggestion) |
| --- | --- | --- | --- |
| 0:00 | Dashboard | Map visible, nothing selected | "In late September 2025, flooding affected more than 20,000 families and 10,000 hectares of rice across nine provinces. Farmers had little warning, and of Cambodia's 40 insurers only one offers crop insurance." |
| 0:20 | Dashboard | Hover over the red districts along the Mekong | "SrovSafe forecasts flood risk for every district, 3 to 10 days ahead, from open data: CHIRPS rainfall, GloFAS river discharge, MRC water levels and Sentinel-1 satellite maps." |
| 0:35 | Dashboard | Click **Peam Ro** | "For each district we show the risk, the next 10 days, why the model thinks so, and what a farmer should do." |
| 0:55 | 2025 Replay | Open page, press **▶ Play** | "Here's how it would have worked in the 2025 flood. Colours are our predicted risk; blue hatching is flooding actually seen by satellite." |
| 1:05 | 2025 Replay | Let it run; **pause around 15–16 Sep** (first red districts) | "On 15 September, districts turn red, and the caption shows flooding was observed about four days later." |
| 1:15 | 2025 Replay | Play on to ~**25 Sep** (hatching spreads), pause | "The hatched districts are where the flooding came. Red appeared there days earlier." |
| 1:25 | 2025 Replay | Click **Ba Phnum**, then **Kang Meas** in the map; point at the chart | "We're honest about errors: Ba Phnum flooded but only reached Medium, and Kang Meas was a false alarm. Lead time and accuracy from our backtest: **TODO**." |
| 1:40 | Dashboard → Farmer Alert | Back to Dashboard, click **Peam Ro**, then open **Farmer Alert** | "When risk is high, farmers get a free alert in Khmer." |
| 1:50 | Farmer Alert | Wait for the 3 messages, then untick **Show English translation** | "It explains why and what to do, and farmers can ask follow-up questions. Advice is only ever chosen from a fixed list of safe actions." |
| 2:05 | Farmer Alert | Pick a Low district in the dropdown (e.g. **Batheay**) | "Low risk gets a calm message, so alerts stay trusted." |
| 2:15 | Partners | Open page, point at cards and chart | "The same risk data helps microfinance institutions and insurers see which part of their portfolio is exposed this week, here with demo data." |
| 2:30 | Partners | Click a column header to sort, then **Export CSV** | "They can sort it, and export it." |
| 2:35 | Any page | Click **ខ្មែរ** in the navbar | "The whole platform works in Khmer and English. SrovSafe: early warning for farmers, risk data for the institutions that support them." |

## Pages at a glance (if you need to improvise)

- **Dashboard:** 5 High districts (Peam Ro, Kaoh Thum, Lvea Aem, Kaoh Soutin, Sithor Kandal).
- **Replay:** first High day 15 Sep; flooding observed from 19 Sep; peak around 27–30 Sep; no High districts left by 4 Oct.
- **Partners (demo):** 16,350 clients · $41.4M portfolio · $10.9M (26%) exposed this week.
