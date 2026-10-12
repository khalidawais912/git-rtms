import { useMemo } from "react";
import { EVALUATION_PROJECT_API, PROJECT_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { useSearchParams } from "next/navigation";
import { DashboardTypeEnum } from "../dashboard/types/types";
import { Project } from "./types";
interface Props {
  refresh?: boolean;
}

const useProjects = ({ refresh = false }: Props = {}) => {
  const serachParams = useSearchParams();
  const dashboardType = serachParams.get("dashboardType");

  // useMemo to ensure recomputation when dashboardType changes
  const endpoint = useMemo(() => {
    return dashboardType === DashboardTypeEnum.EVALUATION
      ? EVALUATION_PROJECT_API
      : PROJECT_API;
  }, [dashboardType]);

  return useData<Project>({ refresh, endpoint });
};
export default useProjects;
