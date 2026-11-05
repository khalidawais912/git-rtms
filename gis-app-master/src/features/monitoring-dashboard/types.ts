import type { ProjectsList } from "@/app/dashboard/components/ProjectsTable/ProjectsTable";
import type { DistrictProjects, Filter, FilterData } from "@/app/dashboard/types";

export type { DistrictProjects, Filter, FilterData, ProjectsList };

/** Programme switch at the top of the dashboard */
export type Program = "cmInitiative" | "adp";

export interface DistrictList {
  id: number;
  districtName: string;
  divisionName: string;
  latitude: string;
  longitude: string;
  approved: number;
  unApproved: number;
  dropped: number;
  good: number;
  average: number;
  crtical: number;
}

/** Response of POST /api/MainDashboard (field names, typos included, come from the backend) */
export interface MainDashboard {
  totalProjects: number;
  monitoredProjects: number;
  inProcessProjects: number;
  defineLimitProjects: number;
  needConsidrationProjects: number;
  criticalProjects: number;
  approvedCost: number;
  expenditure: number;
  progress: number;
  noofProject: number;
  approved: number;
  unapproved: number;
  dropped: number;
  umbralla: number;
  single: number;
  utilization20t080: number;
  a0to200: number;
  a200to400: number;
  a400to800: number;
  a800to1000: number;
  a100above: number;
  projectslist: null;
  disitrictlist: DistrictList[];
  officerReports: {
    issued: number;
    approved: number;
    submitted: number;
    referBack: number;
    completed: number;
    scheduled: number;
    cancelled: number;
  };
}

/** Which column set a projects table shows */
export type ColumnSet =
  | "cmAdp"
  | "cmInitiative"
  | "utilization"
  | "noOfProjects"
  | "reports"
  | "visits";

/** One card that opens the projects table for a status */
export interface ProjectsModalConfig {
  modalId: string;
  status: string;
  label: string;
  columns: ColumnSet;
  /** Table rows: the raw list, all rows with utilPercent, or only the 20–80% rows */
  rows?: "raw" | "withUtilization" | "utilization";
  allowLink?: boolean;
}
