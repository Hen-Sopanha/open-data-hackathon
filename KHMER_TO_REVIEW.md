# Khmer strings to review

All Khmer text was written by Claude Code and **needs a native speaker to check it**.
The source of truth is [src/i18n/km.json](src/i18n/km.json). Edit that file directly; this list is a checklist.

## Step 1: UI shell

| Key | English | Khmer (draft) | OK? |
| --- | --- | --- | --- |
| tagline | Flood early warning | ការព្រមានជាមុនពីទឹកជំនន់ | ☐ |
| nav.dashboard | Dashboard | ផ្ទាំងទិន្នន័យ | ☐ |
| nav.replay | 2025 Replay | ទឹកជំនន់ ២០២៥ | ☐ |
| nav.alert | Farmer Alert | សារជូនដំណឹងកសិករ | ☐ |
| nav.partners | Partners | ដៃគូ | ☐ |
| lang.label | Language | ភាសា | ☐ |
| footer | Prototype · Demo data · … | គំរូសាកល្បង · ទិន្នន័យសាកល្បង · … | ☐ |
| pages.dashboard.title | Flood risk dashboard | ផ្ទាំងហានិភ័យទឹកជំនន់ | ☐ |
| pages.dashboard.subtitle | District flood risk for the next 10 days. | ហានិភ័យទឹកជំនន់តាមស្រុក សម្រាប់ ១០ ថ្ងៃខាងមុខ។ | ☐ |
| pages.replay.title | 2025 flood replay | ការចាក់ឡើងវិញ ទឹកជំនន់ឆ្នាំ ២០២៥ | ☐ |
| pages.replay.subtitle | Predicted risk vs. observed flooding, 1 Sep – 15 Oct 2025. | ព្យាករហានិភ័យ ធៀបនឹងទឹកជំនន់ជាក់ស្តែង ១ កញ្ញា – ១៥ តុលា ២០២៥។ | ☐ |
| pages.alert.title | Farmer alert preview | គំរូសារជូនដំណឹងកសិករ | ☐ |
| pages.alert.subtitle | What a farmer receives in the chat bot. | សារដែលកសិករទទួលបានតាមរយៈ chat bot។ | ☐ |
| pages.partners.title | Partner view | ទិដ្ឋភាពសម្រាប់ដៃគូ | ☐ |
| pages.partners.subtitle | Portfolio exposure for lenders and insurers. | ហានិភ័យផលប័ត្រ សម្រាប់ស្ថាប័នឥណទាន និងក្រុមហ៊ុនធានារ៉ាប់រង។ | ☐ |
| common.comingSoon | Coming in the next step. | នឹងមកដល់នៅជំហានបន្ទាប់។ | ☐ |
| common.demoData | Demo data | ទិន្នន័យសាកល្បង | ☐ |

## Step 2: Dashboard UI (src/i18n/km.json)

| Key | English | Khmer (draft) | OK? |
| --- | --- | --- | --- |
| risk.low | Low | ទាប | ☐ |
| risk.medium | Medium | មធ្យម | ☐ |
| risk.high | High | ខ្ពស់ | ☐ |
| legend.title | Flood risk | ហានិភ័យទឹកជំនន់ | ☐ |
| legend.updated | Last updated | ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ | ☐ |
| panel.empty | Click a district on the map to see its flood risk, 10-day forecast and recommended action. | ចុចលើស្រុកណាមួយនៅលើផែនទី ដើម្បីមើលហានិភ័យទឹកជំនន់ ការព្យាករ ១០ ថ្ងៃ និងសកម្មភាពដែលបានណែនាំ។ | ☐ |
| panel.close | Close | បិទ | ☐ |
| panel.riskNow | Flood risk now | ហានិភ័យទឹកជំនន់បច្ចុប្បន្ន | ☐ |
| panel.forecast | Next 10 days | ១០ ថ្ងៃខាងមុខ | ☐ |
| panel.why | Why | មូលហេតុ | ☐ |
| panel.action | Recommended farmer action | សកម្មភាពណែនាំសម្រាប់កសិករ | ☐ |
| common.loading | Loading… | កំពុងផ្ទុក… | ☐ |

## Step 2: Farmer actions (src/data/actions.json)

