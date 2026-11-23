import { useMemo } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import SummaryCards from '../components/SummaryCards.jsx';
import PortfolioTable from '../components/PortfolioTable.jsx';
import ExposureChart from '../components/ExposureChart.jsx';
import { RISK_LEVELS, formatDate, formatPct } from '../components/risk.js';
import { formatInt, formatUsdCompact } from '../components/money.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useData } from '../data/useData.js';
import { getDistricts, getForecast, getPortfolio } from '../data/api.js';

const WEEK_DAYS = 7;
const EXPOSURE_MIN_PROB = 0.35; // only Medium-or-above peaks count as exposed (same threshold as the legend)

// Exposure this week = portfolio value × highest flood probability over today + next 7 days,
// counted only when that peak is at least Medium (>= 35%); otherwise 0.
function buildRows(data, pick) {
  const props = Object.fromEntries(data.districts.features.map((f) => [f.properties.district_id, f.properties]));
  const risk = Object.fromEntries(data.forecast.districts.map((d) => [d.district_id, d]));
  return data.portfolio.map((p) => {
    const r = risk[p.district_id];
    const peak7 = Math.max(r.probability, ...r.forecast.slice(0, WEEK_DAYS).map((f) => f.probability));
    return {
      district_id: p.district_id,
      district: pick(props[p.district_id], 'name'),
      province: pick(props[p.district_id], 'province'),
      clients: p.clients,
      value_usd: p.value_usd,
      risk_level: r.risk_level,
      probability: r.probability,
      peak7,
      exposure_usd: peak7 >= EXPOSURE_MIN_PROB ? Math.round(p.value_usd * peak7) : 0,
    };
  });
}

function downloadCsv(rows, t, generatedAt) {
  const header = [
    t('partners.col.district'),
    t('partners.col.province'),
    t('partners.col.clients'),
    t('partners.col.value'),
    t('partners.col.risk'),
    t('partners.csv.probability'),
    t('partners.col.peak7'),
    t('partners.col.exposure'),
  ];
  const quote = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [
    header,
    ...rows.map((r) => [
      r.district,
      r.province,
      r.clients,
      r.value_usd,
      t(`risk.${r.risk_level}`),
      r.probability.toFixed(2),
      r.peak7.toFixed(2),
      r.exposure_usd,
    ]),
  ].map((cols) => cols.map(quote).join(','));
  lines.push('', quote(t('partners.csv.note')));
  // BOM so Excel opens Khmer text as UTF-8
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `srovsafe_portfolio_DEMO_${generatedAt}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function Partners() {
  const { t, lang, pick } = useI18n();
  const { data, error } = useData({ districts: getDistricts, forecast: getForecast, portfolio: getPortfolio });

  const rows = useMemo(() => (data ? buildRows(data, pick) : []), [data, pick]);

  if (error) return <section className="page"><div className="placeholder">{String(error)}</div></section>;
  if (!data) return <section className="page"><div className="placeholder">{t('common.loading')}</div></section>;

  const sum = (list, k) => list.reduce((s, r) => s + r[k], 0);
  const totalClients = sum(rows, 'clients');
  const totalValue = sum(rows, 'value_usd');
  const totalExposure = sum(rows, 'exposure_usd');
  const highRows = rows.filter((r) => r.risk_level === 'high');
  const highClients = sum(highRows, 'clients');

  const groups = Object.fromEntries(
    RISK_LEVELS.map((l) => {
      const list = rows.filter((r) => r.risk_level === l);
      return [l, { exposure_usd: sum(list, 'exposure_usd'), clients: sum(list, 'clients'), districts: list.length }];
    })
  );

  const cards = [
    { label: t('partners.cards.clients'), value: formatInt(totalClients), sub: t('partners.cards.clientsSub', { n: rows.length }) },
    {
      label: t('partners.cards.highClients'),
      value: formatInt(highClients),
      sub: t('partners.cards.highClientsSub', { pct: formatPct(highClients / totalClients), n: highRows.length }),
      tone: 'high',
    },
    { label: t('partners.cards.value'), value: formatUsdCompact(totalValue) },
    {
      label: t('partners.cards.exposure'),
      value: formatUsdCompact(totalExposure),
      sub: t('partners.cards.exposureSub', { pct: formatPct(totalExposure / totalValue) }),
      tone: 'accent',
    },
  ];

  return (
    <section className="page">
      <div className="partners-head">
        <PageHeader page="partners" />
        <div className="partners-head__meta">
          <span className="demo-badge">{t('common.demoData')}</span>
          <span className="muted">
            {t('legend.updated')}: {formatDate(data.forecast.generated_at, lang)}
          </span>
        </div>
      </div>

      <SummaryCards cards={cards} />

      <div className="partners-layout">
        <div className="card">
          <div className="card__head">
            <h2>{t('partners.table.title')}</h2>
            <button type="button" className="btn" onClick={() => downloadCsv(rows, t, data.forecast.generated_at)}>
              ⭳ {t('partners.export')}
            </button>
          </div>
          <PortfolioTable rows={rows} />
        </div>

        <div className="partners-side">
          <div className="card">
            <h2>{t('partners.chart.title')}</h2>
            <p className="card__sub">{t('partners.chart.sub')}</p>
            <ExposureChart groups={groups} />
          </div>
          <div className="card card--note">
            <h3>{t('partners.method.title')}</h3>
            <p>{t('partners.method.body')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
