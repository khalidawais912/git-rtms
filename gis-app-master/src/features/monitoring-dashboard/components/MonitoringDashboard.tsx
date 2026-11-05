"use client";
import { inter } from "@/styles/fonts";
import { devMap } from "@/utils";
import Link from "next/link";
import { useCallback, useState } from "react";
import { ROLES } from "../constants";
import { useBigScreen, useMonitoringDashboard, useProjectsList, useReviewCounts, useUserFilters } from "../hooks";
import { fmt } from "../utils";
import ActiveFilters from "./ActiveFilters";
import BudgetPanel from "./BudgetPanel";
import CostSlabPanel from "./CostSlabPanel";
import DashboardHeader from "./DashboardHeader";
import FieldVisitsPanel from "./FieldVisitsPanel";
import FiltersPanel from "./FiltersPanel";
import MiniCard from "./MiniCard";
import styles from "./MonitoringDashboard.module.css";
import ProjectStatusPanel from "./ProjectStatusPanel";
import QuickTools from "./QuickTools";
import ReportWorkflowPanel from "./ReportWorkflowPanel";
import SoloCards from "./SoloCards";
import StatTiles from "./StatTiles";
import VisitsMap from "./VisitsMap";

/** Monitoring Dashboard ("Bold Blue" design) */
const MonitoringDashboard = () => {
  const dash = useMonitoringDashboard();
  const { data, role, roleKey, program, otherFilters } = dash;
  const projects = useProjectsList(program, otherFilters, role);
  const fields = useUserFilters();

  const isSpecial = roleKey === ROLES.special;
  const isDgmeReports = roleKey === ROLES.dgmeReports;
  const isPnd = dash.departmentId === 0 || dash.departmentId === 1;
  const { reportReview, pcivReview } = useReviewCounts({ withPciv: dash.departmentId !== undefined && !isPnd });

  const [filtersOpen, setFiltersOpen] = useState(false);
  const { bigScreen, toggleBigScreen } = useBigScreen();
  const closeFilters = useCallback(() => setFiltersOpen(false), []);
  const districtFilter = otherFilters.find((f) => f.filterIdentifier === "District")?.filterValues;

  const map = devMap && data && (
    <VisitsMap
      districts={data.disitrictlist ?? []}
      selectedDistrictName={districtFilter}
      onSelectDistrict={dash.selectDistrict}
      onClearDistrict={dash.clearDistrict}
    />
  );

  // DGME reports role: report review and the map only
  if (isDgmeReports) {
    return (
      <div className={`${styles.root} ${inter.className}`}>
        <DashboardHeader compact />
        <section className={styles.row2} style={{ gridTemplateColumns: "minmax(0, 360px)" }}>
          {reportReview && (
            <Link href="/report-history" target="_blank">
              <MiniCard
                as="span"
                className={styles.solo}
                icon="review"
                value={fmt(reportReview.total)}
                label="Report review"
                color="var(--violet)"
                allClear={reportReview.total === 0}
                badge={reportReview.pending}
              />
            </Link>
          )}
        </section>
        <section className={`${styles.main2} ${styles.main2Full}`}>{map}</section>
      </div>
    );
  }

  return (
    <div className={`${styles.root} ${inter.className} ${bigScreen ? styles.big : ""}`} aria-busy={dash.isLoading}>
      <DashboardHeader
        program={program}
        total={data?.totalProjects}
        onProgramChange={dash.switchProgram}
        filterCount={otherFilters.length}
        onOpenFilters={() => setFiltersOpen(true)}
        bigScreen={bigScreen}
        onToggleBigScreen={toggleBigScreen}
      />
      <ActiveFilters applied={otherFilters} fields={fields} onChange={dash.applyFilters} onClear={dash.resetFilters} />

      <StatTiles data={data} program={program} projects={projects} role={role} />

      {!isSpecial && (
        <section className={styles.row2}>
          <FieldVisitsPanel data={data} projects={projects} role={role} />
          <ReportWorkflowPanel data={data} projects={projects} role={role} reportReview={reportReview} />
          <SoloCards projects={projects} role={role} isPnd={isPnd} pcivReview={pcivReview} />
        </section>
      )}

      <section className={styles.main2}>
        {map || <div className={styles.map2} />}
        <aside className={styles.rail}>
          {(!isSpecial || isPnd) && (
            <QuickTools data={data} program={program} projects={projects} role={role} isSpecial={isSpecial} isPnd={isPnd} />
          )}
          {!isSpecial && <BudgetPanel data={data} />}
          <ProjectStatusPanel data={data} projects={projects} role={role} />
          <CostSlabPanel data={data} projects={projects} role={role} />
        </aside>
      </section>

      <FiltersPanel
        open={filtersOpen}
        onClose={closeFilters}
        fields={fields}
        applied={otherFilters}
        onApply={dash.applyFilters}
        onReset={dash.resetFilters}
      />
    </div>
  );
};

export default MonitoringDashboard;
