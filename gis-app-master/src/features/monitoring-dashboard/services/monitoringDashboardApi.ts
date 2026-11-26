import apiClient from "@/services/client";
import {
  DISTRICT_API,
  FILTER_SETTING_API,
  MAIN_DASHBOARD_API,
  PC_IV_WORKFLOW_API,
  REPORTS_HISTORY_API,
  SINGLE_PROJECT_DASHBOARD_API,
} from "@/services/endpoints";
import type { SubmittedReport } from "@/app/report-history/types";
import {
  DistrictProjects,
  Filter,
  FilterData,
  MainDashboard,
  ProjectsList,
} from "../types";

export const fetchMainDashboard = async (filters: FilterData[]) => {
  const { data } = await apiClient.post(MAIN_DASHBOARD_API, filters);
  return data.data as MainDashboard;
};

export const fetchProjectsByStatus = async (status: string, filters: FilterData[]) => {
  const { data } = await apiClient.post(
    `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=${status}`,
    filters,
  );
  return data.data as ProjectsList[];
};

/** A row of the 800M+ lists: the usual list row plus actExpUpTo (expenditure up to last 30 June) */
export type Project800M = ProjectsList & { actExpUpTo?: number | null };

/**
 * Projects with PC-I cost ≥ 800M (card cost800MAndAbove) or, with withUtilization, those of them with
 * utilization ≥ 20% (card cost800MAndAboveUtilization20Plus). Same filter body as the dashboard.
 */
export const fetchProjects800M = async (withUtilization: boolean, filters: FilterData[]) => {
  const { data } = await apiClient.post(
    `${MAIN_DASHBOARD_API}/${withUtilization ? "Projects800MAndAboveUtilization20" : "Projects800MAndAbove"}`,
    filters,
  );
  return (data.data ?? []) as Project800M[];
};

export const fetchUserFilters = async (userId = 0) => {
  const { data } = await apiClient.get(
    `${FILTER_SETTING_API}/GetUserFilters?userId=${userId}`,
  );
  return data.data as Filter[];
};

export const fetchDistrictProjects = async (districtId: number) => {
  const { data } = await apiClient.get(
    `${DISTRICT_API}/GetProjectByDistrict?districtId=${districtId}`,
  );
  return data.data as DistrictProjects[];
};

/** True when the project has a monitoring dashboard to open */
export const isProjectMonitored = async (projectId: number) => {
  const { data } = await apiClient.get(
    `${SINGLE_PROJECT_DASHBOARD_API}?projectid=${projectId}`,
  );
  return Boolean(data.data);
};

export const fetchSubmittedReports = async (userId: number) => {
  const { data } = await apiClient.get(
    `${REPORTS_HISTORY_API}/GetSubmittedReports?submittedTo=${userId}`,
  );
  return data.data.reports as SubmittedReport[];
};

export const fetchPcivSubmittedReports = async (userId: number) => {
  const { data } = await apiClient.get(`${PC_IV_WORKFLOW_API}/submitted-reports`, {
    params: { userId },
  });
  return data.data.reports as SubmittedReport[];
};
