import ListWrapper from "../components/ListWrapper";
import { DashboardType, DashboardTypeEnum } from "../dashboard/types/types";
import NewVisitPlan from "./components/NewVisitPlan";

interface Props {
  searchParams: Promise<{
    dashboardType: DashboardType;
  }>;
}

const NewVisitPlanPage = async ({ searchParams }: Props) => {
  const { dashboardType } = await searchParams;

  const types = Object.values(DashboardTypeEnum) as DashboardTypeEnum[]; // Cast to TypeEnum[]
  const currentType = types.includes(dashboardType as DashboardTypeEnum)
    ? (dashboardType as DashboardTypeEnum)
    : undefined;

  return (
    <ListWrapper>
      <NewVisitPlan currentType={currentType} />
    </ListWrapper>
  );
};

export default NewVisitPlanPage;
