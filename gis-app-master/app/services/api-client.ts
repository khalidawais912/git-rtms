import axios, { AxiosError, CanceledError } from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");

export interface ErrorResponse {
  responseCode: number;
  responseMessage: string;
}

export interface BaseResponse<T> {
  responseCode: number;
  responseMessage: string;
  data: T;
}

export default axios.create({
  // withCredentials: true,
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});

export { AxiosError, CanceledError };
