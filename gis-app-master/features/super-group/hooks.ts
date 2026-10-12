import { useSearchParams } from "next/navigation";
import { EVALUATION_SUPER_GROUP_API, SUPER_GROUP_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { DashboardTypeEnum } from "@/app/dashboard/types/types";
import { useEffect, useMemo } from "react";
import { GroupsList, SuperGroup } from "./types";

interface Props {
  refresh?: boolean;
}

export const useSuperGroups = ({ refresh = false }: Props = {}) => {
  const serachParams = useSearchParams();
  const dashboardType = serachParams.get("dashboardType");

  // useMemo to ensure recomputation when dashboardType changes
  const endpoint = useMemo(() => {
    return dashboardType === DashboardTypeEnum.EVALUATION
      ? EVALUATION_SUPER_GROUP_API
      : SUPER_GROUP_API;
  }, [dashboardType]);

  useEffect(() => {
    console.log("endpoint", endpoint);
  }, [endpoint]);

  return useData<SuperGroup>({ refresh, endpoint });
};
