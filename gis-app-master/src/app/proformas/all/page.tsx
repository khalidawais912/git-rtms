import { isProformaType } from "@/features/proformas/adapters";
import { isProjectView } from "@/features/proformas/projectRows";
import ProjectList from "@/features/proformas/components/ProjectList";

interface Props {
  searchParams: { type?: string; view?: string };
}

/** Total PC(IV)s / Total PC(V)s: `?type=pc5` opens the PC-V list, `&view=` one dashboard tile. */
const ProformaProjectsPage = ({ searchParams }: Props) => (
  <ProjectList
    initialType={isProformaType(searchParams.type) ? searchParams.type : "pc4"}
    view={isProjectView(searchParams.view) ? searchParams.view : undefined}
  />
);

export default ProformaProjectsPage;
