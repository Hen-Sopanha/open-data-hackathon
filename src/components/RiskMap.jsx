import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Pane, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useI18n } from '../i18n/I18nContext.jsx';
import { riskColors } from './risk.js';

const NO_DATA = '#c9d1d6';
export const FLOOD_COLOR = '#1f4f8f'; // deep water blue, distinct from all three risk colours

// SVG pattern referenced as fill="url(#flood-hatch)" by Leaflet paths (same document, so ids resolve)
export function FloodHatchDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
      <defs>
        <pattern id="flood-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="rgba(255,255,255,0.25)" />
          <line x1="0" y1="0" x2="0" y2="8" stroke={FLOOD_COLOR} strokeWidth="3.5" />
        </pattern>
      </defs>
    </svg>
  );
}

function FitBounds({ geojson }) {
  const map = useMap();
  useEffect(() => {
    const b = L.geoJSON(geojson).getBounds();
    if (b.isValid()) map.fitBounds(b, { padding: [16, 16] });
  }, [geojson, map]);
  return null;
}

/**
 * Leaflet map of district polygons coloured by risk.
 * Props:
 *   geojson     FeatureCollection from getDistricts()
 *   riskById    { [district_id]: 'low' | 'medium' | 'high' }
 *   selectedId  highlighted district (thick outline)
 *   onSelect    (district_id) => void
 *   observedIds optional Set of district_ids with observed flooding: drawn as a hatched overlay
 *   children    extra overlays (legend etc.), rendered over the map
 */
export default function RiskMap({ geojson, riskById, selectedId, onSelect, observedIds, children }) {
  const { pick } = useI18n();
  const layerRef = useRef(null);
  const floodRef = useRef(null);

  // Keep latest props in refs: Leaflet binds handlers once per feature.
  const onSelectRef = useRef(onSelect);
  const pickRef = useRef(pick);
  onSelectRef.current = onSelect;
  pickRef.current = pick;

  const style = useMemo(() => {
    const colors = riskColors();
    return (feature) => {
      const id = feature.properties.district_id;
      const selected = id === selectedId;
      return {
        fillColor: colors[riskById[id]] ?? NO_DATA,
        fillOpacity: 0.72,
        color: selected ? '#10242e' : '#ffffff',
        weight: selected ? 3 : 1.2,
      };
    };
  }, [riskById, selectedId]);

  const floodStyle = useMemo(
    () => (feature) =>
      observedIds?.has(feature.properties.district_id)
        ? { fillColor: 'url(#flood-hatch)', fillOpacity: 1, color: FLOOD_COLOR, weight: 2.5, opacity: 1 }
        : { fillOpacity: 0, opacity: 0 },
    [observedIds]
  );

  // Restyle in place when risk, selection or flooding changes (smooth, no re-mount)
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.setStyle(style);
    layer.eachLayer((l) => {
      if (l.feature.properties.district_id === selectedId) l.bringToFront();
    });
    if (floodRef.current) {
      floodRef.current.setStyle(floodStyle);
      floodRef.current.bringToFront(); // hatch always sits above the risk fill
    }
  }, [style, selectedId, floodStyle]);

  const onEachFeature = (feature, layer) => {
    const p = feature.properties;
    layer.bindTooltip(
      () => `<strong>${pickRef.current(p, 'name')}</strong><br/>${pickRef.current(p, 'province')}`,
      { sticky: true, className: 'district-tooltip' }
    );
    layer.on({
      click: () => onSelectRef.current?.(p.district_id),
      mouseover: () => layer.setStyle({ fillOpacity: 0.9 }),
      mouseout: () => layer.setStyle({ fillOpacity: 0.72 }),
    });
  };

  return (
    <div className="risk-map">
      <MapContainer center={[11.9, 105.2]} zoom={9} zoomSnap={0.25} scrollWheelZoom className="risk-map__leaflet">
        {/* Esri Light Gray Canvas (no API key needed). CARTO now requires a key. */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors"
          maxNativeZoom={16}
          maxZoom={18}
        />
        <Pane name="labels" style={{ zIndex: 450, pointerEvents: 'none' }}>
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
            maxNativeZoom={16}
            maxZoom={18}
          />
        </Pane>
        <GeoJSON ref={layerRef} data={geojson} style={style} onEachFeature={onEachFeature} />
        {observedIds && <GeoJSON ref={floodRef} data={geojson} style={floodStyle} interactive={false} />}
        <FitBounds geojson={geojson} />
      </MapContainer>
      {observedIds && <FloodHatchDefs />}
      {children}
    </div>
  );
}
