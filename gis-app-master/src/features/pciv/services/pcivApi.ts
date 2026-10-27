import apiClient, { AxiosError } from "@/services/client";
import { PC_IV_WORKFLOW_API } from "@/services/endpoints";
import { BaseResponse } from "@/services/types";
import {
  PcivActionResponse,
  PcivButton,
  PcivButtonsResponse,
  PcivPerson,
  PcivReportTrail,
  PcivSignature,
  PcivSubmittedReportsResult,
} from "../types";

/**
 * The server answers almost everything with HTTP 200 and puts the real result in
 * `responseCode`. Anything but 200 becomes a PcivApiError whose message is written
 * for the end user, so screens can show it as it is.
 */
export class PcivApiError extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
    this.name = "PcivApiError";
  }
}

const request = async <T>(
  call: Promise<{ data: BaseResponse<T> }>,
  /** Returned instead of throwing when the server answers 404 ("none"). */
  whenNotFound?: T,
): Promise<T> => {
  try {
    const { data } = await call;
    if (data.responseCode === 200) return data.data;
    if (data.responseCode === 404 && whenNotFound !== undefined) {
      return whenNotFound;
    }
    throw new PcivApiError(data.responseCode, data.responseMessage);
  } catch (err) {
    if (err instanceof PcivApiError) throw err;
    const response = (err as AxiosError<Partial<BaseResponse<unknown>>>).response;
    if (response?.status === 401) {
      throw new PcivApiError(401, "Your session has expired. Please log in again.");
    }
    if (response?.status === 404 && whenNotFound !== undefined) return whenNotFound;
    throw new PcivApiError(
      response?.data?.responseCode ?? response?.status ?? 0,
      response?.data?.responseMessage ?? "Something went wrong",
    );
  }
};

const BUTTON_PATH: Record<PcivButton, string> = {
  submit: "submit",
  forward: "forward",
  referBack: "refer-back",
  complete: "complete",
  cancel: "cancel",
};

export const getPcivButtons = (pcivId: number) =>
  request<PcivButtonsResponse>(
    apiClient.get(`${PC_IV_WORKFLOW_API}/${pcivId}/buttons`),
  );

/** The next level. One person = no picker needed; empty = cannot forward. */
export const getPcivForwardTargets = (pcivId: number) =>
  request<PcivPerson[]>(
    apiClient.get(`${PC_IV_WORKFLOW_API}/${pcivId}/forward-to`),
    [],
  );

export const pressPcivButton = (
  pcivId: number,
  button: PcivButton,
  body: { remarks?: string; toUserId?: number | null },
) =>
  request<PcivActionResponse>(
    apiClient.post(`${PC_IV_WORKFLOW_API}/${pcivId}/${BUTTON_PATH[button]}`, {
      remarks: body.remarks || null,
      ...(button === "forward" ? { toUserId: body.toUserId ?? null } : {}),
    }),
  );

/** Newest first; [] when none. */
export const getPcivHistory = (pcivId: number) =>
  request<PcivReportTrail[]>(
    apiClient.get(`${PC_IV_WORKFLOW_API}/history`, { params: { pcivId } }),
    [],
  );

/** Newest first; [] when none. */
export const getPcivSignatures = (pcivId: number) =>
  request<PcivSignature[]>(
    apiClient.get(`${PC_IV_WORKFLOW_API}/signatures`, { params: { pcivId } }),
    [],
  );

/** PC-IVs the user has now, or last acted on. */
export const getPcivInbox = (userId: number) =>
  request<PcivSubmittedReportsResult>(
    apiClient.get(`${PC_IV_WORKFLOW_API}/submitted-reports`, {
      params: { userId },
    }),
    { totalIssuedCount: 0, reports: [] },
  );

/** Stored files come back as server paths; this makes them openable. */
export const pcivFileUrl = (path?: string | null) =>
  path ? `${process.env.NEXT_PUBLIC_BACKEND_API}${path}` : undefined;
