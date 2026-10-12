import { useState } from "react";
import { toast } from "react-toastify";
import apiClient, { AxiosError, CanceledError } from "../services/api-client";

interface FetchProps {
  endpoint: string;
  method?: "GET" | "PUT" | "POST"; // Specify request type (default is "GET")
  body?: any; // Query parameters for GET or body data for PUT
}

const useLazyFetch = <T>() => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const notifyError = (message: string) => toast.error(message);

  const fetchData = async ({ endpoint, method = "GET", body }: FetchProps) => {
    const controller = new AbortController();
    setLoading(true);

    try {
      let response;
      if (method === "GET") {
        response = await apiClient.get(endpoint, body);
      } else if (method === "PUT") {
        response = await apiClient.put(endpoint, body);
      }

      setData(response?.data?.data || null);
      setLoading(false);
    } catch (err) {
      if (err instanceof CanceledError) return;
      setError((err as AxiosError).message);
      notifyError((err as AxiosError).message);
      setLoading(false);
    }

    return () => controller.abort();
  };

  return { data, setData, error, isLoading, fetchData };
};

export default useLazyFetch;
