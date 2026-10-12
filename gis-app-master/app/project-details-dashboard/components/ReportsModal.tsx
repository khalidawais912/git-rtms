import Button from "@/app/components/Button";
import { Groups } from "./ProjectDetailsDashboard";
import RenderRichText from "./RenderRichText";

interface Props {
  observations: Groups;
}

const ReportsModal: any = ({ observations }: Props) => {
  return (
    <>
      <Button
        type="button"
        className="col shadow-none btn p-0"
        data-bs-toggle="modal"
        data-bs-target="#reportsModal"
      >
        <img
          src="/icons/linkArrowBlack.svg"
          className="img-fluid"
          style={{ width: "15px", height: "15px" }}
          alt="linkArrowBlack"
        />
      </Button>
      <div
        className="modal fade"
        id="reportsModal"
        aria-labelledby="reportsModalLabel"
      >
        <div
          className="modal-dialog modal-dialog-scrollable modal-lg"
          style={{ marginTop: "80px" }}
        >
          <div
            className="modal-content border-0"
            style={{ background: "rgba(255,255,255,0)" }}
          >
            <div className="modal-body p-0">
              <div
                className="container-fluid border border-white pt-3 pb-3 ps-0 pe-0 text-start"
                style={{
                  borderRadius: "20px",
                  background: "#E8E8E8",
                }}
              >
                <div className="col bg-color-sea-blue text-center py-3 fw-bold text-white fs14px letterSpacing1px">
                  Observations
                </div>
                {observations.attributes.map((observationAttribute, i) => (
                  <div
                    key={observationAttribute.attributeId}
                    className="col p-3"
                  >
                    <p className="m-0 fw-bold">
                      {observationAttribute.label} {i + 1} (
                      {observationAttribute.values[0]?.value.trim()})
                    </p>
                    <p className="col">
                      {observationAttribute.values[0]?.remarks && (
                        <RenderRichText
                          data={observationAttribute.values[0]?.remarks}
                        />
                      )}
                    </p>
                    {observationAttribute.verificatioContentPath && (
                      <img
                        className="img-fluid"
                        src={`${process.env.NEXT_PUBLIC_BACKEND_API}${observationAttribute.verificatioContentPath}`}
                        alt="observationImage"
                        style={{ width: "100%" }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportsModal;
