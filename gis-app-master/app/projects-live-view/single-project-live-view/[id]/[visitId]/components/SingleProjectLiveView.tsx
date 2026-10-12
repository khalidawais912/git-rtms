"use client";
import { SINGLE_PROJECT_DASHBOARD_API } from "@/app/APIs";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import Loader from "@/app/components/Loader/Loader";
import { SingleProjectDashboard } from "@/app/project-details-dashboard/components/ProjectDetailsDashboard";
import Reports from "@/app/project-details-dashboard/components/Reports";
import apiClient from "@/app/services/api-client";
import { addDayToFormattedDate, getFormattedDate } from "@/app/utils";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IoWifiOutline } from "react-icons/io5";
import { MdFullscreen } from "react-icons/md";

interface Props {
  id: string;
  visitId: number;
}

const SingleProjectLiveViewPage = ({ id, visitId }: Props) => {
  const defaultData = [0, 1];
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftHeight, setLeftHeight] = useState<number>(0);

  const [data, setData] = useState<SingleProjectDashboard>();
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setLeftHeight(containerRef.current.offsetHeight);
      }
    };

    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(containerRef.current);

      // Also listen for window resize (covers zoom in/out)
      window.addEventListener("resize", updateHeight);

      // Initialize on mount
      updateHeight();

      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", updateHeight);
      };
    }
  }, []);

  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleSubmit = async (projectId: number, visitId: number) => {
      setLoading(true);
      console.log(
        `${SINGLE_PROJECT_DASHBOARD_API}?projectid=${projectId}&visitId=${visitId}`,
      );
      try {
        const response = await apiClient.get(
          `${SINGLE_PROJECT_DASHBOARD_API}?projectid=${projectId}&visitId=${visitId}`,
        );
        setData(response.data.data);
        console.log(
          `check now: projectid=${projectId}&visit=${visitId}`,
          response,
        );
        setLoading(false);
      } catch (err) {
        console.error("Submission error:", err);
        setLoading(false);
      }
    };

    handleSubmit(parseInt(id), visitId);
  }, [id]);

  //   const previewDate = (requriedDate: string) => {
  //     if (requriedDate.length > 0) {
  //       console.log("requriedDate", requriedDate);
  //       return new Date(requriedDate).toLocaleDateString("en-GB", {
  //         weekday: "short",
  //         year: "numeric",
  //         month: "short",
  //         day: "numeric",
  //       });
  //     } else {
  //       return "";
  //     }
  //   };
  const previewDate = (requriedDate: string) => {
    if (!requriedDate) return "";

    console.log("requriedDate", requriedDate);
    return new Date(requriedDate).toLocaleDateString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      <div
        className="col bg-white"
        style={{
          border: "1.08px solid #CBD5E1",
          borderRadius: "15px",
          padding: "10px 20px",
        }}
      >
        <div
          className="row"
          style={{
            // ✅ make row flex so col-9 dictates height
            alignItems: "stretch",
          }}
        >
          <div
            className="col-9"
            ref={containerRef}
            style={{ paddingRight: "10px" }}
          >
            <CustomModal
              size="xl"
              HeaderTopPos={0}
              HeaderRightPos={0}
              button={
                <div className="position-relative h-100">
                  {/* <video
                    className="w-100 h-100 overflow-hidden"
                    style={{ objectFit: "cover", borderRadius: "10px" }}
                    loop
                    autoPlay
                    playsInline
                    muted
                  >
                    <source src="/video/bgVideoNew.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video> */}
                  <iframe
                    src="https://g3.ipcamlive.com/player/player.php?alias=68c96d3f5a152"
                    // width="800px"
                    height="630px"
                    style={{
                      objectFit: "cover",
                      borderRadius: "10px",
                      width: "100%",
                      height: "630px",
                    }}
                    allowFullScreen
                  >
                    {" "}
                  </iframe>
                  <div
                    className="position-absolute text-white"
                    style={{
                      bottom: "9.55px",
                      left: "14.95px",
                      textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                      fontWeight: "600",
                      zIndex: 2,
                    }}
                  >
                    <p
                      className="fw-bold m-0"
                      style={{ paddingLeft: "6px", fontSize: "1.875rem" }}
                    >
                      GS NO{" "}
                      {
                        data?.groups
                          .find((group) => group.name === "Project Profile")
                          ?.attributes.find((attr) => attr.label === "GS NO")
                          ?.values[0].value
                      }
                    </p>
                    <p
                      className="fw-normal m-0"
                      style={{ paddingLeft: "6px", fontSize: "1.875rem" }}
                    >
                      {new Date().toLocaleDateString("en-GB", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      {/* 12:19:49 PM */}
                    </p>
                  </div>
                  <div
                    className="position-absolute w-100 bottom-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(to bottom, rgba(0, 0, 0, 0) , rgba(0, 0, 0, 1))",
                      borderBottomRightRadius: "10px",
                      borderBottomLeftRadius: "10px",
                      height: "30%",
                    }}
                  ></div>
                  <span
                    className="badge bg-color-evaluation-theme-blue position-absolute fw-5 rounded-pill"
                    style={{
                      top: "7.87px",
                      right: "9.44px",
                      padding: "9px 18.23px",
                      fontSize: "1.108rem",
                    }}
                  >
                    LIVE
                  </span>
                  <div
                    className="row position-absolute text-white d-flex gap-2"
                    style={{
                      top: "7.87px",
                      left: "9.44px",
                      padding: "6px 10px",
                    }}
                  >
                    <div className="col pe-0">
                      <IoWifiOutline size={33} />
                    </div>
                    <div className="col ps-0">
                      <span className="fs22px fw-5">24</span>
                    </div>
                  </div>
                </div>
              }
              body={
                <div className="position-relative">
                  <video
                    ref={videoRef}
                    className="w-100 h-100 overflow-hidden"
                    style={{ objectFit: "cover", borderRadius: "10px" }}
                    loop
                    autoPlay
                    playsInline
                  >
                    <source src="/video/bgVideoNew.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>

                  {/* Custom fullscreen button */}
                  <button
                    onClick={toggleFullscreen}
                    className="btn position-absolute bg-black bg-opacity-50 text-white"
                    style={{
                      zIndex: 2,
                      bottom: "7.87px",
                      right: "9.44px",
                      padding: "6px 10px",
                    }}
                  >
                    <MdFullscreen size={32} />
                  </button>
                </div>
              }
              modalId={"camera 01"}
            />
          </div>
          <div
            className="col-3 "
            style={{
              height: leftHeight ? `${leftHeight}px` : "auto",
              overflowY: "auto",
              paddingLeft: "10px",
            }}
          >
            <p className="text-end">
              <Link
                target="_blank"
                className="link-opacity-10-hover "
                href="https://www.youtube.com/watch?v=2AYvZD8kRHQ"
              >
                Drone Video
              </Link>
            </p>

            {defaultData?.map((d) => (
              <div
                key={d}
                className="col position-relative"
                style={{ marginBottom: "15.74px" }}
              >
                <video
                  className="w-100 h-100 overflow-hidden"
                  style={{ objectFit: "cover", borderRadius: "10px" }}
                >
                  <source src="/video/bgVideoNew.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div
                  className="position-absolute text-white"
                  style={{
                    bottom: "9.55px",
                    left: "14.95px",
                    textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                    fontWeight: "600",
                    zIndex: 2,
                  }}
                >
                  <p
                    className="fw-bold fs12-5px m-0"
                    style={{ paddingLeft: "6px" }}
                  >
                    Camera {d + 1}
                  </p>
                  <p
                    className="fw-normal fs11px m-0"
                    style={{ paddingLeft: "6px" }}
                  >
                    {new Date().toLocaleDateString("en-GB", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {/* 15-5-2025 12:19:49 PM */}
                  </p>
                </div>
                <div
                  className="position-absolute w-100 bottom-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(to bottom, rgba(0, 0, 0, 0) , rgba(0, 0, 0, 1))",
                    borderBottomRightRadius: "10px",
                    borderBottomLeftRadius: "10px",
                    height: "30%",
                  }}
                ></div>
                <span
                  className="badge bg-color-evaluation-theme-blue position-absolute fs11px fw-5 rounded-pill"
                  style={{
                    top: "7.87px",
                    right: "9.44px",
                    padding: "6px 10px",
                  }}
                >
                  LIVE
                </span>
                <div
                  className="row position-absolute text-white d-flex gap-2"
                  style={{ top: "7.87px", left: "9.44px", padding: "6px 10px" }}
                >
                  <div className="col pe-0">
                    <IoWifiOutline size={19} />
                  </div>
                  <div className="col ps-0">
                    <span className="fs12-5px fw-5">24</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="fw-8 fs18px m-0" style={{ padding: "17.33px 0px" }}>
          {data?.name}
        </p>
        <div className="row">
          <div className="col-9">
            <div
              className="row d-flex gap-4"
              style={{ margin: "20px 0px 10px 0px" }}
            >
              <div
                className="col"
                style={{
                  backgroundColor: "rgba(28, 107, 166, 0.1)",
                  border: "1.14px solid #1C6BA6",
                  padding: "27.28px",
                  borderRadius: "30px",
                }}
              >
                <p
                  className="fs16px fw-5 text-center"
                  style={{ marginBottom: "18.18px", color: "#606060" }}
                >
                  Planned Start Date
                </p>
                <p
                  className="fs18px fw-bold text-center m-0"
                  style={{ marginBottom: "18.18px", color: "#475569" }}
                >
                  {previewDate(
                    data?.groups
                      .find((group) => group.name === "Project Profile")
                      ?.attributes.find(
                        (attr) => attr.label === "Planned Start Date",
                      )?.values[0].value || "",
                  )}
                </p>
              </div>
              <div
                className="col"
                style={{
                  backgroundColor: "rgba(28, 107, 166, 0.1)",
                  border: "1.14px solid #1C6BA6",
                  padding: "27.28px",
                  borderRadius: "30px",
                }}
              >
                <p
                  className="fs16px fw-5 text-center"
                  style={{ marginBottom: "18.18px", color: "#606060" }}
                >
                  Planned End Date
                </p>
                <p
                  className="fs18px fw-bold text-center m-0"
                  style={{ marginBottom: "18.18px", color: "#475569" }}
                >
                  {previewDate(
                    data?.groups
                      .find((group) => group.name === "Project Profile")
                      ?.attributes.find(
                        (attr) => attr.label === "Planned End Date",
                      )?.values[0].value || "",
                  )}
                </p>
              </div>
              <div
                className="col"
                style={{
                  backgroundColor: "rgba(28, 107, 166, 0.1)",
                  border: "1.14px solid #1C6BA6",
                  padding: "27.28px",
                  borderRadius: "30px",
                }}
              >
                <p
                  className="fs16px fw-5 text-center"
                  style={{ marginBottom: "18.18px", color: "#606060" }}
                >
                  PC-I Cost
                </p>
                <p
                  className="fs18px fw-bold text-center m-0"
                  style={{ marginBottom: "18.18px", color: "#475569" }}
                >
                  {
                    data?.groups
                      .find((group) => group.name === "Project Profile")
                      ?.attributes.find((attr) => attr.label === "PC-I Cost")
                      ?.values[0].value
                  }
                  M
                </p>
              </div>
              <div
                className="col"
                style={{
                  backgroundColor: "rgba(28, 107, 166, 0.1)",
                  border: "1.14px solid #1C6BA6",
                  padding: "27.28px",
                  borderRadius: "30px",
                }}
              >
                <p
                  className="fs16px fw-5 text-center"
                  style={{ marginBottom: "18.18px", color: "#606060" }}
                >
                  Utilization
                </p>
                <p
                  className="fs18px fw-bold text-center m-0"
                  style={{ marginBottom: "18.18px", color: "#475569" }}
                >
                  {
                    data?.groups
                      .find((group) => group.name === "Financial Analysis")
                      ?.attributes.find((attr) => attr.label === "Utilization")
                      ?.values[0].value
                  }
                  M
                </p>
              </div>
              <div
                className="col"
                style={{
                  backgroundColor: "rgba(28, 107, 166, 0.1)",
                  border: "1.14px solid #1C6BA6",
                  padding: "27.28px",
                  borderRadius: "30px",
                }}
              >
                <p
                  className="fs16px fw-5 text-center"
                  style={{ marginBottom: "18.18px", color: "#606060" }}
                >
                  Gestation Period
                </p>
                <p
                  className="fs18px fw-bold text-center m-0"
                  style={{ marginBottom: "18.18px", color: "#475569" }}
                >
                  {
                    data?.groups
                      .find((group) => group.name === "Project Profile")
                      ?.attributes.find(
                        (attr) => attr.label === "Gestation Period",
                      )?.values[0].value
                  }{" "}
                  Months
                </p>
              </div>
            </div>
          </div>
          <div className="col">
            {data && (
              <Reports
                reports={data.reports}
                observations={
                  data.groups.find(
                    (group) => group.name === "Observation & Recommendations",
                  )!
                }
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProjectLiveViewPage;
