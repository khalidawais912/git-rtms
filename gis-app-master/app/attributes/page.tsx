import { DashboardType, DashboardTypeEnum } from "../dashboard/types/types";
import Attributes from "./components/Attributes";

interface Props {
  searchParams: Promise<{
    dashboardType: DashboardType;
  }>;
}

const AttributesPage = async ({ searchParams }: Props) => {
  const { dashboardType } = await searchParams;

  const types = Object.values(DashboardTypeEnum) as DashboardTypeEnum[]; // Cast to TypeEnum[]
  const currentType = types.includes(dashboardType as DashboardTypeEnum)
    ? (dashboardType as DashboardTypeEnum)
    : undefined;

  return (
    <>
      <Attributes dashboardType={currentType} />
    </>
  );
};

export default AttributesPage;
