import { SECTOR_API } from "@/services/endpoints";
import useData from "@/hooks/useData";
import { Sector } from "../types";

interface Props {
  refresh?: boolean;
}

export const useSectors = ({ refresh = false }: Props = {}) =>
  useData<Sector>({ refresh, endpoint: SECTOR_API });
