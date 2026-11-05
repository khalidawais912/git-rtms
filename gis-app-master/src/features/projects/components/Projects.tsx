import ProjectsList from "./ProjectsList";
import ListWrapper from "@/components/ListWrapper";

const Projects = ({ dashboardType }: { dashboardType?: string }) => {
  return (
    <ListWrapper>
      <ProjectsList dashboardType={dashboardType} />
    </ListWrapper>
  );
};

export default Projects;
