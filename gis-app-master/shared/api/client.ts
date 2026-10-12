import axios, { AxiosError, CanceledError } from "axios";
import Cookies from "js-cookie";

export interface ErrorResponse {
  responseCode: number;
  responseMessage: string;
}

export interface BaseResponse<T> {
  responseCode: number;
  responseMessage: string;
  data: T;
}

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  headers: {
    "Content-Type": "application/json",
  },
});

// Read the token on every request so a fresh login is picked up
// without a page reload.
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

export { AxiosError, CanceledError };
