import { CSSProperties } from "react";
import { DistrictList } from "../types";
import { fmt } from "../utils";
import styles from "./MonitoringDashboard.module.css";

export type Finding = "good" | "average" | "critical";

export const FINDING_COLOR: Record<Finding, string> = {
  good: "#1a8150",
  average: "#c47f0a",
  critical: "#bf3530",
};

const FINDING_LABEL: Record<Finding, string> = { good: "Good", average: "Average", critical: "Critical" };

/** Worst finding in the district decides its colour */
export const districtFinding = (d: DistrictList): Finding =>
  d.crtical > 0 ? "critical" : d.average > 0 ? "average" : "good";

/** District card shown when pointing at a map circle */
const DistrictTooltip = ({ district }: { district: DistrictList }) => {
  const finding = districtFinding(district);
  const { good, average, crtical } = district;
  const reports = good + average + crtical;
  const segments: [number, string][] = [
    [good, FINDING_COLOR.good],
    [average, FINDING_COLOR.average],
    [crtical, FINDING_COLOR.critical],
  ];

  return (
    <>
      <div className={styles.dtHead}>
        <div>
          <div className={styles.dtDiv}>{district.divisionName || "Punjab"} Division</div>
          <h4>{district.districtName}</h4>
        </div>
        <span className={styles.dtFlag} style={{ "--s": FINDING_COLOR[finding] } as CSSProperties}>
          {FINDING_LABEL[finding]}
        </span>
      </div>
      <div className={styles.dtBody}>
        <div className={styles.dtKpis}>
          <div>
            <b className={styles.num}>{fmt(district.approved)}</b>
            <span>Approved</span>
          </div>
          <div>
            <b className={styles.num}>{fmt(district.unApproved)}</b>
            <span>Unapproved</span>
          </div>
          <div>
            <b className={styles.num}>{fmt(district.dropped)}</b>
            <span>Dropped</span>
          </div>
        </div>
        <div className={styles.dtLabel}>
          Inspection findings <small>{fmt(reports)} reports</small>
        </div>
        <div className={styles.dtBar}>
          {segments.map(([n, color], i) =>
            n ? (
              <span key={i} style={{ flex: n, background: color }}>
                {n}
              </span>
            ) : null,
          )}
        </div>
        <div className={styles.dtLegend}>
          <span><i style={{ background: FINDING_COLOR.good }} />Good <b>{good}</b></span>
          <span><i style={{ background: FINDING_COLOR.average }} />Average <b>{average}</b></span>
          <span><i style={{ background: FINDING_COLOR.critical }} />Critical <b>{crtical}</b></span>
        </div>
        <div className={styles.dtHint}>Click to filter the dashboard by this district</div>
      </div>
    </>
  );
};

export default DistrictTooltip;
