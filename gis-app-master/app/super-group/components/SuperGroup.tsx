import ListWrapper from "@/app/components/ListWrapper";
import List from "./List";

const SuperGroup = ({ dashboardType }: { dashboardType?: string }) => {
  return (
    <ListWrapper>
      <List dashboardType={dashboardType} />
    </ListWrapper>
  );
};

export default SuperGroup;
