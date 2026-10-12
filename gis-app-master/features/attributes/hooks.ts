import { useEffect, useMemo } from "react";
import { EVALUATION_ATTRIBUTES_API, ATTRIBUTES_API } from "@/shared/api/endpoints";
import { DashboardTypeEnum } from "@/shared/types/dashboard";
import useData from "@/shared/hooks/useData";
import { useSearchParams } from "next/navigation";
import { Attribute } from "./types";

interface Props {
  refresh?: boolean;
}

export const useAttributes = ({ refresh = false }: Props = {}) => {
  const serachParams = useSearchParams();
  const dashboardType = serachParams.get("dashboardType");

  // useMemo to ensure recomputation when dashboardType changes
  const endpoint = useMemo(() => {
    return dashboardType === DashboardTypeEnum.EVALUATION
      ? EVALUATION_ATTRIBUTES_API
      : ATTRIBUTES_API;
  }, [dashboardType]);

  return useData<Attribute>({ refresh, endpoint });
};
