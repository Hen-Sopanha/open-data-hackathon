import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
  const [open, setOpen] = useState(false); // mobile menu
  const location = useLocation();

  // close the mobile menu after navigating
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className={styles.bar}>
      <NavLink to="/" className={styles.brand}>
        <span className={styles.logo}>{t('brand')}</span>
        <span className={styles.tagline}>{t('tagline')}</span>
      </NavLink>
      <nav id="main-nav" className={`${styles.links} ${open ? styles.open : ''}`}>
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
      <button
        type="button"
        className={styles.menuBtn}
        aria-expanded={open}
        aria-controls="main-nav"
        aria-label={t('nav.menu')}
        onClick={() => setOpen((o) => !o)}
      >
        <span aria-hidden>{open ? '✕' : '☰'}</span>
      </button>
    </header>
  );
}
