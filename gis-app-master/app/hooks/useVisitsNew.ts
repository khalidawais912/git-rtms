import { VISIT_NEW_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { VisitNew } from "./types";
interface Props {
  refresh?: boolean;
}

const useVisitsNew = ({ refresh = false }: Props = {}) =>
  useData<VisitNew>({ refresh, endpoint: VISIT_NEW_API });

export default useVisitsNew;
