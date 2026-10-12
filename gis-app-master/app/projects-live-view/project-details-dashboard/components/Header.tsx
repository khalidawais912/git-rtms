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
          className="position-absolute row d-flex flex-wrap justify-content-center bg-transparent"
          style={{
            overflowX: "scroll",
            whiteSpace: "nowrap",
            overflow: "hidden",
            bottom: 5,
            zIndex: 2,
          }}
        >
          <div
            className="row d-flex flex-wrap justify-content-center"
            style={{ marginBottom: "6px" }}
          >
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
                  <div key={attribute.attributeId} className="col-auto">
                    <p className="m-0 fw-normal fs9px text-wrap text-white  text-center">
                      {attribute.label}
                    </p>
                    <p className="m-0 fw-bold fs4px text-nowrap text-white text-center">
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
              className="row d-flex justify-content-between flex-wrap m-0"
              style={{
                background: "#141518",
                padding: "2px 12px",
                borderRadius: "2.7px",
              }}
            >
              {data.staffTrackings && (
                <>
                  <div className="col-auto">
                    <p className="m-0 fw-normal fs8px text-wrap text-white">
                      Reporting Officer
                    </p>
                    <p className="m-0 fw-normal fs9px text-nowrap text-white">
                      {
                        data.staffTrackings?.filter(
                          (tracking) => tracking.userName,
                        )[0]?.userName
                      }
                    </p>
                  </div>
                  <div className="col-auto">
                    <p className="m-0 fw-normal fs8px text-wrap text-white">
                      Monitoring Reports
                    </p>
                    <p className="m-0 fw-normal fs9px text-wrap text-white">
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
                      <p className="m-0 fw-normal fs8px text-wrap text-white">
                        {attribute.label}
                      </p>
                      <p className="m-0 fw-normal fs9px text-nowrap text-white">
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
                <p className="m-0 fw-normal fs8px text-wrap text-white">
                  Location
                </p>
                <p className="m-0 fw-normal fs9px text-nowrap text-white">
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
