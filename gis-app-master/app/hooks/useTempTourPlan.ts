import { useSearchParams } from "next/navigation";
import { EVALUATION_TEMP_TOUR_PLAN_API, TEMP_TOUR_PLAN_API } from "../APIs";
import useData from "./useData";
import { useMemo } from "react";
import { DashboardTypeEnum } from "../dashboard/types/types";

export interface TempTourPlan {
  tempId: number;
  departmentId: number;
  gsNo: string;
  projectid: number;
  projectName: string;
  projectId: number;
  district: string;
  sectors: string;
  cost: number;
  type: number;
  userId: number;
  meOfficerName: string;
  section: string;
  dateFrom: string;
  dateTo: string;
  driverName: string;
  vehicleNumber: string;
  vehicleId: number;
  driverId: number;
  districtId: number;
  isFocalPerson: boolean;
}

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
