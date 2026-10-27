import { VISIT_API, VISIT_NEW_API } from "@/services/endpoints";
import useData from "@/hooks/useData";
import { Visit, VisitNew } from "../types";

interface Props {
  refresh?: boolean;
}

export const useVisits = ({ refresh = false }: Props = {}) =>
  useData<Visit>({ refresh, endpoint: VISIT_API });

export const useVisitsNew = ({ refresh = false }: Props = {}) =>
  useData<VisitNew>({ refresh, endpoint: VISIT_NEW_API });
