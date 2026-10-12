import Menu from "@/app/components/Menu";
import { Groups } from "@/app/project-details-dashboard/components/ProjectDetailsDashboard";
import { useEffect, useState } from "react";

interface Props {
  group: Groups;
}
const MonitoringRatingIndex = ({ group }: Props) => {
  const [mri, setMRI] = useState<number>();
  useEffect(() => {
    const mriValue = group.group
      .find((g) => g.name.toLowerCase() === "performance")
      ?.attributes.find(
        (attribute) =>
          attribute.label.toLowerCase() === "overall project rating"
      )?.values[0]?.value;
    setMRI(Math.round(Number(mriValue)));
  }, [group]);

  return (
    <div
      className="position-relative col p-0"
      // style={{ height: "500px", overflow: "hidden", overflowY: "scroll" }}
    >
      {/* <div
        className="col p-0 bg-white pb-2"
        style={{ position: "sticky", top: "0" }}
      >
        <p className="fw-bold fs18px">Monitoring Rating Index</p>
        <div className="row d-flex m-0 bg-color-sea-blue rounded-pill">
          <div
            className="col-6 rounded-pill d-flex justify-content-center align-items-center text-white"
            style={{ background: "#0468C8" }}
          >
            Criteria
          </div>
          <div className="col-3 d-flex justify-content-center align-items-center text-white">
            Maximum Points
          </div>
          <div className="col-3 d-flex justify-content-center align-items-center text-white">
            Points Obtained
          </div>
        </div>
      </div>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p>
      <p>asd</p> */}
      {mri && (
        <Menu
          value={mri}
          label={
            mri > 70
              ? "MRI (Good)"
              : mri <= 70 && mri >= 35
              ? "MRI (Average)"
              : mri < 35
              ? "MRI (Critical)"
              : ""
          }
          background={
            mri > 70
              ? "linear-gradient(to bottom right, rgba(115, 255, 64,1) , rgba(79, 227, 20,1), rgba(89, 230, 19,1),rgba(72, 223, 17,1),rgba(163, 197, 11,1))"
              : mri <= 70 && mri >= 35
              ? "linear-gradient(to bottom right, rgba(255, 236, 64,1), rgba(227, 227, 20,1), rgba(230, 226, 19,1),rgba(219, 223, 17,1),rgba(197, 191, 11,1))"
              : mri < 35
              ? "linear-gradient(to bottom right, rgba(255, 64, 64,1) , rgba(227, 20, 20,1), rgba(230, 19, 19,1),rgba(223, 17, 17,1),rgba(197, 11, 11,1))"
              : ""
          }
          icon={
            mri > 70
              ? "/icons/doubleTick.svg"
              : mri <= 70 && mri >= 35
              ? "/icons/bulb.svg"
              : mri < 35
              ? "/icons/critical.svg"
              : "/icons/archery.svg"
          }
          outline={
            mri > 70
              ? "1px solid rgba(50, 179, 52, 0.4)"
              : mri <= 70 && mri >= 35
              ? "1px solid rgba(232, 192, 15, 0.4)"
              : mri < 35
              ? "1px solid rgba(233, 12, 16, 0.4)"
              : ""
          }
        />
      )}
    </div>
  );
};

export default MonitoringRatingIndex;
