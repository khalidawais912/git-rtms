import { Groups } from "@/app/project-details-dashboard/components/ProjectDetailsDashboard";
import { addDayToFormattedDate, getFormattedDate } from "@/app/utils";

interface Props {
  group: Groups;
}

const ProjectProfile = ({ group }: Props) => {
  return (
    <div className="col p-0">
      <div className="row d-flex m-0">
        {group.attributes
          .filter(
            (attribute) =>
              attribute.label.toLowerCase() !== "goal objectives" &&
              attribute.label.toLowerCase() !== "objectives",
          )
          .map((attribute) => (
            <div
              key={attribute.attributeId}
              className="col-lg-6 col-md-6 col-sm-12 mb-3"
            >
              <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
                {attribute.label}
              </p>
              <p className="m-0 pe-0 fw-bold">
                {attribute.label.toLowerCase().includes("date") ||
                (attribute.label.toLowerCase() === "administrative approval" &&
                  attribute?.values[0]?.value)
                  ? new Date(attribute?.values[0]?.value).toLocaleDateString(
                      "en-GB",
                      {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      },
                    )
                  : attribute.label.toLowerCase() === "pc-i cost"
                    ? `${Math.round(parseFloat(attribute?.values[0]?.value))} M`
                    : attribute.label.toLowerCase() === "Gestation Period"
                      ? `${attribute?.values[0]?.value} Months`
                      : attribute?.values[0]?.value}
              </p>
            </div>
          ))}
      </div>
      {/* <div className="row d-flex flex-column mb-3">
        <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
          Objectives
        </p>
        <p className="m-0 pe-0 fw-bold">
          CM Himmat Card Program for Persons with Disabilities (PWDs)
        </p>
      </div>
      <div className="row d-flex mb-3">
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            GS No.
          </p>
          <p className="m-0 pe-0 fw-bold">965</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Location
          </p>
          <p className="m-0 pe-0 fw-bold">Lahore</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            ADP Sector
          </p>
          <p className="m-0 pe-0 fw-bold">Infrastructure</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Sub Sector
          </p>
          <p className="m-0 pe-0 fw-bold">Roads</p>
        </div>
      </div>
      <div className="row d-flex mb-3">
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Sponsoring Ministry/ Agency
          </p>
          <p className="m-0 pe-0 fw-bold">
            Social Welfare and Bait-ul-maal Dep..
          </p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Execution Agency
          </p>
          <p className="m-0 pe-0 fw-bold">
            Social Welfare and Bait-ul-maal Dep..
          </p>
        </div>
      </div>
      <div className="row d-flex mb-3">
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            PC-I Cost (M)
          </p>
          <p className="m-0 pe-0 fw-bold">2658.12</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Expenditure
          </p>
          <p className="m-0 pe-0 fw-bold">422.535</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Planned Start Date
          </p>
          <p className="m-0 pe-0 fw-bold">01-Jul-2024</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Administrative Approval
          </p>
          <p className="m-0 pe-0 fw-bold">03-Jul-2024</p>
        </div>
      </div>
      <div className="row d-flex mb-3">
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Planned End Date
          </p>
          <p className="m-0 pe-0 fw-bold">30-Jun-2025</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Actual Start Date
          </p>
          <p className="m-0 pe-0 fw-bold">03-Jul-2024</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Approving Authority
          </p>
          <p className="m-0 pe-0 fw-bold">PDWP</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Contractor
          </p>
          <p className="m-0 pe-0 fw-bold">M-S NESPAK</p>
        </div>
      </div>
      <div className="row d-flex mb-3">
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Design Engineer
          </p>
          <p className="m-0 pe-0 fw-bold">Mr. Sohail</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Resident Supervision
          </p>
          <p className="m-0 pe-0 fw-bold">Jamshed</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            Gestation Period (Months)
          </p>
          <p className="m-0 pe-0 fw-bold">30</p>
        </div>
        <div className="col">
          <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
            &nbsp;
          </p>
          <p className="m-0 pe-0 fw-bold">&nbsp;</p>
        </div>
      </div> */}
    </div>
  );
};

export default ProjectProfile;
