// app/api/api-client-server.ts (Server-side only)
import axios from "axios";
import { cookies } from "next/headers";

export const createApiClient = () => {
  const token = cookies().get("token")?.value;

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
