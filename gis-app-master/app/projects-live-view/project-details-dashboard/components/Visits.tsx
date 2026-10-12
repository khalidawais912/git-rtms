import Image from "next/image";
import redCircle from "../../../public/icons/redCircle.svg";
import road from "../../../public/icons/road.svg";
import { SingleProjectDashboard } from "./ProjectDetailsDashboard";

interface Props {
  data: SingleProjectDashboard;
}

const Visits = ({ data }: Props) => {
  return (
    <div
      className="col p-1 shadow-sm"
      style={{ background: "#C6D9F1", borderRadius: "15px" }}
    >
      <div className="row m-0">
        <div className="col text-end p-0">
          <Image src={redCircle} alt="redCircle" />
        </div>
      </div>
      <div className="row d-flex ps-3 pb-2">
        <div className="col-2 p-0">
          <Image src={road} alt="road" />
        </div>
        <div className="col">
          <div className="row d-flex">
            <div className="col-9">
              <p className="text-secondary m-0" style={{ fontSize: ".9rem" }}>
                {data?.name}{" "}
              </p>
            </div>
            <div className="col pt-2">
              <p
                className="m-0"
                style={{ fontSize: ".6rem", color: "#E9E9E9" }}
              >
                Am
              </p>
              <p className="m-0 text-white" style={{ fontSize: ".8rem" }}>
                09:00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visits;
