import apiClient, { AxiosError } from "@/services/client";
import {
  GENERATE_REPORT_API,
  PCV_API,
  PCV_MAIN_API,
  PCV_WORKFLOW_API,
} from "@/services/endpoints";
import { BaseResponse } from "@/services/types";
import { PcivInboxReport, PcivReportTrail, PcivSubmittedReportsResult } from "@/features/pciv";
import {
  PcvActionResponse,
  PcvButton,
  PcvButtonsResponse,
  PcvCreateResult,
  PcvForm,
  PcvHeaderUpdate,
  PcvListItem,
  PcvMain,
  PcvPerson,
} from "../types";

/**
 * The server answers with HTTP 200 and puts the result in `responseCode`
 * (400 validation, 403 not allowed, 404 not found, 409 wrong step / locked / year not open).
 * Anything but success becomes a PcvApiError whose message can be shown as it is;
 * `data` keeps the response data (e.g. `blockedReason` on a refused create).
 */
export class PcvApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
    this.name = "PcvApiError";
  }
}

const request = async <T>(
  call: Promise<{ data: BaseResponse<T> }>,
  /** The responseCode that means success (1 for the PDF preview). */
  okCode = 200,
): Promise<T> => {
  try {
    const { data } = await call;
    if (data.responseCode === okCode) return data.data;
    throw new PcvApiError(data.responseCode, data.responseMessage, data.data);
  } catch (err) {
    if (err instanceof PcvApiError) throw err;
    const response = (err as AxiosError<Partial<BaseResponse<unknown>>>).response;
    if (response?.status === 401) {
      throw new PcvApiError(401, "Your session has expired. Please log in again.");
    }
    throw new PcvApiError(
      response?.data?.responseCode ?? response?.status ?? 0,
      response?.data?.responseMessage ?? "Something went wrong.",
      response?.data?.data,
    );
  }
};

const multipart = { headers: { "Content-Type": "multipart/form-data" } };

/* ---------- list and create ---------- */

/** PC-Vs of the token's department; `mine` = only the ones this user created. */
export const getPcvList = async (mine: boolean) =>
  (await request<PcvListItem[] | null>(
    apiClient.get(`${PCV_API}/GetALLPCVs`, { params: { mine } }),
  )) ?? [];

/**
 * Creates the next PC-V of a project. On 409 the error's `data` is a
 * PcvCreateResult whose `blockedReason` says why (see the create modal).
 * ASSUMED body: `{ id: 0, name }`.
 */
export const createPcv = (name: string) =>
  request<PcvCreateResult>(apiClient.post(PCV_MAIN_API, { id: 0, name: name.trim() }));

/* ---------- the form ---------- */

export const getPcv = async (pcvId: number): Promise<PcvForm> => {
  const form = await request<PcvForm>(
    apiClient.get(`${PCV_API}/GetPcVAsync`, { params: { pcvId } }),
  );
  return {
    pcvMain: form.pcvMain,
    chapters: [...(form.chapters ?? [])]
      .map((c) => ({ ...c, photos: c.photos ?? [] }))
      .sort((a, b) => a.chapterNo - b.chapterNo),
  };
};

/** Saves one chapter (2 to 16) only; the header is not touched. ASSUMED body. */
export const saveChapter = (pcvId: number, chapterNo: number, content: string) =>
  request<unknown>(
    apiClient.post(
      `${PCV_API}/SaveOrUpdatePcVAsync`,
      { pcvId, chapterNo, content },
      { params: { headId: chapterNo } },
    ),
  );

/**
 * Saves the header and every chapter. Send the whole `pcvMain` from the GET:
 * a body with only the id clears Initiated By and location. ASSUMED body shape.
 */
export const saveAllPcv = (
  pcvMain: PcvMain,
  chapters: { chapterNo: number; content: string }[],
) => request<unknown>(apiClient.post(`${PCV_API}/SaveAllPcVAsync`, { pcvMain, chapters }));

/** Header and agencies. Leave a field out to keep it; a new project name is rejected. */
export const updatePcvHeader = (pcvId: number, update: PcvHeaderUpdate) =>
  request<unknown>(apiClient.put(`${PCV_MAIN_API}/${pcvId}`, update));

/** The "Initiated By" signature (PNG, JPG or WEBP). */
export const uploadInitiatedBySignature = (pcvId: number, file: File) => {
  const body = new FormData();
  body.append("PcvId", String(pcvId));
  body.append("Type", "initiatedBy");
  body.append("File", file);
  return request<unknown>(apiClient.post(`${PCV_API}/UploadSignatureAsync`, body, multipart));
};

