import { TOUR_PLAN_API } from "../APIs";
import useData from "./useData";

export interface TourPlan {
  id: number;
  department_Id: number;
  name: string;
  tourStartDate: string;
  tourEndDate: string;
  approvalDate: string;
  createdDate: string;
  updatedDate: string;
  createdBy: number;
  updatedBy: number;
}

interface Props {
  refresh?: boolean;
}

const useTourPlans = ({ refresh = false }: Props = {}) => {
  return useData<TourPlan>({
    refresh,
    endpoint: TOUR_PLAN_API,
  });
};

export default useTourPlans;
