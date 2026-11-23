import { useMemo } from 'react';
import { useSelection } from '../state/SelectionContext.jsx';
import PageHeader from '../components/PageHeader.jsx';
import RiskMap from '../components/RiskMap.jsx';
import Legend from '../components/Legend.jsx';
import DistrictPanel from '../components/DistrictPanel.jsx';
import { useI18n } from '../i18n/I18nContext.jsx';
import { useData } from '../data/useData.js';
import { getActions, getDistricts, getDrivers, getForecast } from '../data/api.js';

export default function Dashboard() {
  const { t } = useI18n();
  const { data, error } = useData({
    districts: getDistricts,
    forecast: getForecast,
    actions: getActions,
    drivers: getDrivers,
  });
  const { selectedId, setSelectedId } = useSelection(); // shared with the Farmer Alert page

  const riskById = useMemo(
    () => Object.fromEntries((data?.forecast.districts ?? []).map((d) => [d.district_id, d.risk_level])),
    [data]
  );

  if (error) return <section className="page"><div className="placeholder">{String(error)}</div></section>;
  if (!data) return <section className="page"><div className="placeholder">{t('common.loading')}</div></section>;

  const district = data.districts.features.find((f) => f.properties.district_id === selectedId)?.properties;
  const risk = data.forecast.districts.find((d) => d.district_id === selectedId);

  return (
    <section className="page page--map">
      <PageHeader page="dashboard" />
      <div className="map-layout">
        <RiskMap geojson={data.districts} riskById={riskById} selectedId={selectedId} onSelect={setSelectedId}>
          <Legend updated={data.forecast.generated_at} />
        </RiskMap>
        <DistrictPanel
          district={district}
          risk={risk}
          actions={data.actions}
          drivers={data.drivers}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </section>
  );
}
