import type { ProjectsList } from "@/app/dashboard/components/Evaluation/types";
import { PCV_MAX_SUBMISSIONS, PCV_STATUS, PCV_STATUS_NAME, PcvListItem, PcvOverviewItem, pcvNameOf } from "@/features/pcv";
import { ProformaType } from "./adapters";
import { formatDate } from "./utils";

/** One row of the PC-IV / PC-V projects table, the same shape for both types. */
export interface ProjectRow {
  id: number;
  name: string;
  /** Small line under the name, e.g. "Completed 30 Jun 2023". */
  nameNote: string;
  gs: string;
  sector: string;
  /** Rs million; undefined when the server does not send it. */
  cost?: number;
  sponsor: string;
  exec: string;
  city: string;
  division: string;
  district: string;
  sne?: boolean;
  /** PC-V only: "Year 2 of 5". */
  year: string;
  /** PC-V only: the financial year reported on, "FY 2025-26", shown above the year. */
  fy: string;
  /** PC-V only: when that year's report is due, "31 Jul 2026". */
  due: string;
  status: string;
  /** PC-V: the proforma PDF, opened from the name. */
  pdfPath?: string;
  /** PC-IV: the id its PDF is generated from, opened from the name. */
  pc4PdfId?: number;
}

export type ColumnKey = keyof Omit<ProjectRow, "nameNote" | "fy" | "pdfPath" | "pc4PdfId">;

export interface Column {
  key: ColumnKey;
  label: string;
  /** Cell style: name, gs, wide text or a right-aligned number. */
  kind?: "name" | "gs" | "wide" | "num";
}

/** Same columns, labels and order as the design. */
export const COLUMNS: Record<ProformaType, Column[]> = {
  pc4: [
    { key: "id", label: "ID" },
    { key: "name", label: "Name", kind: "name" },
    { key: "gs", label: "GS No.", kind: "gs" },
    { key: "sector", label: "Sector Name", kind: "wide" },
    { key: "cost", label: "Cost (Rs M)", kind: "num" },
    { key: "sponsor", label: "Sponsoring Agency", kind: "wide" },
    { key: "exec", label: "Executing Agency", kind: "wide" },
    { key: "city", label: "City" },
    { key: "division", label: "Division" },
    { key: "district", label: "District" },
    { key: "sne", label: "Is SNE" },
    { key: "status", label: "Status" },
  ],
  pc5: [
    { key: "id", label: "ID" },
    { key: "name", label: "Name", kind: "name" },
    { key: "gs", label: "GS No.", kind: "gs" },
    { key: "sector", label: "Sector Name", kind: "wide" },
    { key: "sponsor", label: "Sponsoring Agency", kind: "wide" },
    { key: "exec", label: "Executing Agency", kind: "wide" },
    { key: "district", label: "District" },
    { key: "year", label: "Report Year" },
    { key: "due", label: "Due By" },
    { key: "cost", label: "Actual Cost (Rs M)", kind: "num" },
    { key: "status", label: "Status" },
  ],
};

const text = (v: unknown) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v));

/** A PC-IV project from GetProjectsListByStatus. */
export const pc4Row = (p: ProjectsList): ProjectRow => ({
  id: p.id,
  name: text(p.name),
  nameNote: "",
  gs: text(p.gsNo),
  sector: text(p.sectorName),
  cost: typeof p.cost === "number" ? p.cost : undefined,
  sponsor: text(p.sponsoringAgencyName),
  exec: text(p.executingAgencyName),
  city: text(p.city),
  division: text(p.divisionName),
  district: text(p.districtName),
  sne: typeof p.isSNE === "boolean" ? p.isSNE : undefined,
  year: "",
  fy: "",
  due: "",
  status: text(p.status),
  pc4PdfId: p.pcIvmainId || undefined,
});

/**
 * The table opened from a dashboard tile: PC-IV by the dashboard's filter (the same one its
 * old pop-up table used), PC-V by status. The first two are Secretary tiles, the rest
 * Evaluation Dashboard tiles.
 */
export type ProjectView = "submittedToDgme" | "takeUp" | "submittedByDept" | "inProgress" | "assigned" | "referBack";

export interface ProjectViewInfo {
  title: string;
  pc4Filter: string;
  pc5Statuses: number[];
  /** The dashboard the tile is on, for "Back to Dashboard". */
  back: string;
  /** An Evaluation Dashboard tile: the list keeps ?dashboardType=EVALUATION, so the top bar stays on Evaluation. */
  evaluation?: boolean;
}

const SECRETARY = "/dashboard";
const EVALUATION = "/dashboard?dashboardType=EVALUATION";

