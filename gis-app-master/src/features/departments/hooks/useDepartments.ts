import { DEPARTMENT_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { Department } from "./types";

interface Props {
  refresh?: boolean;
}

export const useDepartments = ({ refresh = false }: Props = {}) =>
  useData<Department>({ refresh, endpoint: DEPARTMENT_API });
