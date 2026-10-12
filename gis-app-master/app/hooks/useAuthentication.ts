import { GET_ALL_USERS_API } from "../APIs";
import useData from "./useData";

export interface Authentication {
  id: number;
  userName: string;
  fullName: string;
  email: string;
  designation: string;
  picture: string;
  phoneNumber: string;
  roleId: string;
}

interface Props {
  refresh?: boolean;
}

const useAuthentication = ({ refresh = false }: Props = {}) =>
  useData<Authentication>({ refresh, endpoint: GET_ALL_USERS_API });

export default useAuthentication;
