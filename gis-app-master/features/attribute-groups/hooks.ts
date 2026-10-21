import { useMemo } from "react";
import { ATTRIBUTE_GROUPS_API, EVALUATION_ATTRIBUTE_GROUPS_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { useSearchParams } from "next/navigation";
import { DashboardTypeEnum } from "@/shared/types/dashboard";
import { AttributeGroup } from "./types";

interface Props {
  refresh?: boolean;
}

export const useAttributeGroups = ({ refresh = false }: Props = {}) => {
  const serachParams = useSearchParams();
  const dashboardType = serachParams.get("dashboardType");

  // useMemo to ensure recomputation when dashboardType changes
  const endpoint = useMemo(() => {
    return dashboardType === DashboardTypeEnum.EVALUATION
      ? EVALUATION_ATTRIBUTE_GROUPS_API
      : ATTRIBUTE_GROUPS_API;
  }, [dashboardType]);

  return useData<AttributeGroup>({ refresh, endpoint });
};
