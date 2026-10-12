"use client";
import Button from "@/app/components/Button";
import search3 from "@/public/icons/search3.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaFile, FaUser, FaUserAlt } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  PiBuildingApartmentDuotone,
  PiBuildingOfficeBold,
} from "react-icons/pi";
import { RiBuildingFill } from "react-icons/ri";
import { TfiDownload } from "react-icons/tfi";

const SummaryDetailPage = () => {
  const router = useRouter();

  const [selectedTab, setSelectedTab] = useState(0);
  const tabs = [
    {
      tabName: "All",
      count: 90,
      icon: <FaFile size={30} className="color-sea-blue" />,
    },
    {
      tabName: "Commissioner",
      count: 10,
      icon: <FaUser size={30} className="color-sea-blue" />,
    },
    {
      tabName: "Deputy Commissioner",
      count: 20,
      icon: <FaUserAlt size={30} className="color-sea-blue" />,
    },
    {
      tabName: "Sponsoring Agency",
      count: 15,
      icon: <PiBuildingOfficeBold size={30} className="color-sea-blue" />,
    },
    {
      tabName: "Executing Agency",
      count: 30,
      icon: <PiBuildingApartmentDuotone size={30} className="color-sea-blue" />,
    },
    {
      tabName: "DGME",
      count: 25,
      icon: <RiBuildingFill size={30} className="color-sea-blue" />,
    },
  ];
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
          {/* <div
              className="col bg-color-sea-blue text-white rounded-pill mb-3"
              style={{ padding: "8px 12px 8px 8px" }}
            >
              <div className="row d-flex justify-content-between align-items-center">
                <div className="col fw-bold">
                  <span
                    className="badge fw-6 fs14px bg-white rounded-pill color-sea-blue"
                    style={{ marginRight: "8px" }}
                  >
                    25
                  </span>
                  &nbsp;In Progress
                </div>
                <div className="col text-end">
                  <LuPlus size={24} />
                </div>
              </div>
            </div> */}
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
        {/* <div
            className="col"
            style={{
              background: "#F8FAFC",
              padding: "12px",
              borderRadius: "32px",
            }}
          >
            <div
              className="col text-white rounded-pill mb-3"
              style={{ padding: "8px 12px 8px 8px", background: "#F59E0B" }}
            >
              <div className="row d-flex justify-content-between">
                <div className="col fw-bold">
                  <span
                    className="badge fw-6 fs14px bg-white rounded-pill"
                    style={{ marginRight: "8px", color: "#F59E0B" }}
                  >
                    8
                  </span>
                  &nbsp;Reviewed
                </div>
                <div className="col text-end">
                  <LuPlus size={24} />
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
                <a
                  href="/files/Executing.pdf"
                  download
                  className="col text-end fw-6"
                >
                  <TfiDownload size={20} />
                  &nbsp;Download PDF
                </a>
              </div>
            </div>
          </div> */}
        {/* <div
            className="col"
            style={{
              background: "#F8FAFC",
              padding: "12px",
              borderRadius: "32px",
            }}
          >
            <div
              className="col text-white rounded-pill mb-3"
              style={{ padding: "8px 12px 8px 8px", background: "#22C55E" }}
            >
              <div className="row d-flex justify-content-between">
                <div className="col fw-bold">
                  <span
                    className="badge fw-6 fs14px bg-white rounded-pill"
                    style={{ marginRight: "8px", color: "#22C55E" }}
                  >
                    2
                  </span>
                  &nbsp;Completed
                </div>
                <div className="col text-end">
                  <LuPlus size={24} />
                </div>
              </div>
            </div>
            <div
              className="col bg-white color-sea-blue rounded-pill"
              style={{ padding: "12px", marginBottom: "12px" }}
            >
              <div className="row d-flex justify-content-between">
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
                <a
                  href="/files/Sponsoring.pdf"
                  download
                  className="col text-end fw-6"
                >
                  <TfiDownload size={20} />
                  &nbsp;Download PDF
                </a>
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
                <a
                  href="/files/Deputy-Commissioner.pdf"
                  download
                  className="col text-end fw-6"
                >
                  <TfiDownload size={20} />
                  &nbsp;Download PDF
                </a>
              </div>
            </div>
          </div> */}
      </div>
    </div>
  );
};

export default SummaryDetailPage;
