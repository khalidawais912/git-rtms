"use client";
import { CSSProperties } from "react";
import { PROGRAM_LABEL } from "../constants";
import { ProjectsListState } from "../hooks";
import { MainDashboard, Program, ProjectsModalConfig } from "../types";
import { fmt } from "../utils";
import Icon, { IconName } from "./Icon";
import styles from "./MonitoringDashboard.module.css";
import ProjectsModal from "./ProjectsModal";

interface Props {
  data?: MainDashboard;
  program: Program;
  projects: ProjectsListState;
  role: string;
}

interface Tile {
  config: ProjectsModalConfig;
  value: number;
  title: string;
  note: string;
  icon: IconName;
  color?: string;
}

/** Six key figures; each opens the projects behind it */
const StatTiles = ({ data, program, projects, role }: Props) => {
  const tiles: Tile[] = [
    {
      config: {
        modalId: "TotalProjects",
        status: "TotalProject",
        label: program === "cmInitiative" ? "CM Initiatives project Table" : "ADP Projects",
        columns: "cmInitiative",
        rows: "withUtilization",
        allowLink: false,
      },
      value: data?.totalProjects ?? 0,
      title: PROGRAM_LABEL[program],
      note: `${fmt(data?.approved)} approved · ${fmt(data?.unapproved)} awaiting`,
      icon: program === "cmInitiative" ? "star" : "briefcase",
    },
    {
      config: { modalId: "noOfProjects", status: "NoOfProject", label: "Projects", columns: "noOfProjects" },
      value: data?.noofProject ?? 0,
      title: "Projects monitored",
      note: "Being inspected now",
      icon: "folder",
      color: "var(--info)",
    },
    {
      config: { modalId: "noOfVisits", status: "BeingMonitored", label: "Visits", columns: "reports" },
      value: data?.monitoredProjects ?? 0,
      title: "Site visits",
      note: "To monitored projects",
      icon: "route",
      color: "var(--teal)",
    },
    {
      config: { modalId: "Good", status: "OnTrack", label: "Good Projects", columns: "reports" },
      value: data?.defineLimitProjects ?? 0,
      title: "Good reports",
      note: "Work on track",
      icon: "check",
      color: "var(--good)",
    },
    {
      config: { modalId: "Average", status: "OffTrack", label: "Average Projects", columns: "reports" },
      value: data?.needConsidrationProjects ?? 0,
      title: "Average reports",
      note: "Minor issues found",
      icon: "clock",
      color: "var(--average)",
    },
    {
      config: { modalId: "Critical", status: "Critical", label: "Critical Projects", columns: "reports" },
      value: data?.criticalProjects ?? 0,
      title: "Critical reports",
      note: "Urgent action needed",
      icon: "ban",
      color: "var(--critical)",
    },
  ];

  return (
    <section className={styles.tiles} aria-label="Key figures">
      {tiles.map((t, i) => (
        <ProjectsModal
          key={t.config.modalId}
          config={t.config}
          projects={projects}
          role={role}
          allowOpen={t.value !== 0}
          trigger={
            <button
              type="button"
              className={`${styles.click} ${styles.tile} ${i === 0 ? styles.hero : ""}`}
              style={t.color ? ({ "--tc": t.color } as CSSProperties) : undefined}
              aria-disabled={t.value === 0 || undefined}
            >
              <span className={styles.ti}>
                <Icon name={t.icon} />
              </span>
              <span className={`${styles.tv} ${styles.num}`}>{fmt(t.value)}</span>
              <span className={styles.tl}>{t.title}</span>
              <span className={styles.ts}>{t.note}</span>
              <Icon name="arrow" className={styles.tgo} />
            </button>
          }
        />
      ))}
    </section>
  );
};

export default StatTiles;
