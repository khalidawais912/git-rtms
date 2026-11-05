import List from "./List";
import ListWrapper from "@/components/ListWrapper";

const Attributes = ({ dashboardType }: { dashboardType?: string }) => {
  return (
    <ListWrapper>
      <List dashboardType={dashboardType} />
    </ListWrapper>
  );
};

export default Attributes;
