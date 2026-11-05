"use client";
import Button from "@/components/Button";
import search3 from "@/public/icons/search3.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";


import { TfiDownload } from "react-icons/tfi";

const SummaryDetailPage = () => {
  const router = useRouter();

  return (
    <div
      style={{
        padding: "15px",
        height: "89vh",
      }}
    >
      <div
        className="row d-flex justify-content-between align-items-center"
        style={{
          padding: "15px 32px",
          background: "#F8FAFC",
          borderTopRightRadius: "10px",
          borderTopLeftRadius: "10px",
        }}
      >
        <div className="col-auto ps-0">
          <Button
            className="btn"
            onClick={() => router.push("/department-dashboard-summary")}
          >
            <IoIosArrowRoundBack size={21} style={{ color: "#475569" }} />
          </Button>
          <h5
            className="m-0"
            style={{ fontSize: "1.875rem", fontWeight: "800" }}
          >
            Commissioner Visit Count
          </h5>
          <p className="color-sea-blue fw-6 m-0">
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
                    <Image src={search3} alt="search3" width={18} height={18} />
                  </button>
                  <input
                    type="text"
                    className="form-control border-start-0 rounded-pill rounded-start shadow-none fs14px bg-transparent py-2"
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
        className="row gap-3 bg-white"
        style={{
          padding: "10px 32px 32px 32px",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
        }}
      >
        <div
          className="col"
          style={{
            background: "#F8FAFC",
            padding: "12px",
            borderRadius: "32px",
          }}
        >
          <div
            className="col bg-white color-sea-blue rounded-pill"
            style={{ padding: "12px", marginBottom: "12px" }}
          >
            <div className="row d-flex justify-content-between align-items-center">
              <div className="col">
                <div className="row gap-3 m-0">
                  <div
                    className="col-auto badge fw-6 rounded-pill color-sea-blue"
                    style={{
                      padding: "4px 8px 4px 8px",
                      background: "#EEF2FF",
                    }}
                  >
                    GS.No 7654
                  </div>
                  <div
                    className="col-auto badge fw-6 rounded-pill color-sea-blue"
                    style={{
                      padding: "4px 8px 4px 8px",
                      background: "#EEF2FF",
                    }}
                  >
                    25/12/2025
                  </div>
                </div>
              </div>
              <div className="col text-end fw-6">
                <a href="/files/Commissioner.pdf" download>
                  <TfiDownload size={20} />
                  &nbsp;Download PDF
                </a>
              </div>
            </div>
          </div>
          <div
            className="col bg-white color-sea-blue rounded-pill"
            style={{ padding: "12px", marginBottom: "12px" }}
          >
            <div className="row d-flex justify-content-between align-items-center">
              <div className="col">
                <div className="row gap-3 m-0">
                  <div
                    className="col-auto badge fw-6 rounded-pill color-sea-blue"
                    style={{
                      padding: "4px 8px 4px 8px",
                      background: "#EEF2FF",
                    }}
                  >
                    GS.No 7654
                  </div>
                  <div
                    className="col-auto badge fw-6 rounded-pill color-sea-blue"
                    style={{
                      padding: "4px 8px 4px 8px",
                      background: "#EEF2FF",
                    }}
                  >
                    25/12/2025
                  </div>
                </div>
              </div>
              <div className="col text-end fw-6">
                <a href="/files/Executing.pdf" download>
                  <TfiDownload size={20} />
                  &nbsp;Download PDF
                </a>
              </div>
            </div>
          </div>
          <div
            className="col bg-white color-sea-blue rounded-pill"
            style={{ padding: "12px", marginBottom: "12px" }}
          >
            <div className="row d-flex justify-content-between align-items-center">
              <div className="col">
                <div className="row gap-3 m-0">
                  <div
                    className="col-auto badge fw-6 rounded-pill color-sea-blue"
                    style={{
                      padding: "4px 8px 4px 8px",
                      background: "#EEF2FF",
                    }}
                  >
                    GS.No 7654
                  </div>
                  <div
                    className="col-auto badge fw-6 rounded-pill color-sea-blue"
                    style={{
                      padding: "4px 8px 4px 8px",
                      background: "#EEF2FF",
                    }}
                  >
                    25/12/2025
                  </div>
                </div>
              </div>
              <div className="col text-end fw-6">
                <a href="/files/Sponsoring.pdf" download>
                  <TfiDownload size={20} />
                  &nbsp;Download PDF
                </a>
              </div>
            </div>
          </div>
          <div
            className="col bg-white color-sea-blue rounded-pill"
            style={{ padding: "12px", marginBottom: "12px" }}
          >
            <div className="row d-flex justify-content-between align-items-center">
              <div className="col">
                <div className="row gap-3 m-0">
                  <div
                    className="col-auto badge fw-6 rounded-pill color-sea-blue"
                    style={{
                      padding: "4px 8px 4px 8px",
                      background: "#EEF2FF",
                    }}
                  >
                    GS.No 7654
                  </div>
                  <div
                    className="col-auto badge fw-6 rounded-pill color-sea-blue"
                    style={{
                      padding: "4px 8px 4px 8px",
                      background: "#EEF2FF",
                    }}
                  >
                    25/12/2025
                  </div>
                </div>
              </div>
              <div className="col text-end fw-6">
                <a href="/files/Deputy-Commissioner.pdf" download>
                  <TfiDownload size={20} />
                  &nbsp;Download PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryDetailPage;
