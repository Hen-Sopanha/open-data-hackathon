import { useI18n } from '../i18n/I18nContext.jsx';
import { RISK_LEVELS, formatDate } from './risk.js';

// Map legend overlay. `updated` is an ISO date shown as "Last updated".
export default function Legend({ updated, children }) {
  const { t, lang } = useI18n();
  return (
    <div className="legend">
      <div className="legend__title">{t('legend.title')}</div>
      {[...RISK_LEVELS].reverse().map((l) => (
        <div key={l} className="legend__row">
          <span className={`legend__swatch legend__swatch--${l}`} />
          <span>{t(`risk.${l}`)}</span>
          <span className="legend__range">{t(`legend.range.${l}`)}</span>
        </div>
      ))}
      {children}
      {updated && (
        <div className="legend__updated">
          {t('legend.updated')}: {formatDate(updated, lang)}
        </div>
      )}
    </div>
  );
}
