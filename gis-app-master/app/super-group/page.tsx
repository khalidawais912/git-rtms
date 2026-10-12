import { DashboardType, DashboardTypeEnum } from "@/shared/types/dashboard";
import SuperGroup from "@/features/super-group/components/SuperGroup";

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
