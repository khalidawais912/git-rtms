import { VEHICLE_API } from "@/services/endpoints";
import useData from "@/hooks/useData";
import { Vehicle } from "../types";

interface Props {
  refresh?: boolean;
}

export const useVehicle = ({ refresh = false }: Props = {}) => {
  return useData<Vehicle>({
    refresh,
    endpoint: VEHICLE_API,
  });
};
