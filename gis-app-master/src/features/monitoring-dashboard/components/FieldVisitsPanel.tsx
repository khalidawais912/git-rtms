"use client";
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

/** Scheduled and completed site visits, with progress */
const FieldVisitsPanel = ({ data, projects, role }: Props) => {
  const scheduled = data?.officerReports.scheduled ?? 0;
  const completed = data?.officerReports.completed ?? 0;
  const planned = scheduled + completed;
  const done = percent(completed, planned);

  return (
    <div className={styles.panel}>
      <div className={styles.panelH}>
        <h2>Field visits</h2>
        <span className={styles.phNote}>
          <span className={styles.num}>{fmt(planned)}</span> planned
        </span>
      </div>
      <div className={styles.pair}>
        <ProjectsModal
          config={{ modalId: "scheduledVisits", status: "Scheduled", label: "Scheduled Visits", columns: "visits" }}
          projects={projects}
          role={role}
          allowOpen={scheduled !== 0}
          trigger={
            <MiniCard icon="calendar" value={fmt(scheduled)} label="Scheduled" color="var(--violet)" disabled={scheduled === 0} />
          }
        />
        <ProjectsModal
          config={{ modalId: "completedVisits", status: "Completed", label: "Completed Visits", columns: "visits" }}
          projects={projects}
          role={role}
          allowOpen={completed !== 0}
          trigger={
            <MiniCard icon="check" value={fmt(completed)} label="Completed" color="var(--good)" disabled={completed === 0} />
          }
        />
      </div>
      <div className={styles.prog} aria-hidden="true">
        <span style={{ width: `${done}%` }} />
      </div>
      <div className={styles.progNote}>
        {planned
          ? `${fmt(completed)} of ${fmt(planned)} visits completed (${done.toFixed(0)}%)`
          : "No visits planned yet"}
      </div>
    </div>
  );
};

export default FieldVisitsPanel;
