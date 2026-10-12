import approved from "@/public/icons/evaluation/approved.svg";
import dropped from "@/public/icons/evaluation/dropped.svg";
import unApproved from "@/public/icons/evaluation/unApproved.svg";
import Image from "next/image";
import { ProgressBar } from "react-bootstrap";
import { DistrictList } from "../Evaluation/DashboardEvaluation";

interface Props {
  data: DistrictList;
}

const DistrictCardEvaluation = ({ data }: Props) => {
  return (
    <div
      style={{
        borderRadius: "7px",
        border: ".5px solid rgba(255, 255, 255, 0.66)",
      }}
    >
      <div
        className="district-card-bg-blur"
        style={{
          borderRadius: "7px",
          padding: "16px",
        }}
      >
        <div className="row justify-content-between mb-2">
          <div className="col-auto fw-bold fs-6">{data.divisionName}</div>
          <div
            className="col-auto fw-normal fs14px"
            style={{ color: "#0C8CE9" }}
          >
            {data.districtName}
          </div>
        </div>
        <div className="col mb-2" style={{ width: "400px" }}>
          <div className="row m-0 gap-2 fs-6">
            <div
              className="col shadow-sm mb-2 py-2 px-3 d-flex rounded-pill"
              style={{
                border: ".7px solid rgba(255, 255, 255, 0.5)",
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 255, 255, 0.4) , rgba(255, 255, 255, 0.01))",
              }}
            >
              <Image src={approved} alt="approved" width={40} height={40} />
              &nbsp;
              <div className="col">
                <p className="m-0 fw-6">{data.submittedPCIVs}</p>
                <p
                  className="m-0 fw-5 fs14px"
                  style={{ color: "rgba(0, 0, 0, 0.78)" }}
                >
                  Submitted PC(IV)s
                </p>
              </div>
            </div>
            <div
              className="col shadow-sm mb-2 py-2 px-3 d-flex rounded-pill"
              style={{
                border: ".7px solid rgba(255, 255, 255, 0.5)",
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 255, 255, 0.4) , rgba(255, 255, 255, 0.01))",
              }}
            >
              <Image src={unApproved} alt="unApproved" width={40} height={40} />
              &nbsp;
              <div className="col">
                <p className="m-0 fw-6">{data.visitedPCIVs}</p>
                <p
                  className="m-0 fw-5 fs14px"
                  style={{ color: "rgba(0, 0, 0, 0.78)" }}
                >
                  Visited PC(IV)s
                </p>
              </div>
            </div>
          </div>
          <div className="row m-0 gap-2 fs-6">
            <div
              className="col-12 col-sm-12 col-md-6 col-lg-6 shadow-sm mb-2 py-2 px-3 d-flex rounded-pill"
              style={{
                border: ".7px solid rgba(255, 255, 255, 0.5)",
                backgroundImage:
                  "linear-gradient(to right, rgba(255, 255, 255, 0.4) , rgba(255, 255, 255, 0.01))",
              }}
            >
              <Image src={dropped} alt="dropped" width={40} height={40} />
              &nbsp;
              <div className="col">
                <p className="m-0 fw-6">{data.notVisitedPCIvs}</p>
                <p
                  className="m-0 fw-5 fs14px"
                  style={{ color: "rgba(0, 0, 0, 0.78)" }}
                >
                  Not Visited PC(IV)s
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col">
          <ProgressBar className="bg-transparent">
            <ProgressBar
              variant="success"
              now={data.successful}
              max={1}
              key={1}
              label={`Successful`}
              className="bg-transparent text-dark fw-5"
            />
            <ProgressBar
              variant="warning"
              now={data.partiallySuccessful}
              max={1}
              key={2}
              label={`Partial Success`}
              className="bg-transparent text-dark fw-5"
            />
            <ProgressBar
              variant="danger"
              now={data.notSuccessful}
              max={1}
              key={3}
              label={`Not Sucessfull`}
              className="bg-transparent text-dark fw-5"
            />
          </ProgressBar>

          <ProgressBar className="rounded-pill">
            <ProgressBar
              variant="success"
              now={data.successful}
              max={1}
              key={4}
              className="rounded-pill fw-5"
              label={`${data.successful}`}
              style={{
                backgroundImage: "linear-gradient(to top, #6EBD18 , #7ED321)",
              }}
            />
            <ProgressBar
              variant="warning"
              now={data.partiallySuccessful}
              max={1}
              key={5}
              className="rounded-pill fw-5"
              label={`${data.partiallySuccessful}`}
              style={{
                backgroundImage: "linear-gradient(to top, #F0B30F , #FDCA40)",
              }}
            />
            <ProgressBar
              variant="danger"
              now={data.notSuccessful}
              max={1}
              key={6}
              className="rounded-pill fw-5"
              label={`${data.notSuccessful}`}
              style={{
                backgroundImage: "linear-gradient(to top, #BE1707 , #D62C2C)",
              }}
            />
          </ProgressBar>
        </div>
      </div>
    </div>
  );
};

export default DistrictCardEvaluation;

{
  /* <div className="col">
          {(() => {
            const total =
              data.successful + data.partiallySuccessful + data.notSuccessful ||
              1; // fallback to avoid divide-by-zero

            return (
              <>
                <ProgressBar className="bg-transparent">
                  <ProgressBar
                    variant="success"
                    now={Math.max(data.successful, 1)}
                    max={total}
                    key={1}
                    label="Successful"
                    className="bg-transparent text-dark fw-5"
                  />
                  <ProgressBar
                    variant="warning"
                    now={Math.max(data.partiallySuccessful, 1)}
                    max={total}
                    key={2}
                    label="Partial Success"
                    className="bg-transparent text-dark fw-5"
                  />
                  <ProgressBar
                    variant="danger"
                    now={Math.max(data.notSuccessful, 1)}
                    max={total}
                    key={3}
                    label="Not Successful"
                    className="bg-transparent text-dark fw-5"
                  />
                </ProgressBar>

                <ProgressBar className="rounded-pill">
                  <ProgressBar
                    variant="success"
                    now={Math.max(data.successful, 1)}
                    max={total}
                    key={4}
                    className="rounded-pill fw-5"
                    label={`${data.successful}`}
                    style={{
                      backgroundImage:
                        "linear-gradient(to top, #6EBD18 , #7ED321)",
                    }}
                  />
                  <ProgressBar
                    variant="warning"
                    now={Math.max(data.partiallySuccessful, 1)}
                    max={total}
                    key={5}
                    className="rounded-pill fw-5"
                    label={`${data.partiallySuccessful}`}
                    style={{
                      backgroundImage:
                        "linear-gradient(to top, #F0B30F , #FDCA40)",
                    }}
                  />
                  <ProgressBar
                    variant="danger"
                    now={Math.max(data.notSuccessful, 1)}
                    max={total}
                    key={6}
                    className="rounded-pill fw-5"
                    label={`${data.notSuccessful}`}
                    style={{
                      backgroundImage:
                        "linear-gradient(to top, #BE1707 , #D62C2C)",
                    }}
                  />
                </ProgressBar>
              </>
            );
          })()}
        </div> */
}
