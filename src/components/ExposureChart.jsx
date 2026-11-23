import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList, ResponsiveContainer } from 'recharts';
import { useI18n } from '../i18n/I18nContext.jsx';
import { RISK_LEVELS, cssVar, riskColors } from './risk.js';
import { formatUsd, formatUsdCompact, formatInt } from './money.js';

/**
 * Exposure this week, grouped by current risk level.
 * Props: groups { low|medium|high: { exposure_usd, clients, districts } }
 */
export default function ExposureChart({ groups }) {
  const { t } = useI18n();
  const colors = riskColors();
  const muted = cssVar('--text-muted', '#5a6b75');
  const text = cssVar('--text', '#1c2a33');
  const grid = cssVar('--border', '#dde3e7');

  const data = RISK_LEVELS.map((l) => ({ level: l, label: t(`risk.${l}`), ...groups[l] }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 24, right: 8, bottom: 0, left: 0 }} barCategoryGap="28%">
        <CartesianGrid vertical={false} stroke={grid} strokeOpacity={0.7} />
        <XAxis dataKey="label" tick={{ fill: text, fontSize: 14 }} tickLine={false} axisLine={{ stroke: grid }} />
        <YAxis tickFormatter={formatUsdCompact} tick={{ fill: muted, fontSize: 12 }} tickLine={false} axisLine={false} width={56} />
        <Tooltip
          cursor={{ fill: grid, fillOpacity: 0.35 }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="chart-tooltip">
                <div className="chart-tooltip__date">{d.label}</div>
                <div>
                  {t('partners.chart.exposure')}: {formatUsd(d.exposure_usd)}
                </div>
                <div>
                  {formatInt(d.districts)} {t('partners.chart.districts')} · {formatInt(d.clients)} {t('partners.chart.clients')}
                </div>
              </div>
            );
          }}
        />
        <Bar dataKey="exposure_usd" radius={[4, 4, 0, 0]} isAnimationActive={false}>
          {data.map((d) => (
            <Cell key={d.level} fill={colors[d.level]} />
          ))}
          <LabelList dataKey="exposure_usd" position="top" formatter={formatUsdCompact} fill={text} fontSize={13} fontWeight={600} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
