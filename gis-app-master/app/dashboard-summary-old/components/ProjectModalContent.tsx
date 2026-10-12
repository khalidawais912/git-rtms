import Button from "@/app/components/Button";
import arrowDown from "@/public/icons/arrowDown.svg";
import arrowTopRight from "@/public/icons/arrowTopRight.svg";
import leaf from "@/public/icons/leaf.svg";
import map from "@/public/icons/map.svg";
import maximize2 from "@/public/icons/maximize2.svg";
import tick2 from "@/public/icons/tick2.svg";
import Image from "next/image";

const ProjectModalContent = () => {
  return (
    <div
      className="col mb-3 p-0"
      style={{
        background: "#E8E8E8",
        borderRadius: "15px",
        fontSize: ".9rem",
        marginTop: "-30px",
      }}
    >
      <div className="row d-flex mb-2">
        <div className="col-lg-1 col-md-1 col-sm-12 ms-3 mt-2">
          <Image src={leaf} alt="leaf" />
        </div>
        <div className="col-lg-10 col-md-10 col-sm-12 ms-1">
          <p className="text-start m-0 fs-4 mb-1 ms-1 fw-bold">title</p>
          <div className="row d-flex ms-1">
            <div
              className=" col p-2 fs13px text-center me-2 mb-1 mb-1"
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
              className=" col p-2 fs13px text-center me-2 mb-1"
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
              className=" col p-2 fs13px text-center me-2 mb-1"
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
              className=" col p-2 fs13px text-center me-2 mb-1"
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
        className="col p-4"
        style={{
          background: "rgba(250, 251, 252, 0.60)",
          borderRadius: "8px",
        }}
      >
        <div className="row d-flex m-0 mb-2">
          <div className="col fs18px fw-bold ps-0">
            Chief Minister&apos;s Fund for Promotion of E-mechanization through
            Indigenous Manufacturing of Agricultural Machinery (2024-25 to
            2025-26)
          </div>
          <div className="col-lg-1 col-md-1 col-sm-2 col-2 pe-1 text-end">
            <Image src={maximize2} alt="maximize2" className="img-fluid" />
          </div>
        </div>
        <div className="row d-flex justify-content-between m-0">
          <div className="col-lg-6">
            <div className="row d-flex mb-2">
              <div
                className="col rounded-3 text-center fs13px me-2 py-2 mb-1 fw-normal whiteSpaceNoWrap"
                style={{ background: "rgba(255,255,255,.5)", color: "#87898C" }}
              >
                GS No: <span className="fw-bold">3247</span>
              </div>
              <div
                className="col rounded-3 text-center fs13px me-2 py-2 mb-1 fw-normal whiteSpaceNoWrap"
                style={{ background: "rgba(255,255,255,.5)", color: "#87898C" }}
              >
                Total Visits: <span className="fw-bold">5</span>
              </div>
              <div
                className="col rounded-3 text-center fs13px me-2 py-2 mb-1 fw-normal whiteSpaceNoWrap"
                style={{
                  background: "rgba(255,255,255,.5)",
                  color: "#87898C",
                }}
              >
                Last Visit Date: <span className="fw-bold">15 Jul 2024</span>
              </div>
              <div
                className="col rounded-3 text-center fs13px me-2 py-2 mb-1 fw-normal text-white"
                style={{ background: "#DD2025" }}
              >
                Critical
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-4 col-sm-12">
            <div className="row d-flex mb-2">
              <Button
                className="btn col rounded-3 text-center me-2 ps-1 mb-1 fw-normal"
                style={{
                  background: "rgba(255,255,255,.5)",
                  color: "#87898C",
                  border: "0.783px solid #425166",
                  fontSize: "0.8rem",
                  whiteSpace: "nowrap",
                }}
              >
                <Image
                  src={arrowTopRight}
                  alt="arrowTopRight"
                  width={8}
                  height={8}
                />
                &nbsp;Explore Details
              </Button>
              <Button
                className="btn col rounded-3 text-center me-2 mb-1 fw-normal text-white"
                style={{
                  background: "#197CF0",
                  color: "#87898C",
                  fontSize: "0.8rem",
                }}
              >
                <Image src={map} alt="map" width={13} height={13} />
                &nbsp;View Map
              </Button>
            </div>
          </div>
        </div>
        <div className="col-lg-8 col-md-12 col">
          <div className="row d-flex m-0 mb-2">
            <div
              className="col rounded-3 text-center fs14px me-2 p-1 mb-1"
              style={{ background: "rgba(255,255,255,.5)" }}
            >
              <span className="fw-bold">Cost</span>
              <br />
              970.73 B
            </div>
            <div
              className="col rounded-3 text-center fs14px me-2 p-1 mb-1"
              style={{ background: "rgba(255,255,255,.5)" }}
            >
              <span className="fw-bold">Allocation</span>
              <br />
              278.13 B
            </div>
            <div
              className="col whiteSpaceNoWrap rounded-3 text-center fs14px me-2 p-1 mb-1"
              style={{ background: "rgba(255,255,255,.5)" }}
            >
              <span className="fw-bold">Current Year Release</span>
              <br />
              100.13 B
            </div>
            <div
              className="col whiteSpaceNoWrap rounded-3 text-center fs14px me-2 p-1 mb-1"
              style={{ background: "rgba(255,255,255,.5)" }}
            >
              <span className="fw-bold">Total Release</span>
              <br />
              2.25 B
            </div>
            <div
              className="col rounded-3 text-center fs14px me-2 p-1 mb-1"
              style={{ background: "rgba(255,255,255,.5)" }}
            >
              <span className="fw-bold">Utilization</span>
              <br />
              0.00 B
            </div>
          </div>
        </div>
        <div
          className="col pt-4 p-3"
          style={{
            border: ".8px solid #CBD5E1",
            borderRadius: "8px",
            background: "rgba(250, 251, 252, 0.6)",
          }}
        >
          <div className="row d-flex">
            <div className="col">
              <div
                className="col rounded-circle m-auto text-center"
                style={{ background: "#008C76", width: "40px", height: "40px" }}
              >
                <Image
                  src={tick2}
                  alt="tick2"
                  className="img-fluid rounded-circle"
                  width={15}
                  height={15}
                  style={{ marginTop: "14px" }}
                />
              </div>
              <p className="m-0 fs12px fw-bold text-center my-2">
                Allocated Project
              </p>
              <div
                className="row d-flex bg-white m-0 text-center p-1"
                style={{ borderRadius: "6px" }}
              >
                <div className="col p-0 fs11px">
                  <p className="m-0 whiteSpaceNoWrap fw-bold">15 Jul, 2024</p>
                  <p className="m-0 whiteSpaceNoWrap">Planned Date</p>
                </div>
                <div className="p-0" style={{ width: "2px" }}>
                  <img
                    src="/icons/lineVerticalDashed.svg"
                    alt="lineVerticalDashed"
                    className="img-fluid"
                    style={{ height: "100%", width: "100%" }}
                  />
                </div>
                <div className="col p-0 fs11px">
                  <p className="m-0 whiteSpaceNoWrap fw-bold">Umer Shafique</p>
                  <p className="m-0 whiteSpaceNoWrap">Officer Name</p>
                </div>
              </div>
            </div>
            <div className="col">
              <div
                className="col rounded-circle m-auto text-center bg-white p-1"
                style={{
                  width: "40px",
                  height: "40px",
                  border: "1px solid #0468C8",
                }}
              >
                <div
                  className="col rounded-circle m-auto text-center"
                  style={{
                    background: "#0468C8",
                    width: "30px",
                    height: "30px",
                  }}
                ></div>
              </div>
              <p className="m-0 fs12px fw-bold text-center my-2">Visit Date</p>
              <div
                className="row d-flex bg-white m-0 text-center p-1"
                style={{ borderRadius: "6px" }}
              >
                <div className="col p-0 fs11px">
                  <p className="m-0 whiteSpaceNoWrap fw-bold">15 Jul, 2024</p>
                  <p className="m-0 whiteSpaceNoWrap">Planned Date</p>
                </div>
                <div className="p-0" style={{ width: "2px" }}>
                  <img
                    src="/icons/lineVerticalDashed.svg"
                    alt="lineVerticalDashed"
                    className="img-fluid"
                    style={{ height: "100%", width: "100%" }}
                  />
                </div>
                <div className="col p-0 fs11px">
                  <p className="m-0 whiteSpaceNoWrap fw-bold">Umer Shafique</p>
                  <p className="m-0 whiteSpaceNoWrap">Officer Name</p>
                </div>
              </div>
            </div>
            <div className="col">Report Preparation</div>
            <div className="col">Submitted Report</div>
            <div className="col">Issued Report</div>
            <div className="col">MCM</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModalContent;
