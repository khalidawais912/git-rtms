import { COORDINATES_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";

export interface StaffTracking {
  id: number;
  visitID: number;
  userID: number;
  latitude: string;
  longitude: string;
  createdAt: string;
}

interface Props {
  refresh?: boolean;
}

const useStaffTrackings = ({ refresh = false }: Props = {}) =>
  useData<StaffTracking>({ refresh, endpoint: COORDINATES_API });

export default useStaffTrackings;
