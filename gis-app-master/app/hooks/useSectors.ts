import { SECTOR_API } from "../APIs";
import useData from "./useData";

export interface Sector {
  id: number;
  parentId: number;
  name: string;
  description: string;
  createdAt: string;
  updateAt: string;
  sortId: number;
}

interface Props {
  refresh?: boolean;
}

const useSectors = ({ refresh = false }: Props = {}) =>
  useData<Sector>({ refresh, endpoint: SECTOR_API });

export default useSectors;
