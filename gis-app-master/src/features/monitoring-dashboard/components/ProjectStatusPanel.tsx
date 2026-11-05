"use client";
import { CSSProperties } from "react";
import { ProjectsListState } from "../hooks";
import { MainDashboard } from "../types";
import { fmt, percent } from "../utils";
import MiniCard from "./MiniCard";
import styles from "./MonitoringDashboard.module.css";
import ProjectsModal from "./ProjectsModal";

interface Props {
  data?: MainDashboard;
  projects: ProjectsListState;
  role: string;
}

/** Approved / unapproved / dropped split, then umbrella vs single projects */
const ProjectStatusPanel = ({ data, projects, role }: Props) => {
  const approved = data?.approved ?? 0;
  const unapproved = data?.unapproved ?? 0;
  const dropped = data?.dropped ?? 0;
  const total = approved + unapproved + dropped;

  const rows = [
    { modalId: "Approved", status: "Approved", label: "Approved Projects", name: "Approved", value: approved, color: "var(--good)", valueColor: "var(--good)" },
    { modalId: "Unapproved", status: "Un-Approved", label: "Unapproved Projects", name: "Unapproved", value: unapproved, color: "var(--average)", valueColor: "var(--critical)" },
    { modalId: "Dropped", status: "Dropped", label: "Dropped Projects", name: "Dropped", value: dropped, color: "var(--slate)", valueColor: undefined },
  ];

  return (
    <div className={styles.panel}>
      <div className={styles.panelH}>
        <h2>Project status</h2>
        <span className={styles.phNote}>{fmt(total)} projects</span>
      </div>
      <div className={styles.statusBar} aria-hidden="true">
        {rows.map((r) => (
          <span
            key={r.modalId}
            style={{ width: `${percent(r.value, total)}%`, background: r.color, minWidth: r.value ? 4 : 0 }}
          />
        ))}
      </div>
      {rows.map((r) => (
        <ProjectsModal
          key={r.modalId}
          config={{ modalId: r.modalId, status: r.status, label: r.label, columns: "cmAdp", allowLink: false }}
          projects={projects}
          role={role}
          trigger={
            <button type="button" className={`${styles.click} ${styles.srow}`} style={{ "--rc": r.color } as CSSProperties}>
              <span className={styles.sw} style={{ background: r.color }} />
              {r.name}
              <b className={styles.num} style={{ color: r.valueColor }}>
                {fmt(r.value)}
              </b>
            </button>
          }
        />
      ))}
      <div className={`${styles.pair} ${styles.typePair}`}>
        <ProjectsModal
          config={{ modalId: "Umbrella", status: "umbralla", label: "Umbrella Projects", columns: "cmAdp", allowLink: false }}
          projects={projects}
          role={role}
          trigger={<MiniCard icon="umbrella" value={fmt(data?.umbralla)} label="Umbrella" color="var(--teal)" />}
        />
        <ProjectsModal
          config={{ modalId: "single", status: "single", label: "Single Projects", columns: "cmAdp", allowLink: false }}
          projects={projects}
          role={role}
          trigger={<MiniCard icon="box" value={fmt(data?.single)} label="Single" color="var(--info)" />}
        />
      </div>
    </div>
  );
};

export default ProjectStatusPanel;
