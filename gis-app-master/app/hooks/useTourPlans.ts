import { TOUR_PLAN_API } from "@/shared/api/endpoints";
import useData from "@/shared/hooks/useData";
import { TourPlan } from "./types";
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
