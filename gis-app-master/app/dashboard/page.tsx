import DashboardEvaluation from "./components/Evaluation/DashboardEvaluation";
import DashboardMonitoring from "./components/DashboardMonitoring";
import { DashboardType, DashboardTypeEnum } from "./types/types";
import { cookies } from "next/headers";

interface Props {
  searchParams: Promise<{
    dashboardType: DashboardType;
  }>;
}

const DashboardPage = async ({ searchParams }: Props) => {
  const { dashboardType } = await searchParams;

  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value;

  // Administrative secretary can only access Evaluation
  if (role?.toLowerCase() === "administrative secretary") {
    return <DashboardEvaluation />;
  }

  const types = Object.values(DashboardTypeEnum) as DashboardTypeEnum[];

  const currentType = types.includes(dashboardType as DashboardTypeEnum)
    ? (dashboardType as DashboardTypeEnum)
    : undefined;

  return currentType ? <DashboardEvaluation /> : <DashboardMonitoring />;
};

export default DashboardPage;
