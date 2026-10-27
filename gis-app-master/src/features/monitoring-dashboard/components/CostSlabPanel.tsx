"use client";
import { COST_SLABS } from "../constants";
import { ProjectsListState } from "../hooks";
import { MainDashboard } from "../types";
import { fmt, percent } from "../utils";
import styles from "./MonitoringDashboard.module.css";
import ProjectsModal from "./ProjectsModal";

interface Props {
  data?: MainDashboard;
  projects: ProjectsListState;
  role: string;
}

/** Projects by cost, i.e. by the forum that approves them */
const CostSlabPanel = ({ data, projects, role }: Props) => {
  const counts = COST_SLABS.map((s) => data?.[s.field] ?? 0);
  const max = Math.max(...counts);

  return (
    <div className={styles.panel}>
      <div className={styles.panelH}>
        <h2>Project cost slab</h2>
        <span className={styles.phNote}>Approval forum by cost</span>
      </div>
      <div className={styles.slab}>
        {COST_SLABS.map((s, i) => (
          <ProjectsModal
            key={s.modalId}
            config={{ modalId: s.modalId, status: s.status, label: s.label, columns: "cmAdp", allowLink: false }}
            projects={projects}
            role={role}
            trigger={
              <button type="button" className={`${styles.click} ${styles.slabRow}`}>
                <span className={styles.code}>{s.code}</span>
                <span className={styles.rng}>{s.range}</span>
                <b className={styles.num}>{fmt(counts[i])}</b>
                <span className={styles.sbar}>
                  <span style={{ width: `${percent(counts[i], max)}%` }} />
                </span>
              </button>
            }
          />
        ))}
      </div>
    </div>
  );
};

export default CostSlabPanel;
