import arrowDown from "@/public/icons/arrowDown.svg";
import arrowTopRight from "@/public/icons/arrowTopRight.svg";
import leaf from "@/public/icons/leaf.svg";
import tree from "@/public/icons/tree.svg";
import Image from "next/image";

const ProjectTab = () => {
  return (
    <div
      className="col shadow-sm mb-3 p-3"
      style={{
        background: "#C6D9F1",
        borderRadius: "15px",
        fontSize: ".9rem",
      }}
    >
      <div className="col text-end">
        <Image src={arrowTopRight} alt="arrowTopRight" />
      </div>
      <div className="row d-flex">
        <div className="col-lg-1 col-md-1 col-sm-12 ms-3 mt-2">
          <Image src={leaf} alt="leaf" />
        </div>
        <div className="col-lg-10 col-md-10 col-sm-12 ms-1">
          <p
            className="text-start m-0 fs-4 mb-1 ms-1"
            style={{ fontWeight: "900" }}
          >
            title
          </p>
          <div className="row d-flex ms-1">
            <div
              className=" col p-2 fs12px text-center me-2 mb-1 mb-1"
              style={{
                color: "#0C8CE9",
                background: "#E2F2F8",
                borderRadius: "7px",
                fontWeight: "900",
              }}
            >
              Total Visit : 5
            </div>
            <div
              className=" col p-2 fs12px text-center me-2 mb-1"
              style={{
                color: "#0C8CE9",
                background: "#E2F2F8",
                borderRadius: "7px",
                fontWeight: "900",
              }}
            >
              Total Reports: 3
            </div>
            <div
              className=" col p-2 fs12px text-center me-2 mb-1"
              style={{
                color: "#0C8CE9",
                background: "#E2F2F8",
                borderRadius: "7px",
                fontWeight: "900",
              }}
            >
              Schemes: 3
            </div>
            <div
              className=" col p-2 fs12px text-center me-2 mb-1"
              style={{
                color: "#0C8CE9",
                background: "#E2F2F8",
                borderRadius: "7px",
                fontWeight: "900",
              }}
            >
              Monitored 4 &nbsp;
              <Image src={arrowDown} alt="arrowDown" />
            </div>
          </div>
        </div>
      </div>
      <div
        className="row d-none d-md-block"
        style={{ marginTop: "-8px", marginLeft: "100px" }}
      >
        <Image src={tree} alt="tree" width={50} height={50} />
        <div className="row d-flex justify">
          <div className="col-4 text-center">
            <p
              className="text-danger fw-bold"
              style={{
                fontWeight: "500",
                marginLeft: "-30px",
                marginBottom: 0,
              }}
            >
              Critical
              <br />3
            </p>
          </div>
          <div className="col-4">
            <p
              className="m-0 text-center fw-bold"
              style={{ color: "#2AA0F6", fontWeight: "500" }}
            >
              Within Defined Limits
              <br />1
            </p>
          </div>
          <div className="col-4">
            <p
              className="text-center fw-bold"
              style={{
                color: "#F2D01B",
                fontWeight: "500",
                marginLeft: "10px",
                marginBottom: 0,
              }}
            >
              Need Consideration
              <br />5
            </p>
          </div>
        </div>
      </div>
      <div className="row d-flex ps-3 pe-3 pt-3">
        <div
          className="col-lg-2 col-md-2 col rounded-3 text-center fs14px me-2 p-1 mb-1"
          style={{ background: "rgba(255,255,255,.5)" }}
        >
          <span className="fw-bold">Cost</span>
          <br />
          970.73 B
        </div>
        <div
          className="col-lg-2 col-md-2 col rounded-3 text-center fs14px me-2 p-1 mb-1"
          style={{ background: "rgba(255,255,255,.5)" }}
        >
          <span className="fw-bold">Allocation</span>
          <br />
          278.13 B
        </div>
        <div
          className="col-lg-3 col-md-3 col rounded-3 text-center fs14px me-2 p-1 mb-1"
          style={{ background: "rgba(255,255,255,.5)" }}
        >
          <span className="fw-bold">Current Year Release</span>
          <br />
          100.13 B
        </div>
        <div
          className="col-lg-2 col-md-2 col rounded-3 text-center fs14px me-2 p-1 mb-1"
          style={{ background: "rgba(255,255,255,.5)" }}
        >
          <span className="fw-bold">Total Release</span>
          <br />
          2.25 B
        </div>
        <div
          className="col-lg-2 col-md-2 col rounded-3 text-center fs14px me-2 p-1 mb-1"
          style={{ background: "rgba(255,255,255,.5)" }}
        >
          <span className="fw-bold">Utilization</span>
          <br />
          0.00 B
        </div>
      </div>
    </div>
  );
};

export default ProjectTab;
