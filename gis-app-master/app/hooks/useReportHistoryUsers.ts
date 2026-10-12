import { GET_ALL_USERS_AND_OFFICERS_API } from "../APIs";
import useData from "./useData";

export interface ReportHistoryUser {
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

const useReportHistoryUser = ({ refresh = false }: Props = {}) =>
  useData<ReportHistoryUser>({
    refresh,
    endpoint: GET_ALL_USERS_AND_OFFICERS_API,
  });

export default useReportHistoryUser;
