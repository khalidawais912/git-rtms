import { GET_ALL_OFFICERS_API } from "../APIs";
import useData from "./useData";

export interface Officer {
  id: number;
  departmentId: number;
  userName: string;
  fullName: string;
  designation: string;
  picture: string;
  email: string;
  phoneNumber: string;
  roleName: string;
}

interface Props {
  refresh?: boolean;
}

const useOfficers = ({ refresh = false }: Props = {}) =>
  useData<Officer>({ refresh, endpoint: GET_ALL_OFFICERS_API });

export default useOfficers;
