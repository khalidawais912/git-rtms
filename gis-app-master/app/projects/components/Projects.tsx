import ProjectsList from "./ProjectsList";
import ListWrapper from "@/app/components/ListWrapper";

const Projects = ({ dashboardType }: { dashboardType?: string }) => {
  return (
    <ListWrapper>
      <ProjectsList dashboardType={dashboardType} />
      {/* <span>
          Image:
          <DownloadPDFBtn />
        </span>
        <DownloadFile /> */}
    </ListWrapper>
  );
};

export default Projects;
