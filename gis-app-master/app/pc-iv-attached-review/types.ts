import { Dispatch, SetStateAction } from "react";
import { Officer, ReportHistoryUser } from "@/features/users";

export interface ReportHistory {
  id: number;
  pcIv_id: number;
  mark_From: number;
  mark_to: number;
  remarks: string;
  mark_date: string;
  pciv_pdf_path: string;
  status: number;
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
  pcivId: number;
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
  users: ReportHistoryUser[];
  officers: Officer[];
  deputyDirectors: Officer[];
  directors: Officer[];
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  loggedInUsername: string;
}