/** A photo on chapter 5 or 12 (the chapters with `allowsPhotos`). ASSUMED field names. */
export const uploadChapterPhoto = (pcvId: number, chapterNo: number, file: File) => {
  const body = new FormData();
  body.append("PcvId", String(pcvId));
  body.append("ChapterNo", String(chapterNo));
  body.append("File", file);
  return request<unknown>(apiClient.post(`${PCV_API}/UploadChapterPhotoAsync`, body, multipart));
};

export const deleteChapterPhoto = (photoId: number) =>
  request<unknown>(
    apiClient.delete(`${PCV_API}/DeleteChapterPhotoAsync`, { params: { photoId } }),
  );

/** Builds the PDF; success is responseCode 1 with the file path in `data`. */
export const generatePcvPreview = (pcvId: number) =>
  request<string>(
    apiClient.post(`${GENERATE_REPORT_API}/GenerateReportPCV`, null, { params: { pcvId } }),
    1,
  );

/* ---------- workflow (same as PC-IV, under /api/pcv/workflow) ---------- */

/** ASSUMED: the button paths match PC-IV's. */
const BUTTON_PATH: Record<PcvButton, string> = {
  submit: "submit",
  forward: "forward",
  referBack: "refer-back",
  complete: "complete",
  cancel: "cancel",
};

export const getPcvButtons = (pcvId: number) =>
  request<PcvButtonsResponse>(apiClient.get(`${PCV_WORKFLOW_API}/${pcvId}/buttons`));

/** People the PC-V can be submitted or forwarded to; [] when none. */
export const getPcvForwardTargets = async (pcvId: number) =>
  (await request<PcvPerson[] | null>(
    apiClient.get(`${PCV_WORKFLOW_API}/${pcvId}/forward-to`),
  )) ?? [];

export const pressPcvButton = (
  pcvId: number,
  button: PcvButton,
  body: { remarks?: string; toUserId?: number },
) =>
  request<PcvActionResponse>(
    apiClient.post(`${PCV_WORKFLOW_API}/${pcvId}/${BUTTON_PATH[button]}`, {
      remarks: body.remarks || null,
      ...(button === "submit" || button === "forward" ? { toUserId: body.toUserId ?? null } : {}),
    }),
  );

/**
 * PC-Vs this user has now, or last acted on (the reviewers' list).
 * ASSUMED: same path and shape as PC-IV's submitted-reports, with `pcvId` in each row.
 * Rows are returned in the PC-IV shape (`pcivId` = the PC-V id) so one list can show both.
 */
export const getPcvInbox = async (userId: number): Promise<PcivSubmittedReportsResult> => {
  type Row = PcivInboxReport & { pcvId?: number };
  try {
    const result = await request<{ totalIssuedCount?: number; reports?: Row[] | null } | null>(
      apiClient.get(`${PCV_WORKFLOW_API}/submitted-reports`, { params: { userId } }),
    );
    return {
      totalIssuedCount: result?.totalIssuedCount ?? 0,
      reports: (result?.reports ?? []).map((r) => ({ ...r, pcivId: r.pcvId ?? r.pcivId })),
    };
  } catch (err) {
    if (err instanceof PcvApiError && err.code === 404) return { totalIssuedCount: 0, reports: [] };
    throw err;
  }
};

/**
 * Newest first; [] when none. ASSUMED: same path and shape as PC-IV's history,
 * with the PDF in `pcv_pdf_path` (returned as `pciv_pdf_path` so one view shows both).
 */
export const getPcvHistory = async (pcvId: number): Promise<PcivReportTrail[]> => {
  type Row = PcivReportTrail & { pcv_pdf_path?: string | null; pcV_id?: number };
  try {
    const rows = await request<Row[] | null>(
      apiClient.get(`${PCV_WORKFLOW_API}/history`, { params: { pcvId } }),
    );
    return (rows ?? []).map((r) => ({ ...r, pciv_pdf_path: r.pcv_pdf_path ?? r.pciv_pdf_path ?? null }));
  } catch (err) {
    if (err instanceof PcvApiError && err.code === 404) return [];
    throw err;
  }
};

/** Stored files come back as server paths; this makes them openable. */
export const pcvFileUrl = (path?: string | null) =>
  path ? `${process.env.NEXT_PUBLIC_BACKEND_API}${path}` : undefined;
