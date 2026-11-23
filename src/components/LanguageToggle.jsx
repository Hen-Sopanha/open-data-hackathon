import { useI18n } from '../i18n/I18nContext.jsx';
import styles from './LanguageToggle.module.css';

const OPTIONS = [
  { code: 'en', label: 'EN' },
  { code: 'km', label: 'ខ្មែរ' },
];

export default function LanguageToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className={styles.toggle} role="group" aria-label={t('lang.label')}>
      {OPTIONS.map((o) => (
        <button
          key={o.code}
          type="button"
          lang={o.code}
          className={lang === o.code ? `${styles.btn} ${styles.on}` : styles.btn}
          aria-pressed={lang === o.code}
          onClick={() => setLang(o.code)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
