import { ROLE_API } from "@/services/endpoints";
import useData from "@/hooks/useData";
import { Role } from "../types";

interface Props {
  refresh?: boolean;
}

export const useRoles = ({ refresh = false }: Props = {}) =>
  useData<Role>({ refresh, endpoint: ROLE_API });
