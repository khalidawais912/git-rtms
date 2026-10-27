import { ROLE_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { Role } from "./types";

interface Props {
  refresh?: boolean;
}

export const useRoles = ({ refresh = false }: Props = {}) =>
  useData<Role>({ refresh, endpoint: ROLE_API });