| id | English | Khmer (draft) | OK? |
| --- | --- | --- | --- |
| harvest_early | Harvest early if the grain is mature. | ប្រមូលផលឲ្យបានឆាប់ ប្រសិនបើគ្រាប់ស្រូវទុំហើយ។ | ☐ |
| delay_transplant | Delay transplanting by about one week. | ពន្យារពេលស្ទូងប្រហែលមួយសប្តាហ៍។ | ☐ |
| move_inputs | Move seed and fertiliser to higher ground. | រើគ្រាប់ពូជ និងជី ទៅទុកនៅកន្លែងខ្ពស់។ | ☐ |
| contact_lender | Contact your lender early if you expect losses. | ទាក់ទងស្ថាប័នឥណទានរបស់អ្នកឲ្យបានឆាប់ ប្រសិនបើអ្នករំពឹងថានឹងខាតបង់។ | ☐ |
| monitor | No action needed. Keep monitoring alerts. | មិនចាំបាច់ធ្វើអ្វីទេ។ សូមបន្តតាមដានការជូនដំណឹង។ | ☐ |

## Step 2: Risk drivers (src/data/drivers.json)

| id | English | Khmer (draft) | OK? |
| --- | --- | --- | --- |
| upstream_discharge_rising | Upstream river discharge rising | លំហូរទឹកទន្លេពីខាងលើកំពុងកើនឡើង | ☐ |
| mekong_level_high | Mekong water level near flood alert level | កម្ពស់ទឹកទន្លេមេគង្គជិតដល់កម្រិតប្រុងប្រយ័ត្ន | ☐ |
| rain_3day_high | Heavy rain in the last 3 days | ភ្លៀងធ្លាក់ខ្លាំងក្នុងរយៈពេល ៣ ថ្ងៃចុងក្រោយ | ☐ |
| rain_forecast_high | Heavy rain forecast this week | មានការព្យាករថានឹងមានភ្លៀងធ្លាក់ខ្លាំងនៅសប្តាហ៍នេះ | ☐ |
| soil_saturated | Soil already saturated from recent rain | ដីឆ្អែតទឹករួចហើយ ដោយសារភ្លៀងថ្មីៗ | ☐ |
| low_lying_floodplain | Low-lying area that flooded in past years | តំបន់ទំនាបដែលធ្លាប់លិចទឹកក្នុងឆ្នាំមុនៗ | ☐ |
| satellite_water_expanding | Satellite shows standing water expanding | រូបភាពផ្កាយរណបបង្ហាញថាផ្ទៃទឹកកំពុងរីកធំ | ☐ |
| river_levels_falling | River levels falling | កម្ពស់ទឹកទន្លេកំពុងស្រក | ☐ |
| little_rain | Little rain recorded or forecast | មានភ្លៀងតិចតួច ទាំងបច្ចុប្បន្ន និងការព្យាករ | ☐ |

## Step 2: Province and district names

Source: `KM_NAMES` / `PROVINCES` in [scripts/build-districts.mjs](scripts/build-districts.mjs).
After fixing, re-run `node scripts/build-districts.mjs raw/khm_admin_boundaries.geojson/khm_admin2.geojson src/data/districts.geojson`.

| Code | English | Khmer (draft) | OK? |
| --- | --- | --- | --- |
| KH03 | Kampong Cham (province) | កំពង់ចាម | ☐ |
| KH08 | Kandal (province) | កណ្ដាល | ☐ |
| KH14 | Prey Veng (province) | ព្រៃវែង | ☐ |
| KH0301 | Batheay | បាធាយ | ☐ |
| KH0302 | Chamkar Leu | ចំការលើ | ☐ |
| KH0303 | Cheung Prey | ជើងព្រៃ | ☐ |
| KH0305 | Kampong Cham | កំពង់ចាម | ☐ |
| KH0306 | Kampong Siem | កំពង់សៀម | ☐ |
| KH0307 | Kang Meas | កងមាស | ☐ |
| KH0308 | Kaoh Soutin | កោះសូទិន | ☐ |
| KH0313 | Prey Chhor | ព្រៃឈរ | ☐ |
| KH0314 | Srei Santhor | ស្រីសន្ធរ | ☐ |
| KH0315 | Stueng Trang | ស្ទឹងត្រង់ | ☐ |
| KH0801 | Kandal Stueng | កណ្ដាលស្ទឹង | ☐ |
| KH0802 | Kien Svay | កៀនស្វាយ | ☐ |
| KH0803 | Khsach Kandal | ខ្សាច់កណ្ដាល | ☐ |
| KH0804 | Kaoh Thum | កោះធំ | ☐ |
| KH0805 | Leuk Daek | លើកដែក | ☐ |
| KH0806 | Lvea Aem | ល្វាឯម | ☐ |
| KH0807 | Mukh Kampul | មុខកំពូល | ☐ |
| KH0808 | Angk Snuol | អង្គស្នួល | ☐ |
| KH0809 | Ponhea Lueu | ពញាឮ | ☐ |
| KH0810 | S'ang | ស្អាង | ☐ |
| KH0811 | Ta Khmau | តាខ្មៅ | ☐ |
| KH1401 | Ba Phnum | បាភ្នំ | ☐ |
| KH1402 | Kamchay Mear | កំចាយមារ | ☐ |
| KH1403 | Kampong Trabaek | កំពង់ត្របែក | ☐ |
| KH1404 | Kanhchriech | កញ្ជ្រៀច | ☐ |
| KH1405 | Me Sang | មេសាង | ☐ |
| KH1406 | Peam Chor | ពាមជរ | ☐ |
| KH1407 | Peam Ro | ពាមរក៍ | ☐ |
| KH1408 | Pea Reang | ពារាំង | ☐ |
| KH1409 | Preah Sdach | ព្រះស្ដេច | ☐ |
| KH1410 | Prey Veng | ព្រៃវែង | ☐ |
| KH1411 | Pur Rieng | ពោធិ៍រៀង | ☐ |
| KH1412 | Sithor Kandal | ស៊ីធរកណ្ដាល | ☐ |
| KH1413 | Svay Antor | ស្វាយអន្ទរ | ☐ |

