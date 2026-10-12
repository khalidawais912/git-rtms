import {
  addDayToFormattedDate,
  formatAmountWithCommas,
  getFormattedDate,
} from "@/app/utils";
import { SingleProjectDashboard } from "./ProjectDetailsDashboard";

interface Props {
  data: SingleProjectDashboard;
}

const Header = ({ data }: Props) => {
  return (
    <>
      {data && (
        <div
          className="row d-flex mb-3 shadow-sm m-2 p-2"
          style={{
            background: "#C6D9F1",
            borderRadius: "10px",
            overflowX: "scroll",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <p className="fw-bold fs20px text-wrap m-0">{data.name}</p>
          <div className="row d-flex flex-wrap mb-2">
            {data.groups &&
              data.groups.find((d) => d.name === "Project Profile")
                ?.attributes &&
              data.groups
                .find((d) => d.name === "Project Profile")!
                .attributes?.filter(
                  (attribute) =>
                    attribute.label.toLowerCase().includes("gs no") ||
                    attribute.label
                      .toLowerCase()
                      .includes("sponsoring ministry") ||
                    attribute.label
                      .toLowerCase()
                      .includes("approving authority") ||
                    attribute.label.toLowerCase().includes("pc-i cost") ||
                    attribute.label
                      .toLowerCase()
                      .includes("planned start date") ||
                    attribute.label.toLowerCase().includes("planned end date"),
                )
                .map((attribute) => (
                  <div key={attribute.attributeId} className="col">
                    <p
                      className="m-0 fw-normal fs14px text-wrap"
                      style={{ color: "#7A889C" }}
                    >
                      {attribute.label}
                    </p>
                    <p className="m-0 fw-normal fs18px text-nowrap">
                      {attribute.label.toLowerCase().includes("pc-i cost")
                        ? `${
                            attribute.values[0]?.value &&
                            formatAmountWithCommas(
                              parseFloat(attribute.values[0]?.value),
                            )
                          }M`
                        : attribute.label.toLowerCase().includes("date") &&
                            attribute?.values[0]?.value
                          ? new Date(
                              attribute?.values[0]?.value,
                            ).toLocaleDateString("en-GB", {
                              weekday: "short",
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : attribute.values[0]?.value}
                    </p>
                  </div>
                ))}
          </div>
          <div className="col px-5">
            <div
              className="row d-flex justify-content-around flex-wrap rounded-3 m-0 p-1"
              style={{
                background: "rgba(255, 255, 255, 0.5)",
              }}
            >
              {data.staffTrackings && (
                <>
                  <div className="col-auto">
                    <p
                      className="m-0 fw-normal fs14px text-wrap"
                      style={{ color: "#7A889C" }}
                    >
                      Reporting Officer
                    </p>
                    <p className="m-0 fw-normal fs18px text-nowrap">
                      {
                        data.staffTrackings?.filter(
                          (tracking) => tracking.userName,
                        )[0]?.userName
                      }
                    </p>
                  </div>
                  <div className="col-auto">
                    <p
                      className="m-0 fw-normal fs14px text-wrap"
                      style={{ color: "#7A889C" }}
                    >
                      Monitoring Reports
                    </p>
                    <p className="m-0 fw-normal fs18px text-wrap">
                      {data.reportsCount}
                      {data.reportsCount === 1
                        ? "st"
                        : data.reportsCount === 2
                          ? "nd"
                          : data.reportsCount === 3
                            ? "rd"
                            : "th"}{" "}
                      Monitoring Report
                    </p>
                  </div>
                </>
              )}
              {data.groups &&
                data.groups.find((d) => d.name.toLowerCase() === "main")
                  ?.attributes &&
                data.groups
                  .find((d) => d.name.toLowerCase() === "main")!
                  .attributes.filter(
                    (attribute) =>
                      attribute.label.toLowerCase().includes("report date") ||
                      attribute.label.toLowerCase().includes("visit date"),
                  )
                  .map((attribute) => (
                    <div key={attribute.attributeId} className="col-auto">
                      <p
                        className="m-0 fw-normal fs14px text-wrap"
                        style={{ color: "#7A889C" }}
                      >
                        {attribute.label}
                      </p>
                      <p className="m-0 fw-normal fs18px text-nowrap">
                        {attribute.values[0]?.value &&
                          new Date(
                            attribute.values[0]?.value,
                          ).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                      </p>
                    </div>
                  ))}
              <div className="col-auto">
                <p
                  className="m-0 fw-normal fs14px text-wrap"
                  style={{ color: "#7A889C" }}
                >
                  Location
                </p>
                <p className="m-0 fw-normal fs18px text-nowrap">
                  {data.groups &&
                    data.groups
                      .find((d) => d.name === "Project Profile")
                      ?.attributes.filter((attribute) =>
                        attribute.label.toLowerCase().includes("location"),
                      )[0]?.values[0]?.value}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
