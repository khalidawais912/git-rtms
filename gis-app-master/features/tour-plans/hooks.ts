import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  EVALUATION_TEMP_TOUR_PLAN_API,
  TEMP_TOUR_PLAN_API,
  TOUR_PLAN_API,
} from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { DashboardTypeEnum } from "@/shared/types/dashboard";
import { TempTourPlan, TourPlan } from "./types";

interface Props {
  refresh?: boolean;
}

export const useTourPlans = ({ refresh = false }: Props = {}) =>
  useData<TourPlan>({ refresh, endpoint: TOUR_PLAN_API });

/** Draft tour plans; evaluation ones when ?dashboardType=EVALUATION. */
export const useTempTourPlans = ({ refresh = false }: Props = {}) => {
  const searchParams = useSearchParams();
  const dashboardType = searchParams.get("dashboardType");

  const endpoint = useMemo(
    () =>
      dashboardType === DashboardTypeEnum.EVALUATION
        ? EVALUATION_TEMP_TOUR_PLAN_API + "/get-tour-plan"
        : TEMP_TOUR_PLAN_API + "/get-tour-plan",
    [dashboardType],
  );

  return useData<TempTourPlan>({ refresh, endpoint });
};
