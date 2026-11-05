import ListWrapper from "@/components/ListWrapper";
import HierarchyBuilder from "./components/SecondTry/HirarchyBuilder";

const ProcessPage = () => {
  return (
    <ListWrapper>
      <div style={{ height: "86vh" }}>
        <HierarchyBuilder />
      </div>
    </ListWrapper>
  );
};

export default ProcessPage;
