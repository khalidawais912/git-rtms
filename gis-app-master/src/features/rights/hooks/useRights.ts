import { RIGHT_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { Right } from "./types";

interface Props {
  refresh?: boolean;
}

export const useRights = ({ refresh = false }: Props = {}) =>
  useData<Right>({ refresh, endpoint: RIGHT_API });