export const PROJECT_VIEWS: Record<ProjectView, ProjectViewInfo> = {
  submittedToDgme: { title: "Submitted To DGM&E", pc4Filter: "inprogress", pc5Statuses: [PCV_STATUS.APPROVED_BY_SECRETARY], back: SECRETARY },
  takeUp: { title: "Take-up for Evaluation", pc4Filter: "inprogress", pc5Statuses: [PCV_STATUS.MARKED_TO_EVALUATION], back: SECRETARY },
  submittedByDept: { title: "Submitted by Department", pc4Filter: "all", pc5Statuses: [PCV_STATUS.SUBMITTED], back: EVALUATION, evaluation: true },
  inProgress: {
    title: "In Progress",
    pc4Filter: "inprogress",
    pc5Statuses: [PCV_STATUS.APPROVED_BY_SECRETARY, PCV_STATUS.APPROVED_BY_DG],
    back: EVALUATION,
    evaluation: true,
  },
  assigned: { title: "Assigned", pc4Filter: "inprogress", pc5Statuses: [PCV_STATUS.MARKED_TO_EVALUATION], back: EVALUATION, evaluation: true },
  referBack: { title: "Refer Back", pc4Filter: "inprogress", pc5Statuses: [PCV_STATUS.REFERRED_BACK], back: EVALUATION, evaluation: true },
};

export const isProjectView = (value: unknown): value is ProjectView =>
  typeof value === "string" && value in PROJECT_VIEWS;

const agencyNames = (list: unknown) =>
  Array.isArray(list) ? (list as { agencyName?: string }[]).map((a) => a.agencyName).filter(Boolean).join(", ") : "";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * The financial year a PC-V reports on and its due date. A PC-V is due by 31 July for the
 * financial year (July to June) that just ended, so one submitted in Nov 2026 reports on
 * FY 2025-26, due 31 Jul 2026. Empty without a submission date.
 */
export const reportYear = (submissionDate?: string | null) => {
  const d = submissionDate ? new Date(submissionDate) : null;
  if (!d || Number.isNaN(d.getTime())) return { fy: "", due: "" };
  const end = d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1;
  return { fy: `FY ${end - 1}-${String(end % 100).padStart(2, "0")}`, due: `31 ${MONTHS[6]} ${end}` };
};

/**
 * A PC-V from GetALLPCVs or /api/pcv/overview. GS No., cost and district are not in either
 * response yet: they are read if the server starts sending them; the location stands in for
 * the district.
 */
export const pc5Row = (p: PcvListItem | PcvOverviewItem): ProjectRow => {
  const extra = p as PcvOverviewItem & Record<string, unknown>;
  return {
    id: p.id,
    name: pcvNameOf(p),
    nameNote: p.completedAt ? `Completed ${formatDate(p.completedAt)}` : "",
    gs: text(extra.gsNo),
    sector: text(extra.sector) || text(p.sectorName),
    cost: typeof extra.actualCost === "number" ? extra.actualCost : undefined,
    sponsor: agencyNames(extra.sponsoringAgency),
    exec: agencyNames(extra.executingAgency),
    city: text(extra.city),
    division: text(extra.divisionName),
    district: text(extra.districtName) || text(extra.location),
    sne: undefined,
    year: p.submissionNo ? `Year ${p.submissionNo} of ${PCV_MAX_SUBMISSIONS}` : "",
    ...reportYear(extra.submissionDate),
    status: text(p.statusName) || PCV_STATUS_NAME[p.status] || "",
    pdfPath: text(extra.pcVPerformaPath) || undefined,
  };
};

export interface RowFilters {
  search: string;
  district: string;
  sector: string;
  year: string;
  status: string;
}

export const EMPTY_FILTERS: RowFilters = { search: "", district: "", sector: "", year: "", status: "" };

/** Every word of the search must appear in the row; the selects match exactly. */
export const filterRows = (rows: ProjectRow[], f: RowFilters) => {
  const words = f.search.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return rows.filter(
    (r) =>
      (!f.district || r.district === f.district) &&
      (!f.sector || r.sector === f.sector) &&
      (!f.year || r.year === f.year) &&
      (!f.status || r.status === f.status) &&
      words.every((w) =>
        [r.name, r.gs, r.sector, r.sponsor, r.exec, r.district, r.city].join(" ").toLowerCase().includes(w),
      ),
  );
};

export const sortRows = (rows: ProjectRow[], key: ColumnKey | null, dir: 1 | -1) => {
  if (!key) return rows;
  return [...rows].sort((a, b) => {
    const x = a[key];
    const y = b[key];
    if (x === y) return 0;
    if (x === undefined || x === "") return 1;
    if (y === undefined || y === "") return -1;
    return (x > y ? 1 : -1) * dir;
  });
};

export const totalCost = (rows: ProjectRow[]) => rows.reduce((n, r) => n + (r.cost ?? 0), 0);

export const money = (n: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Sorted distinct non-empty values, for the filter selects. */
export const distinct = (rows: ProjectRow[], key: "district" | "sector" | "year" | "status") =>
  Array.from(new Set(rows.map((r) => r[key]).filter(Boolean))).sort();
