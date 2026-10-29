import { Groups, ReportsData } from "../../types";
import { PiFilePdfBold } from "react-icons/pi";
import { MdOutlineFileDownload } from "react-icons/md";

interface Props {
  reports: ReportsData[];
  observations: Groups;
}

const Reports = ({ reports }: Props) => {

  return (
    <div
      style={{
        border: ".43px solid #1D1F25",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div
        className="col"
        style={{
          background: "#1D1F25",
          padding: "7px 14px",
        }}
      >
        <div className="row align-items-center" style={{ marginBottom: "7px" }}>
          <div className="col-auto">
            <p className="m-0 fs8px fw-bold text-white">Reports</p>
          </div>
          <div className="col-auto p-0">
            <span
              className="badge rounded-pill bg-white color-sea-blue"
              style={{ padding: "1.7px 3.5px" }}
            >
              {reports.length}
            </span>
          </div>
        </div>
        <p className="m-0 text-white fs6px fw-5 text-start">
          Here you can explore Project Report files.
        </p>
      </div>
      <div
        className="col p-0"
        style={{
          height: "200px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          overflowY: "scroll",
        }}
      >
        <div className="d-flex flex-column">
          {reports.map((d, i) => (
            <div key={i}>
              {d.reportPath && (
                <div
                  className="row d-flex align-items-center m-0"
                  style={{
                    background: "#141518",
                    borderBottom: ".493px solid #1D1F25",
                    padding: "5px 10px",
                  }}
                >
                  <div className="col p-0">
                    <div className="row d-flex m-0 gap-2">
                      <div className="col-auto p-0">
                        <div
                          className="rounded-circle"
                          style={{
                            background: "white",
                            width: "17px",
                            height: "17px",
                            padding: "4.3px",
                            // 👇 ADD THESE THREE FLEXBOX PROPERTIES 👇
                            display: "flex",
                            justifyContent: "center", // Centers horizontally
                            alignItems: "center", // Centers vertically
                          }}
                        >
                          <PiFilePdfBold
                            size={7}
                            style={{ color: "#F43F5E" }}
                          />
                        </div>
                      </div>
                      <div className="col-auto p-0">
                        <p className="m-0 mt-1 fs6px fw-bold text-white">
                          Project Report {i + 1}.pdf
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-auto p-0">
                    <a
                      href={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.reportPath}`}
                      className="btn p-0"
                      download
                      target="_blank"
                    >
                      <MdOutlineFileDownload size={7} color="white" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
