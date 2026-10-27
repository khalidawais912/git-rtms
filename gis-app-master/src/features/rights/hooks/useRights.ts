import { RIGHT_API } from "@/services/endpoints";
import useData from "@/hooks/useData";
import { Right } from "../types";

interface Props {
  refresh?: boolean;
}

export const useRights = ({ refresh = false }: Props = {}) =>
  useData<Right>({ refresh, endpoint: RIGHT_API });
