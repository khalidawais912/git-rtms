// PC-V (annual performance report) contract, from "Frontend guide: PC-V".
// Fields marked ASSUMED are not spelled out in the guide; check them against
// the Postman collection and fix them here (and in services/pcvApi.ts) only.
import { PcivButton, PcivPerson } from "@/features/pciv";
import { AgencyItem } from "@/features/agencies";

/** Same workflow buttons as PC-IV. */
export type PcvButton = PcivButton;
export type PcvPerson = PcivPerson;

/** GET /api/pcv/workflow/{id}/buttons (same shape as PC-IV, ASSUMED). */
export interface PcvButtonsResponse {
  pcvId?: number;
  status: number;
  statusName: string;
  withUser: string | null;
  canEdit: boolean;
  buttons: PcvButton[];
  note: string | null;
}

/** Response of every workflow button (only `statusName` is used). */
export interface PcvActionResponse {
  status: number;
  statusName: string;
}

/** One row of GET /api/PCV/GetALLPCVs (ASSUMED field names). */
export interface PcvListItem {
  id: number;
  projectName?: string | null;
  name?: string | null;
  /** 1 to 5: which year of the project this PC-V is. */
  submissionNo: number;
  status: number;
  statusName?: string | null;
  departmentName?: string | null;
  sectorName?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  completedAt?: string | null;
}

/** `pcvMain` of GET /api/PCV/GetPcVAsync. Sent back whole on Save everything. */
export interface PcvMain {
  id: number;
  /** Item 1 of the form. Set on create, never renamed. */
  projectName: string;
  submissionNo: number;
  status: number;
  statusName?: string | null;
  sectorId?: number | null;
  sponsoringAgency?: AgencyItem[] | null;
  executingAgency?: AgencyItem[] | null;
  /** ASSUMED name of the "Initiated By" name field. */
  initiatedByName?: string | null;
  /** ASSUMED name of the uploaded "Initiated By" signature path. */
  initiatedBySignaturePath?: string | null;
  completedAt?: string | null;
  /** Anything else the server sends (e.g. location) is kept and sent back as it came. */
  [key: string]: unknown;
}

/** A photo on chapter 5 or 12 (ASSUMED field names). */
export interface PcvPhoto {
  id: number;
  path: string;
  fileName?: string | null;
}

/** One of chapters 2 to 16. */
export interface PcvChapter {
  chapterNo: number;
  title: string;
  subtitle: string | null;
  allowsPhotos: boolean;
  /** Quill delta as a JSON string; null or "" when empty. */
  content: string | null;
  photos: PcvPhoto[] | null;
}

/** GET /api/PCV/GetPcVAsync?pcvId= */
export interface PcvForm {
  pcvMain: PcvMain;
  chapters: PcvChapter[];
}

/** PUT /api/PcvMain/{id}. Leave a field out to keep it; [] clears that side. */
export interface PcvHeaderUpdate {
  sectorId?: number | null;
  sponsoringAgencyIds?: number[];
  executingAgencyIds?: number[];
  initiatedByName?: string;
}

export type PcvBlockedReason =
  | "openPcv"
  | "notOpenYet"
  | "allSubmissionsUsed"
  | "missingCompletionDate"
  | "nameRequired";

/** `data` of POST /api/PcvMain: the new PC-V, or (409) why it was refused. */
export interface PcvCreateResult {
  id: number;
  name: string;
  submissionNo: number;
  blockedReason?: PcvBlockedReason | null;
  /** Server local time, no offset. Show the date part only. */
  nextSubmissionOpensOn?: string | null;
  openPcvId?: number | null;
}
