import useData from "@/hooks/useData";
import { GET_ALL_STAFF_API, GET_ALL_USERS_API } from "../services";
import {
  GET_ALL_OFFICERS_API,
  GET_ALL_USERS_AND_OFFICERS_API,
} from "@/services/endpoints";
import { Authentication, Officer, ReportHistoryUser, User } from "../types";

interface Props {
  refresh?: boolean;
}

/** Login accounts (username, email, role). */
export const useAuthentication = ({ refresh = false }: Props = {}) =>
  useData<Authentication>({ refresh, endpoint: GET_ALL_USERS_API });

/** Staff profiles (designation, department, BPS). */
export const useUsers = ({ refresh = false }: Props = {}) =>
  useData<User>({ refresh, endpoint: GET_ALL_STAFF_API });

/** Officers only. */
export const useOfficers = ({ refresh = false }: Props = {}) =>
  useData<Officer>({ refresh, endpoint: GET_ALL_OFFICERS_API });

/** Users and officers together, for report history screens. */
export const useReportHistoryUsers = ({ refresh = false }: Props = {}) =>
  useData<ReportHistoryUser>({
    refresh,
    endpoint: GET_ALL_USERS_AND_OFFICERS_API,
  });
