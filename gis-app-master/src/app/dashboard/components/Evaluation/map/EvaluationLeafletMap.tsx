"use client";
import { Expand } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useRef } from "react";
import { EvaluationMainDashboard } from "../types";
import type { MapPin } from "./EvaluationLeafletCanvas";
import styles from "./EvaluationLeafletMap.module.css";

// Leaflet needs the browser
const EvaluationLeafletCanvas = dynamic(() => import("./EvaluationLeafletCanvas"), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading map…</div>,
});

const coords = (p: { latitude: string; longitude: string }) => {
  const lat = parseFloat(p.latitude);
  const lng = parseFloat(p.longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : undefined;
};

/**
 * The Secretary dashboard map (RTMES design): one pin per evaluated project from
 * `projectsList`; when there are none, one pin per district from `districtList`.
 */
const EvaluationLeafletMap = ({ data }: { data: EvaluationMainDashboard }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const pins = useMemo<MapPin[]>(() => {
    const projects = (data.projectsList ?? []).flatMap((p) => {
      const c = coords(p);
      return c
        ? [
            {
              key: `p${p.id}`,
              ...c,
              kicker: p.districtName ? `${p.districtName} District` : "Project",
              name: p.projectName,
              facts: p.gSno ? [{ label: "GS No.", value: p.gSno }] : [],
            },
          ]
        : [];
    });
    if (projects.length) return projects;
    return (data.districtList ?? []).flatMap((d) => {
      const c = coords(d);
      return c
        ? [
            {
              key: `d${d.id}`,
              ...c,
              kicker: d.divisionName ? `${d.divisionName} Division` : "District",
              name: d.districtName,
              facts: [
                { label: "PC-IVs", value: d.submittedPCIVs },
                { label: "Visited", value: d.visitedPCIVs },
              ],
            },
          ]
        : [];
    });
  }, [data]);

  const toggleFullScreen = () => {
    const card = cardRef.current;
    if (!card) return;
    if (document.fullscreenElement === card) document.exitFullscreen();
    else card.requestFullscreen?.();
  };

  return (
    <div ref={cardRef} className={styles.card} aria-label="Map of Punjab showing evaluated projects">
      <EvaluationLeafletCanvas pins={pins} />
      <div className={styles.float}>
        <Link href="/projects-live-view" target="_blank" className={styles.live}>
          <span className={styles.dot} aria-hidden="true" />
          Live Streaming
        </Link>
        <button
          type="button"
          className={styles.square}
          onClick={toggleFullScreen}
          title="Full screen"
          aria-label="Show map full screen"
        >
          <Expand size={20} />
        </button>
      </div>
      {pins.length === 0 && <div className={styles.empty}>No projects with a location yet.</div>}
    </div>
  );
};

export default EvaluationLeafletMap;
