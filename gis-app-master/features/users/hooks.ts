import useData from "@/shared/hooks/useData";
import { GET_ALL_STAFF_API, GET_ALL_USERS_API } from "./api";
import { Authentication, User } from "./types";

interface Props {
  refresh?: boolean;
}

/** Login accounts (username, email, role). */
export const useAuthentication = ({ refresh = false }: Props = {}) =>
  useData<Authentication>({ refresh, endpoint: GET_ALL_USERS_API });

/** Staff profiles (designation, department, BPS). */
export const useUsers = ({ refresh = false }: Props = {}) =>
  useData<User>({ refresh, endpoint: GET_ALL_STAFF_API });
