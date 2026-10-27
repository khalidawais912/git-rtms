"use client";
import Link from "next/link";
import { ProjectsListState, ReviewCount } from "../hooks";
import { fmt } from "../utils";
import MiniCard from "./MiniCard";
import styles from "./MonitoringDashboard.module.css";
import ProjectsModal from "./ProjectsModal";

interface Props {
  projects: ProjectsListState;
  role: string;
  /** Department 0/1 (P&D) sees Department summary; other departments see PC-IV and DGME reports */
  isPnd: boolean;
  pcivReview?: ReviewCount;
}

const ROSE = "var(--cat-rose)";

/** Independent cards beside the report workflow */
const SoloCards = ({ projects, role, isPnd, pcivReview }: Props) => (
  <div className={styles.soloCol}>
    {isPnd && (
      <Link href="/department-dashboard-summary" target="_blank" className="d-grid">
        <MiniCard as="span" className={styles.solo} icon="building" value={0} label="Department summary" color="var(--teal)" allClear />
      </Link>
    )}

    <ProjectsModal
      config={{ modalId: "pc-iii", status: "InProcess", label: "Reports In Progress", columns: "reports" }}
      projects={projects}
      role={role}
      buttonColumn="d-grid"
      trigger={<MiniCard className={styles.solo} icon="doc" value={0} label="PC-III" color={ROSE} allClear />}
    />

    {!isPnd && pcivReview && (
      <Link href="/pc-iv-review" target="_blank" className="d-grid">
        <MiniCard
          as="span"
          className={styles.solo}
          icon="review"
          value={fmt(pcivReview.total)}
          label="PC-IV review"
          color="var(--violet)"
          allClear={pcivReview.total === 0}
          badge={pcivReview.pending}
        />
      </Link>
    )}

    {!isPnd && (
      <ProjectsModal
        config={{ modalId: "dgme-reports", status: "InProcess", label: "DGME Reports", columns: "reports" }}
        projects={projects}
        role={role}
        buttonColumn="d-grid"
        trigger={<MiniCard className={styles.solo} icon="clipboard" value={0} label="DGME reports" color="var(--info)" allClear />}
      />
    )}
  </div>
);

export default SoloCards;
