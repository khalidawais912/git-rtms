import { GET_ALL_USERS_AND_OFFICERS_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { ReportHistoryUser } from "./types";
interface Props {
  refresh?: boolean;
}

const useReportHistoryUser = ({ refresh = false }: Props = {}) =>
  useData<ReportHistoryUser>({
    refresh,
    endpoint: GET_ALL_USERS_AND_OFFICERS_API,
  });

export default useReportHistoryUser;
