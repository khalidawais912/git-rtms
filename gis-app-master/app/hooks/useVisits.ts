import { VISIT_API } from "../APIs";
import useData from "./useData";

export interface Visit {
  id: number;
  projectId: number;
  assignedTo: number;
  status: number;
  latitude: string;
  longitude: string;
  vehicleID: number;
  districtID: number;
  mriValue: number;
  driverID: number;
  fromDate: string;
  toDate: string;
  createdAt: string;
  updatedAt: string;
  complete_at: string;
  submitted_at: string;
  issued_at: string;
  tracking_status: true;
  visitPlanGroup: number;
  one_pager_status: string;
  op_submitted_at: string;
}

interface Props {
  refresh?: boolean;
}

const useVisits = ({ refresh = false }: Props = {}) =>
  useData<Visit>({ refresh, endpoint: VISIT_API });

export default useVisits;
