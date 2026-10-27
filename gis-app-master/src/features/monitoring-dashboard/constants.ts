import {
  adpFilters,
  cmInitiativeFilters,
  oldCmInitiativeFilters,
  pastYearCmInitiativeFilters,
} from "@/app/dashboard/filters";
import { FilterData, Program } from "./types";

export const DASHBOARD_TUTORIAL =
  "https://www.youtube.com/watch?v=1wgAwCufsko&ab_channel=DirectorateGeneralMonitoringandEvaluation";

/** Roles with special dashboard rules (compare in lower case) */
export const ROLES = {
  special: "special role",
  dgmeReports: "dgme reports",
  director: "director",
  deputyDirector: "deputy director",
  superAdmin: "super admin",
} as const;

/** Programme filters plus the user's own filters, chosen by the Year filter */
export const buildFilters = (program: Program, otherFilters: FilterData[]): FilterData[] => {
  if (program === "adp") return [...adpFilters, ...otherFilters];

  const year = otherFilters.find((f) => f.filterIdentifier === "Year")?.filterValues;
  if (!year || year === "2026-2027") return [...cmInitiativeFilters, ...otherFilters];
  if (year === "2024-2025" || year === "2025-2026") {
    return [...pastYearCmInitiativeFilters, ...otherFilters];
  }
  return [...oldCmInitiativeFilters, ...otherFilters];
};

export const PROGRAM_LABEL: Record<Program, string> = {
  cmInitiative: "CM Initiatives",
  adp: "ADP Projects",
};

/** Project cost slabs: status sent to GetProjectsListByStatus and the dashboard field */
export const COST_SLABS = [
  { modalId: "0.1M", code: "DDC", range: "Rs 0.1M – 200M", status: "0to200", field: "a0to200", label: "0.1M to Up to 200M DDC Projects" },
  { modalId: "Above200M", code: "DDWP", range: "Above 200M – 400M", status: "201to400", field: "a200to400", label: "Above 200M to Up to 400M DDWP Projects" },
  { modalId: "Above400M", code: "DDSC", range: "Above 400M – 800M", status: "401to800", field: "a400to800", label: "Above 400M Up to 800M DDSC Projects" },
  { modalId: "Above800M", code: "PDWP", range: "Above 800M – 10B", status: "801to1000", field: "a800to1000", label: "Above 800M to upto 10B PDWP Projects" },
  { modalId: "10Billion", code: "CDWP", range: "Rs 10B or above", status: "1001Above", field: "a100above", label: "10 Billion or above CDWP Projects" },
] as const;

/** Map view of Punjab */
export const PUNJAB_BOUNDS: [[number, number], [number, number]] = [
  [28.0, 69.6],
  [33.9, 75.3],
];
