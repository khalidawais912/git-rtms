import { VISIT_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { Visit } from "./types";
interface Props {
  refresh?: boolean;
}

const useVisits = ({ refresh = false }: Props = {}) =>
  useData<Visit>({ refresh, endpoint: VISIT_API });

export default useVisits;
