import { isProformaType } from "@/features/proformas/adapters";
import ProformaList from "@/features/proformas/components/ProformaList";
import { isProformaList, isProformaTab } from "@/features/proformas/utils";

interface Props {
  searchParams: { type?: string; list?: string; tab?: string };
}

/**
 * List of Proformas: PC-IV and PC-V. `?type=pc5&tab=dgme` opens that type and step;
 * `&list=referback` shows the Referback tile's tabs.
 */
const ProformasPage = ({ searchParams }: Props) => {
  const { tab } = searchParams;
  return (
    <ProformaList
      initialType={isProformaType(searchParams.type) ? searchParams.type : "pc4"}
      list={isProformaList(searchParams.list) ? searchParams.list : "main"}
      initialTab={isProformaTab(tab) ? tab : undefined}
    />
  );
};

export default ProformasPage;
