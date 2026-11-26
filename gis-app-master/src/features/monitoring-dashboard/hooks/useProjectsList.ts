"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { buildFilters, ROLES } from "../constants";
import { fetchProjects800M, fetchProjectsByStatus } from "../services";
import { ColumnSet, FilterData, Program, ProjectsList } from "../types";

type Key = keyof ProjectsList;

const withPercent = (rows: ProjectsList[]) =>
  rows.map((p) => ({
    ...p,
    utilPercent: Math.round(((p.expUpToJune + p.utilization) / p.cost) * 100),
  }));

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

  /** Shows a list in the open table: empty while it loads */
  const show = useCallback(
    async (get: (filters: FilterData[]) => Promise<ProjectsList[]>) => {
      setProjectsData([]);
      try {
        setProjectsData(await get(buildFilters(program, otherFilters)));
      } catch (err) {
        console.error("Projects list error:", err);
      }
    },
    [program, otherFilters],
  );

  const load = useCallback((status: string) => show((f) => fetchProjectsByStatus(status, f)), [show]);

  /**
   * The CM Initiatives tile's 800M+ lists. The server's utilization % counts actExpUpTo (spent up to last
   * 30 June), so the table's "Expenditure + Utilization" column shows that too and agrees with the %.
   */
  const load800M = useCallback(
    (withUtilization: boolean) =>
      show(async (f) =>
        (await fetchProjects800M(withUtilization, f)).map((p) => ({ ...p, expUpToJune: p.actExpUpTo ?? p.expUpToJune })),
      ),
    [show],
  );

  /** Every project with the current filters; kept apart, as opening a card replaces projectsData */
  const [allRows, setAllRows] = useState<ProjectsList[]>();

  // Every project, again when the programme or filters change: feeds the Utilization badge (first load)
  useEffect(() => {
    let live = true;
    setAllRows(undefined);
    fetchProjectsByStatus("TotalProject", buildFilters(program, otherFilters))
      .then((rows) => {
        if (!live) return;
        setAllRows(rows);
        setProjectsData((now) => now ?? rows);
      })
      .catch((err) => console.error("Projects list error:", err));
    return () => {
      live = false;
    };
  }, [program, otherFilters]);

  /** Every row with utilPercent = (expUpToJune + utilization) / cost */
  const withUtilization = useMemo(() => withPercent(projectsData ?? []), [projectsData]);

  /** Projects with 20% or more of the cost used (Quick tools: Utilization ≥ 20%) */
  const utilizationRows = useMemo(() => withUtilization.filter((p) => p.utilPercent >= 20), [withUtilization]);

  /** Of every project, those with 20% or more used that the DGME team has not visited; undefined while loading */
  const unvisitedUtilization = useMemo(
    () =>
      allRows ? withPercent(allRows).filter((p) => p.utilPercent >= 20 && !(p.visitCount > 0)).length : undefined,
    [allRows],
  );

  const columns = (set: ColumnSet): Key[] | false =>
    !!projectsData && projectsData.length > 0 && buildColumns(set, projectsData[0], isSpecial, program);

  return {
    projectsData,
    setProjectsData,
    load,
    load800M,
    withUtilization,
    utilizationRows,
    unvisitedUtilization,
    columns,
  };
};

export type ProjectsListState = ReturnType<typeof useProjectsList>;
