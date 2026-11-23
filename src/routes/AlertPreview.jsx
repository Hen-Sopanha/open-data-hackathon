import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader.jsx';
import PhoneMock from '../components/PhoneMock.jsx';
import ChatBubble, { ChatDate } from '../components/ChatBubble.jsx';
import RiskBadge from '../components/RiskBadge.jsx';
import { formatDate, formatPct } from '../components/risk.js';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useSelection } from '../state/SelectionContext.jsx';
import { useData } from '../data/useData.js';
import { getActions, getDistricts, getDrivers, getForecast } from '../data/api.js';
import en from '../i18n/en.json';
import km from '../i18n/km.json';

const DEFAULT_DISTRICT = 'KH1407'; // Peam Ro (High) if nothing was clicked on the Dashboard

// Fill {placeholders} in a template string
const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

export default function AlertPreview() {
  const { t, lang, pick } = useI18n();
  const { selectedId, setSelectedId } = useSelection();
  const [showTranslation, setShowTranslation] = useState(true);
  const { data, error } = useData({
    districts: getDistricts,
    forecast: getForecast,
    actions: getActions,
    drivers: getDrivers,
  });

  const districtId = selectedId ?? DEFAULT_DISTRICT;

  // districts grouped by province for the dropdown
  const groups = useMemo(() => {
    if (!data) return [];
    const byProv = {};
    for (const f of data.districts.features) (byProv[f.properties.province_id] ??= []).push(f.properties);
    return Object.values(byProv).map((list) => list.sort((a, b) => pick(a, 'name').localeCompare(pick(b, 'name'))));
  }, [data, pick]);

  if (error) return <section className="page"><div className="placeholder">{String(error)}</div></section>;
  if (!data) return <section className="page"><div className="placeholder">{t('common.loading')}</div></section>;

  const district = data.districts.features.find((f) => f.properties.district_id === districtId).properties;
  const risk = data.forecast.districts.find((d) => d.district_id === districtId);
  const riskById = Object.fromEntries(data.forecast.districts.map((d) => [d.district_id, d.risk_level]));
  const action = data.actions.find((a) => a.id === risk.action_id);
  const driver = data.drivers.find((d) => d.id === risk.drivers[0]);
  const peak = risk.forecast.reduce((a, b) => (b.probability > a.probability ? b : a));
  const level = risk.risk_level;

  // Chat messages are always Khmer (the farmer's language); English is the optional translation line.
  const msg = (dict, dateLocale) => {
    const vars = {
      district: district[`name_${dateLocale}`],
      province: district[`province_${dateLocale}`],
      pct: formatPct(risk.probability),
      driver: driver?.[dateLocale] ?? '',
      action: action?.[dateLocale] ?? '',
      peakDate: formatDate(peak.date, dateLocale, { weekday: 'long', day: 'numeric', month: 'long' }),
      peakPct: formatPct(peak.probability),
    };
    const a = dict.alertMsg[level];
    return {
      alert: fill(a.alert, vars),
      question: fill(a.question, vars),
      reply: fill(a.reply, vars),
    };
  };
  const kmMsg = msg(km, 'km');
  const enMsg = msg(en, 'en');

  return (
    <section className="page">
      <PageHeader page="alert" />
      <div className="alert-layout">
        <div className="alert-controls">
          <label className="field">
            <span className="field__label">{t('alert.district')}</span>
            <select value={districtId} onChange={(e) => setSelectedId(e.target.value)}>
              {groups.map((list) => (
                <optgroup key={list[0].province_id} label={pick(list[0], 'province')}>
                  {list.map((d) => (
                    <option key={d.district_id} value={d.district_id}>
                      {pick(d, 'name')} · {t(`risk.${riskById[d.district_id]}`)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <div className="alert-summary">
            <div className="alert-summary__name">
              {pick(district, 'name')}, {pick(district, 'province')}
            </div>
            <RiskBadge level={level} probability={risk.probability} large />
          </div>

          <label className="toggle">
            <input type="checkbox" checked={showTranslation} onChange={(e) => setShowTranslation(e.target.checked)} />
            <span>{t('alert.showTranslation')}</span>
          </label>

          <div className="alert-how">
            <h3>{t('alert.how.title')}</h3>
            <ol>
              <li>{t('alert.how.step1')}</li>
              <li>{t('alert.how.step2')}</li>
              <li>{t('alert.how.step3')}</li>
            </ol>
          </div>
        </div>

        <div className="alert-phone">
          {/* key = district: re-mount so the messages animate in again when the district changes */}
          <PhoneMock key={districtId} title={t('alert.botName')} subtitle={t('alert.botSubtitle')} avatar="SS" footerPlaceholder={t('alert.inputPlaceholder')}>
            <ChatDate>{formatDate(data.forecast.generated_at, lang, { day: 'numeric', month: 'long', year: 'numeric' })}</ChatDate>
            <ChatBubble from="bot" accent={level} km={kmMsg.alert} en={enMsg.alert} showTranslation={showTranslation} time="07:00" delay={0.1} />
            <ChatBubble from="user" km={kmMsg.question} en={enMsg.question} showTranslation={showTranslation} time="07:11" delay={0.9} />
            <ChatBubble from="bot" km={kmMsg.reply} en={enMsg.reply} showTranslation={showTranslation} time="07:12" delay={1.7} />
          </PhoneMock>
        </div>
      </div>
    </section>
  );
}
