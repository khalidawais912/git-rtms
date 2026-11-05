"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { fetchDistrictProjects, isProjectMonitored } from "../services";
import { DistrictList, DistrictProjects } from "../types";
import { FINDING_COLOR } from "./DistrictTooltip";
import Icon from "./Icon";
import styles from "./MonitoringDashboard.module.css";
import type { BaseLayer } from "./VisitsMapCanvas";

// Leaflet needs the browser
const VisitsMapCanvas = dynamic(() => import("./VisitsMapCanvas"), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Loading map…</div>,
});

interface Props {
  districts: DistrictList[];
  /** District filter in use; when it is removed elsewhere the map shows all districts again */
  selectedDistrictName?: string;
  onSelectDistrict: (districtName: string) => void;
  onClearDistrict: () => void;
}

/** "Where we visited": district circles; a click filters the dashboard and shows its projects */
const VisitsMap = ({ districts, selectedDistrictName, onSelectDistrict, onClearDistrict }: Props) => {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [baseLayer, setBaseLayer] = useState<BaseLayer>("map");
  const [activeDistrict, setActiveDistrict] = useState<DistrictList | null>(null);
  const [districtProjects, setDistrictProjects] = useState<DistrictProjects[]>([]);
  const [tipOpen, setTipOpen] = useState(false);

  useEffect(() => {
    if (activeDistrict && selectedDistrictName !== activeDistrict.districtName) {
      setActiveDistrict(null);
      setDistrictProjects([]);
    }
  }, [selectedDistrictName, activeDistrict]);

  const handleDistrictClick = async (district: DistrictList) => {
    // Second click on the same district shows all districts again
    if (activeDistrict?.id === district.id) return handleBack();

    setActiveDistrict(district);
    setTipOpen(false);
    onSelectDistrict(district.districtName);
    try {
      setDistrictProjects(await fetchDistrictProjects(district.id));
    } catch (err) {
      console.error("District projects error:", err);
      setDistrictProjects([]);
    }
  };

  const handleBack = () => {
    setActiveDistrict(null);
    setDistrictProjects([]);
    onClearDistrict();
  };

  const handleProjectClick = async (projectId: number) => {
    try {
      if (await isProjectMonitored(projectId)) {
        router.push(`/projectDetailsDashboard/${projectId}`);
        return;
      }
    } catch (err) {
      console.error("Project dashboard error:", err);
    }
    toast.error("This Project is not yet Monitored");
  };

  const toggleFullscreen = () => {
    const card = cardRef.current;
    if (!card) return;
    if (document.fullscreenElement === card) document.exitFullscreen();
    else card.requestFullscreen?.();
  };

  return (
    <div ref={cardRef} className={`${styles.map2} ${tipOpen ? styles.tipOpen : ""}`}>
      <Toaster />
      <VisitsMapCanvas
        districts={districts}
        activeDistrict={activeDistrict}
        districtProjects={districtProjects}
        baseLayer={baseLayer}
        onDistrictClick={handleDistrictClick}
        onProjectClick={handleProjectClick}
        onTooltip={setTipOpen}
      />

      <div className={styles.mapFloat}>
        <span className={styles.mapTitle}>
          <Icon name="pin" />
          {activeDistrict ? activeDistrict.districtName : "Where we visited"}
        </span>
        <div className={styles.seg}>
          {(["map", "sat"] as const).map((layer) => (
            <button
              key={layer}
              type="button"
              className={baseLayer === layer ? styles.active : ""}
              onClick={() => setBaseLayer(layer)}
            >
              {layer === "map" ? "Map" : "Satellite"}
            </button>
          ))}
        </div>
        <Link href="/projects-live-view" target="_blank" className={styles.liveBtn}>
          <span className={styles.liveDot} />
          Live Streaming
        </Link>
        {activeDistrict && (
          <button type="button" className={`${styles.backBtn} ${styles.pushRight}`} onClick={handleBack}>
            <Icon name="back" />
            All districts
          </button>
        )}
        <button
          type="button"
          className={`${styles.sqBtn} ${activeDistrict ? "" : styles.pushRight}`}
          onClick={toggleFullscreen}
          title="Full screen"
          aria-label="Show map full screen"
        >
          <Icon name="expand" />
        </button>
      </div>

      <div className={styles.legend}>
        <h4>Report finding</h4>
        <div><span className={styles.dotm} style={{ background: FINDING_COLOR.good }} />Good — work on track</div>
        <div><span className={styles.dotm} style={{ background: FINDING_COLOR.average }} />Average — minor issues</div>
        <div><span className={styles.dotm} style={{ background: FINDING_COLOR.critical }} />Critical — urgent action</div>
        <div className={styles.hint}>Point at a circle to see district details</div>
      </div>
    </div>
  );
};

export default VisitsMap;
