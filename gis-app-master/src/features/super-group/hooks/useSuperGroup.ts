import { useSearchParams } from "next/navigation";
import { EVALUATION_SUPER_GROUP_API, SUPER_GROUP_API } from "@/services/endpoints";
import useData from "@/hooks/useData";
import { DashboardTypeEnum } from "@/types/dashboard";
import { useMemo } from "react";
import { SuperGroup } from "../types";

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


  return useData<SuperGroup>({ refresh, endpoint });
};
