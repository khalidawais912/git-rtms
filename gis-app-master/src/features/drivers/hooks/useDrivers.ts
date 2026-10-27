import { DRIVER_API } from "@/services/endpoints";
import useData from "@/hooks/useData";
import { Driver } from "../types";

interface Props {
  refresh?: boolean;
}

export const useDriver = ({ refresh = false }: Props = {}) => {
  return useData<Driver>({
    refresh,
    endpoint: DRIVER_API,
  });
};
