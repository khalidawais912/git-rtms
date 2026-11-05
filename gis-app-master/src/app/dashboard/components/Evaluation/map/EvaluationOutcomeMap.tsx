"use client";
import Icon from "@/features/monitoring-dashboard/components/Icon";
import mon from "@/features/monitoring-dashboard/components/MonitoringDashboard.module.css";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { DistrictList } from "../types";
import type { BaseLayer } from "./EvaluationLeafletCanvas";
import { OUTCOME_COLOR, outcomePins } from "./outcome";

// Leaflet needs the browser
const EvaluationLeafletCanvas = dynamic(() => import("./EvaluationLeafletCanvas"), {
  ssr: false,
  loading: () => <div className={mon.mapLoading}>Loading map…</div>,
});

/** "Where we evaluated": one pin per district, coloured by its evaluation outcome. */
const EvaluationOutcomeMap = ({ districts }: { districts: DistrictList[] }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [baseLayer, setBaseLayer] = useState<BaseLayer>("map");
  const pins = useMemo(() => outcomePins(districts), [districts]);

  const toggleFullscreen = () => {
    const card = cardRef.current;
    if (!card) return;
    if (document.fullscreenElement === card) document.exitFullscreen();
    else card.requestFullscreen?.();
  };

  return (
    <div ref={cardRef} className={mon.map2}>
      <EvaluationLeafletCanvas pins={pins} baseLayer={baseLayer} className={mon.mapCanvas} />

      <div className={mon.mapFloat}>
        <span className={mon.mapTitle}>
          <Icon name="pin" />
          Where we evaluated
        </span>
        <div className={mon.seg}>
          {(["map", "sat"] as const).map((layer) => (
            <button
              key={layer}
              type="button"
              className={baseLayer === layer ? mon.active : ""}
              onClick={() => setBaseLayer(layer)}
            >
              {layer === "map" ? "Map" : "Satellite"}
            </button>
          ))}
        </div>
        <Link href="/projects-live-view" target="_blank" className={mon.liveBtn}>
          <span className={mon.liveDot} />
          Live Streaming
        </Link>
        <button
          type="button"
          className={`${mon.sqBtn} ${mon.pushRight}`}
          onClick={toggleFullscreen}
          title="Full screen"
          aria-label="Show map full screen"
        >
          <Icon name="expand" />
        </button>
      </div>

      <div className={mon.legend}>
        <h4>Evaluation outcome</h4>
        <div><span className={mon.dotm} style={{ background: OUTCOME_COLOR.successful }} />Successful</div>
        <div><span className={mon.dotm} style={{ background: OUTCOME_COLOR.partial }} />Partial success</div>
        <div><span className={mon.dotm} style={{ background: OUTCOME_COLOR.notSuccessful }} />Not successful</div>
        <div className={mon.hint}>Point at a pin to see project details</div>
      </div>
    </div>
  );
};

export default EvaluationOutcomeMap;
