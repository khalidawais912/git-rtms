import { Groups } from "@/app/project-details-dashboard/components/ProjectDetailsDashboard";
import RenderRichText from "@/app/project-details-dashboard/components/RenderRichText";

interface Props {
  group: Groups;
}
const ObservationsAndRecommendations = ({ group }: Props) => {
  return (
    <div
      className="col p-0"
      // style={{
      //   height: "541px",
      //   overflow: "hidden",
      //   overflowY: "scroll",
      // }}
    >
      <div className="row d-flex flex-column mb-3">
        {group.attributes.length > 0 &&
          group.attributes[0].values.length > 0 &&
          group.attributes.map((attribute, i) => (
            <div key={i} className="col">
              <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
                {i + 1} - {attribute.label} ({attribute?.values[0]?.value})
              </p>
              <ol className="m-0 pe-0 fw-bold">
                {attribute?.values[0]?.remarks && (
                  <li className="mb-3">
                    <RenderRichText data={attribute.values[0].remarks} />
                  </li>
                )}
                {attribute?.values[0]?.verificatioContentPath && (
                  <li className="mb-3">
                    <img
                      src={`${process.env.NEXT_PUBLIC_BACKEND_API}${attribute.values[0].verificatioContentPath}`}
                      alt="obervatiopn image"
                      className="rounded-3"
                      style={{ width: "100%", objectFit: "cover" }}
                    />
                  </li>
                )}
              </ol>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ObservationsAndRecommendations;
