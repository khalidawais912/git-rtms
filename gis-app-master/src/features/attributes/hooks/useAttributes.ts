import { useMemo } from "react";
import { EVALUATION_ATTRIBUTES_API, ATTRIBUTES_API } from "@/services/endpoints";
import { DashboardTypeEnum } from "@/types/dashboard";
import useData from "@/hooks/useData";
import { useSearchParams } from "next/navigation";
import { Attribute } from "../types";

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
