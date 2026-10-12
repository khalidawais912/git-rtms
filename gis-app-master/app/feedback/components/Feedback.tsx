"use client";
import { FEEDBACK_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import { setFeedbackCount } from "@/app/features/feedback/feedbackCountSlice";
import useAuthentication from "@/app/hooks/useAuthentication";
import useProjects from "@/app/hooks/useProjects";
import apiClient, { AxiosError } from "@/app/services/api-client";
import {
  addDayToFormattedDate,
  getDaysAgo,
  getFormattedDate,
} from "@/app/utils";
import Cookies from "js-cookie";
import { Lexend } from "next/font/google";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoSearch } from "react-icons/io5";
import { useDispatch } from "react-redux";

const lexend = Lexend({
  subsets: ["latin"],
});

export interface Feedback {
  id: number;
  projectId: number;
  userId: number;
  remarks: string;
  commentPath: string;
  reportTo: number;
  status: number;
  reportDate: string;
  resolvedDate: string;
}

const Feedback = () => {
  const [selectedButton, setSelectedButton] = useState(2);
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState<Feedback[]>();
  const [userId, setUserId] = useState<number>();
  const { data: users } = useAuthentication({ refresh });
  // const [singleProjectData, setSingleProjectData] =
  //   useState<SingleProjectLessData>();
  const dispatch = useDispatch();

  useEffect(() => {
    const id = Cookies.get("userId");
    // const role = Cookies.get("role");
    if (id) setUserId(parseInt(id));
  }, []);

  useEffect(() => {
    const handleSubmit = async (userId: number) => {
      try {
        const response = await apiClient.get(
          `${FEEDBACK_API}/GetFeedBackByReportingTo?reportingTo=${userId}`,
        );
        setData(response.data.data);
        {
          data && data.length > 0
            ? data.filter((d) => d.status === 0).length
            : "";
        }
        dispatch(
          setFeedbackCount(
            response.data.data.filter((d: any) => d.status === 0).length,
          ),
        );
      } catch (err) {
        console.error("Submission error:", err);
      }
    };
    if (userId) handleSubmit(userId);
  }, [userId, refresh]);

  // useEffect(() => {
  //   const handleSubmit = async (projectId: number) => {
  //     try {
  //       const response = await apiClient.get(
  //         `${PROJECT_API}/GetSingleProject?id=${projectId}`
  //       );
  //       setSingleProjectData(response.data.data);
  //     } catch (err) {
  //       console.error("Submission error:", err);
  //     }
  //   };
  //   if (userId) handleSubmit(userId);
  // }, [userId]);

  const { data: projects } = useProjects({ refresh });

  const handleSubmit = async (data: Feedback) => {
    console.log("feedback data", data);
    try {
      const response = await apiClient.put(FEEDBACK_API, data);
      toast.success("Issue Resolved Successfully");
      console.log("resolved api status:", response);
      setRefresh(!refresh);
    } catch (err) {
      console.error("Submission error:", (err as AxiosError).message);
      toast.error("Something Bad Happend");
    }
  };

  const [status, setStatus] = useState(0);

  // State for search input
  const [searchTerm, setSearchTerm] = useState("");

  // State for filtered data
  const [filteredData, setFilteredData] = useState<Feedback[]>([]);

  // Handle search logic
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const lowercasedFilter = searchTerm.toLowerCase();
    const filtered =
      data &&
      data.filter((item) =>
        [
          item.id.toString(),
          item.projectId.toString(),
          item.remarks,
          item.status.toString(),
          item.userId.toString(),
        ]
          .filter((field) => field) // Remove undefined fields
          .map((field) => field.toLowerCase())
          .some((field) => field.includes(e.target.value.toLowerCase())),
      );

    if (filtered) setFilteredData(filtered);
  };

  // Update searchTerm and clear search if empty
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e);
  };

  const handleFilterData = (data: Feedback[], status: number) => {
    if (status === -1) {
      setFilteredData(
        data
          ?.filter((d: any) => d) // Apply any additional filters if needed
          .sort((a: any, b: any) =>
            a.status === 0 ? -1 : b.status === 0 ? 1 : 0,
          ),
      );
    } else {
      setStatus(status);
      setFilteredData(data?.filter((d: any) => d.status === status));
    }
  };

  useEffect(() => {
    if (data) handleFilterData(data, status);
  }, [data]);

  return (
    <div
      className="container-fluid p-3 mb-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6), rgba(255, 255, 255, 0.08))",
        border: "1px solid rgba(255, 255, 255, 0.6)",
        borderRadius: "10px",
      }}
    >
      {data && (
        <div className={`col ${lexend.className}`}>
          <div className="row d-flex m-0 mb-3">
            <div className="col">
              <h2 className="fw-bold" style={{ fontSize: "30px" }}>
                Feedback
              </h2>
            </div>
            {/* <div className="col text-end">
            <Button className="btn rounded-circle p-0">
              <Image
                src={settingsGrey}
                alt="settingsGrey"
                width={24}
                height={24}
              />
            </Button>
          </div> */}
          </div>
          <div className="row d-flex m-0 mb-3">
            <div className="col">
              <div className="row d-flex m-0">
                <div className="col-auto">
                  <Button
                    className={`btn shadow-none rounded-0 fw-bold position-relative ${
                      selectedButton === 1 ? "text-dark" : "text-secondary"
                    }`}
                    style={{
                      borderBottom: `${
                        selectedButton === 1 ? "3px solid #0c8ce9" : ""
                      }`,
                    }}
                    onClick={() => {
                      setSelectedButton(1);
                      handleFilterData(data, -1);
                    }}
                  >
                    All
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {data && data.length > 0 ? data.length : ""}
                    </span>
                  </Button>
                </div>
                <div className="col-auto">
                  <Button
                    className={`btn shadow-none rounded-0 fw-bold position-relative ${
                      selectedButton === 2 ? "text-dark" : "text-secondary"
                    }`}
                    style={{
                      borderBottom: `${
                        selectedButton === 2 ? "3px solid #0c8ce9" : ""
                      }`,
                    }}
                    onClick={() => {
                      setSelectedButton(2);
                      handleFilterData(data, 0);
                    }}
                  >
                    Pending
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {data && data.length > 0
                        ? data.filter((d) => d.status === 0).length
                        : ""}
                    </span>
                  </Button>
                </div>
                <div className="col-auto">
                  <Button
                    className={`btn shadow-none rounded-0 fw-bold position-relative ${
                      selectedButton === 3 ? "text-dark" : "text-secondary"
                    }`}
                    style={{
                      borderBottom: `${
                        selectedButton === 3 ? "3px solid #0c8ce9" : ""
                      }`,
                    }}
                    onClick={() => {
                      setSelectedButton(3);
                      handleFilterData(data, 1);
                    }}
                  >
                    Resolved
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {data && data.length > 0
                        ? data.filter((d) => d.status === 1).length
                        : ""}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 text-auto">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control border-0 rounded-pill rounded-end"
                    style={{
                      background: "rgba(16, 143, 168, .1)",
                      outline: "none",
                      border: "1px solid #D0D5DD",
                    }}
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleChange}
                  />
                  <button
                    className="btn rounded-start rounded-pill bg-color-sea-green text-white"
                    type="submit"
                  >
                    <IoSearch className="mb-1" style={{ color: "#fff" }} />
                  </button>
                </div>
              </form>
            </div>
          </div>
          {filteredData.map((d) => (
            <div
              key={d.id}
              className="col w-100 bg-white p-3 mb-3"
              style={{ borderRadius: "8px" }}
            >
              <div className="row d-flex m-0 mb-2">
                <div className="col">
                  <div
                    className="row px-1 py-2 d-flex m-0 shadow-sm mb-2"
                    style={{ borderRadius: "8px" }}
                  >
                    {users.find((user) => user.id === d.userId) && (
                      <div className="col-auto">
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_API}${
                            users.find((user) => user.id === d.userId)?.picture
                          }`}
                          alt="profilePic"
                          className="img-fluid rounded-circle shadow-sm"
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "cover",
                            objectPosition: "center top",
                          }}
                        />
                      </div>
                    )}
                    <div className="col ps-0">
                      <div className="row d-flex m-0">
                        <div className="col p-0">
                          <p className="m-0 fs13px fw-bold">
                            {
                              projects.find(
                                (project) => project.id === d.projectId,
                              )?.name
                            }
                          </p>
                        </div>
                        {d.status === 0 && (
                          <div className="col-auto fs11px fw-normal text-secondary">
                            {getDaysAgo(d.reportDate)}
                          </div>
                        )}
                      </div>
                      <>
                        <span
                          className="m-0 fs13px me-3"
                          style={{ color: "#4D4D4D", fontWeight: 500 }}
                        >
                          GS No:{" "}
                          <span
                            className="fw-normal"
                            style={{ color: "#888888" }}
                          >
                            {
                              projects.find(
                                (project) => project.id === d.projectId,
                              )?.gsNo
                            }
                          </span>
                        </span>
                      </>
                      <>
                        <span
                          className="m-0 fs13px me-3"
                          style={{ color: "#4D4D4D", fontWeight: 500 }}
                        >
                          Officer Name:{" "}
                          <span
                            className="fw-normal"
                            style={{ color: "#888888" }}
                          >
                            {
                              users.find((user) => user.id === d.userId)
                                ?.userName
                            }
                          </span>
                        </span>
                      </>
                      <>
                        <span
                          className="m-0 fs13px me-3"
                          style={{ color: "#4D4D4D", fontWeight: 500 }}
                        >
                          Status:{" "}
                          <span
                            className="fw-normal"
                            style={{ color: "#888888" }}
                          >
                            {d.status === 0 ? "Pending" : "Resolved"}
                          </span>
                        </span>
                      </>
                      <>
                        <span
                          className="m-0 fs13px me-3"
                          style={{ color: "#4D4D4D", fontWeight: 500 }}
                        >
                          Report Date:{" "}
                          <span
                            className="fw-normal"
                            style={{ color: "#888888" }}
                          >
                            {new Date(d.reportDate).toLocaleDateString(
                              "en-GB",
                              {
                                weekday: "short",
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </span>
                      </>
                    </div>
                    {d.status === 1 && (
                      <div className="col-auto fs11px fw-normal text-secondary m-auto">
                        <span
                          className="badge rounded-pill text-white px-3 py-2 fs11px"
                          style={{
                            background: "#22B07D",
                            fontWeight: "500",
                          }}
                        >
                          Issue Resolved
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="row d-flex m-0 mb-3">
                    <div className="col fs13px fw-bold">
                      <p className="mb-1">Remarks</p>
                      <div
                        className="col fs11px fw-normal p-2"
                        style={{
                          background: "rgba(243, 243, 243, 0.5)",
                          border: "1px solid #E4E4E4",
                          borderRadius: "3px",
                          color: "#666666",
                        }}
                      >
                        {d.remarks}
                      </div>
                    </div>
                    <div className="col-auto fs13px fw-bold pe-0">
                      <p className="mb-1">Pictures</p>
                      <div
                        className="col fs11px fw-normal p-2"
                        style={{
                          border: "1px dashed #E4E4E4",
                          borderRadius: "10px",
                        }}
                      >
                        {d.commentPath && (
                          <CustomModal
                            size="xl"
                            modalId={`feedbackImage${d.id}`}
                            button={
                              <Button className="btn p-0">
                                <img
                                  src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.commentPath}`}
                                  alt="feedbackImage"
                                  className="img-fluid"
                                  style={{
                                    width: "252px",
                                    height: "112px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                  }}
                                />
                              </Button>
                            }
                            body={
                              <div
                                className="container-fluid border-0 p-1"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                }}
                              >
                                <img
                                  src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.commentPath}`}
                                  alt="feedbackImage"
                                  className="img-fluid"
                                  style={{
                                    width: "100%",
                                    height: "90vh",
                                    objectFit: "contain",
                                  }}
                                />
                              </div>
                            }
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  {d.status === 0 && (
                    <div className="row m-0">
                      <div className="col fw-bold text-end">
                        <Button
                          className="btn rounded-pill py-2 px-4 text-white"
                          style={{ background: "#2B67F6" }}
                          onClick={() =>
                            handleSubmit({
                              id: d.id,
                              projectId: d.projectId,
                              userId: d.userId,
                              remarks: d.remarks,
                              commentPath: d.commentPath,
                              reportTo: d.reportTo,
                              status: 1,
                              reportDate: d.reportDate,
                              resolvedDate: new Date().toISOString(),
                            })
                          }
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feedback;
