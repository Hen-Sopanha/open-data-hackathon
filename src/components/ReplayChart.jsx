import { useMemo } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { useI18n } from '../i18n/I18nContext.jsx';
import { cssVar, formatDate, riskColors } from './risk.js';
import { FLOOD_COLOR } from './RiskMap.jsx';

/**
 * One district's daily risk probability over the replay window.
 * Props: rows [{date, probability, risk_level, observed_flood}], currentDate, ticks[]
 */
export default function ReplayChart({ rows, currentDate, ticks }) {
  const { t, lang } = useI18n();
  const colors = riskColors();
  const accent = cssVar('--accent', '#0f6e78');
  const muted = cssVar('--text-muted', '#5a6b75');
  const grid = cssVar('--border', '#dde3e7');

  const data = useMemo(() => rows.map((r) => ({ ...r, pct: Math.round(r.probability * 100) })), [rows]);

  // contiguous observed-flood periods -> shaded bands
  const floods = useMemo(() => {
    const out = [];
    let start = null;
    rows.forEach((r, i) => {
      if (r.observed_flood && start == null) start = r.date;
      const endsHere = r.observed_flood && (i === rows.length - 1 || !rows[i + 1].observed_flood);
      if (endsHere) {
        out.push([start, r.date]);
        start = null;
      }
    });
    return out;
  }, [rows]);

  const tick = { fill: muted, fontSize: 12 };

  return (
    <ResponsiveContainer width="100%" height={210}>
      <ComposedChart data={data} margin={{ top: 18, right: 12, bottom: 0, left: -18 }}>
        <defs>
          <pattern id="flood-hatch-chart" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill={FLOOD_COLOR} fillOpacity="0.06" />
            <line x1="0" y1="0" x2="0" y2="6" stroke={FLOOD_COLOR} strokeWidth="2" strokeOpacity="0.45" />
          </pattern>
        </defs>
        <CartesianGrid vertical={false} stroke={grid} strokeOpacity={0.7} />
        {floods.map(([a, b], i) => (
          <ReferenceArea
            key={a}
            x1={a}
            x2={b}
            fill="url(#flood-hatch-chart)"
            fillOpacity={1}
            stroke="none"
            label={i === 0 ? { value: t('replay.chart.flooded'), position: 'insideTop', fill: FLOOD_COLOR, fontSize: 12, fontWeight: 600 } : undefined}
          />
        ))}
        <ReferenceLine
          y={65}
          stroke={colors.high}
          strokeDasharray="4 4"
          label={{ value: t('replay.chart.threshold'), position: 'insideTopLeft', fill: colors.high, fontSize: 12, dy: -14 }}
        />
        <XAxis
          dataKey="date"
          ticks={ticks}
          tickFormatter={(d) => formatDate(d, lang, { day: 'numeric', month: 'short' })}
          tick={tick}
          tickLine={false}
          axisLine={{ stroke: grid }}
        />
        <YAxis domain={[0, 100]} ticks={[0, 35, 65, 100]} unit="%" tick={tick} tickLine={false} axisLine={false} />
        <Tooltip
          cursor={{ stroke: muted, strokeWidth: 1 }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const r = payload[0].payload;
            return (
              <div className="chart-tooltip">
                <div className="chart-tooltip__date">{formatDate(r.date, lang)}</div>
                <div>
                  {t(`risk.${r.risk_level}`)} · {r.pct}%
                </div>
                {r.observed_flood && <div className="chart-tooltip__flood">{t('replay.chart.flooded')}</div>}
              </div>
            );
          }}
        />
        <ReferenceLine x={currentDate} stroke="#10242e" strokeWidth={1.5} />
        <Line type="monotone" dataKey="pct" stroke={accent} strokeWidth={2} dot={false} activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }} isAnimationActive={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
