import { Groups } from "@/app/project-details-dashboard/components/ProjectDetailsDashboard";
import { getFormattedDate } from "@/app/utils";

interface Props {
  group: Groups;
}

const Main = ({ group }: Props) => {
  return (
    <div className="col p-0">
      <div className="row d-flex flex-column mb-2">
        <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
          Report Name
        </p>
        <p className="m-0 pe-0 fw-bold">
          {
            group?.attributes.find(
              (attribute) => attribute.label.toLowerCase() === "report name",
            )?.values[0]?.value
          }
        </p>
      </div>
      <div className="row d-flex mb-2">
        {group?.attributes
          .filter(
            (attribute) =>
              attribute.label.toLowerCase() !== "report picture" &&
              attribute.label.toLowerCase() !== "report name",
          )
          .map((attribute) => (
            <div className="col" key={attribute.attributeId}>
              <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
                {attribute?.label}
              </p>
              <p className="m-0 pe-0 fw-bold">
                {attribute?.values[0]?.value &&
                  new Date(attribute.values[0].value).toLocaleDateString(
                    "en-GB",
                    {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  )}
              </p>
            </div>
          ))}
      </div>
      <div
        className="row d-flex flex-column mb-2"
        style={{
          overflow: "hidden",
          overflowX: "scroll",
        }}
      >
        <p
          className="m-0 fs14px pe-0"
          style={{
            color: "#414651",
          }}
        >
          Report Pictures
        </p>
        <div
          className="d-flex justify-content-start m-0 pe-0 fw-bold p-1"
          style={{
            border: "1px solid #D5D7DA",
            borderRadius: "8px",
          }}
        >
          {group?.attributes.find(
            (attribute) => attribute.label.toLowerCase() === "report picture",
          )?.values[0]?.verificatioContentPath && (
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_API}${
                group?.attributes.find(
                  (attribute) =>
                    attribute.label.toLowerCase() === "report picture",
                )?.values[0]?.verificatioContentPath
              }`}
              className="img-fluid rounded-3 me-2"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
              }}
              alt="reportImage"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Main;