## Step 3: 2025 Replay (src/i18n/km.json)

| Key | English | Khmer (draft) | OK? |
| --- | --- | --- | --- |
| replay.play | Play | ចាក់ | ☐ |
| replay.pause | Pause | ផ្អាក | ☐ |
| replay.dateLabel | Replay date | កាលបរិច្ឆេទ | ☐ |
| replay.observedToggle | Actual flooding (satellite) | ទឹកជំនន់ជាក់ស្តែង (ផ្កាយរណប) | ☐ |
| replay.observedShort | Flooding observed | បានរកឃើញទឹកជំនន់ | ☐ |
| replay.caption.high | {count} districts at High risk | ស្រុកចំនួន {count} មានហានិភ័យខ្ពស់ | ☐ |
| replay.caption.none | No districts at High risk | គ្មានស្រុកណាមានហានិភ័យខ្ពស់ទេ | ☐ |
| replay.caption.lead | flooding observed {days} days later | បានរកឃើញទឹកជំនន់ {days} ថ្ងៃក្រោយមក | ☐ |
| replay.caption.flooded | {count} districts flooded | ស្រុកចំនួន {count} លិចទឹក | ☐ |
| replay.chart.title | Predicted flood risk, 1 Sep – 15 Oct 2025 | ហានិភ័យទឹកជំនន់ដែលបានព្យាករ ១ កញ្ញា – ១៥ តុលា ២០២៥ | ☐ |
| replay.chart.threshold | High (65%) | ខ្ពស់ (65%) | ☐ |
| replay.chart.hint | Click a district to see its risk timeline. | ចុចលើស្រុកណាមួយ ដើម្បីមើលហានិភ័យតាមពេលវេលា។ | ☐ |

(The `_one` variants of the caption keys use ១ in place of {count}/{days}.)

## Step 4: Farmer alert (src/i18n/km.json)

In chat messages, `\n` is a line break and `{...}` parts are filled in automatically (district, province, %, date, reason, action). Keep the `{...}` parts unchanged.

