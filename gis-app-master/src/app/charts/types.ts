export interface AssignedProject {
  userName: string;
  totalAssignedProjects: number;
}

export interface EvaluationTotalProject {
  userName: string;
  totalAssignedProjects: number;
}

export interface SNEProject {
  userName: string;
  totalAssignedProjects: number;
}

export interface OfficerWiseVisits {
  officerName: string;
  scheduledCount: number;
  completedCount: number;
  cancelledCount: number;
}

export interface DistrictProject {
  districtName: string;
  totalProject: number;
}

export interface Stats {
  summary: {
    totalProjects: number;
    totalVisit: number;
    unassignedProjects: number;
    scheduleProjects: number;
    completedProjects: number;
    submmittedProjects: number;
    refferBackProjects: number;
    approvedByDGProjects: number;
    issuedProjects: number;
    cancelProjects: number;
  };
  assignedProjects: AssignedProject[];
  evaluationTotalProject: EvaluationTotalProject[];
  isSNEProjectCount: SNEProject[];
  officerWiseVisits: OfficerWiseVisits[];
  districtProjects: DistrictProject[];
}
