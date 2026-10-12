import { VEHICLE_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";

export interface Vehicle {
  id: number;
  name: string;
  description: string;
  vehicleNumber: string;
  model: string;
  color: string;
  trasnmission: string;
  seatsCapacity: number;
  fuelType: string;
  vehicleImage: string;
  vehicleIcon: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  refresh?: boolean;
}

const useVehicle = ({ refresh = false }: Props = {}) => {
  return useData<Vehicle>({
    refresh,
    endpoint: VEHICLE_API,
  });
};

export default useVehicle;
