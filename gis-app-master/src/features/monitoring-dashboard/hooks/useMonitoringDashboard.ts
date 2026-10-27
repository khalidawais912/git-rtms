"use client";
import { setContent } from "@/store/contentSlice";
import { setTutorial } from "@/store/tutorialSlice";
import { getSession } from "@/utils/session";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { buildFilters, DASHBOARD_TUTORIAL } from "../constants";
import { fetchMainDashboard } from "../services";
import { FilterData, MainDashboard, Program } from "../types";

const withoutDistrict = (filters: FilterData[]) =>
  filters.filter((f) => f.filterIdentifier !== "District");

/** Dashboard figures, the programme switch and the user's filters */
export const useMonitoringDashboard = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState<MainDashboard>();
  const [isLoading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [departmentId, setDepartmentId] = useState<number>();
  const [program, setProgram] = useState<Program>("cmInitiative");
  const [otherFilters, setOtherFilters] = useState<FilterData[]>([]);

  const load = useCallback(async (filters: FilterData[]) => {
    setLoading(true);
    try {
      setData(await fetchMainDashboard(filters));
    } catch (err) {
      console.error("Main dashboard error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userRole = getSession("role");
    const department = getSession("departmentId");
    if (userRole) setRole(userRole);
    if (department) setDepartmentId(parseInt(department));

    dispatch(setContent("dashboard"));
    dispatch(setTutorial(DASHBOARD_TUTORIAL));
    load(buildFilters("cmInitiative", []));
  }, [dispatch, load]);

  const switchProgram = (next: Program) => {
    setProgram(next);
    load(buildFilters(next, otherFilters));
  };

  const applyFilters = (filters: FilterData[]) => {
    setOtherFilters(filters);
    load(buildFilters(program, filters));
  };

  const resetFilters = () => applyFilters([]);

  /** District picked on the map: becomes the District filter */
  const selectDistrict = (districtName: string) =>
    applyFilters([
      ...withoutDistrict(otherFilters),
      { filterIdentifier: "District", filterValues: districtName },
    ]);

  const clearDistrict = () => applyFilters(withoutDistrict(otherFilters));

  return {
    data,
    isLoading,
    role,
    roleKey: role.toLowerCase(),
    departmentId,
    program,
    otherFilters,
    switchProgram,
    applyFilters,
    resetFilters,
    selectDistrict,
    clearDistrict,
  };
};

export type MonitoringDashboardState = ReturnType<typeof useMonitoringDashboard>;
