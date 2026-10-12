import { useMemo } from "react";
import { ATTRIBUTE_GROUPS_API, EVALUATION_ATTRIBUTE_GROUPS_API } from "../APIs";
import useData from "./useData";
import { useSearchParams } from "next/navigation";
import { DashboardTypeEnum } from "../dashboard/types/types";

export interface AttributeGroup {
  id: number;
  parentId: number;
  parentName: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  sortId: number;
  group_type: number;
  group_nature: number;
}

interface Props {
  refresh?: boolean;
}

const useAttributeGroups = ({ refresh = false }: Props = {}) => {
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

export default useAttributeGroups;
