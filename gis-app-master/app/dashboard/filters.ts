import { FilterData } from "./components/DashboardMonitoring";

// for LIVE
export const pastYearCmInitiativeFilters: FilterData[] = [
  {
    filterIdentifier: "ProjectSubType",
    filterValues: " CM Package",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues: " CM Package, Umbrella",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues: " CM Package, Flagship / Mega Project, Umbrella",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues: " Block, CM Package",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues: " Block, CM Package, Umbrella",
  },
];

// for dev-154 and live
export const cmInitiativeFilters: FilterData[] = [
  {
    filterIdentifier: "ProjectSubType",
    filterValues: "CM Package, PM Package",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues: "CM Package, Flagship / Mega Project",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues: "CM Package, Flagship / Mega Project, Youth",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues: "CM Package, Flagship / Mega Project, Umbrella",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues: " CM Package, Flagship / Mega Project, Umbrella, Youth",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues: "CM Package, PM Package, Umbrella",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues: "Block, CM Package, PM Package",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues:
      "Block, CM Package, Flagship / Mega Project, Special Initiatives",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues: "CM Package, Flagship / Mega Project, Programme",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues: "CM Package, Flagship / Mega Project, Katcha Area Dev Prog",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues:
      "CM Package, Economic Transformation, Flagship / Mega Project",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues:
      " CM Package, Economic Transformation, Flagship / Mega Project, Youth",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues:
      "CM Package, Economic Transformation, Flagship / Mega Project, Katcha Area Dev Prog",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues:
      "CM Package, Economic Transformation, Flagship / Mega Project, Katcha Area Dev Prog, Youth",
  },
];

export const adpFilters: FilterData[] = [
  {
    filterIdentifier: "",
    filterValues: "",
  },
];

export const oldCmInitiativeFilters: FilterData[] = [
  {
    filterIdentifier: "ProjectSubType",
    filterValues: "CM Package",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues: "CM Package, Flagship / Mega Project",
  },
  {
    filterIdentifier: "ProjectSubType",
    filterValues: "CM Package, Programme",
  },
];
