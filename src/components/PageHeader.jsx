import { useI18n } from '../i18n/I18nContext.jsx';

// Shared title + subtitle block for each route. `page` is a key under pages.* in the dictionaries.
export default function PageHeader({ page }) {
  const { t } = useI18n();
  return (
    <div className="page-header">
      <h1>{t(`pages.${page}.title`)}</h1>
      <p>{t(`pages.${page}.subtitle`)}</p>
    </div>
  );
}
