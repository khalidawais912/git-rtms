import type { Attributes, Groups } from "@/app/project-details-dashboard/types";
import type { StaffTracking } from "@/app/staff-tracking/components/StaffTracking";

export interface FilterData {
  filterIdentifier: string;
  filterValues: string;
}

export interface RangeType {
  startDate: Date | undefined;
  endDate: Date | undefined;
  key: string;
}

export interface Filter {
  label: string;
  filterIdentifier: string;
  dataType: string;
  filterValues: [string];
}

export interface DistrictProjects {
  id: number;
  superGroupID: number;
  smdpProjectID: number;
  name: string;
  sectorId: number;
  address: string;
  city: string;
  division: string;
  districtId: number;
  latitude: string;
  longitude: string;
  locationCoordinates: string;
  status: string;
  approvalDate: string;
}

export interface MarkEvaluationProject {
  id: number;
  projectId: number;
  projectName: string;
  pciCost: number;
  utilization: number;
  physicalProgress: number;
  totalMonitoringVisit: number;
  requestForPCIV: false;
  letterofRequestPCIV: string;
  requestForPCIVDate: string;
  submittedPCIVDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SectorItem {
  id: number;
  title: string;
}

export interface Project {
  id: number;
  superGroupID: number;
  smdpProjectID: number;
  name: string;
  sectorId: number;
  address: string;
  city: string;
  locationCoordinates: string;
  status: string;
  sectorName: string;
  groups: Groups[];
  attributes: Attributes[];
  evaluationFormula: string;
  evaluationFormulaWeightage: number;
  remarks: string;
  weightage: number;
  readOnly: number;
  sortId: number;
  attributeCode: string;
  smdpIdentifier: string;
}

export interface FilterParams {
  districtName?: string;
  sectorName?: string;
  userName?: string;
  startDate?: string;
  endDate?: string;
  reportStatus?: number;
}

export interface StartEndLatLng {
  visit: {
    visitID: number;
    visitStartTime: string;
    startLatLng: {
      latitude: string;
      longitude: string;
      createdAt: string;
    };
    endLatLng: {
      latitude: string;
      longitude: string;
      createdAt: string;
    };
  };
}

export interface StaffTrackingData {
  data: StaffTracking[];
}

export interface Report {
  rowLabels: "";
  no?: "";
  yes?: "";
  grandTotal?: "14";
  ["1%"]?: "";
  ["100%"]?: "";
  ["15%"]?: "";
  ["22%"]?: "";
  ["28%"]?: "";
  ["34%"]?: "";
  ["63%"]?: "";
  ["73%"]?: "";
}

export interface props {
  data: Report[];
  groups: Report[];
}
