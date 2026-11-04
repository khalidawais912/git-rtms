import { isProformaType } from "@/features/proformas/adapters";
import ProjectList from "@/features/proformas/components/ProjectList";

interface Props {
  searchParams: { type?: string };
}

/** Total PC(IV)s / Total PC(V)s: `?type=pc5` opens the PC-V list. */
const ProformaProjectsPage = ({ searchParams }: Props) => (
  <ProjectList initialType={isProformaType(searchParams.type) ? searchParams.type : "pc4"} />
);

export default ProformaProjectsPage;
