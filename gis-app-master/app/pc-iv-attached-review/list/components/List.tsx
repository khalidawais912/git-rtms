"use client";
import { PC_IV_WORKFLOW_API, REPORTS_HISTORY_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import Loader from "@/app/components/Loader/Loader";
import { DashboardTypeEnum } from "@/app/dashboard/types/types";
import { Officer } from "@/app/hooks/useOfficers";
import { ReportHistoryUser } from "@/app/hooks/useReportHistoryUsers";
import apiClient, { AxiosError } from "@/app/services/api-client";
import search3 from "@/public/icons/search3.svg";
import Cookies from "js-cookie";
import { Raleway } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BsExclamationTriangleFill } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";
import DownloadWrapper from "../../components/DownloadWrapper";
import ReportNoting from "../../components/ReportNoting";
import ViewHistoryOnly from "../../components/ViewHistoryOnly";
import {
  APPROVED,
  COMPLETED,
  ISSUED,
  REFERBACK,
  SCHEDULED,
  SUBMITTED,
} from "../../statuses";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export interface SubmittedReport {
  id: number;
  visitId: number;
  projectId: number;
  submittedFrom: number;
  submittedTo: number;
  remarks: string;
  projectName: string;
  gsNo: string;
  reportPath: string;
  status: number;
  submittedDate: string;
  issuanceDate: string;
  reportType: number;
  intiallyUserId: number;
  intiallyUser: string;
  intiallyDesignation: string;
  isFocalPerson: boolean;
}

export interface SubmittedReportResponse {
  totalIssuedCount: number;
  reports: SubmittedReport[];
}

interface Tab {
  id: number;
  label: string;
  status: number;
  role: string;
  reportSubmittedFrom?: number;
  reportSubmittedTo?: number;
  count: number;
  filteredData: SubmittedReport[] | undefined;
}

interface Props {
  dashbaordType: DashboardTypeEnum | undefined;
  users: ReportHistoryUser[];
  officers: Officer[];
  deputyDirectors: Officer[];
  directors: Officer[];
  // departmentHead: Officer;
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  loggedInUsername: string;
}

