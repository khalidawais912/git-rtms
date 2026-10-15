import { VEHICLE_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { Vehicle } from "./types";

interface Props {
  refresh?: boolean;
}

export const useVehicle = ({ refresh = false }: Props = {}) => {
  return useData<Vehicle>({
    refresh,
    endpoint: VEHICLE_API,
  });
};
