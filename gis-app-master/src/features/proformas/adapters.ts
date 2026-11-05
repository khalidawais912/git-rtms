import {
  getPcivButtons,
  getPcivForwardTargets,
  getPcivHistory,
  getPcivInbox,
  PcivApiError,
  pcivFileUrl,
  PcivButton,
  PcivButtonsResponse,
  PcivPerson,
  PcivReportTrail,
  PcivSubmittedReportsResult,
  pressPcivButton,
} from "@/features/pciv";
import {
  getPcvButtons,
  getPcvForwardTargets,
  getPcvHistory,
  getPcvInbox,
  PcvApiError,
  pcvFileUrl,
  pressPcvButton,
} from "@/features/pcv";

export type ProformaType = "pc4" | "pc5";

/** A file attached to a proforma (Approved PC-I, completion certificate…). */
export interface ProformaDocument {
  id: number | string;
  name: string;
  path: string;
  /** e.g. "PDF"; taken from the file name when not sent. */
  fileType?: string;
  sizeBytes?: number;
  uploadedAt?: string;
}

export const PROFORMA_TYPES: ProformaType[] = ["pc4", "pc5"];

/** One workflow's API, so the list and the drawer work the same for PC-IV and PC-V. */
export interface ProformaAdapter {
  type: ProformaType;
  label: string;
  description: string;
  inbox: (userId: number) => Promise<PcivSubmittedReportsResult>;
  history: (id: number) => Promise<PcivReportTrail[]>;
  buttons: (id: number) => Promise<PcivButtonsResponse>;
  forwardTargets: (id: number) => Promise<PcivPerson[]>;
  press: (
    id: number,
    button: PcivButton,
    body: { remarks?: string; toUserId?: number },
  ) => Promise<{ statusName: string }>;
  fileUrl: (path?: string | null) => string | undefined;
  /**
   * Attached documents. Neither the PC-IV API nor the PC-V guide has an endpoint for them yet,
   * so both lists are empty until the backend adds one; fill it in here.
   */
  documents: (id: number) => Promise<ProformaDocument[]>;
}

// TEMP: one mock document for testing the menu, only under `next dev`. Remove it when the API comes.
const noDocuments = async (): Promise<ProformaDocument[]> =>
  process.env.NODE_ENV === "development"
    ? [
        {
          id: "mock-1",
          name: "Annual Accounts Statement (mock)",
          path: "/upload/2026-2027/Nov/PC-V/PCV_51/PCV_51_V1.pdf",
          fileType: "PDF",
          sizeBytes: 152107,
          uploadedAt: "2026-11-04T15:30:14",
        },
      ]
    : [];

export const PROFORMA_ADAPTERS: Record<ProformaType, ProformaAdapter> = {
  pc4: {
    type: "pc4",
    label: "PC-IV",
    description: "Project completion proforma",
    inbox: getPcivInbox,
    history: getPcivHistory,
    buttons: getPcivButtons,
    forwardTargets: getPcivForwardTargets,
    press: pressPcivButton,
    fileUrl: pcivFileUrl,
    documents: noDocuments,
  },
  pc5: {
    type: "pc5",
    label: "PC-V",
    description: "Yearly proforma after completion",
    inbox: getPcvInbox,
    history: getPcvHistory,
    // The PC-V buttons response has the same fields; only the id field is named differently.
    buttons: async (id) => ({ pcivId: id, ...(await getPcvButtons(id)) }),
    forwardTargets: getPcvForwardTargets,
    press: pressPcvButton,
    fileUrl: pcvFileUrl,
    documents: noDocuments,
  },
};

/** Message of an error from either API, ready to show. */
export const proformaErrorText = (err: unknown) =>
  err instanceof PcivApiError || err instanceof PcvApiError ? err.message : "Something went wrong.";

export const proformaErrorCode = (err: unknown) =>
  err instanceof PcivApiError || err instanceof PcvApiError ? err.code : undefined;

export const isProformaType = (value: unknown): value is ProformaType =>
  value === "pc4" || value === "pc5";
