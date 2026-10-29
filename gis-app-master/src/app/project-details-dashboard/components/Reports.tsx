import Image from "next/image";
import adobeAcrobat from "@/public/icons/adobeAcrobat.svg";
import downloadLineBlack from "@/public/icons/downloadLineBlack.svg";
import { Groups, ReportsData } from "../types";

interface Props {
  reports: ReportsData[];
  observations: Groups;
}

const Reports = ({ reports }: Props) => {

  return (
    <div
      className="col shadow-sm mb-3 ms-3 me-3 pt-4 ps-4 pe-4 "
      style={{ background: "#C6D9F1", borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div
        className="row d-flex m-0 pb-1  mb-3"
        style={{ borderBottom: "1px dashed #97ABBD" }}
      >
        <div className="col">
          <div className="col">
            <h4 className="fw-bold mt-2">{reports.length} Reports</h4>
          </div>
        </div>
      </div>
      <div className="row pb-2">
        <div
          className="col"
          style={{
            height: "150px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            overflowY: "scroll",
          }}
        >
          <div
            className="d-flex flex-column"
          >
            {reports.map((d, i) => (
              <div key={i}>
                {d.reportPath && (
                  <>
                    <div className="col mx-2">
                      <Image unoptimized width={567} height={200}
                        src="/images/pdfViewable.png"
                        alt="pdfViewable"
                        style={{
                          width: "100%",
                          height: "200px",
                          objectFit: "cover",
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                        }}
                        className="img-fluid"
                      />
                    </div>
                    <div
                      className="row d-flex p-2 mb-2 mx-2"
                      style={{
                        background: "#DCE9F5",
                        border: ".8px dashed rgba(151, 171, 189, .5)",
                        borderBottomLeftRadius: "10px",
                        borderBottomRightRadius: "10px",
                      }}
                    >
                      <div className="col">
                        <div className="row d-flex">
                          <div className="col-lg-2 col-md-2 col mt-2">
                            <Image src={adobeAcrobat} alt="adobeAcrobat" />
                          </div>
                          <div className="col-lg-10 col-md-9 col">
                            <p className="m-0 mt-1 fs13px fw-bold">
                              Project Report {i + 1}.pdf
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-2 col-md-2 col text-end mt-1">
                        <a
                          href={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.reportPath}`}
                          className="btn p-0"
                          download
                          target="_blank"
                        >
                          <Image
                            src={downloadLineBlack}
                            alt="downloadLineBlack"
                            width={12}
                            height={16}
                          />
                        </a>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
