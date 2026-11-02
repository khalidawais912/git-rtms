import apiClient, { AxiosError } from "@/shared/api/client";
import { AGENCIES_API } from "@/shared/api/endpoints";
import { BaseResponse } from "@/shared/api/types";
import { AgencyNode } from "./types";

/**
 * The server answers with HTTP 200 and puts the result in `responseCode`
 * (400 validation, 403 not an owner, 404 not found, 409 duplicate / used on a PC-IV).
 * Anything but 200 becomes an AgencyApiError whose message can be shown as it is.
 */
export class AgencyApiError extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
    this.name = "AgencyApiError";
  }
}

const request = async <T>(call: Promise<{ data: BaseResponse<T> }>): Promise<T> => {
  try {
    const { data } = await call;
    if (data.responseCode === 200) return data.data;
    throw new AgencyApiError(data.responseCode, data.responseMessage);
  } catch (err) {
    if (err instanceof AgencyApiError) throw err;
    const response = (err as AxiosError<Partial<BaseResponse<unknown>>>).response;
    if (response?.status === 401) {
      throw new AgencyApiError(401, "Your session has expired. Please log in again.");
    }
    // HTTP 404 (not responseCode 404): the endpoint itself is missing on this server
    if (response?.status === 404) {
      throw new AgencyApiError(404, "Agencies are not available on the server yet.");
    }
    throw new AgencyApiError(
      response?.data?.responseCode ?? response?.status ?? 0,
      response?.data?.responseMessage ?? "Something went wrong.",
    );
  }
};

/** The API may send null for children and names; screens always get arrays and strings. */
const normalize = (nodes: AgencyNode[] | null): AgencyNode[] =>
  (nodes ?? []).map((node) => ({
    ...node,
    agencyName: node.agencyName ?? "",
    children: normalize(node.children ?? null),
  }));

/** True when this user may add, rename and delete. Everyone can still read. */
export const canManageAgencies = () => request<boolean>(apiClient.get(`${AGENCIES_API}/can-manage`));

/** The whole tree (top-level agencies with their children), sorted by name at each level. */
export const getAgencyTree = async () =>
  normalize(await request<AgencyNode[] | null>(apiClient.get(AGENCIES_API)));

/** Top-level agencies only. */
export const getMainAgencies = async () =>
  normalize(await request<AgencyNode[] | null>(apiClient.get(`${AGENCIES_API}/main`)));

/** Children of one top-level agency. responseCode 404 when the parent is unknown. */
export const getAgencyChildren = async (parentId: number) =>
  normalize(await request<AgencyNode[] | null>(apiClient.get(`${AGENCIES_API}/${parentId}/children`)));

export const getAgency = (id: number) => request<AgencyNode>(apiClient.get(`${AGENCIES_API}/${id}`));

/** parentAgencyId null = top-level agency; a top-level id = child. A child id is rejected (400). */
export const createAgency = (agencyName: string, parentAgencyId: number | null) =>
  request<AgencyNode>(
    apiClient.post(AGENCIES_API, { agencyName: agencyName.trim(), parentAgencyId }),
  );

/** Name only: an agency cannot move to another parent. */
export const renameAgency = (id: number, agencyName: string) =>
  request<AgencyNode>(apiClient.put(`${AGENCIES_API}/${id}`, { agencyName: agencyName.trim() }));

/**
 * Deletes the agency and every agency under it; returns how many children went with it.
 * responseCode 409 (nothing deleted) when it or a child is used on a PC-IV.
 */
export const deleteAgency = (id: number) =>
  request<number>(apiClient.delete(`${AGENCIES_API}/${id}`));
