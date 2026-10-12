import approved from "@/public/icons/approved.svg";
import dropped from "@/public/icons/dropped.svg";
import unApproved from "@/public/icons/unapproved.svg";
import Image from "next/image";
import { ProgressBar } from "react-bootstrap";
import { DistrictList } from "../Dashboard";

interface Props {
  data: DistrictList;
}

const DistrictCard = ({ data }: Props) => {
  return (
    <div
      className="card border-0"
      style={{
        borderRadius: "10px",
        padding: "10px",
      }}
    >
      <div className="col fw-bold fs-6">{data.divisionName}</div>
      <div className="col fw-normal fs-6" style={{ color: "#28B5E1" }}>
        {data.districtName}
      </div>
      <div className="row d-flex m-0 fs-6 m-2">
        <div
          className="col shadow-sm p-2 me-2 d-flex"
          style={{ borderRadius: "5px" }}
        >
          <Image src={approved} alt="approved" width={40} height={40} />
          &nbsp;
          <div className="col">
            <p className="m-0 fw-bold">{data.approved}</p>
            <p className="m-0 text-secondary fw-normal">Approved</p>
          </div>
        </div>
        <div
          className="col shadow-sm p-2 d-flex"
          style={{ borderRadius: "5px" }}
        >
          <Image src={unApproved} alt="unApproved" width={40} height={40} />
          &nbsp;
          <div className="col">
            <p className="m-0 fw-bold">{data.unApproved}</p>
            <p className="m-0 text-secondary fw-normal">Unapproved</p>
          </div>
        </div>
      </div>
      <div
        className="col shadow-sm p-2 m-2 d-flex fs-6"
        style={{ borderRadius: "5px" }}
      >
        <Image src={dropped} alt="dropped" width={40} height={40} />
        &nbsp;
        <div className="col">
          <p className="m-0 fw-bold">{data.dropped}</p>
          <p className="m-0 text-secondary fw-normal">Dropped Projects</p>
        </div>
      </div>
      <div className="col">
        <ProgressBar className="bg-white">
          <ProgressBar
            variant="success"
            now={data.good}
            max={1}
            key={1}
            label={`Good`}
            className="bg-white text-dark"
          />
          <ProgressBar
            variant="warning"
            now={data.average}
            max={1}
            key={2}
            label={`Average`}
            className="bg-white text-dark"
          />
          <ProgressBar
            variant="danger"
            now={data.crtical}
            max={1}
            key={3}
            label={`Critical`}
            className="bg-white text-dark"
          />
        </ProgressBar>

        <ProgressBar className="rounded-pill">
          <ProgressBar
            variant="success"
            now={data.good}
            max={1}
            key={4}
            className="rounded-pill"
            label={`${data.good}`}
            style={{
              backgroundImage: "linear-gradient(to top, #6EBD18 , #7ED321)",
            }}
          />
          <ProgressBar
            variant="warning"
            now={data.average}
            max={1}
            key={5}
            className="rounded-pill"
            label={`${data.average}`}
            style={{
              backgroundImage: "linear-gradient(to top, #F0B30F , #FDCA40)",
            }}
          />
          <ProgressBar
            variant="danger"
            now={data.crtical}
            max={1}
            key={6}
            className="rounded-pill"
            label={`${data.crtical}`}
            style={{
              backgroundImage: "linear-gradient(to top, #BE1707 , #D62C2C)",
            }}
          />
        </ProgressBar>
      </div>
      {/* <div
        className="row d-flex m-1 mb-0 fw-normal fs-6"
        style={{ letterSpacing: 1 }}
      >
        <div className="col fw-bold">Division</div>
        <div className="col text-end color-sea-blue fs-6 fw-bold">Division</div>
      </div>
      <div
        className="row d-flex m-1 fw-normal fs-6"
        style={{ letterSpacing: 1 }}
      >
        <div className="col" style={{ whiteSpace: "nowrap" }}>
          {data?.districtName}
        </div>
        <div
          className="col text-end color-sea-blue fs-6"
          style={{ whiteSpace: "nowrap" }}
        >
          {data?.divisionName}
        </div>
      </div> */}
    </div>
  );
};

export default DistrictCard;
