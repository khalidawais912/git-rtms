import { DISTRICT_API } from "@/services/endpoints";
import useData from "@/hooks/useData";
import { District } from "../types";

interface Props {
  refresh?: boolean;
}

export const useDistrict = ({ refresh = false }: Props = {}) =>
  useData<District>({ refresh, endpoint: DISTRICT_API });
