import { ROLE_API } from "../APIs";
import useData from "./useData";

export interface Role {
  id: number;
  name: string;
  normalizedName: string;
  concurrencyStamp: string;
}

interface Props {
  refresh?: boolean;
}

const useRoles = ({ refresh = false }: Props = {}) =>
  useData<Role>({ refresh, endpoint: ROLE_API });

export default useRoles;