const List = ({
  dashbaordType,
  users,
  officers,
  deputyDirectors,
  directors,
  // departmentHead,
  refresh,
  setRefresh,
  loggedInUsername,
}: Props) => {
  const [data, setData] = useState<SubmittedReport[]>([]);
  const [issuedReportCount, setIssuedReportCount] = useState<number>(0);
  const [issuedReportsData, setIssuedReportsData] =
    useState<SubmittedReport[]>();

  const [userId, setUserId] = useState<number>();
  const [role, setRole] = useState<string>();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedTabLabel, setSelectedLabel] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  // 👇 NEW: Track if initial modal has been opened
  const hasOpenedInitialModal = useRef(false);

  // 👇 NEW: Track current modal index and auto-open state
  const [currentAutoOpenIndex, setCurrentAutoOpenIndex] = useState<number>(-1);
  const [shouldAutoOpen, setShouldAutoOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("selectedTab", selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    const id = Cookies.get("userId");
    const role = Cookies.get("role");

    if (id) {
      const convertedId = parseInt(id);
      setUserId(convertedId);
    }
    if (role) setRole(role.toLowerCase());
  }, []);

  // State for filtered data
  const [filteredData, setFilteredData] = useState<
    SubmittedReport[] | undefined
  >();
  // State for filtered data
  const [searchData, setSearchData] = useState<SubmittedReport[] | undefined>();

  useEffect(() => {
    const handleSubmit = async (userId: number) => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          `${PC_IV_WORKFLOW_API}/submitted-reports`,
          {
            params: { userId },
          },
        );
        if (response.data.data) {
          console.log("response.data.data", response.data.data);

          const sortedData = response.data.data.reports.sort(
            (a: any, b: any) =>
              new Date(a.submittedDate).getTime() -
              new Date(b.submittedDate).getTime(),
          );
          setData(sortedData);
          console.log("sortedData data", sortedData);
        }
        console.log("original data", response.data.data);
        setLoading(false);
      } catch (err) {
        setError((err as AxiosError).message);
        console.error("Submission error:", err);
        setLoading(false);
      }
    };
    if (userId) handleSubmit(userId);
  }, [userId, refresh]);

  useEffect(() => {
    if (issuedReportsData) {
      if (userRole === "MONITORING") {
        setIssuedReportCount(
          issuedReportsData.filter((data) => data.reportType === 1).length,
        );
      } else if (userRole === "EVALUATION") {
        setIssuedReportCount(
          issuedReportsData.filter((data) => data.reportType === 0).length,
        );
      } else {
        setIssuedReportCount(issuedReportsData.length);
      }
    }
  }, [issuedReportsData]);

  useEffect(() => {
    const handleSubmit = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(
          `${REPORTS_HISTORY_API}/GetIssuedReports`,
        );

        if (response.data.data) {
          const sortedData = response.data.data.sort(
            (a: any, b: any) => b.visitId - a.visitId,
          );

          setIssuedReportsData(sortedData);
          console.log("issued response.data.data", response.data.data);
        }
        setLoading(false);
      } catch (err) {
        setError((err as AxiosError).message);
        console.error("Submission error:", err);
        setLoading(false);
      }
    };

    handleSubmit();
  }, []);

  const hasManuallySelectedTab = useRef(false);

  const [tabs, setTabs] = useState<Tab[]>();

  useEffect(() => {
    const tabs = [
      // {
      // id: 0,
      //   label: "All",
      //   status: -99,
      //   reportSubmittedFrom: userId,
      //   reportSubmittedTo: userId,
      //   filteredData:data;
      // },
      {
        id: 1,
        label: "SUBMITTED BY ATTACHED DEPT.",
        status: SUBMITTED,
        role: "administrative secretary",
        count: 0,
        filteredData: undefined,
      },
      {
        id: 2,
        label: "SUBMITTED TO (DGM&E)",
        status: SUBMITTED,
        role: "administrative secretary",
        count: 0,
        filteredData: undefined,
      },

      // {
      // id: 14,
      //   label: "ISSUED",
      //   status: ISSUED,
      //   direction: undefined,
      //   tabKey: `${ISSUED}`,
      //   count: 0,
      // },
    ];

    if (data) {
      const updatedTabs: Tab[] = tabs.map((tab) => {
        let count = 0;
        let filteredData: SubmittedReport[] = [];

        return { ...tab, count, filteredData };
      });
      if (updatedTabs) setTabs(updatedTabs);
    }
  }, [data]);

  useEffect(() => {
    if (!tabs) return;

    // ✅ If user manually selected a tab, respect that choice
    if (hasManuallySelectedTab.current) {
      // Update filteredData based on selected tab
      if (selectedTab === 0) {
        // "All" tab
        setFilteredData(data);
      } else if (selectedTab === -98) {
        // "Issued" tab - don't change anything
        return;
      } else {
        // Other tabs
        const selected = tabs.find((t) => t.id === selectedTab);
        if (selected) {
          setFilteredData(selected.filteredData);
        }
      }
      return; // Don't run auto-selection logic
    }

    // ✅ Auto-select logic (only when NOT manually selected)
    const tabWithRecord = tabs.find(
      (tab) =>
        tab.role === role &&
        tab.count > 0 &&
        (tab.id === 1 ||
          tab.id === 8 ||
          tab.id === 9 ||
          tab.id === 2 ||
          tab.id === 7 ||
          tab.id === 11 ||
          tab.id === 5),
    );

    if (tabWithRecord) {
      setSelectedTab(tabWithRecord.id);
      setSelectedLabel(tabWithRecord.label);
      setFilteredData(tabWithRecord.filteredData);
    } else {
      setSelectedTab(0);
      setSelectedLabel("All");
      setFilteredData(data);
    }
  }, [tabs, role, selectedTab, data]);

  console.log("tabs", tabs);

  // 👇 NEW: Get comment-eligible reports (where user needs to comment)
  const getCommentEligibleReports = () => {
    if (!filteredData || selectedTabLabel === "All") return [];

    return filteredData.filter((d) => d.submittedTo === userId);
  };

  // 👇 NEW: Auto-open first modal on initial load
  useEffect(() => {
    if (
      !hasOpenedInitialModal.current &&
      filteredData &&
      filteredData.length > 0 &&
      selectedTabLabel !== "All" &&
      userId
    ) {
      const commentEligibleReports = getCommentEligibleReports();

      if (commentEligibleReports.length > 0) {
        // Wait for DOM to be ready
        setTimeout(() => {
          const firstModalButton = document.querySelector(
            `[data-bs-target="#comment${commentEligibleReports[0].id}"]`,
          ) as HTMLButtonElement;

          if (firstModalButton) {
            firstModalButton.click();
            hasOpenedInitialModal.current = true;
            setCurrentAutoOpenIndex(0);
          }
        }, 500);
      }
    }
  }, [filteredData, selectedTabLabel, userId]);

  // 👇 NEW: Handle auto-opening next modal after submission
  useEffect(() => {
    if (!shouldAutoOpen || currentAutoOpenIndex < 0) return;

    const currentTab = tabs?.find((tab) => tab.id === selectedTab);
    const currentTabData = currentTab?.filteredData ?? filteredData ?? [];
    const commentEligible = currentTabData.filter(
      (d) => d.submittedTo === userId,
    );

    const nextIndex = currentAutoOpenIndex + 1;

    if (nextIndex < commentEligible.length) {
      const nextReport = commentEligible[nextIndex];
      setTimeout(() => {
        const btn = document.querySelector(
          `[data-bs-target="#comment${nextReport.id}"]`,
        ) as HTMLButtonElement;
        if (btn) {
          btn.click();
          setCurrentAutoOpenIndex(nextIndex);
        }
        setShouldAutoOpen(false);
      }, 300);
    } else {
      setShouldAutoOpen(false);
      setCurrentAutoOpenIndex(-1);
    }
  }, [
    shouldAutoOpen,
    currentAutoOpenIndex,
    selectedTab,
    tabs,
    filteredData,
    userId,
  ]);

  // 👇 NEW: Callback function to trigger next modal
  const handleCommentSubmitted = () => {
    setShouldAutoOpen(true);
  };

  // 🔍 Search handler
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filtered = filteredData?.filter((item) =>
      [
        item.id,
        item.gsNo,
        item.intiallyDesignation,
        item.intiallyUser,
        item.projectId,
        item.projectName,
        item.visitId,
      ]
        .filter(Boolean)
        .map((f) => String(f).toLowerCase())
        .some((field) => field.includes(value)),
    );
    setSearchTerm(e.target.value);
    setSearchData(filtered);
  };

  useEffect(() => {
    console.log("searchData", searchData);
  }, [searchData]);

  // 🔍 Search handler
  const handleSearchIssuedReports = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    const filtered = issuedReportsData?.filter((item) =>
      [
        item.id,
        item.gsNo,
        item.intiallyDesignation,
        item.intiallyUser,
        item.projectId,
        item.projectName,
        item.visitId,
      ]
        .filter(Boolean)
        .map((f) => String(f).toLowerCase())
        .some((field) => field.includes(value)),
    );
    setSearchTerm(e.target.value);
    setSearchData(filtered);
  };

  const isIssuedTab = selectedTabLabel === "Issued";

  const userRole = useMemo(() => {
    const username = loggedInUsername.toLowerCase();

    if (username.includes("monitoring")) return "MONITORING";
    if (username.includes("evaluation")) return "EVALUATION";

    return "ALL";
  }, [loggedInUsername]);

  let issuedDataFiltered = issuedReportsData;

  if (userRole === "MONITORING") {
    issuedDataFiltered = issuedReportsData?.filter((d) => d.reportType === 1);
  } else if (userRole === "EVALUATION") {
    issuedDataFiltered = issuedReportsData?.filter((d) => d.reportType === 0);
  }

  const dataToRender = searchTerm
    ? searchData
    : isIssuedTab
      ? issuedDataFiltered
      : filteredData;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div
          className="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <BsExclamationTriangleFill size={24} className="me-2" />
          <div>{error}, Please Try Again!</div>
        </div>
      ) : userId && role ? (
        // ✅ render your data block here
        <div
          className={`container-fluid p-3 mt-3 mb-4 ${raleway.className}`}
          style={{
            background:
              "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6) , rgba(255, 255, 255, 0.08))",
            border: "1px solid rgba(255, 255, 255, 0.29)",
            borderRadius: "15px",
          }}
        >
          <div className="row d-flex justify-content-between">
            <div className="col-auto my-auto">
              <h5 className="fs18px fw-bold">List of Reports</h5>
            </div>

            <div className="col-auto">
              <div className="row d-flex justify-content-end mb-3">
                <div className="col-auto my-auto">
                  {selectedTabLabel === "Issued" && issuedReportsData ? (
                    <DownloadWrapper
                      data={issuedReportsData}
                      fileName={selectedTabLabel}
                    />
                  ) : filteredData ? (
                    <DownloadWrapper
                      data={filteredData}
                      fileName={selectedTabLabel}
                    />
                  ) : (
                    ""
                  )}
                </div>

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
                        <Image
                          src={search3}
                          alt="search3"
                          width={18}
                          height={18}
                        />
                      </button>
                      <input
                        type="text"
                        className="form-control border-start-0 rounded-pill rounded-start shadow-none fs14px bg-transparent py-2"
                        style={{
                          border: "1px solid rgba(38, 50, 56,.6)",
                          color: "rgba(38, 50, 56,1)",
                        }}
                        placeholder="Search"
                        value={searchTerm}
                        onChange={
                          selectedTabLabel === "Issued"
                            ? handleSearchIssuedReports
                            : handleSearch
                        }
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col m-auto">
            <div className="row d-flex mb-3">
              <div className="col">
                <div className="row d-flex align-items-center">
                  <div className="col-auto">
                    <Button
                      className={`btn shadow-none rounded-0 fw-bold position-relative ${
                        selectedTab === 0 ? "text-dark" : "text-secondary"
                      }`}
                      style={{
                        borderBottom:
                          selectedTab === 0 ? "3px solid #0c8ce9" : "",
                      }}
                      onClick={() => {
                        setSelectedTab(0);
                        hasManuallySelectedTab.current = true;
                        setSelectedLabel("All");
                        setFilteredData(data);
                      }}
                    >
                      All
                      {data?.filter(
                        (d) =>
                          (d.submittedTo === userId ||
                            d.submittedFrom === userId) &&
                          d.isFocalPerson === true,
                      ).length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {
                            data?.filter(
                              (d) =>
                                (d.submittedTo === userId ||
                                  d.submittedFrom === userId) &&
                                d.isFocalPerson === true,
                            ).length
                          }
                        </span>
                      )}
                    </Button>
                  </div>
                  {tabs?.map((tab) => (
                    <div key={tab.id} className="col-auto">
                      <Button
                        className={`btn shadow-none rounded-0 fw-bold position-relative ${
                          selectedTab === tab.id
                            ? "text-dark"
                            : "text-secondary"
                        }`}
                        style={{
                          borderBottom:
                            selectedTab === tab.id ? "3px solid #0c8ce9" : "",
                        }}
                        onClick={() => {
                          hasManuallySelectedTab.current = true; // 👈 add this
                          setSelectedTab(tab.id);
                          setSelectedLabel(tab.label);
                          setFilteredData(tab.filteredData);
                          setCurrentAutoOpenIndex(-1);
                          setShouldAutoOpen(false);
                          hasOpenedInitialModal.current = false;
                          console.log("tab filteredData", tab.filteredData);
                        }}
                      >
                        {tab.label}
                        {tab.count > 0 && (
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {tab.count}
                          </span>
                        )}
                      </Button>
                    </div>
                  ))}
                  {/* {(dashbaordType === undefined ||
                    role !== "Department Admin") && (
                    <div className="col-auto">
                      <Button
                        className={`btn shadow-none rounded-0 fw-bold position-relative ${
                          selectedTab === -98 ? "text-dark" : "text-secondary"
                        }`}
                        style={{
                          borderBottom:
                            selectedTab === -98 ? "3px solid #0c8ce9" : "",
                        }}
                        onClick={() => {
                          hasManuallySelectedTab.current = true; // ✅ ADD THIS
                          setSelectedTab(-98);
                          setSelectedLabel("Issued");
                          setCurrentAutoOpenIndex(-1); // ✅ ADD THIS
                          setShouldAutoOpen(false); // ✅ ADD THIS
                          hasOpenedInitialModal.current = false; // ✅ ADD THIS
                        }}
                      >
                        Issued
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {issuedReportCount}
                        </span>
                      </Button>
                    </div>
                  )} */}

                  {/* <div className="col-auto">
                    <Button
                      className={`btn shadow-none rounded-0 fw-bold position-relative ${
                        selectedTab === tabs.length
                          ? "text-dark"
                          : "text-secondary"
                      }`}
                      style={{
                        borderBottom:
                          selectedTab === tabs.length
                            ? "3px solid #0c8ce9"
                            : "",
                      }}
                      onClick={() => {
                        setSelectedTab(tabs.length);
                        setSelectedLabel("Issued")
                        setFilteredData(
                          data?.filter((d) => d.status === ISSUED)
                        );
                      }}
                    >
                      Issued
                      {data?.filter((d) => d.status === ISSUED).length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {data?.filter((d) => d.status === ISSUED).length}
                        </span>
                      )}
                    </Button>
                  </div> */}
                </div>
              </div>
              {/* <div className="col-lg-4 col-md-6 col-sm-12 text-auto">
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
                      </div> */}
            </div>
          </div>
          {dataToRender && dataToRender?.length > 0 ? (
            dataToRender?.map((d, i) => (
              <div
                key={i}
                className="col mb-2 position-relative overflow-hidden"
              >
                <div
                  className="col p-3"
                  style={{
                    background: "#FAFAFA",
                    borderRadius: "12px",
                    border: "1px solid rgba(0, 0, 0,.1)",
                  }}
                >
                  <div className="row m-0">
                    {/* LEFT STATUS BOX */}
                    <div
                      className={`col-auto rounded-3 p-3 ${
                        d.status === ISSUED
                          ? "bg-success text-light"
                          : d.status === REFERBACK
                            ? "bg-danger text-light"
                            : d.status === SUBMITTED
                              ? "bg-warning text-dark"
                              : "bg-info text-dark"
                      }`}
                    >
                      <p className="fw-5 mb-0">
                        <span className="fw-bold">Sr#</span> {i + 1}
                      </p>
                      <p className="fw-5 mb-0">
                        <span className="fw-bold">GS No. </span>
                        {d.gsNo}
                      </p>
                    </div>

                    <div className="col">
                      {/* HEADER */}
                      <div className="row d-flex justify-content-between align-items-center mb-2">
                        <div className="col">
                          <p
                            className="fs18px fw-bold m-0"
                            style={{ color: "#263238", paddingRight: 90 }}
                          >
                            <span>Project: </span> {d.projectName}
                          </p>
                        </div>

                        {/* BADGE */}
                        <div
                          className="col-auto position-absolute p-0"
                          style={{ rotate: "45deg", top: 40, right: -40 }}
                        >
                          {d.reportType === 1 ? (
                            <span
                              className="badge px-5 fw-bold py-2 fs-6"
                              style={{ backgroundColor: "#3B7C80" }}
                            >
                              MONITORING
                            </span>
                          ) : d.reportType === 0 ? (
                            <span className="badge bg-color-evaluation-theme-blue px-5 fw-bold py-2 fs-6">
                              EVALUATION
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* BODY */}
                      <div className="row d-flex justify-content-between">
                        {/* Officer */}
                        <div className="col">
                          <p className="mb-2 fs18px fw-bold">Officer Name</p>
                          <p className="mb-0">
                            {d.intiallyUser}
                            <br />
                            <span>({d.intiallyDesignation})</span>
                          </p>
                        </div>

                        {/* Submitted */}
                        <div className="col">
                          <p className="mb-2 fs18px fw-bold">Submitted Date</p>
                          <p className="mb-0">
                            {d.submittedDate ? (
                              <>
                                {new Date(d.submittedDate).toLocaleDateString(
                                  "en-GB",
                                  {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                                <br />
                                {new Date(d.submittedDate).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  },
                                )}
                              </>
                            ) : (
                              "N/A"
                            )}
                          </p>
                        </div>

                        {/* ✅ Issued Date ONLY for Issued Tab */}
                        {isIssuedTab && (
                          <div className="col">
                            <p className="mb-2 fs18px fw-bold">Issued Date</p>
                            <p className="mb-0">
                              {d.issuanceDate
                                ? new Date(d.issuanceDate).toLocaleDateString(
                                    "en-GB",
                                    {
                                      weekday: "short",
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : "N/A"}
                            </p>
                          </div>
                        )}

                        {/* ACTION BUTTON */}
                        <div className="col d-flex justify-content-end align-items-end pe-5">
                          {selectedTabLabel === "All" ? (
                            <CustomModal
                              isFullscreen
                              modalId={`view-history${d.id}`}
                              buttonColumn="col-auto"
                              button={
                                <Button className="btn shadow-sm py-2 px-3 rounded-pill fw-bold">
                                  View History
                                </Button>
                              }
                              body={<ViewHistoryOnly data={d} users={users} />}
                            />
                          ) : (
                            <CustomModal
                              isFullscreen
                              modalId={`comment${d.id}`}
                              buttonColumn="col-auto"
                              button={
                                <Button className="btn shadow-sm py-2 px-3 rounded-pill fw-bold">
                                  {d.submittedTo === userId
                                    ? "Comment"
                                    : d.status === ISSUED
                                      ? "Issued"
                                      : d.status === APPROVED
                                        ? "Approved"
                                        : "Submitted"}
                                </Button>
                              }
                              body={
                                <ReportNoting
                                  data={d}
                                  setRefresh={setRefresh}
                                  role={role}
                                  userId={userId}
                                  selectedTabLabel={selectedTabLabel}
                                  users={users}
                                  deputyDirectors={deputyDirectors}
                                  directors={directors}
                                  officers={officers}
                                  onCommentSubmitted={handleCommentSubmitted}
                                />
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="alert alert-warning d-flex align-items-center"
              role="alert"
            >
              <BsExclamationTriangleFill size={24} className="me-2" />
              <div>No reports found.</div>
            </div>
          )}
          {/* {data?.length === 0(
        <div
          className="alert alert-warning d-flex align-items-center"
          role="alert"
        >
          <BsExclamationTriangleFill size={24} className="me-2" />
          <div>No reports found.</div>
        </div>
      )} */}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default List;
