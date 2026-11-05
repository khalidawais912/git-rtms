import apiClient, { AxiosError } from "@/services/client";
import { DOCUMENT_CATEGORY_API } from "@/services/endpoints";
import { BaseResponse } from "@/services/types";
import { DocumentCategoryNode } from "../types";
 
export class DocumentCategoryApiError extends Error {
  constructor(
    public code: number,
    message: string,
  ) {
    super(message);
    this.name = "DocumentCategoryApiError";
  }
}

const request = async <T>(call: Promise<{ data: BaseResponse<T> }>): Promise<T> => {
  try {
    const { data } = await call;
    if (data.responseCode === 200) return data.data;
    throw new DocumentCategoryApiError(data.responseCode, data.responseMessage);
  } catch (err) {
    if (err instanceof DocumentCategoryApiError) throw err;
    const response = (err as AxiosError<Partial<BaseResponse<unknown>>>).response;
    if (response?.status === 401) {
      throw new DocumentCategoryApiError(401, "Your session has expired. Please log in again.");
    }
    // HTTP 404 (not responseCode 404): the endpoint itself is missing on this server
    if (response?.status === 404) {
      throw new DocumentCategoryApiError(
        404,
        "Document categories are not available on the server yet.",
      );
    }
    throw new DocumentCategoryApiError(
      response?.data?.responseCode ?? response?.status ?? 0,
      response?.data?.responseMessage ?? "Something went wrong.",
    );
  }
};

/** False for everyone but the Super Admin: hide the screen. */
export const canManageDocumentCategories = () =>
  request<boolean>(apiClient.get(`${DOCUMENT_CATEGORY_API}/can-manage`));

/** The API may send null for children and names; the screen always gets arrays and strings. */
const normalize = (nodes: DocumentCategoryNode[] | null): DocumentCategoryNode[] =>
  (nodes ?? []).map((node) => ({
    ...node,
    docCategoryName: node.docCategoryName ?? "",
    children: normalize(node.children),
  }));

/** The whole tree: main categories with their sub-categories and documents. */
export const getDocumentCategories = async () =>
  normalize(
    await request<DocumentCategoryNode[] | null>(apiClient.get(DOCUMENT_CATEGORY_API)),
  );

/** parentId null = main category; a main id = sub-category; a sub-category id = document. */
export const createDocumentCategory = (docCategoryName: string, parentId: number | null) =>
  request<DocumentCategoryNode>(
    apiClient.post(DOCUMENT_CATEGORY_API, {
      docCategoryName: docCategoryName.trim(),
      parentId,
    }),
  );

/** Always allowed, even when the category is used on a PC-IV. */
export const renameDocumentCategory = (id: number, docCategoryName: string) =>
  request<unknown>(
    apiClient.put(`${DOCUMENT_CATEGORY_API}/${id}`, {
      docCategoryName: docCategoryName.trim(),
    }),
  );

/** Also removes its children. 409 when it is used on a PC-IV. */
export const deleteDocumentCategory = (id: number) =>
  request<unknown>(apiClient.delete(`${DOCUMENT_CATEGORY_API}/${id}`));
