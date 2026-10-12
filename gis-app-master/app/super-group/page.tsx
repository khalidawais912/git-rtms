import { DashboardType, DashboardTypeEnum } from "../dashboard/types/types";
import SuperGroup from "./components/SuperGroup";

interface Props {
  searchParams: Promise<{
    dashboardType: DashboardType;
  }>;
}

const SuperGroupPage = async ({ searchParams }: Props) => {
  const { dashboardType } = await searchParams;

  const types = Object.values(DashboardTypeEnum) as DashboardTypeEnum[]; // Cast to TypeEnum[]
  const currentType = types.includes(dashboardType as DashboardTypeEnum)
    ? (dashboardType as DashboardTypeEnum)
    : undefined;

  return (
    <>
      <SuperGroup dashboardType={currentType} />
    </>
  );
};

export default SuperGroupPage;
