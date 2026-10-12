import Image from "next/image";
import Button from "../components/Button";
import ListWrapper from "../components/ListWrapper";
import { SlSizeFullscreen } from "react-icons/sl";
import { MdOutlineRemoveRedEye } from "react-icons/md";
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
