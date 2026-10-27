import { DashboardTypeEnum } from "@/types/dashboard";
import { ReportHistoryUser } from "@/features/users";

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

export interface ListProps {
  dashbaordType: DashboardTypeEnum | undefined;
  users: ReportHistoryUser[];
  refresh: boolean;
}
