import { COORDINATES_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { StaffTracking } from "./types";
interface Props {
  refresh?: boolean;
}

const useStaffTrackings = ({ refresh = false }: Props = {}) =>
  useData<StaffTracking>({ refresh, endpoint: COORDINATES_API });

export default useStaffTrackings;
