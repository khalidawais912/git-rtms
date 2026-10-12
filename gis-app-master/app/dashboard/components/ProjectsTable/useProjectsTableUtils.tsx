import { OptionType } from "@/shared/components/types";
import useDistrict from "@/app/hooks/useDistrict";
import { useSectors } from "@/features/sectors";
import { useUsers } from "@/features/users";
import { useMemo } from "react";

const useProjectsTableUtils = () => {
  const { data: districts } = useDistrict();
  const { data: sectors } = useSectors();
  const { data: users } = useUsers();

  const rowCountOptions: OptionType[] = useMemo(() => {
    const rowCounts = [10, 20, 30, 40, 50];
    return rowCounts.map((d) => ({
      value: d.toString(),
      label: d.toString(),
    }));
  }, []);

  const districtOptions = districts.map((district) => {
    return {
      value: district.districtName,
      label: district.districtName,
    };
  });

  const sectorOptions = sectors.map((sector) => {
    return {
      value: sector.name,
      label: sector.name,
    };
  });

  const userOptions = users.map((user) => {
    return {
      value: user.name,
      label: user.name,
    };
  });

  return { rowCountOptions, districtOptions, sectorOptions, userOptions };
};

export default useProjectsTableUtils;
