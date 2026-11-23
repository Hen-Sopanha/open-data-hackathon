import { useI18n } from '../i18n/I18nContext.jsx';
import { formatPct } from './risk.js';

// Pill such as "High · 78%". Colours come from .risk-badge--{level} in global.css
export default function RiskBadge({ level, probability, large = false }) {
  const { t } = useI18n();
  return (
    <span className={`risk-badge risk-badge--${level}${large ? ' risk-badge--lg' : ''}`}>
      {t(`risk.${level}`)}
      {probability != null && <> · {formatPct(probability)}</>}
    </span>
  );
}
