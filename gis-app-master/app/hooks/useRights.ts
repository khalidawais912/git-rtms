import { RIGHT_API } from "../APIs";
import useData from "./useData";

export interface Right {
  rightId: number;
  rightName: string;
  rightIdentifier: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  refresh?: boolean;
}

const useRights = ({ refresh = false }: Props = {}) =>
  useData<Right>({ refresh, endpoint: RIGHT_API });

export default useRights;
