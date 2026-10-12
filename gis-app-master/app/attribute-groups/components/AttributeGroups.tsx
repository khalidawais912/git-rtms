import ListWrapper from "@/app/components/ListWrapper";
import List from "./List";

const AttributeGroups = ({ dashboardType }: { dashboardType?: string }) => {
  return (
    <ListWrapper>
      <List dashboardType={dashboardType} />
    </ListWrapper>
  );
};

export default AttributeGroups;
