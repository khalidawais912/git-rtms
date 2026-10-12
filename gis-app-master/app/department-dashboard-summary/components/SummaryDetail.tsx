import Badge from "@/app/dashboard/components/ProjectsTable/components/Badge";
import { FiSearch } from "react-icons/fi";
import { LuDownload } from "react-icons/lu";
import { PiFilePdfBold } from "react-icons/pi";

const dummyData = [
  {
    count: 1,
    pdfLink: "/files/Commissioner.pdf",
  },
  {
    count: 1,
    pdfLink: "/files/Executing.pdf",
  },
  {
    count: 1,
    pdfLink: "/files/Sponsoring.pdf",
  },
  {
    count: 0,
    pdfLink: "/files/Deputy-Commissioner.pdf",
  },
];

const SummaryDetail = () => {
  return (
    <div
      className="bg-white"
      style={{
        borderRadius: "10px",
        padding: "10px 15px 0px 15px",
        overflow: "hidden",
      }}
    >
      <div
        className="row d-flex justify-content-between align-items-center "
        style={{
          padding: "10px 15px",
        }}
      >
        <div className="col-auto ps-0">
          <h5
            className="m-0 fs21px"
            style={{
              fontWeight: "800",
            }}
          >
            Commissioner Visit Count
          </h5>
          <p className="color-sea-blue m-0 fs13px">
            CM Himmat Card Program for Persons with Disabilities (PWDs)
          </p>
        </div>

        <div className="col-auto my-auto pe-0">
          <div className="row d-flex justify-content-end">
            <div className="col">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <button
                    className="btn rounded-end rounded-pill text-white shadow-none border-end-0 pe-0"
                    type="submit"
                    style={{
                      border: "1px solid rgba(38, 50, 56,.6)",
                    }}
                  >
                    <FiSearch
                      size={21}
                      style={{ color: "#475569", marginBottom: "3px" }}
                    />
                  </button>
                  <input
                    type="text"
                    className="form-control border-start-0 rounded-pill rounded-start shadow-none fs14px bg-transparent py-2 placeholder-bold"
                    style={{
                      border: "1px solid rgba(38, 50, 56,.6)",
                      color: "rgba(38, 50, 56,1)",
                    }}
                    placeholder="Search"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          background: "#F8FAFC",
          padding: "10px 15px",
          marginRight: "-15px",
          marginLeft: "-15px",
          borderTop: "1px solid #E2E8F0",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <span
          className="fw-bold fs17px"
          style={{
            color: "#1E293B",
            marginRight: "7px",
            display: "inline-block",
          }}
        >
          Reports
        </span>
        <Badge color="#0C8CE9">2</Badge>
      </div>
      <div
        className="row bg-white"
        style={{
          marginRight: "-15px",
          marginLeft: "-15px",
        }}
      >
        {dummyData.map((d, i) => (
          <div
            key={i}
            className="col-6 bg-white color-sea-blue"
            style={{
              padding: "14px 22px",
              border: "1px solid #E2E8F0",
            }}
          >
            <div className="row justify-content-between align-items-center">
              <div className="col-auto">
                <div
                  className="row d-flex align-items-center bg-white cursor-pointer m-0"
                  style={{
                    borderRadius: "20px",
                  }}
                >
                  <div
                    className="col-auto rounded-circle flex items-center justify-center"
                    style={{
                      background: "#FFF1F2",
                      padding: "9.5px",
                    }}
                  >
                    <PiFilePdfBold size={19} style={{ color: "#F43F5E" }} />
                  </div>
                  <div className="col pe-0" style={{ paddingLeft: "10px" }}>
                    <p
                      className="fw-bold fs13px mb-0"
                      style={{
                        color: "#475569",
                      }}
                    >
                      GS No :23134
                    </p>
                    <p className="fs13px mb-0" style={{ color: "#475569" }}>
                      25/12/2025
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-auto text-end fw-6">
                <a href={d.pdfLink} download>
                  <LuDownload size={23} color="#475569" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryDetail;