| Key | English | Khmer (draft) | OK? |
| --- | --- | --- | --- |
| alert.district | Farmer's district | ស្រុករបស់កសិករ | ☐ |
| alert.showTranslation | Show English translation | បង្ហាញការបកប្រែជាភាសាអង់គ្លេស | ☐ |
| alert.botName | SrovSafe | SrovSafe | ☐ |
| alert.botSubtitle | Flood alerts · bot | ការជូនដំណឹងទឹកជំនន់ · បូត | ☐ |
| alert.inputPlaceholder | Message | សរសេរសារ… | ☐ |
| alert.how.title | How it works | របៀបដំណើរការ | ☐ |
| alert.how.step1 | Every day the model forecasts flood risk for each district. | ជារៀងរាល់ថ្ងៃ ម៉ូដែលព្យាករហានិភ័យទឹកជំនន់សម្រាប់ស្រុកនីមួយៗ។ | ☐ |
| alert.how.step2 | Farmers get a free alert in Khmer, with the reason and what to do. | កសិករទទួលបានសារជូនដំណឹងជាភាសាខ្មែរដោយឥតគិតថ្លៃ រួមទាំងមូលហេតុ និងអ្វីដែលត្រូវធ្វើ។ | ☐ |
| alert.how.step3 | Advice is only ever picked from a fixed list of safe actions. | ដំបូន្មានត្រូវបានជ្រើសរើសតែពីបញ្ជីសកម្មភាពសុវត្ថិភាពដែលបានកំណត់ទុកប៉ុណ្ណោះ។ | ☐ |
| alertMsg.high.alert | ⚠️ FLOOD WARNING: {district}, {province}\nFlood risk is HIGH ({pct}). Highest on {peakDate} ({peakPct}).\nWhy: {driver}.\nWhat to do: {action} | ⚠️ ការព្រមានទឹកជំនន់៖ ស្រុក{district} ខេត្ត{province}\nហានិភ័យទឹកជំនន់ខ្ពស់ ({pct})។ ខ្ពស់បំផុតនៅថ្ងៃ{peakDate} ({peakPct})។\nមូលហេតុ៖ {driver}។\nអ្វីដែលត្រូវធ្វើ៖ {action} | ☐ |
| alertMsg.high.question | Should I harvest now? | តើខ្ញុំគួរច្រូតកាត់ឥឡូវនេះទេ? | ☐ |
| alertMsg.high.reply | If most of your grain is mature, yes: harvest in the next 1–2 days and dry the paddy on higher ground. If it is not mature yet, move seed and fertiliser to higher ground and wait for our next alert. | បើគ្រាប់ស្រូវភាគច្រើនទុំហើយ គួរច្រូតក្នុងរយៈពេល ១–២ ថ្ងៃខាងមុខ ហើយហាលស្រូវនៅកន្លែងខ្ពស់។ បើមិនទាន់ទុំទេ សូមរើគ្រាប់ពូជ និងជីទៅកន្លែងខ្ពស់ ហើយរង់ចាំការជូនដំណឹងបន្ទាប់របស់យើង។ | ☐ |
| alertMsg.medium.alert | 🔔 FLOOD WATCH: {district}, {province}\nFlood risk is MEDIUM ({pct}). Highest on {peakDate} ({peakPct}).\nWhy: {driver}.\nSuggested: {action} | 🔔 ការតាមដានទឹកជំនន់៖ ស្រុក{district} ខេត្ត{province}\nហានិភ័យទឹកជំនន់មធ្យម ({pct})។ ខ្ពស់បំផុតនៅថ្ងៃ{peakDate} ({peakPct})។\nមូលហេតុ៖ {driver}។\nការណែនាំ៖ {action} | ☐ |
| alertMsg.medium.question | Do I need to do anything now? | តើខ្ញុំត្រូវធ្វើអ្វីឥឡូវនេះទេ? | ☐ |
| alertMsg.medium.reply | It is not urgent yet. {action} We will message you again if the risk turns High. | មិនទាន់បន្ទាន់ទេ។ {action} យើងនឹងផ្ញើសារម្តងទៀត ប្រសិនបើហានិភ័យឡើងដល់កម្រិតខ្ពស់។ | ☐ |
| alertMsg.low.alert | ✅ {district}, {province}\nFlood risk is LOW ({pct}) for the next 10 days.\n{action} | ✅ ស្រុក{district} ខេត្ត{province}\nហានិភ័យទឹកជំនន់ទាប ({pct}) សម្រាប់ ១០ ថ្ងៃខាងមុខ។\n{action} | ☐ |
| alertMsg.low.question | Is it safe to transplant this week? | តើសប្តាហ៍នេះអាចស្ទូងបានដោយសុវត្ថិភាពទេ? | ☐ |
| alertMsg.low.reply | Flood risk stays low for the next 10 days, so you can go ahead. We will alert you if anything changes. | ហានិភ័យទឹកជំនន់នៅតែទាបសម្រាប់ ១០ ថ្ងៃខាងមុខ ដូច្នេះអ្នកអាចស្ទូងបាន។ យើងនឹងជូនដំណឹងអ្នក ប្រសិនបើមានការប្រែប្រួល។ | ☐ |

## Step 5: Partners (src/i18n/km.json)

`{...}` parts are filled in automatically. Keep them unchanged.

