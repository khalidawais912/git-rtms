import Image from "next/image";
// import { StaffTracking } from "./MapComponent";
import tickStar from "../../../../public/icons/tickStar.svg";
import whiteBuilding from "../../../../public/icons/whiteBuilding.svg";
import { DistrictProjects } from "./MyMap";

interface Props {
  data: DistrictProjects;
}

const ProjectCard = ({ data }: Props) => {
  return (
    <div
      className="card border-0"
      style={{
        width: "250px",
        borderRadius: "10px",
      }}
    >
      <p className="m-2 mb-1 fw-normal fs-6" style={{ letterSpacing: 1 }}>
        {data.name}
      </p>
      <p className="col m-2 mb-3 fw-normal fs-6">
        <span
          className="col p-1 rounded me-1 text-white"
          style={{ background: "#B5FFB2" }}
        >
          <Image
            src={tickStar}
            style={{ marginBottom: "1.5px" }}
            alt="tickStar"
          />{" "}
          {data.sectorId && data.sectorId}
          {/* {new Date(data.approvalDate).toLocaleDateString(
                            "en-GB",
                            {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )} */}
        </span>
        <span
          className="col p-1 rounded text-white"
          style={{ background: "rgba(12, 140, 233, 0.35)" }}
        >
          <Image
            src={whiteBuilding}
            style={{ marginBottom: "1.5px" }}
            alt="whiteBuilding"
          />{" "}
          {data.districtId}
        </span>
      </p>
    </div>
  );
};

export default ProjectCard;
