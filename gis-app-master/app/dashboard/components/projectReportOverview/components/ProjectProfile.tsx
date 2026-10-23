import { Groups } from "@/app/project-details-dashboard/types";
import { addDayToFormattedDate, getFormattedDate } from "@/shared/utils";

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
    </div>
  );
};

export default ProjectProfile;
