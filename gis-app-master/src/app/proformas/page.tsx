import { isProformaType } from "@/features/proformas/adapters";
import ProformaList from "@/features/proformas/components/ProformaList";
import { isProformaTab } from "@/features/proformas/utils";

interface Props {
  searchParams: { type?: string; tab?: string };
}

/** List of Proformas: PC-IV and PC-V. `?type=pc5&tab=inprogress` opens that list and step. */
const ProformasPage = ({ searchParams }: Props) => (
  <ProformaList
    initialType={isProformaType(searchParams.type) ? searchParams.type : "pc4"}
    initialTab={isProformaTab(searchParams.tab) ? searchParams.tab : "all"}
  />
);

export default ProformasPage;
