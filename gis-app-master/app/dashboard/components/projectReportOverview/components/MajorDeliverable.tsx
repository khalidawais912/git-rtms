import { Groups } from "@/app/project-details-dashboard/components/ProjectDetailsDashboard";
import RenderRichText from "@/app/project-details-dashboard/components/RenderRichText";

interface Props {
  group: Groups;
}

const MajorDeliverable = ({ group }: Props) => {
  return (
    <div className="col p-0">
      {group.group.map((g) => (
        <div key={g.id} className="col">
          <div className="col-12 mb-3">
            <p
              className="m-0 p-1 ps-2 fs-6 fw-bold text-break mb-2 rounded-3 shadow-sm"
              style={{ color: "#414651", background: "#f5f7fa" }}
            >
              {g.name}
            </p>
          </div>
          <div className="row d-flex m-0">
            {g.attributes.map((attribute) => (
              <div
                key={attribute.attributeId}
                className="col-lg-6 col-md-6 col-sm-12 mb-3"
              >
                <p
                  className="m-0 fs14px pe-0 text-break"
                  style={{ color: "#414651" }}
                >
                  {attribute.label}
                </p>
                <p className="m-0 pe-0 fw-bold">
                  {attribute?.values[0]?.value}
                </p>
                {attribute?.values[0]?.remarks && (
                  <>
                    <p className="m-0 fs14px pe-0 mt-2">Remarks</p>
                    <p className="m-0 pe-0 fw-bold text-nowrap">
                      <RenderRichText data={attribute?.values[0]?.remarks} />
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MajorDeliverable;
