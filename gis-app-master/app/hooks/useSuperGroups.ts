import { useSearchParams } from "next/navigation";
import { EVALUATION_SUPER_GROUP_API, SUPER_GROUP_API } from "../APIs";
import useData from "./useData";
import { DashboardTypeEnum } from "../dashboard/types/types";
import { useEffect, useMemo } from "react";

export interface GroupsList {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  parentId: number;
  sortId: number;
}

export interface SuperGroup {
  id: number;
  superGroupLabel: string;
  groupsList: GroupsList[];
}

interface Props {
  refresh?: boolean;
}

const useSuperGroups = ({ refresh = false }: Props = {}) => {
  const serachParams = useSearchParams();
  const dashboardType = serachParams.get("dashboardType");

  // useMemo to ensure recomputation when dashboardType changes
  const endpoint = useMemo(() => {
    return dashboardType === DashboardTypeEnum.EVALUATION
      ? EVALUATION_SUPER_GROUP_API
      : SUPER_GROUP_API;
  }, [dashboardType]);

  //   const endpoint = useMemo(() => {
  //   const type = dashboardType as TypeEnum | null;
  //   if (!type || type === undefined) return SUPER_GROUP_API;
  //   if (type === TypeEnum.EVALUATION) return EVALUATION_SUPER_GROUP_API;

  //   console.log("dashboardType:", dashboardType, " -> endpoint:", endpoint);
  //   return SUPER_GROUP_API;
  // }, [dashboardType]);

  useEffect(() => {
    console.log("endpoint", endpoint);
  }, [endpoint]);

  return useData<SuperGroup>({ refresh, endpoint });
};

export default useSuperGroups;
