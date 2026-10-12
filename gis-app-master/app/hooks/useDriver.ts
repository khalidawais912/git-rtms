import { DRIVER_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";

export interface Driver {
  id: number;
  user_Id: number;
  driverName: string;
  driverImage: string;
  mobileNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  refresh?: boolean;
}

const useDriver = ({ refresh = false }: Props = {}) => {
  return useData<Driver>({
    refresh,
    endpoint: DRIVER_API,
  });
};

export default useDriver;
