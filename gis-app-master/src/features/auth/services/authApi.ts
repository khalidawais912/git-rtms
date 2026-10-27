import apiClient from "@/shared/api/client";
import { LOGIN_API } from "@/shared/api/endpoints";
import { clearSession } from "@/shared/utils/session";
import { LoginFormData } from "./schema";
import { LoginData, LoginResponse } from "./types";

/** Logs in and returns the session data; throws with the backend's message if it refuses. */
export const login = async (formData: LoginFormData): Promise<LoginData> => {
  // Drop any old session first, so apiClient doesn't send a stale token with the login request.
  clearSession();
  const { data } = await apiClient.post<LoginResponse>(LOGIN_API, formData);
  if (data.responseCode !== 200) throw new Error(data.responseMessage);
  return data.data;
};
