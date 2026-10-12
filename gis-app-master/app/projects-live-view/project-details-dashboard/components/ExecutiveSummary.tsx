import { useEffect, useState } from "react";
import Card from "./Card";
import Button from "@/app/components/Button";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiGridFourBold } from "react-icons/pi";
import { BsCircleFill } from "react-icons/bs";
import { Groups, SingleProjectDashboard } from "./ProjectDetailsDashboard";

interface Props {
  data: SingleProjectDashboard;
}

const ExecutiveSummary = ({ data }: Props) => {
  const [gestationPeriod, setGestationPeriod] = useState(0);
  const [plannedStartDate, setPlannedStartDate] = useState("");
  const [pcICost, setPcICost] = useState(0);
  const [estimatedCostCompletion, setEstimatedCostCompletion] = useState(0);
  const [timeEstimateCompletion, setTimeEstimateCompletion] = useState(0);
  const [criticalObservations, setCriticalObservations] = useState<string[]>(
    []
  );
  const [residentEngineer, setResidentEngineer] = useState(
    data.is_ResidentEngineer
  );
  const [reHiredMonths, setReHiredMonths] = useState<string>("");

  // ✅ Parse group data
  useEffect(() => {
    if (!data?.groups) return;

    // 1️⃣ Observation & Recommendations
    const obsGroup = data.groups.find(
      (g) => g.name === "Observation & Recommendations"
    );
    if (obsGroup) {
      const critical = obsGroup.attributes
        .filter(
          (att) =>
            att.values?.[0]?.value && (att as any).values?.[0]?.priority === 2
        )
        .map((att) => att.values[0].value);
      setCriticalObservations(critical);
    }

    // 2️⃣ Project Profile
    const projectProfile = data.groups.find(
      (g) => g.name === "Project Profile"
    );
    if (projectProfile) {
      projectProfile.attributes.forEach((att) => {
        const val = att.values?.[0]?.value ?? "";
        if (att.label === "Gestation Period" && val)
          setGestationPeriod(Number(val));
        if (att.label === "Planned Start Date" && val) setPlannedStartDate(val);
        if (att.label === "PC-I Cost" && val) setPcICost(Number(val));
      });
    }

    // 3️⃣ Earned Value Analysis
    const evaGroup = data.groups.find(
      (g) => g.name === "Earned Value Analysis"
    );
    if (evaGroup) {
      evaGroup.attributes.forEach((att) => {
        const val = att.values?.[0]?.value ?? "";
        if (att.label === "Estimate Cost at Completion")
          setEstimatedCostCompletion(Number(val));
        if (att.label === "Time Estimate at Completion (TEAC)")
          setTimeEstimateCompletion(Number(val));
      });
    }

    // 4️⃣ Resident Engineer date comparison
    if (residentEngineer === 1 && projectProfile) {
      let actualStart = "";
      let reHired = "";

      projectProfile.attributes.forEach((att) => {
        const val = att.values?.[0]?.value ?? "";
        if (att.label === "Actual Start Date") actualStart = val;
        if (att.label === "RE Hired Date") reHired = val;
      });

      if (actualStart && reHired) {
        const parseDate = (d: string) => {
          const [day, month, year] = d.split("-").map(Number);
          return new Date(year, month - 1, day);
        };
        const startDate = parseDate(actualStart);
        const reDate = parseDate(reHired);

        let diff =
          (reDate.getFullYear() - startDate.getFullYear()) * 12 +
          (reDate.getMonth() - startDate.getMonth());
        if (reDate.getDate() < startDate.getDate()) diff--;
        setReHiredMonths(diff > 0 ? `${diff} Months` : "Not Re-Appointed");
      } else {
        setReHiredMonths("Not Re-Appointed");
      }
    }
  }, [data, residentEngineer]);

  const costVariance = estimatedCostCompletion - pcICost;
  const timeDifference = timeEstimateCompletion - gestationPeriod;

  const liStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "0.5rem",
    fontWeight: 500,
    backgroundColor: "#64C3FF",
    padding: "1px 3px",
    marginBottom: "2px",
  };

  return (
    <Card>
      {/* Header */}
      <div className="row justify-content-between align-items-center mb-2">
        <div className="col-auto">
          <p className="m-0 fs10px fw-bold text-white">Executive Summary</p>
        </div>
        <div className="col-auto">
          <div className="btn-group">
            <Button
              className="rounded-end rounded-pill text-white d-flex align-items-center justify-content-center"
              style={{
                background: "#141518",
                border: ".43px solid #1D1F25",
                padding: "8px",
                lineHeight: 1,
              }}
            >
              <GiHamburgerMenu size={16} />
            </Button>
            <Button
              className="rounded-start rounded-pill text-white d-flex align-items-center justify-content-center"
              style={{
                background: "#141518",
                border: ".43px solid #1D1F25",
                padding: "8px",
                lineHeight: 1,
              }}
            >
              <PiGridFourBold size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="col"
        style={{
          padding: "2px 7px",
          border: ".42px solid #141518",
          background: "#141518",
          borderRadius: "5px",
        }}
      >
        <div
          className="col p-0"
          style={{
            height: "90px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            overflowY: "scroll",
          }}
        >
          <ul className="list-group" style={{ listStyleType: "none" }}>
            {/* Critical Observations */}
            {criticalObservations.length > 0 && (
              <>
                <li style={liStyle}>
                  <div className="d-flex align-items-center">
                    <BsCircleFill size={3} className="ms-1 me-1" />
                    No of Critical Observations
                  </div>
                  <span>({criticalObservations.length})</span>
                </li>
                {criticalObservations.map((item, idx) => (
                  <li
                    key={idx}
                    style={{ ...liStyle, backgroundColor: "#C7E9FF" }}
                  >
                    <div className="d-flex align-items-center">
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;{item}
                    </div>
                  </li>
                ))}
              </>
            )}

            {/* Time Difference */}
            {timeDifference <= 0 ? (
              <li style={liStyle}>
                <div className="d-flex align-items-center">
                  <BsCircleFill size={3} className="ms-1 me-1" />
                  Expected Before Time (at Existing Pace) *
                </div>
                <span>{timeDifference.toFixed(1)} Months</span>
              </li>
            ) : (
              <li style={liStyle}>
                <div className="d-flex align-items-center">
                  <BsCircleFill size={3} className="ms-1 me-1" />
                  Expected Time Overrun (at Existing Pace) *
                </div>
                <span>{timeDifference.toFixed(1)} Months</span>
              </li>
            )}

            {/* Cost Variance */}
            {costVariance <= 0 ? (
              <li style={liStyle}>
                <div className="d-flex align-items-center">
                  <BsCircleFill size={3} className="ms-1 me-1" />
                  Expected Within The Budget **
                </div>
                <span>-</span>
              </li>
            ) : (
              <li style={liStyle}>
                <div className="d-flex align-items-center">
                  <BsCircleFill size={3} className="ms-1 me-1" />
                  Expected Cost Overrun Because of Time Overrun (at Existing
                  Pace) **
                </div>
                <span>(Rs. {costVariance.toFixed(3)}M)</span>
              </li>
            )}

            {/* Resident Engineer */}
            {residentEngineer != null && (
              <>
                <li style={liStyle}>
                  <div className="d-flex align-items-center">
                    <BsCircleFill size={3} className="ms-1 me-1" />
                    Resident Engineer (R.E) Required
                  </div>
                  <span>{residentEngineer === 0 ? "No" : "Yes"}</span>
                </li>

                <li style={liStyle}>
                  <div className="d-flex align-items-center">
                    <BsCircleFill size={3} className="ms-1 me-1" />
                    Resident Engineer (R.E) Appointed
                  </div>
                  <span>{residentEngineer === 1 ? "Yes" : "No"}</span>
                </li>

                <li style={liStyle}>
                  <div className="d-flex align-items-center">
                    <BsCircleFill size={3} className="ms-1 me-1" />
                    Delay in R.E. Reappointment/Reengagement ***
                  </div>
                  <span>{reHiredMonths}</span>
                </li>
              </>
            )}
          </ul>

          <ul className="list-group" style={{ listStyleType: "none" }}>
            <li
              className="fs8px fw-5 text-white text-start"
              style={{ padding: "1px 3px" }}
            >
              * (Time Estimate at Completion - Gestation Period)
            </li>
            <li
              className="fs8px fw-5 text-white text-start"
              style={{ padding: "1px 3px" }}
            >
              ** (Estimate Cost at Completion - PC-I Cost)
            </li>
            <li
              className="fs8px fw-5 text-white text-start"
              style={{ padding: "1px 3px" }}
            >
              *** (R.E Appointment Date - Actual Start Date)
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ExecutiveSummary;
