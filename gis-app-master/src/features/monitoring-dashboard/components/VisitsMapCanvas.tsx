"use client";
import "leaflet/dist/leaflet.css";
import { Fragment, useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
  ZoomControl,
} from "react-leaflet";
import { PUNJAB_BOUNDS } from "../constants";
import { DistrictList, DistrictProjects } from "../types";
import DistrictTooltip, { districtFinding, FINDING_COLOR } from "./DistrictTooltip";
import styles from "./MonitoringDashboard.module.css";

export type BaseLayer = "map" | "sat";

interface Props {
  districts: DistrictList[];
  activeDistrict: DistrictList | null;
  districtProjects: DistrictProjects[];
  baseLayer: BaseLayer;
  onDistrictClick: (district: DistrictList) => void;
  onProjectClick: (projectId: number) => void;
  onTooltip: (open: boolean) => void;
}

const esri = (service: string) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/${service}/MapServer/tile/{z}/{y}/{x}`;
const ATTRIBUTION = "Tiles &copy; Esri";

const hasCoords = (p: { latitude: string; longitude: string }) =>
  !!p.latitude && !!p.longitude && !isNaN(parseFloat(p.latitude)) && !isNaN(parseFloat(p.longitude));

const toLatLng = (p: { latitude: string; longitude: string }): [number, number] => [
  parseFloat(p.latitude),
  parseFloat(p.longitude),
];

/** Moves the view to the chosen district, its projects, or back to all of Punjab */
const ViewController = ({
  activeDistrict,
  districtProjects,
}: Pick<Props, "activeDistrict" | "districtProjects">) => {
  const map = useMap();

  useEffect(() => {
    const projects = districtProjects.filter(hasCoords);
    if (activeDistrict && projects.length) {
      map.fitBounds(projects.map(toLatLng), { padding: [60, 60], maxZoom: 11 });
    } else if (activeDistrict && hasCoords(activeDistrict)) {
      map.flyTo(toLatLng(activeDistrict), 9);
    } else {
      map.fitBounds(PUNJAB_BOUNDS, { padding: [40, 40] });
    }
  }, [map, activeDistrict, districtProjects]);

  // Leaflet must re-measure after full screen or layout changes
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

/** Leaflet map: one circle per district, sized by reports and coloured by worst finding */
const VisitsMapCanvas = ({
  districts,
  activeDistrict,
  districtProjects,
  baseLayer,
  onDistrictClick,
  onProjectClick,
  onTooltip,
}: Props) => {
  const shown = (activeDistrict ? [activeDistrict] : districts)
    .filter(hasCoords)
    .map((d) => ({ d, reports: d.good + d.average + d.crtical }))
    .sort((a, b) => b.reports - a.reports); // big circles first, small ones stay clickable on top

  return (
    <MapContainer
      className={styles.mapCanvas}
      bounds={PUNJAB_BOUNDS}
      boundsOptions={{ padding: [40, 40] }}
      scrollWheelZoom={false}
      zoomSnap={0.25}
      zoomControl={false}
    >
      <ZoomControl position="bottomright" />
      {baseLayer === "map" ? (
        <Fragment key="map">
          <TileLayer url={esri("Canvas/World_Light_Gray_Base")} attribution={ATTRIBUTION} maxZoom={16} />
          <TileLayer url={esri("Canvas/World_Light_Gray_Reference")} maxZoom={16} />
        </Fragment>
      ) : (
        <Fragment key="sat">
          <TileLayer url={esri("World_Imagery")} attribution={ATTRIBUTION} maxZoom={18} />
          <TileLayer url={esri("Reference/World_Boundaries_and_Places")} maxZoom={18} />
        </Fragment>
      )}

      {shown.map(({ d, reports }) => (
        <CircleMarker
          key={d.id}
          center={toLatLng(d)}
          radius={8 + Math.sqrt(reports) * 3.6}
          pathOptions={{ color: "#fff", weight: 2.5, fillColor: FINDING_COLOR[districtFinding(d)], fillOpacity: 0.9 }}
          eventHandlers={{
            click: () => onDistrictClick(d),
            mouseover: (e) => e.target.setStyle({ weight: 4 }),
            mouseout: (e) => e.target.setStyle({ weight: 2.5 }),
            tooltipopen: () => onTooltip(true),
            tooltipclose: () => onTooltip(false),
          }}
        >
          <Tooltip className={styles.distTip} direction="auto" opacity={1}>
            <DistrictTooltip district={d} />
          </Tooltip>
        </CircleMarker>
      ))}

      {activeDistrict &&
        districtProjects.filter(hasCoords).map((p) => (
          <CircleMarker
            key={`p-${p.id}`}
            center={toLatLng(p)}
            radius={7}
            pathOptions={{ color: "#fff", weight: 2, fillColor: "#1f58a8", fillOpacity: 0.95 }}
            eventHandlers={{ click: () => onProjectClick(p.id) }}
          >
            <Tooltip className={styles.distTip} direction="top" opacity={1}>
              <div className={styles.ptName}>
                {p.name}
                <small>{p.status ? `${p.status} · ` : ""}Click to open project dashboard</small>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}

      <ViewController activeDistrict={activeDistrict} districtProjects={districtProjects} />
    </MapContainer>
  );
};

export default VisitsMapCanvas;
