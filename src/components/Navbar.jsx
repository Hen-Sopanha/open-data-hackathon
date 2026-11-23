import { NavLink } from 'react-router-dom';
import { useI18n } from '../i18n/I18nContext.jsx';
import LanguageToggle from './LanguageToggle.jsx';
import styles from './Navbar.module.css';

const LINKS = [
  { to: '/', key: 'nav.dashboard', end: true },
  { to: '/replay', key: 'nav.replay' },
  { to: '/alert', key: 'nav.alert' },
  { to: '/partners', key: 'nav.partners' },
];

export default function Navbar() {
  const { t } = useI18n();
  return (
    <header className={styles.bar}>
      <NavLink to="/" className={styles.brand}>
        <span className={styles.logo}>{t('brand')}</span>
        <span className={styles.tagline}>{t('tagline')}</span>
      </NavLink>
      <nav className={styles.links}>
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
          >
            {t(l.key)}
          </NavLink>
        ))}
      </nav>
      <LanguageToggle />
    </header>
  );
}
