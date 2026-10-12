import { formatDateTime } from "@/app/utils";
import cultus from "@/public/icons/cultus.svg";
import distanceTraveled from "@/public/icons/distanceTraveled.svg";
import galon from "@/public/icons/galon.svg";
import greenCircle from "@/public/icons/greenCircle.svg";
import meter2 from "@/public/icons/meter2.svg";
import petrol from "@/public/icons/petrol.svg";
import redCircle2 from "@/public/icons/redCircle2.svg";
import Image from "next/image";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Tracking } from "./MapCarsComponent";

interface Props {
  apiData: Tracking;
}

const CarCard = ({ apiData }: Props) => {
  return (
    <div
      className="card border-0"
      style={{
        width: "420px",
        borderRadius: "10px",
      }}
    >
      <div className="container p-0 position-relative shadow-sm text-center">
        <Image
          src={cultus}
          className="img-fluid card-img-top mt-2 mb-5"
          style={{
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            objectFit: "contain",
            width: "250px",
            height: "150px",
          }}
          alt="cultus"
        />
        {apiData["GBB-062"]["Engine value"] === "stopped" ? (
          <div
            className="position-absolute text-white fs14px rounded-3 fw-normal bg-danger"
            style={{
              top: "10px",
              right: "10px",
              borderRadius: "5px",
              letterSpacing: 1,
              padding: "5px 12px 2px 12px",
            }}
          >
            Stopped
          </div>
        ) : (
          <div
            className="position-absolute text-white fs14px rounded-3 fw-normal"
            style={{
              top: "10px",
              right: "10px",
              borderRadius: "5px",
              background: "#22B07D",
              letterSpacing: 1,
              padding: "5px 12px 2px 12px",
            }}
          >
            In Use
          </div>
        )}

        <div
          className="position-absolute  rounded-3 fw-normal"
          style={{
            bottom: "25px",
            left: "0px",
            borderRadius: "5px",
            letterSpacing: 1,
            padding: "5px 12px 2px 12px",
          }}
        >
          {apiData["GBB-062"]["Engine value"] === "stopped" ? (
            <>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-top`}>Engine: Off</Tooltip>}
              >
                <Image
                  src={redCircle2}
                  width={10}
                  height={10}
                  className="mb-1 me-1"
                  alt="redCircle2"
                />
              </OverlayTrigger>
            </>
          ) : (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id={`tooltip-top`}>Engine Running</Tooltip>}
            >
              <Image
                src={greenCircle}
                width={12}
                height={12}
                className="mb-1"
                alt="greenCircle"
              />
            </OverlayTrigger>
          )}
          {apiData["GBB-062"].Vehicle_Make} {apiData["GBB-062"].Vehicle_Model}{" "}
          <img
            src="/icons/rightTriangleBlue.svg"
            alt="rightTriangleBlue"
            className="img-fluid"
            style={{ width: "7px", marginBottom: "2px" }}
          />
        </div>
        <div
          className="position-absolute  rounded-3 fw-normal"
          style={{
            bottom: "25px",
            right: "0px",
            borderRadius: "5px",
            letterSpacing: 1,
            padding: "5px 12px 2px 12px",
          }}
        >
          {apiData["GBB-062"].Vehicle_Device}
        </div>
        <div
          className="position-absolute  rounded-3 fw-normal"
          style={{
            bottom: "0px",
            left: "0px",
            borderRadius: "5px",
            letterSpacing: 1,
            padding: "5px 12px 2px 12px",
          }}
        >
          <Image
            src={meter2}
            width={20}
            height={20}
            style={{ marginBottom: "2px" }}
            alt="meter2"
          />{" "}
          {apiData["GBB-062"].Speed} km/h
        </div>
        <div
          className="position-absolute  rounded-3 fw-normal"
          style={{
            bottom: "0px",
            left: "24%",
            borderRadius: "5px",
            letterSpacing: 1,
            padding: "5px 12px 2px 12px",
          }}
        >
          <Image
            src={distanceTraveled}
            width={20}
            height={20}
            style={{ marginBottom: "2px" }}
            alt="distanceTraveled"
          />{" "}
          {apiData["GBB-062"]["Distance traveled"]} km
        </div>

        <div
          className="position-absolute  rounded-3 fw-normal"
          style={{
            bottom: "0px",
            left: "52%",
            borderRadius: "5px",
            letterSpacing: 1,
            padding: "5px 12px 2px 12px",
          }}
        >
          <Image
            src={petrol}
            width={18}
            height={18}
            style={{ marginBottom: "2px" }}
            alt="petrol"
          />{" "}
          {apiData["GBB-062"]["Fuel burned"]} Ltr
        </div>

        <div
          className="position-absolute  rounded-3 fw-normal"
          style={{
            bottom: "0px",
            right: "0px",
            borderRadius: "5px",
            letterSpacing: 1,
            padding: "5px 12px 2px 12px",
          }}
        >
          <Image
            src={galon}
            width={20}
            height={20}
            style={{ marginBottom: "2px" }}
            alt="galon"
          />{" "}
          {Math.round(
            Number(apiData["GBB-062"]["Distance traveled"]) /
              Number(apiData["GBB-062"]["Fuel burned"])
          )}{" "}
          KM/L
        </div>
      </div>
      <div className="card-body pt-2 pb-2 pe-0">
        {/* <div
          className="row d-flex m-0 mb-2 pb-1"
          style={{ borderBottom: "1px dashed #D5D5D5" }}
        >
          <div className="col-2 p-0 m-auto">
            <img
              src="/images/sadiqMunawar.jpg"
              className="mb-1 img-fluid rounded-circle"
              style={{ width: "37px", height: "37px", objectFit: "cover" }}
              alt="sadiqMunawar"
            />
          </div>
          <div className="col ps-0 pe-0">
            <p className="mt-1 mb-0 fw-normal " style={{ letterSpacing: 1 }}>
              <div className="row d-flex mt-1">
                <div className="col pe-0">Sadiq Munawar</div>
                <div
                  className="col text-end color-sea-blue fs14px ps-0"
                  style={{ marginTop: "2px" }}
                >
                  Forest Agriculture & Livestock Expert (BS-17)
                </div>
              </div>
            </p>
            <p
              className="m-0 mt-1  fw-normal text-secondary"
              style={{ letterSpacing: 1 }}
            >
              <Image
                src={phone3}
                width={20}
                height={20}
                className="mb-1"
                alt="phone3"
              />
              &nbsp;+92 333 4976011
            </p>
          </div>
        </div>
        <div className="row d-flex m-0">
          <div className="col-2 p-0 m-auto">
            <img
              src="/images/aliRaza.jpg"
              className="mb-1 img-fluid rounded-circle"
              style={{ width: "37px", height: "37px", objectFit: "cover" }}
              alt="driver2"
            />
          </div>
          <div className="col ps-0 pe-0">
            <p className="mt-1 mb-0 fw-normal " style={{ letterSpacing: 1 }}>
              <div className="row d-flex mt-1">
                <div className="col pe-0">Ali Raza (junior)</div>
                <div
                  className="col-3 text-end color-sea-blue fs14px ps-0"
                  style={{ marginTop: "2px" }}
                >
                  Driver
                </div>
              </div>
            </p>
            <p
              className="m-0 mt-1  fw-normal text-secondary"
              style={{ letterSpacing: 1 }}
            >
              <Image
                src={phone3}
                width={20}
                height={20}
                className="mb-1"
                alt="phone3"
              />
              &nbsp;03182342344
            </p>
          </div>
        </div> */}
        <div
          className="row d-flex mb-2"
          style={{ marginLeft: "-20px", marginRight: "0px" }}
        >
          <div className="col-1 p-0">
            <img
              src="/icons/twoCirclesVertical.svg"
              alt="twoCirclesVertical"
              className="img-fluid mt-1"
              style={{ width: "100%", height: "60px" }}
            />
          </div>
          <div className="col p-0">
            <div className="col p-0 mb-1">
              <p className="m-0 fs14px fw-normal" style={{ color: "#7A889C" }}>
                Start Location
              </p>
              <p className="m-0 fs-6 fw-normal">
                {apiData["GBB-062"]["First Ignition Location"]}
              </p>
            </div>
            <div className="col p-0">
              <p className="m-0 fs14px fw-normal" style={{ color: "#7A889C" }}>
                End Location
              </p>
              <p className="m-0 fs-6 fw-normal">
                {apiData["GBB-062"]["Last Ignition Location"]}
              </p>
            </div>
          </div>
        </div>
        <div className="row d-flex m-0 mb-2">
          <div className="col">
            <p
              className="fs14px m-0 fw-normal text-center"
              style={{ color: "#7A889C" }}
            >
              Visit Start Time
            </p>
            <p className="fs-6 m-0 fw-normal text-center">
              {formatDateTime(
                apiData["GBB-062"]["First Ignition On Time"],
                "time"
              )}
            </p>
          </div>
          <div className="col-1 p-0 img-fluid">
            <img
              src="/icons/verticalLine.svg"
              alt="verticalLine"
              className="img-fluid"
              style={{ width: "100%", height: "30px" }}
            />
          </div>
          <div className="col">
            <p
              className="fs14px m-0 fw-normal text-center"
              style={{ color: "#7A889C" }}
            >
              Visit Start Date
            </p>
            <p className="fs-6 m-0 fw-normal text-center">
              {formatDateTime(
                apiData["GBB-062"]["First Ignition On Time"],
                "date"
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
