"use client";
import CustomModal from "@/components/CustomModal/CustomModal";
import DistributedColumnChart from "@/app/dashboard/components/DistributedColumnChart";
import MarkToProjects from "@/app/dashboard/components/MarkToProjects/MarkToProjects";
import SimplePieChart from "@/app/dashboard/components/SimplePieChart";
import VisitsPlan from "@/app/dashboard/components/VisitsPlan";
import Link from "next/link";
import { CSSProperties } from "react";
import { ROLES } from "../constants";
import { ProjectsListState } from "../hooks";
import { MainDashboard, Program } from "../types";
import { fmt } from "../utils";
import Icon, { IconName } from "./Icon";
import styles from "./MonitoringDashboard.module.css";
import ProjectsModal from "./ProjectsModal";

interface Props {
  data?: MainDashboard;
  program: Program;
  projects: ProjectsListState;
  role: string;
  isSpecial: boolean;
  isPnd: boolean;
}

const ToolFace = ({ icon, color, label, badge, title }: {
  icon: IconName;
  color: string;
  label: string;
  badge?: number;
  title?: string;
}) => (
  <>
    <span className={styles.toolIco} style={{ "--tc": color } as CSSProperties}>
      <Icon name={icon} />
    </span>
    {label}
    {badge !== undefined && (
      <span className={`${styles.badge} ${styles.num}`} title={title}>
        {fmt(badge)}
      </span>
    )}
  </>
);

const toolStyle = (color: string) => ({ "--tc": color }) as CSSProperties;
const toolClass = `${styles.click} ${styles.tool}`;

/** Shortcuts to the tracking, planning and analysis screens */
const QuickTools = ({ data, program, projects, role, isSpecial, isPnd }: Props) => {
  const roleKey = role.toLowerCase();
  const canSeeUtilizationGap = ([ROLES.superAdmin, ROLES.deputyDirector, ROLES.director] as string[]).includes(roleKey);
  const canMarkToEvaluation = roleKey === ROLES.director || roleKey === ROLES.deputyDirector;
  // Utilization projects not yet visited by the DGME team
  const unvisited = (data?.utilization20t080 ?? 0) - projects.utilizationRows.filter((p) => p.visitCount > 0).length;
  const chartRow = projects.projectsData?.[0];

  return (
    <div className={styles.panel}>
      <div className={styles.panelH}>
        <h2>Quick tools</h2>
      </div>
      <div className={styles.tools}>
        {!isSpecial && (
          <CustomModal
            buttonColumn="d-grid"
            size="xl"
            modalId="pieBarChart"
            HeaderRightPos={20}
            HeaderTopPos={5}
            onOpen={() => projects.load("BarPie")}
            button={
              <button type="button" className={toolClass} style={toolStyle("var(--cat-brand)")}>
                <ToolFace icon="finance" color="var(--cat-brand)" label="Financial Analysis" />
              </button>
            }
            body={
              <div className="row d-flex m-0">
                {chartRow && (
                  <>
                    <div className="col mb-4">
                      <DistributedColumnChart data={chartRow} activeFilter={program} />
                    </div>
                    <div className="col mb-4">
                      <SimplePieChart
                        data={{
                          totalRevenueCost: chartRow.totalRevenueCost,
                          totalCapitalCost: chartRow.totalCapitalCost,
                        }}
                        activeFilter={program}
                      />
                    </div>
                  </>
                )}
              </div>
            }
          />
        )}

        {!isSpecial && (
          <Link href="/vehicle-tracking" target="_blank" className={toolClass} style={toolStyle("var(--cat-cyan)")}>
            <ToolFace icon="car" color="var(--cat-cyan)" label="Vehicle Tracking" />
          </Link>
        )}

        {!isSpecial && (
          <Link href="/staff-tracking" target="_blank" className={toolClass} style={toolStyle("var(--cat-violet)")}>
            <ToolFace icon="userPin" color="var(--cat-violet)" label="Staff Tracking" />
          </Link>
        )}

        {!isSpecial && (
          <VisitsPlan
            getProjectsList={projects.load}
            projectsData={projects.projectsData ?? []}
            setProjectsData={projects.setProjectsData}
            buttonColumn="d-grid"
            trigger={
              <button type="button" className={toolClass} style={toolStyle("var(--cat-rose)")}>
                <ToolFace icon="route" color="var(--cat-rose)" label="Visits Plan" />
              </button>
            }
          />
        )}

        {isPnd && (
          <ProjectsModal
            config={{
              modalId: "utilization",
              status: "TotalProject",
              label: "Utilization(20% - 80%)",
              columns: "utilization",
              rows: "utilization",
              allowLink: false,
            }}
            projects={projects}
            role={role}
            buttonColumn="d-grid"
            trigger={
              <button
                type="button"
                className={toolClass}
                style={toolStyle("var(--cat-indigo)")}
                aria-label={`Utilization 20 to 80 percent, ${data?.utilization20t080 ?? 0} projects`}
              >
                <ToolFace
                  icon="gauge"
                  color="var(--cat-indigo)"
                  label={`Utilization 20–80% (${fmt(data?.utilization20t080)})`}
                  badge={canSeeUtilizationGap && data ? unvisited : undefined}
                  title="Utilization vs Schemes Visited by DGME's Team"
                />
              </button>
            }
          />
        )}

        {!isSpecial && (
          <Link href="/report-analysis" target="_blank" className={toolClass} style={toolStyle("var(--cat-slate)")}>
            <ToolFace icon="chart" color="var(--cat-slate)" label="Report Analysis" />
          </Link>
        )}

        {isPnd && canMarkToEvaluation && (
          <CustomModal
            HeaderRightPos={0}
            HeaderTopPos={17}
            buttonColumn="d-grid"
            isFullscreen
            showCloseButton
            modalId="mark to evaluation"
            button={
              <button type="button" className={toolClass} style={toolStyle("var(--good)")}>
                <ToolFace icon="shieldCheck" color="var(--good)" label="Marked To Evaluation" />
              </button>
            }
            body={
              <div className="container-fluid border-0 p-0">
                <MarkToProjects role={role} />
              </div>
            }
          />
        )}
      </div>
    </div>
  );
};

export default QuickTools;
