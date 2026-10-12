import { Groups } from "@/app/project-details-dashboard/components/ProjectDetailsDashboard";

interface Props {
  group: Groups;
}
const EarnedValueAnalysis = ({ group }: Props) => {
  return (
    <div className="col p-0">
      <div className="row d-flex m-0 mb-3">
        {group.attributes.map((attribute) => (
          <div
            key={attribute.attributeId}
            className="col-lg-6 col-md-6 col-sm-12 mb-3"
          >
            <p className="m-0 fs14px pe-0" style={{ color: "#414651" }}>
              {attribute.label}
            </p>
            <p className="m-0 pe-0 fw-bold">
              {attribute?.values[0]?.value &&
                Math.round(parseFloat(attribute.values[0].value))}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarnedValueAnalysis;
