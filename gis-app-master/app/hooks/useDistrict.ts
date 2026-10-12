import { DISTRICT_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { District } from "./types";
interface Props {
  refresh?: boolean;
}

const useDistrict = ({ refresh = false }: Props = {}) =>
  useData<District>({ refresh, endpoint: DISTRICT_API });

export default useDistrict;
