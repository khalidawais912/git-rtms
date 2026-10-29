import { Dispatch, SetStateAction } from "react";

export interface DistrictList {
  id: number;
  districtName: string;
  divisionName: string;
  latitude: string;
  longitude: string;
  submittedPCIVs: number;
  visitedPCIVs: number;
  notVisitedPCIvs: number;
  successful: number;
  partiallySuccessful: number;
  notSuccessful: number;
}

export interface EvaluationMainDashboard {
  totalSubmittedPCIvs: number;
  snEs: number;
  nonSNEs: number;
  pCivInProgress: number;
  assignedToEvaluator: number;
  refferBackPcIV: number;
  noOfVisitsMultipleSitesOrUmbrella: number;
  noOfVisitsMultipleSitesOrUmbrellaTotalSNEs: number;
  noOfVisitsMultipleSitesOrUmbrellaTotalNonSNEs: number;
  noOfVisitsSingle: number;
  noOfVisitsSingleTotalSNEs: number;
  noOfVisitsSingleTotalNonSNEs: number;
  successful: number;
  partiallySuccessful: number;
  notSuccessful: number;
  reportsInProgress: number;
  utilization80OrAbove: number;
  projectsList: [
    {
      id: number;
      gSno: string;
      projectName: string;
      districtName: string;
      latitude: string;
      longitude: string;
    },
  ];
  districtList: DistrictList[];
}

export interface ProjectsList {
  id: number;
  pcIvmainId: number;
  name: string;
  gsNo: string;
  sectorId: number;
  sectorName: string;
  visitStartDate: string;
  visitEndDate: string;
  cost: number;
  userName: string;
  designation: string;
  visitId: number;
  approvalDate: string;
  sponsoringAgencyName: string;
  sponsring_agency_id: number;
  executingAgencyName: string;
  executing_agency_id: number;
  city: string;
  division_Id: number;
  divisionName: string;
  districtId: number;
  districtName: string;
  isSNE: true;
  isPCIVSubmitted: true;
  pcivSubmittedDate: string;
  status: string;
  visitCount: number;
  maxMRIValue: number;
  avgMRIValue: number;
  hasVisited: true;
  // Sent for some statuses only (reports, utilization)
  reportCompletion: number;
  completedDate: string;
  utilization: number;
  expUpToJune: number;
  utilPercent: number;
  submittedDate: string;
  deadline: string;
  reportStatus: number;
  statusDate: string;
}

export interface ProjectsTableProps {
  projectsData: ProjectsList[];
  setProjectsData: Dispatch<SetStateAction<ProjectsList[] | undefined>>;
  label: string;
  keys: (keyof ProjectsList)[];
  role: string;
  allowLink?: boolean;
}
