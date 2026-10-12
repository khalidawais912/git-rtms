import { GET_ALL_OFFICERS_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { Officer } from "./types";
interface Props {
  refresh?: boolean;
}

const useOfficers = ({ refresh = false }: Props = {}) =>
  useData<Officer>({ refresh, endpoint: GET_ALL_OFFICERS_API });

export default useOfficers;
