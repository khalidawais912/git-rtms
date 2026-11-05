import apiClient from "@/services/client";
import { LOGIN_API } from "@/services/endpoints";
import { clearSession } from "@/utils/session";
import { LoginFormData } from "../schema";
import { LoginData, LoginResponse } from "../types";

/** Logs in and returns the session data; throws with the backend's message if it refuses. */
export const login = async (formData: LoginFormData): Promise<LoginData> => {
  // Drop any old session first, so apiClient doesn't send a stale token with the login request.
  clearSession();
  const { data } = await apiClient.post<LoginResponse>(LOGIN_API, formData);
  if (data.responseCode !== 200) throw new Error(data.responseMessage);
  return data.data;
};
