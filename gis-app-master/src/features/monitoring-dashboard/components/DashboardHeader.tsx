"use client";
import { useEffect, useState } from "react";
import { PROGRAM_LABEL } from "../constants";
import { Program } from "../types";
import { fmt } from "../utils";
import Icon from "./Icon";
import styles from "./MonitoringDashboard.module.css";

interface Props {
  program?: Program;
  /** Projects in the active programme (the other programme's count is not loaded) */
  total?: number;
  onProgramChange?: (program: Program) => void;
  filterCount?: number;
  onOpenFilters?: () => void;
  bigScreen?: boolean;
  onToggleBigScreen?: () => void;
  /** Hide the programme switch and actions (DGME reports role) */
  compact?: boolean;
}

const PROGRAMS: { key: Program; icon: "star" | "briefcase"; label: string }[] = [
  { key: "cmInitiative", icon: "star", label: "CM Initiatives" },
  { key: "adp", icon: "briefcase", label: "ADP" },
];

/** Title row: breadcrumbs, programme switch and page actions */
const DashboardHeader = ({
  program,
  total,
  onProgramChange,
  filterCount = 0,
  onOpenFilters,
  bigScreen,
  onToggleBigScreen,
  compact,
}: Props) => {
  // Set after mount so server and browser render the same text
  const [today, setToday] = useState("");
  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }));
  }, []);

  return (
    <div className={styles.head}>
      <div>
        <div className={styles.crumbs}>
          <Icon name="home" /> Monitoring <Icon name="chevR" /> Main Dashboard{today && ` · ${today}`}
        </div>
        <h1 className={styles.title}>Monitoring Dashboard</h1>
      </div>

      {!compact && program && (
        <>
          <div className={styles.pills} role="tablist" aria-label="Choose programme">
            {PROGRAMS.map((p) => (
              <button
                key={p.key}
                type="button"
                role="tab"
                aria-selected={program === p.key}
                className={program === p.key ? styles.active : ""}
                onClick={() => program !== p.key && onProgramChange?.(p.key)}
                title={PROGRAM_LABEL[p.key]}
              >
                <Icon name={p.icon} />
                {p.label}
                {program === p.key && total !== undefined && <b className={styles.num}>{fmt(total)}</b>}
              </button>
            ))}
          </div>
          <div className={styles.headActions}>
            <button type="button" className={styles.btn} onClick={onOpenFilters} aria-haspopup="dialog">
              <Icon name="filter" />
              Filters
              <span className={`${styles.count} ${styles.num} ${filterCount ? styles.countOn : ""}`}>{filterCount}</span>
            </button>
            <button
              type="button"
              className={`${styles.btn} ${bigScreen ? styles.bigOn : ""}`}
              onClick={onToggleBigScreen}
              aria-pressed={bigScreen}
              title="Larger text for projectors and TV screens"
            >
              <Icon name="screen" />
              {bigScreen ? "Normal Screen" : "Big Screen"}
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => window.print()}
              title="Print or save the dashboard as PDF"
            >
              <Icon name="download" />
              Export
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardHeader;
