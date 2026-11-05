import axios, { AxiosError, CanceledError, InternalAxiosRequestConfig } from "axios";
import { getSession } from "@/utils/session";
import { requestFinished, requestStarted } from "@/components/AppLoader/loaderStore";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Requests counted by the page loader (see AppLoader)
const tracked = new WeakSet<InternalAxiosRequestConfig>();
const settle = (config?: InternalAxiosRequestConfig) => {
  if (config && tracked.has(config)) {
    tracked.delete(config);
    requestFinished();
  }
};

// Read the token on every request so a fresh login is picked up
// without a page reload.
apiClient.interceptors.request.use((config) => {
  const token = getSession("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (typeof window !== "undefined" && requestStarted()) tracked.add(config);
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    settle(response.config);
    return response;
  },
  (error) => {
    settle(error?.config);
    return Promise.reject(error);
  },
);

export default apiClient;

export { AxiosError, CanceledError };
