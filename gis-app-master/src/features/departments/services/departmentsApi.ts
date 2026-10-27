import apiClient from "@/services/client";
import { DEPARTMENT_API } from "@/services/endpoints";
import { DepartmentWithRights } from "../schema";
import { DataAgainstFiled, FiledList } from "../types";

export const getDepartment = (id: number) =>
  apiClient
    .get(`${DEPARTMENT_API}/${id}`)
    .then((res) => res.data.data as DepartmentWithRights);

export const createDepartment = (data: DepartmentWithRights) =>
  apiClient.post(`${DEPARTMENT_API}/CreateWithRights`, data);

export const updateDepartment = (data: DepartmentWithRights) =>
  apiClient.put(`${DEPARTMENT_API}/Update`, data);

export const deleteDepartment = (id: number) =>
  apiClient.delete(`${DEPARTMENT_API}/${id}`);

export const getFieldList = () =>
  apiClient
    .get(`${DEPARTMENT_API}/GetFieldList`)
    .then((res) => res.data.data as FiledList);

export const getDataAgainstField = (fieldId: number) =>
  apiClient
    .get(`${DEPARTMENT_API}/GetDataAgainstField?id=${fieldId}`)
    .then((res) => res.data.data as DataAgainstFiled[]);
