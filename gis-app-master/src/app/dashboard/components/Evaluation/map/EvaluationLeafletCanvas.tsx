"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, Tooltip, useMap, ZoomControl } from "react-leaflet";
import styles from "./EvaluationLeafletMap.module.css";

/** One pin on the map. */
export interface MapPin {
  key: string;
  lat: number;
  lng: number;
  /** Small line above the name, e.g. "Lahore District". */
  kicker: string;
  name: string;
  facts: { label: string; value: string | number }[];
}

/** All of Punjab, as in the design. */
const PUNJAB_BOUNDS: [[number, number], [number, number]] = [
  [28.0, 69.6],
  [33.9, 75.3],
];

const esri = (service: string) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`;
const ATTRIBUTION = "Tiles &copy; Esri";
const PIN_COLOR = "#2d66b4";

const pinIcon = L.divIcon({
  className: styles.pin,
  iconSize: [28, 38],
  iconAnchor: [14, 38],
  tooltipAnchor: [0, -34],
  html: `<svg width="28" height="38" viewBox="0 0 24 32" aria-hidden="true"><path d="M12 1C5.9 1 1 5.8 1 11.8 1 20 12 31 12 31s11-11 11-19.2C23 5.8 18.1 1 12 1z" fill="${PIN_COLOR}" stroke="#fff" stroke-width="2"/><circle cx="12" cy="11.6" r="4.2" fill="#fff"/></svg>`,
});

/** Fits Punjab once, and re-measures after full screen or a resize. */
const ViewController = () => {
  const map = useMap();

  useEffect(() => {
    map.fitBounds(PUNJAB_BOUNDS, { padding: [40, 40] });
  }, [map]);

  useEffect(() => {
    const resize = () => map.invalidateSize();
    document.addEventListener("fullscreenchange", resize);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("fullscreenchange", resize);
      window.removeEventListener("resize", resize);
    };
  }, [map]);

  return null;
};

/** Leaflet map: the light grey Esri map and one pin per evaluated project. */
const EvaluationLeafletCanvas = ({ pins }: { pins: MapPin[] }) => {
  const center = useMemo<[number, number]>(() => [31.1704, 72.7097], []);

  return (
    <MapContainer
      className={styles.map}
      center={center}
      zoom={7}
      zoomSnap={0.25}
      zoomControl={false}
      scrollWheelZoom={false}
    >
      <TileLayer url={esri("Canvas/World_Light_Gray_Base")} attribution={ATTRIBUTION} maxZoom={16} />
      <TileLayer url={esri("Canvas/World_Light_Gray_Reference")} maxZoom={16} />
      <ZoomControl position="bottomright" />
      <ViewController />
      {pins.map((pin) => (
        <Marker key={pin.key} position={[pin.lat, pin.lng]} icon={pinIcon} riseOnHover>
          <Tooltip className={styles.tip} direction="top" opacity={1}>
            <div className={styles.tipHead}>
              <small>{pin.kicker}</small>
              <h4>{pin.name}</h4>
            </div>
            {pin.facts.length > 0 && (
              <div className={styles.tipBody}>
                {pin.facts.map((f) => (
                  <div key={f.label}>
                    <b>{f.value}</b>
                    {f.label}
                  </div>
                ))}
              </div>
            )}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default EvaluationLeafletCanvas;
