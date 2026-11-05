import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { EVALUATION_PROJECT_API, PROJECT_API } from "@/services/endpoints";
import useData from "@/hooks/useData";
import { DashboardTypeEnum } from "@/types/dashboard";
import { Project } from "../types";

interface Props {
  refresh?: boolean;
}

/** Monitoring projects, or evaluation projects when ?dashboardType=EVALUATION. */
export const useProjects = ({ refresh = false }: Props = {}) => {
  const searchParams = useSearchParams();
  const dashboardType = searchParams.get("dashboardType");

  const endpoint = useMemo(
    () =>
      dashboardType === DashboardTypeEnum.EVALUATION
        ? EVALUATION_PROJECT_API
        : PROJECT_API,
    [dashboardType],
  );

  return useData<Project>({ refresh, endpoint });
};
