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
  /**
   * Several agencies are joined with ", "; null when there are none.
   * The response also has `sponsoringAgency` / `executingAgency` lists ({ agencyId, agencyName }),
   * left out here because this screen only shows the names.
   */
  sponsoringAgencyName: string | null;
  executingAgencyName: string | null;
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
}

export interface ProjectsTableProps {
  projectsData: ProjectsList[];
  setProjectsData: Dispatch<SetStateAction<ProjectsList[] | undefined>>;
  label: string;
  keys: (keyof ProjectsList)[];
  role: string;
  allowLink?: boolean;
}
