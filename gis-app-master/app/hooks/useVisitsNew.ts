import { VISIT_NEW_API } from "../APIs";
import useData from "./useData";

export interface VisitNew {
  id: number;
  superGroupID: number;
  smdpProjectID: number;
  name: string;
  userId: number;
  userName: string;
  designation: string;
  gsNo: string;
  sectorId: number;
  sectorName: string;
  address: string;
  city: string;
  division: string;
  districtId: number;
  districtName: string;
  latitude: string;
  longitude: string;
  locationCoordinates: string;
  status: string;
  visitStatus: true;
  approvalDate: string;
}

interface Props {
  refresh?: boolean;
}

const useVisitsNew = ({ refresh = false }: Props = {}) =>
  useData<VisitNew>({ refresh, endpoint: VISIT_NEW_API });

export default useVisitsNew;
