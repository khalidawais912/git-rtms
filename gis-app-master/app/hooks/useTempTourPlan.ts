import { useSearchParams } from "next/navigation";
import { EVALUATION_TEMP_TOUR_PLAN_API, TEMP_TOUR_PLAN_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { useMemo } from "react";
import { DashboardTypeEnum } from "../dashboard/types/types";
import { TempTourPlan } from "./types";
interface Props {
  refresh?: boolean;
}

const useTempTourPlans = ({ refresh = false }: Props = {}) => {
  const serachParams = useSearchParams();
  const dashboardType = serachParams.get("dashboardType");

  // useMemo to ensure recomputation when dashboardType changes
  const endpoint = useMemo(() => {
    return dashboardType === DashboardTypeEnum.EVALUATION
      ? EVALUATION_TEMP_TOUR_PLAN_API + "/get-tour-plan"
      : TEMP_TOUR_PLAN_API + "/get-tour-plan";
  }, [dashboardType]);

  return useData<TempTourPlan>({
    refresh,
    endpoint,
  });
};
export default useTempTourPlans;
