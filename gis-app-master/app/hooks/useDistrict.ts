import { DISTRICT_API } from "../APIs";
import useData from "./useData";

export interface District {
  id: number;
  divisionName: string;
  districtName: string;
  latitude: string;
  longitude: string;
}

interface Props {
  refresh?: boolean;
}

const useDistrict = ({ refresh = false }: Props = {}) =>
  useData<District>({ refresh, endpoint: DISTRICT_API });

export default useDistrict;
