import { FaCircle } from "react-icons/fa";
import Card from "../Card";
import { SingleProjectDashboard } from "../ProjectDetailsDashboard";
import { useEffect, useState } from "react";

interface Props {
  data: SingleProjectDashboard;
}

const ProgressScaled = ({ data }: Props) => {
  const [physicalVsPlanned, setPhysicalVsPlanned] = useState<number>();
  const [achievedVsFinancial, setAchievedVsFinancial] = useState<number>();

  const PLANNED_PHYSICAL_PROGRESS = "planned physical progress";
  const ACTUAL_PHYSICAL_PROGRESS = "actual physical progress";
  const PLANNED_VS_ACTUAL_PHYSICAL_PROGRESS =
    "planned physical progress\n vs actual physical progress";

  const ACTUAL_FINANCIAL_PROGRESS = "actual financial progress";
  const ACTUAL_PHYSICAL_VS_ACTUAL_FINANCIAL_PROGRESS =
    "actual physical progress vs actual financial progress";

  useEffect(() => {
    if (data) {
      const physicalProgressVsPlannedProgress = data.groups
        .find((group) => group.name.toLowerCase().includes("progress analysis"))
        ?.attributes.filter(
          (attribute) =>
            attribute.label.toLowerCase() ===
            PLANNED_VS_ACTUAL_PHYSICAL_PROGRESS
        )[0];

      if (physicalProgressVsPlannedProgress?.values[0]?.value) {
        setPhysicalVsPlanned(
          parseFloat(physicalProgressVsPlannedProgress?.values[0]?.value)
        );
      }

      console.log("physicalVsPlanned:", physicalVsPlanned);

      const achievedProgressVsFinancialProgress = data.groups
        .find((group) => group.name.toLowerCase().includes("progress analysis"))
        ?.attributes.filter(
          (attribute) =>
            attribute.label.toLowerCase() ===
            ACTUAL_PHYSICAL_VS_ACTUAL_FINANCIAL_PROGRESS
        )[0];

      if (achievedProgressVsFinancialProgress) {
        setAchievedVsFinancial(
          parseFloat(achievedProgressVsFinancialProgress?.values[0]?.value)
        );
      }
      console.log("achievedVsFinancial:", achievedVsFinancial);
    }
  }, [data]);

  return (
    <Card>
      <div className="d-flex flex-column" style={{ gap: "2.6px" }}>
        <div>
          <p
            className="m-0 fs10px fw-bold text-white"
            style={{ marginBottom: "5px" }}
          >
            Physical Progress
          </p>
          {data.groups
            .find((group) =>
              group.name.toLowerCase().includes("progress analysis")
            )
            ?.attributes.filter(
              (attribute) =>
                attribute.hidden === 0 &&
                [
                  PLANNED_PHYSICAL_PROGRESS,
                  ACTUAL_PHYSICAL_PROGRESS,
                  PLANNED_VS_ACTUAL_PHYSICAL_PROGRESS,
                ].includes(attribute.label.toLowerCase())
            )
            .map((attribute) => (
              <div
                key={attribute.attributeId}
                className="color-sea-blue d-flex justify-content-between"
                style={{
                  padding: "4.1px 4.3px",
                  background: "rgba(226, 232, 240, 0.1)",
                  borderRadius: "3.4px",
                  marginBottom: "1.5px",
                }}
              >
                <span className="fw-5 fs6px">
                  {attribute.label.toLowerCase() ===
                  PLANNED_VS_ACTUAL_PHYSICAL_PROGRESS
                    ? parseFloat(attribute.values[0]?.value) <= 0
                      ? "Lead in Physical Progress"
                      : "Lag in Physical Progress"
                    : attribute.label}
                </span>
                <span className="fw-6 fs7px">
                  {parseFloat(attribute.values[0]?.value)}%
                </span>
              </div>
            ))}
        </div>
        <div>
          <p
            className="m-0 fs10px fw-bold text-white"
            style={{ marginBottom: "5px" }}
          >
            Financial Progress
          </p>
          {data.groups
            .find((group) =>
              group.name.toLowerCase().includes("progress analysis")
            )
            ?.attributes.filter(
              (attribute) =>
                attribute.hidden === 0 &&
                [
                  ACTUAL_FINANCIAL_PROGRESS,
                  ACTUAL_PHYSICAL_VS_ACTUAL_FINANCIAL_PROGRESS,
                ].includes(attribute.label.toLowerCase())
            )
            .map((attribute) => (
              <div
                key={attribute.attributeId}
                className="d-flex justify-content-between"
                style={{
                  color: "#F0AF19",
                  padding: "4.1px 4.3px",
                  background: "rgba(226, 232, 240, 0.1)",
                  borderRadius: "3.4px",
                  marginBottom: "1.5px",
                }}
              >
                <span className="fw-5 fs6px">
                  {attribute.label.toLowerCase() ===
                  PLANNED_VS_ACTUAL_PHYSICAL_PROGRESS
                    ? parseFloat(attribute.values[0]?.value) <= 0
                      ? "Lead in Physical Progress"
                      : "Lag in Physical Progress"
                    : attribute.label}
                </span>
                <span className="fw-6 fs7px">
                  {parseFloat(attribute.values[0]?.value)}%
                </span>
              </div>
            ))}
        </div>
        <div
          className="d-flex justify-content-center gap-2"
          style={{
            borderTop: ".43px solid rgba(226, 232, 240, 0.07)",
            marginRight: "-14px",
            marginLeft: "-14px",
            padding: "4px 10px 0px 10px",
          }}
        >
          <div className="d-flex align-items-center gap-1">
            <FaCircle color="#008FFB" size={7} />
            <span
              className="badge rounded-pill fs3px fw-6"
              style={{
                background: "#141518",
                padding: "1px 2px",
              }}
            >
              {physicalVsPlanned && physicalVsPlanned <= 0 ? (
                <span>
                  Lag in Planned Physical Progress <br /> V/S Achieved Physical
                  Progress
                </span>
              ) : (
                <span>
                  Behind in Planned Physical Progress <br /> V/S Achieved
                  Physical Progress
                </span>
              )}
            </span>
          </div>
          <div className="d-flex align-items-center gap-1">
            <FaCircle color="#F0AF19" size={7} />
            <span
              className="badge rounded-pill fs3px fw-6"
              style={{
                background: "#141518",
                padding: "1px 2px",
              }}
            >
              {achievedVsFinancial && achievedVsFinancial <= 0 ? (
                <span>
                  Lag in Achieved Physical Progress <br />
                  V/S Achieved Financial Progress
                </span>
              ) : (
                <span>
                  Lead in Achieved Physical Progress <br />
                  V/S Achieved Financial Progress
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressScaled;
