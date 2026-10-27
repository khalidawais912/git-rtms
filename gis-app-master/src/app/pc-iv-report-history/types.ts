export interface ReportHistory {
  id: number;
  pcIv_id: number;
  mark_From: number;
  mark_to: number;
  remarks: string;
  pciv_pdf_path: string;
  status: number;
  mark_date: string;
}

export interface SuggestionPopup {
  word: string;
  suggestions: string[];
  x: number;
  y: number;
  from: number;
  to: number;
}

export interface SubmittedReport {
  id: number;
  visitId: number;
  pcivId: number;
  projectId: number;
  submittedFrom: number;
  submittedTo: number;
  remarks: string;
  projectName: string;
  gsNo: string;
  reportPath: string;
  status: number;
  submittedDate: string;
  issuanceDate: string;
  reportType: number;
  intiallyUserId: number;
  intiallyUser: string;
  intiallyDesignation: string;
  isFocalPerson: boolean;
}

export interface SubmittedReportResponse {
  totalIssuedCount: number;
  reports: SubmittedReport[];
}

export interface Tab {
  id: number;
  label: string;
  status: number;
  role: string;
  reportSubmittedFrom?: number;
  reportSubmittedTo?: number;
  count: number;
  filteredData: SubmittedReport[] | undefined;
}
