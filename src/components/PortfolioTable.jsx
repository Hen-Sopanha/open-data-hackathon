import { useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';
import RiskBadge from './RiskBadge.jsx';
import { formatPct } from './risk.js';
import { formatUsd, formatInt } from './money.js';

const RISK_ORDER = { low: 0, medium: 1, high: 2 };

/**
 * Sortable portfolio table.
 * Props: rows [{ district_id, district, province, clients, value_usd, risk_level, probability, peak7, exposure_usd }]
 */
export default function PortfolioTable({ rows }) {
  const { t } = useI18n();
  const [sort, setSort] = useState({ key: 'exposure_usd', dir: -1 });

  const columns = [
    { key: 'district', label: t('partners.col.district') },
    { key: 'province', label: t('partners.col.province') },
    { key: 'clients', label: t('partners.col.clients'), num: true },
    { key: 'value_usd', label: t('partners.col.value'), num: true },
    { key: 'risk_level', label: t('partners.col.risk') },
    { key: 'peak7', label: t('partners.col.peak7'), num: true },
    { key: 'exposure_usd', label: t('partners.col.exposure'), num: true },
  ];

  const sorted = useMemo(() => {
    const val = (r) => (sort.key === 'risk_level' ? RISK_ORDER[r.risk_level] * 10 + r.probability : r[sort.key]);
    return [...rows].sort((a, b) => {
      const va = val(a);
      const vb = val(b);
      return (typeof va === 'string' ? va.localeCompare(vb) : va - vb) * sort.dir;
    });
  }, [rows, sort]);

  const onSort = (key) => setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: key === 'district' || key === 'province' ? 1 : -1 }));

  return (
    <div className="table-wrap">
      <table className="portfolio-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className={c.num ? 'num' : undefined} aria-sort={sort.key === c.key ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none'}>
                <button type="button" onClick={() => onSort(c.key)}>
                  {c.label}
                  <span className="sort-arrow" aria-hidden>
                    {sort.key === c.key ? (sort.dir > 0 ? '▲' : '▼') : ''}
                  </span>
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r.district_id} className={`row--${r.risk_level}`}>
              <td className="strong">{r.district}</td>
              <td className="muted">{r.province}</td>
              <td className="num">{formatInt(r.clients)}</td>
              <td className="num">{formatUsd(r.value_usd)}</td>
              <td>
                <RiskBadge level={r.risk_level} probability={r.probability} />
              </td>
              <td className="num">{formatPct(r.peak7)}</td>
              <td className="num strong">{formatUsd(r.exposure_usd)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
