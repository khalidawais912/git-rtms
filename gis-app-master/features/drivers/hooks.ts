import { DRIVER_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { Driver } from "./types";

interface Props {
  refresh?: boolean;
}

export const useDriver = ({ refresh = false }: Props = {}) => {
  return useData<Driver>({
    refresh,
    endpoint: DRIVER_API,
  });
};
