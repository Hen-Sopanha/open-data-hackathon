import { useI18n } from '../i18n/I18nContext.jsx';
import RiskBadge from './RiskBadge.jsx';
import { formatDate, formatPct } from './risk.js';
import styles from './DistrictPanel.module.css';

/**
 * Side panel for one district.
 * Props: district (geojson properties) | null, risk (forecast entry), actions[], drivers[], onClose
 */
export default function DistrictPanel({ district, risk, actions, drivers, onClose }) {
  const { t, lang, pick } = useI18n();

  if (!district || !risk) {
    return (
      <aside className={styles.panel}>
        <div className={styles.empty}>
          <div className={styles.emptyIcon} aria-hidden>⌖</div>
          <p>{t('panel.empty')}</p>
        </div>
      </aside>
    );
  }

  const other = lang === 'en' ? 'km' : 'en';
  const action = actions.find((a) => a.id === risk.action_id);
  const driverInfo = risk.drivers.map((id) => drivers.find((d) => d.id === id)).filter(Boolean);

  return (
    <aside className={styles.panel}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.name}>{pick(district, 'name')}</h2>
          <div className={styles.sub}>
            {pick(district, 'province')} · <span lang={other}>{district[`name_${other}`]}, {district[`province_${other}`]}</span>
          </div>
        </div>
        <button type="button" className={styles.close} onClick={onClose} aria-label={t('panel.close')}>
          ×
        </button>
      </div>

      <section className={styles.section}>
        <h3 className={styles.label}>{t('panel.riskNow')}</h3>
        <RiskBadge level={risk.risk_level} probability={risk.probability} large />
      </section>

      <section className={styles.section}>
        <h3 className={styles.label}>{t('panel.forecast')}</h3>
        <ol className={styles.days}>
          {risk.forecast.map((f) => (
            <li key={f.date} className={`${styles.day} ${styles[f.risk_level]}`} title={`${t(`risk.${f.risk_level}`)} · ${formatPct(f.probability)}`}>
              <span className={styles.dayName}>{formatDate(f.date, lang, { weekday: 'short' })}</span>
              <span className={styles.dayDate}>{formatDate(f.date, lang, { day: 'numeric', month: 'numeric' })}</span>
              <span className={styles.dayPct}>{formatPct(f.probability)}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section}>
        <h3 className={styles.label}>{t('panel.why')}</h3>
        <ul className={styles.drivers}>
          {driverInfo.map((d) => (
            <li key={d.id}>
              <span>{d[lang] ?? d.en}</span>
              <span className={styles.source}>{d.source}</span>
            </li>
          ))}
        </ul>
      </section>

      {action && (
        <section className={`${styles.section} ${styles.action}`}>
          <h3 className={styles.label}>{t('panel.action')}</h3>
          <p>{action[lang] ?? action.en}</p>
        </section>
      )}
    </aside>
  );
}
