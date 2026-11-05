import { DEPARTMENT_API } from "@/services/endpoints";
import useData from "@/hooks/useData";
import { Department } from "../types";

interface Props {
  refresh?: boolean;
}

export const useDepartments = ({ refresh = false }: Props = {}) =>
  useData<Department>({ refresh, endpoint: DEPARTMENT_API });
