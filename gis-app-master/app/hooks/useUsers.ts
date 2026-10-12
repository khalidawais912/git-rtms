import { USER_API } from "../APIs";
import useData from "./useData";

export interface User {
  id: number;
  name: string;
  designation: string;
  attendance_id: number;
  machine_num: number;
  status: true;
  created_at: string;
  updated_at: string;
  departmentId: number;
  created_by: string;
  updated_by: string;
  user_Id: number;
  bps: number;
  userImage: string;
}

interface Props {
  refresh?: boolean;
}

const useUsers = ({ refresh = false }: Props = {}) =>
  useData<User>({ refresh, endpoint: USER_API + "/GetAllUsers" });

export default useUsers;
