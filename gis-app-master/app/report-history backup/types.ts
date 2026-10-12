export interface ReportHistory {
  id: number;
  visitId: number;
  projectId: number;
  submittedFrom: number;
  submittedTo: number;
  remarks: string;
  reportPath: string;
  status: number;
  sDate: string;
  reportType: number;
}

export interface SubmittedReport {
  id: number;
  visitId: number;
  projectId: number;
  submittedFrom: number;
  submittedTo: number;
  remarks: string;
  projectName: string;
  gsNo: string;
  reportPath: string;
  status: number;
  sDate: string;
  submittedDate: string;
  issuanceDate: string;
  reportType: number;
  lastStatus: number;
  intiallyUserId: number;
  intiallyUser: string;
  intiallyDesignation: string;
}
