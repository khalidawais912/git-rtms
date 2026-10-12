import React from "react";
import { Attributes } from "../ProjectDetailsDashboard";
import RenderRichText from "../RenderRichText";

interface Props {
  data: Attributes;
  setSelectedStaffIndex: React.Dispatch<React.SetStateAction<number>>;
}

const ProjectCard = ({ data, setSelectedStaffIndex }: Props) => {
  return (
    <div
      style={{
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: "white",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
      }}
      className="p-2 rounded shadow"
    >
      <div className="row d-flex m-0">
        <div className="col mb-2 fs-6 fw-bold">{data.label}</div>
        <div className="col text-end p-0">
          <button
            className="p-0 btn shadow-none"
            onClick={() => setSelectedStaffIndex(9999 + Math.random())}
          >
            <img src="/icons/cross.svg" alt="cross" />
          </button>
        </div>
      </div>
      {data.values[0].verificatioContentPath && (
        <img
          src={`${process.env.NEXT_PUBLIC_BACKEND_API}${data.values[0].verificatioContentPath}`}
          alt="obervation image"
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
          className="img-fluid"
        />
      )}
      <p className="m-0 fs-6 fw-normal">
        {data.values[0].remarks && (
          <RenderRichText data={data.values[0].remarks} />
        )}
      </p>
    </div>
  );
};

export default ProjectCard;
