// import DownloadPDFTest from "./components/DownloadPDFTest";

import { DashboardType, DashboardTypeEnum } from "../dashboard/types/types";
import Projects from "./components/Projects";

interface Props {
  searchParams: Promise<{
    dashboardType: DashboardType;
  }>;
}

const ProjectPage = async ({ searchParams }: Props) => {
  const { dashboardType } = await searchParams;

  const types = Object.values(DashboardTypeEnum) as DashboardTypeEnum[]; // Cast to TypeEnum[]
  const currentType = types.includes(dashboardType as DashboardTypeEnum)
    ? (dashboardType as DashboardTypeEnum)
    : undefined;

  return (
    <>
      <Projects dashboardType={currentType} />
      {/* <DownloadPDFTest /> */}
    </>
  );
};

export default ProjectPage;