| Key | English | Khmer (draft) | OK? |
| --- | --- | --- | --- |
| partners.cards.clients | Total clients | អតិថិជនសរុប | ☐ |
| partners.cards.clientsSub | across {n} districts | ក្នុងស្រុកចំនួន {n} | ☐ |
| partners.cards.highClients | Clients in High-risk districts | អតិថិជនក្នុងស្រុកហានិភ័យខ្ពស់ | ☐ |
| partners.cards.highClientsSub | {pct} of clients · {n} districts | {pct} នៃអតិថិជន · ស្រុកចំនួន {n} | ☐ |
| partners.cards.value | Portfolio value | តម្លៃផលប័ត្រ | ☐ |
| partners.cards.exposure | Exposure this week | ហានិភ័យប៉ះពាល់សប្តាហ៍នេះ | ☐ |
| partners.cards.exposureSub | {pct} of portfolio exposed | {pct} នៃផលប័ត្រប្រឈមហានិភ័យ | ☐ |
| partners.table.title | Portfolio by district | ផលប័ត្រតាមស្រុក | ☐ |
| partners.export | Export CSV | នាំចេញ CSV | ☐ |
| partners.col.district | District | ស្រុក | ☐ |
| partners.col.province | Province | ខេត្ត | ☐ |
| partners.col.clients | Clients | អតិថិជន | ☐ |
| partners.col.value | Portfolio value (USD) | តម្លៃផលប័ត្រ (USD) | ☐ |
| partners.col.risk | Risk level | កម្រិតហានិភ័យ | ☐ |
| partners.col.peak7 | Peak risk (7 days) | ហានិភ័យខ្ពស់បំផុត (៧ ថ្ងៃ) | ☐ |
| partners.col.exposure | Exposure this week (USD) | ហានិភ័យប៉ះពាល់សប្តាហ៍នេះ (USD) | ☐ |
| partners.csv.probability | Current probability | ប្រូបាប៊ីលីតេបច្ចុប្បន្ន | ☐ |
| partners.csv.note | DEMO DATA: all figures are mock values for a hackathon prototype. | ទិន្នន័យសាកល្បង៖ តួលេខទាំងអស់ជាតម្លៃសាកល្បងសម្រាប់គំរូ hackathon។ | ☐ |
| partners.chart.title | Exposure by risk level | ហានិភ័យប៉ះពាល់តាមកម្រិតហានិភ័យ | ☐ |
| partners.chart.sub | Exposure this week, grouped by each district's current risk level. | ហានិភ័យប៉ះពាល់សប្តាហ៍នេះ ចាត់ក្រុមតាមកម្រិតហានិភ័យបច្ចុប្បន្នរបស់ស្រុកនីមួយៗ។ | ☐ |
| partners.chart.exposure | Exposure | ហានិភ័យប៉ះពាល់ | ☐ |
| partners.chart.districts | districts | ស្រុក | ☐ |
| partners.chart.clients | clients | អតិថិជន | ☐ |
| partners.method.title | How exposure is calculated | របៀបគណនាហានិភ័យប៉ះពាល់ | ☐ |
| partners.method.body | Exposure this week = portfolio value in a district × the highest flood probability forecast for that district in the next 7 days. Only districts whose peak reaches Medium or above (≥ 35%) are counted. Summed across districts. | ហានិភ័យប៉ះពាល់សប្តាហ៍នេះ = តម្លៃផលប័ត្រក្នុងស្រុក × ប្រូបាប៊ីលីតេទឹកជំនន់ខ្ពស់បំផុតដែលបានព្យាករសម្រាប់ស្រុកនោះក្នុងរយៈពេល ៧ ថ្ងៃខាងមុខ។ គិតតែស្រុកដែលហានិភ័យខ្ពស់បំផុតឡើងដល់កម្រិតមធ្យម ឬខ្ពស់ជាងនេះ (≥ 35%) ប៉ុណ្ណោះ។ បូកបញ្ចូលគ្នាពីគ្រប់ស្រុក។ | ☐ |

## Step 6: Date names (src/components/risk.js)

Chrome cannot format Khmer dates itself, so these names are hard-coded. Edit them in `src/components/risk.js`.

- Months: មករា, កុម្ភៈ, មីនា, មេសា, ឧសភា, មិថុនា, កក្កដា, សីហា, កញ្ញា, តុលា, វិច្ឆិកា, ធ្នូ ☐
- Weekdays (Sun → Sat): អាទិត្យ, ច័ន្ទ, អង្គារ, ពុធ, ព្រហស្បតិ៍, សុក្រ, សៅរ៍ ☐
- Short weekdays, used in the 10-day forecast boxes (Sun → Sat): អា, ច, អ, ពុ, ព្រ, សុ, ស ☐
- Dates use Khmer digits, e.g. ២៣ វិច្ឆិកា ២០២៦ ☐

## Mobile menu (src/i18n/km.json)

| Key | English | Khmer (draft) | OK? |
| --- | --- | --- | --- |
| nav.menu | Menu | ម៉ឺនុយ | ☐ |
