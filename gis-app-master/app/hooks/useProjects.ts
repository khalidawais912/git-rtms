import { useMemo } from "react";
import { EVALUATION_PROJECT_API, PROJECT_API } from "../APIs";
import useData from "./useData";
import { useSearchParams } from "next/navigation";
import { DashboardTypeEnum } from "../dashboard/types/types";

export interface Project {
  id: number;
  gsNo: string;
  sectorId: number;
  name: string;
  address: string;
  city: string;
  locationCoordinates: string;
  status: string;
  smdpProjectID: number;
}

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
