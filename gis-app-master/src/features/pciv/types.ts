// PC-IV workflow contract (backend "PC-IV frontend integration guide").
// Field names match the API JSON exactly, including its spellings.

/** Workflow buttons the server can offer, in the order it returns them. */
export type PcivButton = "submit" | "forward" | "referBack" | "complete" | "cancel";

/** GET /api/pciv/workflow/{id}/buttons */
export interface PcivButtonsResponse {
  pcivId: number;
  status: number;
  statusName: string;
  /** Who has the PC-IV now; null when no single person (e.g. any Secretary). */
  withUser: string | null;
  canEdit: boolean;
  buttons: PcivButton[];
  /** Warning to show above the buttons, e.g. a missing signature. */
  note: string | null;
}

/** GET /api/pciv/workflow/{id}/forward-to */
export interface PcivPerson {
  userId: number;
  name: string;
  designation: string;
}

/** Response of every workflow button. */
export interface PcivActionResponse {
  pcivId: number;
  action: number;
  status: number;
  statusName: string;
  holder: PcivPerson | null;
  pdfPath: string | null;
  trailId: number;
  evaluationProjectId: number | null;
}

/** GET /api/pciv/workflow/history (newest first). */
export interface PcivReportTrail {
  id: number;
  pcIv_id: number;
  mark_From: number;
  mark_to: number;
  remarks: string | null;
  mark_date: string;
  pciv_pdf_path: string | null;
  status: number;
  /** null on rows from the previous workflow. */
  from_status: number | null;
  action: number | null;
  actor_role: string | null;
}

/** GET /api/pciv/workflow/signatures (newest first). */
export interface PcivSignature {
  id: number;
  pcivId: number;
  /** 1 Initiated By, 2 Department user, 3 Secretary. */
  stage: number;
  signedByUserId: number;
  name: string;
  designation: string;
  signaturePath: string;
  signedAt: string;
  trailId: number;
  isActive: boolean;
}

/** One row of GET /api/pciv/workflow/submitted-reports (the inbox). */
export interface PcivInboxReport {
  id: number;
  visitId: number | null;
  pcivId: number;
  projectId: number | null;
  submittedFrom: number | null;
  submittedTo: number | null;
  remarks: string | null;
  projectName: string;
  gsNo: string;
  reportPath: string;
  status: number;
  statusName?: string;
  submittedDate: string;
  issuanceDate: string | null;
  reportType: number;
  intiallyUserId: number;
  intiallyUser: string;
  intiallyDesignation: string;
  isFocalPerson: boolean;
  /** `action` of the newest history row; filled only by lists that ask for it. */
  lastAction?: number | null;
}

export interface PcivSubmittedReportsResult {
  totalIssuedCount: number;
  reports: PcivInboxReport[];
}

/** Fields of an inbox row the list tabs need. */
export interface PcivInboxRow {
  status: number;
  submittedFrom: number | null;
  submittedTo: number | null;
  /** Newest history `action` (1 submit, 2 refer back, 4 forward…), when loaded. */
  lastAction?: number | null;
}

/** Page-specific wording for the workflow panel; anything left out uses the defaults. */
export interface PcivPanelLabels {
  buttons?: Partial<Record<PcivButton, string>>;
  /** Text before the single forward person, e.g. "Mark To". */
  forwardTo?: string;
}

export interface PcivInboxTab<T> {
  id: number;
  label: string;
  pending?: boolean;
  count: number;
  filteredData: T[];
}
