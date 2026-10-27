"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buildFilters, ROLES } from "../constants";
import { fetchProjectsByStatus } from "../services";
import { ColumnSet, FilterData, Program, ProjectsList } from "../types";

type Key = keyof ProjectsList;

/** Columns of each table, in the order the backend sends them unless noted */
const pick = (row: ProjectsList, allowed: (string | false)[]) =>
  Object.keys(row).filter((k) => allowed.includes(k)) as Key[];

const buildColumns = (
  set: ColumnSet,
  row: ProjectsList,
  isSpecial: boolean,
  program: Program,
): Key[] => {
  const cmAdp = pick(row, [
    "gSno", "projectName", "sectorName", "districtName", "cost", "revisedAllocation",
    "pnDReleases", "utilization", "utilPercent", !isSpecial && "visitCount",
  ]);

  switch (set) {
    case "cmAdp":
      return cmAdp;
    case "cmInitiative":
      // CM Initiatives table adds the "Marked to Evaluation" toggle
      return program === "cmInitiative" && !isSpecial && "markToEvaluation" in row
        ? [...cmAdp, "markToEvaluation" as Key]
        : cmAdp;
    case "utilization": {
      // Fixed order, only keys the rows actually have
      const base = [
        "gSno", "projectName", "sectorName", "districtName", "cost",
        "revisedAllocation", "pnDReleases", "utilization", "utilPercent",
      ];
      const visits = isSpecial
        ? []
        : [
            "scheduleVisitCount", "completeVisitCount", "submittedVisitCount", "visitCount",
            "latestIssuedReport", "datesOfIssuedReports", "issuedReportDistrict",
            "issuedReportActualPhysicalPrograss", "latestIssuedReportCostOverRun",
            "latestIssuedReportTimeOverRun", "markToEvaluation",
          ];
      return [...base, ...visits].filter((k) => k in row) as Key[];
    }
    case "noOfProjects":
      return pick(row, [
        "gSno", "projectName", "sectorName", "districtName", !isSpecial && "visitCount",
        "userName", "reportCompletion", "visitStartDate", "completedDate",
        !isSpecial && "deadline", "fileGenrated",
      ]);
    case "reports":
      return pick(row, [
        "gSno", "projectName", "sectorName", "districtName", "userName", "reportCompletion",
        "visitStartDate", "completedDate", !isSpecial && "deadline", "reportStatus", "statusDate",
      ]);
    case "visits":
      return pick(row, [
        "gSno", "projectName", "sectorName", "districtName", "userName",
        "visitStartDate", "completedDate", "reportStatus",
      ]);
  }
};

/** Project list behind every card: loaded by status with the current filters */
export const useProjectsList = (program: Program, otherFilters: FilterData[], role: string) => {
  const [projectsData, setProjectsData] = useState<ProjectsList[]>();
  const isSpecial = role.toLowerCase() === ROLES.special;

  const load = useCallback(
    async (status: string) => {
      setProjectsData([]);
      try {
        setProjectsData(await fetchProjectsByStatus(status, buildFilters(program, otherFilters)));
      } catch (err) {
        console.error("Projects list error:", err);
      }
    },
    [program, otherFilters],
  );

  // First load feeds the Utilization badge
  useEffect(() => {
    load("TotalProject");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Every row with utilPercent = (expUpToJune + utilization) / cost */
  const withUtilization = useMemo(
    () =>
      (projectsData ?? []).map((p) => ({
        ...p,
        utilPercent: Math.round(((p.expUpToJune + p.utilization) / p.cost) * 100),
      })),
    [projectsData],
  );

  const utilizationRows = useMemo(
    () => withUtilization.filter((p) => p.utilPercent >= 20 && p.utilPercent <= 80),
    [withUtilization],
  );

  const columns = (set: ColumnSet): Key[] | false =>
    !!projectsData && projectsData.length > 0 && buildColumns(set, projectsData[0], isSpecial, program);

  return {
    projectsData,
    setProjectsData,
    load,
    withUtilization,
    utilizationRows,
    columns,
  };
};

export type ProjectsListState = ReturnType<typeof useProjectsList>;
