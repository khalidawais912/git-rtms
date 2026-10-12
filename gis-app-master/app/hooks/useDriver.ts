import { DRIVER_API } from "../APIs";
import useData from "./useData";

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
