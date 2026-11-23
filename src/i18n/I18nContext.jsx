import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './en.json';
import km from './km.json';

const DICTS = { en, km };
const I18nContext = createContext(null);

function lookup(dict, key) {
  return key.split('.').reduce((obj, part) => (obj == null ? undefined : obj[part]), dict);
}

export function I18nProvider({ children }) {
  // Default English; ?lang=km in the URL opens the app in Khmer (handy for recording/screenshots)
  const [lang, setLang] = useState(() =>
    new URLSearchParams(window.location.search).get('lang') === 'km' ? 'km' : 'en'
  );

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // t('nav.dashboard') -> string. Falls back to English, then to the key itself.
  // Supports simple {placeholders}: t('replay.caption', { count: 3 })
  const t = useCallback(
    (key, vars) => {
      let str = lookup(DICTS[lang], key) ?? lookup(DICTS.en, key) ?? key;
      if (vars && typeof str === 'string') {
        str = str.replace(/\{(\w+)\}/g, (m, name) => (name in vars ? vars[name] : m));
      }
      return str;
    },
    [lang]
  );

  // Pick the right-language field from a data object, e.g. name(obj, 'name') -> obj.name_km
  const pick = useCallback((obj, field) => obj?.[`${field}_${lang}`] ?? obj?.[`${field}_en`], [lang]);

  const value = useMemo(() => ({ lang, setLang, t, pick }), [lang, t, pick]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
