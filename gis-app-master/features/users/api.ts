import apiClient from "@/shared/api/client";
import { USER_API } from "@/shared/api/endpoints";
import { UserFormData } from "./schema";

const AUTH_API = `/api/Authentication`;
export const GET_ALL_USERS_API = `${AUTH_API}/users`;
export const GET_ALL_STAFF_API = `${USER_API}/GetAllUsers`;

export const getUser = (id: number) =>
  apiClient.get(`${USER_API}/${id}`).then((res) => res.data.data);

export const createUser = (data: UserFormData) =>
  apiClient.post(`${AUTH_API}/register`, data);

export const updateUser = (id: number, data: UserFormData) =>
  apiClient.put(`${USER_API}/${id}`, data);

export const deleteUser = (userName: string) =>
  apiClient.delete(`${AUTH_API}/DeleteUser?UserName=${userName}`);

export const updateUserRole = (userName: string, roleName: string[] | null) =>
  apiClient.post(
    `${AUTH_API}/UpdateUserRole?UserName=${userName}&RoleName=${roleName}`,
  );
