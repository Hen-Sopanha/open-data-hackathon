import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import RiskMap from '../components/RiskMap.jsx';
import Legend from '../components/Legend.jsx';
import DateSlider from '../components/DateSlider.jsx';
import ReplayChart from '../components/ReplayChart.jsx';
import { RISK_LEVELS, formatDate } from '../components/risk.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useData } from '../data/useData.js';
import { getDistricts, getReplay } from '../data/api.js';

const STEP_MS = 333; // ~3 days per second while playing
const DEFAULT_DISTRICT = 'KH1407'; // Peam Ro: clear early-warning example for the video
const TICKS = ['2025-09-01', '2025-09-15', '2025-10-01', '2025-10-15'];
const LOOKAHEAD_DAYS = 10; // how far ahead the caption looks for "flooding observed N days later"

export default function Replay() {
  const { t, lang, pick } = useI18n();
  const { data, error } = useData({ districts: getDistricts, replay: getReplay });

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showObserved, setShowObserved] = useState(true);
  const [selectedId, setSelectedId] = useState(DEFAULT_DISTRICT);

  // ---- index the replay rows once ----
  const model = useMemo(() => {
    if (!data) return null;
    const dates = [...new Set(data.replay.map((r) => r.date))].sort();
    const dateIdx = Object.fromEntries(dates.map((d, i) => [d, i]));
    const byDay = dates.map(() => ({})); // byDay[i][district_id] = row
    const byDistrict = {}; // byDistrict[id] = rows sorted by date
    for (const r of data.replay) {
      byDay[dateIdx[r.date]][r.district_id] = r;
      (byDistrict[r.district_id] ??= []).push(r);
    }
    Object.values(byDistrict).forEach((rows) => rows.sort((a, b) => a.date.localeCompare(b.date)));
    const highCounts = byDay.map((day) => Object.values(day).filter((r) => r.risk_level === 'high').length);
    const floodCounts = byDay.map((day) => Object.values(day).filter((r) => r.observed_flood).length);
    return { dates, byDay, byDistrict, highCounts, floodCounts };
  }, [data]);

  // ---- playback ----
  useEffect(() => {
    if (!playing || !model) return;
    const id = setInterval(() => {
      setIndex((i) => {
        if (i >= model.dates.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, STEP_MS);
    return () => clearInterval(id);
  }, [playing, model]);

  const togglePlay = () => {
    if (!playing && model && index >= model.dates.length - 1) setIndex(0); // restart from the top
    setPlaying((p) => !p);
  };

  const today = model?.byDay[index];

  const riskById = useMemo(
    () => (today ? Object.fromEntries(Object.entries(today).map(([id, r]) => [id, r.risk_level])) : {}),
    [today]
  );

  const observedIds = useMemo(() => {
    if (!showObserved || !today) return null;
    return new Set(Object.values(today).filter((r) => r.observed_flood).map((r) => r.district_id));
  }, [today, showObserved]);

  if (error) return <section className="page"><div className="placeholder">{String(error)}</div></section>;
  if (!data || !model) return <section className="page"><div className="placeholder">{t('common.loading')}</div></section>;

  // ---- caption ----
  const rows = Object.values(today);
  const counts = Object.fromEntries(RISK_LEVELS.map((l) => [l, rows.filter((r) => r.risk_level === l).length]));
  const floodedNow = rows.filter((r) => r.observed_flood).length;

  // Lead time of today's warnings: for each district at High (not yet flooded) whose flood follows,
  // days from the START of its High streak to the first observed flood. Report the shortest (conservative).
  let lead = null;
  for (const r of rows) {
    if (r.risk_level !== 'high' || r.observed_flood) continue;
    const series = model.byDistrict[r.district_id];
    let streakStart = index;
    while (streakStart > 0 && series[streakStart - 1].risk_level === 'high') streakStart--;
    for (let j = index + 1; j < Math.min(series.length, index + 1 + LOOKAHEAD_DAYS); j++) {
      if (series[j].observed_flood) {
        lead = lead == null ? j - streakStart : Math.min(lead, j - streakStart);
        break;
      }
    }
  }

  const plural = (key, n, vars) => t(n === 1 ? `${key}_one` : key, vars);
  const captionParts = [
    counts.high ? plural('replay.caption.high', counts.high, { count: counts.high }) : t('replay.caption.none'),
  ];
  if (lead != null) captionParts.push(plural('replay.caption.lead', lead, { days: lead }));
  if (floodedNow && showObserved) captionParts.push(plural('replay.caption.flooded', floodedNow, { count: floodedNow }));

  const currentDate = model.dates[index];
  const selected = data.districts.features.find((f) => f.properties.district_id === selectedId)?.properties;

  return (
    <section className="page page--map">
      <PageHeader page="replay" />
      <div className="replay-layout">
        <div className="replay-layout__map">
          <RiskMap
            geojson={data.districts}
            riskById={riskById}
            selectedId={selectedId}
            onSelect={setSelectedId}
            observedIds={observedIds}
          >
            <Legend>
              {showObserved && (
                <div className="legend__row legend__row--flood">
                  <span className="legend__swatch legend__swatch--flood" />
                  <span>{t('replay.observedShort')}</span>
                </div>
              )}
            </Legend>
          </RiskMap>
        </div>

        <div className="replay-layout__controls">
          <DateSlider
            dates={model.dates}
            index={index}
            onChange={(i) => {
              setPlaying(false);
              setIndex(i);
            }}
            playing={playing}
            onTogglePlay={togglePlay}
            highCounts={model.highCounts}
            floodCounts={model.floodCounts}
            ticks={TICKS}
          />
        </div>

        <aside className="replay-panel">
          <div className="replay-panel__date">{formatDate(currentDate, lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
          <p className="replay-panel__caption" aria-live="polite">
            {captionParts.join(' · ')}
          </p>

          <div className="replay-panel__counts">
            {[...RISK_LEVELS].reverse().map((l) => (
              <div key={l} className={`count-chip count-chip--${l}`}>
                <span className="count-chip__n">{counts[l]}</span>
                <span>{t(`risk.${l}`)}</span>
              </div>
            ))}
          </div>

          <label className="toggle">
            <input type="checkbox" checked={showObserved} onChange={(e) => setShowObserved(e.target.checked)} />
            <span className="legend__swatch legend__swatch--flood" />
            <span>{t('replay.observedToggle')}</span>
          </label>

          <div className="replay-panel__chart">
            {selected ? (
              <>
                <h3>
                  {pick(selected, 'name')} <span>· {pick(selected, 'province')}</span>
                </h3>
                <div className="replay-panel__chart-sub">{t('replay.chart.title')}</div>
                <ReplayChart rows={model.byDistrict[selectedId]} currentDate={currentDate} ticks={TICKS} />
              </>
            ) : (
              <p className="replay-panel__hint">{t('replay.chart.hint')}</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
