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

/** One half of the programme tile's footer: a count that opens its own projects */
interface Part {
  config: ProjectsModalConfig;
  label: string;
  title: string;
  value?: number;
}

/**
 * Six key figures; each opens the projects behind it. The first (programme) tile also splits its
 * projects into "Cost ≥ 800M" and, of those, "+ Util. ≥ 20%".
 */
const StatTiles = ({ data, program, projects, role }: Props) => {
  // Counts and lists of "Cost ≥ 800M" and "+ Util. ≥ 20%" come from the server (see fetchProjects800M)
  const name = PROGRAM_LABEL[program];
  const tableLabel = program === "cmInitiative" ? "CM Initiatives project Table" : "ADP Projects";

  const hero: Tile = {
    config: {
      modalId: "TotalProjects",
      status: "TotalProject",
      label: tableLabel,
      columns: "cmInitiative",
      rows: "withUtilization",
      allowLink: false,
    },
    value: data?.totalProjects ?? 0,
    title: name,
    note: `${fmt(data?.approved)} approved · ${fmt(data?.unapproved)} awaiting`,
    icon: program === "cmInitiative" ? "star" : "briefcase",
  };

  const parts: Part[] = [
    {
      config: { ...hero.config, modalId: "BigCost", label: `${name}: cost 800M or above`, rows: "raw", source: "800M" },
      label: "Cost ≥ 800M",
      title: "Projects with PC-I cost of 800 million or more",
      value: data?.cost800MAndAbove,
    },
    {
      config: {
        ...hero.config,
        modalId: "BigCostUtil",
        label: `${name}: cost 800M or above, utilization 20% or above`,
        rows: "raw",
        source: "800MUtil20",
      },
      label: "+ Util. ≥ 20%",
      title: "Of those, projects with 20% or more of the cost used",
      value: data?.cost800MAndAboveUtilization20Plus,
    },
  ];

  const tiles: Tile[] = [
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
      <div className={`${styles.tile} ${styles.hero} ${styles.heroSplit}`}>
        <ProjectsModal
          config={hero.config}
          projects={projects}
          role={role}
          allowOpen={hero.value !== 0}
          buttonColumn={styles.heroMainCell}
          trigger={
            <button
              type="button"
              className={`${styles.click} ${styles.heroMain}`}
              aria-disabled={hero.value === 0 || undefined}
            >
              <span className={styles.ti}>
                <Icon name={hero.icon} />
              </span>
              <span className={`${styles.tv} ${styles.num}`}>{fmt(hero.value)}</span>
              <span className={styles.tl}>{hero.title}</span>
              <span className={styles.ts}>{hero.note}</span>
              <Icon name="arrow" className={styles.tgo} />
            </button>
          }
        />
        <div className={styles.heroFoot}>
          {parts.map((p) => (
            <ProjectsModal
              key={p.config.modalId}
              config={p.config}
              projects={projects}
              role={role}
              allowOpen={!!p.value}
              buttonColumn={styles.heroPartCell}
              trigger={
                <button
                  type="button"
                  className={`${styles.click} ${styles.heroPart}`}
                  title={p.title}
                  aria-disabled={!p.value || undefined}
                >
                  <small>{p.label}</small>
                  <b className={styles.num}>{p.value === undefined ? "–" : fmt(p.value)}</b>
                  <span className={styles.heroChev}>
                    <Icon name="chevR" />
                  </span>
                </button>
              }
            />
          ))}
        </div>
      </div>

      {tiles.map((t) => (
        <ProjectsModal
          key={t.config.modalId}
          config={t.config}
          projects={projects}
          role={role}
          allowOpen={t.value !== 0}
          trigger={
            <button
              type="button"
              className={`${styles.click} ${styles.tile}`}
              style={t.color ? ({ "--tc": t.color } as CSSProperties) : undefined}
              aria-disabled={t.value === 0 || undefined}
            >
              <span className={styles.ti}>
                <Icon name={t.icon} />
              </span>
              <span className={`${styles.tv} ${styles.num}`}>{fmt(t.value)}</span>
              <span className={styles.tl}>{t.title}</span>
              <span className={`${styles.ts} ${styles.tband}`}>{t.note}</span>
              <Icon name="arrow" className={styles.tgo} />
            </button>
          }
        />
      ))}
    </section>
  );
};

export default StatTiles;
