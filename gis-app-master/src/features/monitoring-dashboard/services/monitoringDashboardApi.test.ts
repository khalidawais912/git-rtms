import { beforeEach, describe, expect, it, vi } from "vitest";
import apiClient from "@/services/client";
import {
  DISTRICT_API,
  FILTER_SETTING_API,
  MAIN_DASHBOARD_API,
  PC_IV_WORKFLOW_API,
  REPORTS_HISTORY_API,
  SINGLE_PROJECT_DASHBOARD_API,
} from "@/services/endpoints";
import {
  fetchDistrictProjects,
  fetchMainDashboard,
  fetchPcivSubmittedReports,
  fetchProjectsByStatus,
  fetchSubmittedReports,
  fetchUserFilters,
  isProjectMonitored,
} from "./monitoringDashboardApi";

vi.mock("@/services/client", () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

const get = vi.mocked(apiClient.get);
const post = vi.mocked(apiClient.post);
const reply = (data: unknown) => ({ data: { data } });
const filters = [{ filterIdentifier: "District", filterValues: "Lahore" }];

beforeEach(() => {
  get.mockReset();
  post.mockReset();
});

describe("monitoring dashboard API", () => {
  it("fetchMainDashboard posts the filters and returns the dashboard", async () => {
    post.mockResolvedValue(reply({ totalProjects: 12 }));
    await expect(fetchMainDashboard(filters)).resolves.toEqual({ totalProjects: 12 });
    expect(post).toHaveBeenCalledWith(MAIN_DASHBOARD_API, filters);
  });

  it("fetchProjectsByStatus sends the status in the query", async () => {
    post.mockResolvedValue(reply([{ projectId: 1 }]));
    await expect(fetchProjectsByStatus("Critical", filters)).resolves.toEqual([{ projectId: 1 }]);
    expect(post).toHaveBeenCalledWith(
      `${MAIN_DASHBOARD_API}/GetProjectsListByStatus?status=Critical`,
      filters,
    );
  });

  it("fetchUserFilters asks for user 0 by default", async () => {
    get.mockResolvedValue(reply([]));
    await fetchUserFilters();
    expect(get).toHaveBeenCalledWith(`${FILTER_SETTING_API}/GetUserFilters?userId=0`);
  });

  it("fetchDistrictProjects asks for the district", async () => {
    get.mockResolvedValue(reply([{ districtId: 7 }]));
    await expect(fetchDistrictProjects(7)).resolves.toEqual([{ districtId: 7 }]);
    expect(get).toHaveBeenCalledWith(`${DISTRICT_API}/GetProjectByDistrict?districtId=7`);
  });

  it.each([
    [{ id: 1 }, true],
    [null, false],
  ])("isProjectMonitored(%j) is %s", async (data, expected) => {
    get.mockResolvedValue(reply(data));
    await expect(isProjectMonitored(5)).resolves.toBe(expected);
    expect(get).toHaveBeenCalledWith(`${SINGLE_PROJECT_DASHBOARD_API}?projectid=5`);
  });

  it("fetchSubmittedReports returns the reports list", async () => {
    get.mockResolvedValue(reply({ reports: [{ reportId: 3 }] }));
    await expect(fetchSubmittedReports(9)).resolves.toEqual([{ reportId: 3 }]);
    expect(get).toHaveBeenCalledWith(`${REPORTS_HISTORY_API}/GetSubmittedReports?submittedTo=9`);
  });

  it("fetchPcivSubmittedReports sends the user id as a parameter", async () => {
    get.mockResolvedValue(reply({ reports: [] }));
    await expect(fetchPcivSubmittedReports(9)).resolves.toEqual([]);
    expect(get).toHaveBeenCalledWith(`${PC_IV_WORKFLOW_API}/submitted-reports`, {
      params: { userId: 9 },
    });
  });

  it("passes request errors on to the caller", async () => {
    get.mockRejectedValue(new Error("offline"));
    await expect(fetchUserFilters(1)).rejects.toThrow("offline");
  });
});
