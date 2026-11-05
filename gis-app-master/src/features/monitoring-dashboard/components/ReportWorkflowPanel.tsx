"use client";
import Link from "next/link";
import { ProjectsListState, ReviewCount } from "../hooks";
import { MainDashboard } from "../types";
import { fmt } from "../utils";
import MiniCard from "./MiniCard";
import styles from "./MonitoringDashboard.module.css";
import ProjectsModal from "./ProjectsModal";

interface Props {
  data?: MainDashboard;
  projects: ProjectsListState;
  role: string;
  reportReview?: ReviewCount;
}

/** Reports being written and reports waiting for review */
const ReportWorkflowPanel = ({ data, projects, role, reportReview }: Props) => {
  const inProcess = data?.inProcessProjects ?? 0;

  return (
    <div className={styles.panel}>
      <div className={styles.panelH}>
        <h2>Report workflow</h2>
        <span className={styles.phNote}>Work waiting for your team</span>
      </div>
      <div className={styles.wf}>
        <ProjectsModal
          config={{ modalId: "reportsInProgress", status: "InProcess", label: "Reports In Progress", columns: "reports" }}
          projects={projects}
          role={role}
          allowOpen={inProcess !== 0}
          trigger={
            <MiniCard
              icon="edit"
              value={fmt(inProcess)}
              label="Reports in progress"
              color="var(--info)"
              allClear={inProcess === 0}
              disabled={inProcess === 0}
            />
          }
        />
        {reportReview && (
          <Link href="/report-history" target="_blank">
            <MiniCard
              as="span"
              icon="review"
              value={fmt(reportReview.total)}
              label="Report review"
              color="var(--violet)"
              allClear={reportReview.total === 0}
              badge={reportReview.pending}
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default ReportWorkflowPanel;
