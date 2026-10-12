import { DashboardType, DashboardTypeEnum } from "../dashboard/types/types";
import AttributeGroups from "./components/AttributeGroups";

interface Props {
  searchParams: Promise<{
    dashboardType: DashboardType;
  }>;
}

const AttributeGroupsPage = async ({ searchParams }: Props) => {
  const { dashboardType } = await searchParams;

  const types = Object.values(DashboardTypeEnum) as DashboardTypeEnum[]; // Cast to TypeEnum[]
  const currentType = types.includes(dashboardType as DashboardTypeEnum)
    ? (dashboardType as DashboardTypeEnum)
    : undefined;

  return (
    <>
      <AttributeGroups dashboardType={currentType} />
    </>
  );
};

export default AttributeGroupsPage;
