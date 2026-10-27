import axios, { AxiosError, CanceledError } from "axios";
import { getSession } from "@/utils/session";
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Read the token on every request so a fresh login is picked up
// without a page reload.
apiClient.interceptors.request.use((config) => {
  const token = getSession("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

export { AxiosError, CanceledError };
