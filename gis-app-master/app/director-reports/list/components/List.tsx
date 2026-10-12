"use client";
import { REPORTS_HISTORY_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import Loader from "@/app/components/Loader/Loader";
import { DashboardTypeEnum } from "@/app/dashboard/types/types";
import { Officer } from "@/app/hooks/useOfficers";
import { ReportHistoryUser } from "@/app/hooks/useReportHistoryUsers";
import apiClient, { AxiosError } from "@/app/services/api-client";
import search3 from "@/public/icons/search3.svg";
import Cookies from "js-cookie";
import { Raleway } from "next/font/google";
import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { BsExclamationTriangleFill } from "react-icons/bs";
import DownloadWrapper from "../../components/DownloadWrapper";
import { APPROVED, REFERBACK, SUBMITTED } from "../../statuses";
import ProjectTile from "./ProjectTile";

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
  departmentHead: Officer;
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

const List = ({
  dashbaordType,
  users,
  officers,
  deputyDirectors,
  directors,
  departmentHead,
  refresh,
  setRefresh,
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
          `${REPORTS_HISTORY_API}/GetSubmittedReports?submittedTo=${userId}`,
        );
        if (response.data.data) {
          setIssuedReportCount(response.data.data.totalIssuedCount);
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
        label: "SUBMITTED BY (AD)",
        status: SUBMITTED,
        role: "deputy director",
        reportSubmittedTo: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 2,
        label: "SUBMITTED BY (DD)",
        status: SUBMITTED,
        role: "director",
        reportSubmittedTo: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 3,
        label: "SUBMITTED TO (DIRECTOR)",
        status: SUBMITTED,
        role: "deputy director",
        reportSubmittedFrom: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 4,
        label: "SUBMITTED TO (DG)",
        status: SUBMITTED,
        role: "director",
        reportSubmittedFrom: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 5,
        label: "SUBMITTED BY (DIRECTOR)",
        status: SUBMITTED,
        role: "department head",
        reportSubmittedTo: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 6,
        label: "APPROVED AND MARK TO (DIRECTOR)",
        status: APPROVED,
        role: "department head",
        reportSubmittedFrom: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 7,
        label: "APPROVED BY (DG)",
        status: APPROVED,
        role: "director",
        reportSubmittedTo: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 8,
        label: "APPROVED BY (DG)",
        status: APPROVED,
        role: "deputy director",
        reportSubmittedTo: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 9,
        label: "REFERBACK BY (DIRECTOR)",
        status: REFERBACK,
        role: "deputy director",
        reportSubmittedTo: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 10,
        label: "REFERBACK TO (AD)",
        status: REFERBACK,
        role: "deputy director",
        reportSubmittedFrom: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 11,
        label: "REFERBACK BY (DG)",
        status: REFERBACK,
        role: "director",
        reportSubmittedTo: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 12,
        label: "REFERBACK TO (DD)",
        status: REFERBACK,
        role: "director",
        reportSubmittedFrom: userId,
        count: 0,
        filteredData: undefined,
      },
      {
        id: 13,
        label: "REFERBACK TO (DIRECTOR)",
        status: REFERBACK,
        role: "department head",
        reportSubmittedFrom: userId,
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

        if (tab.reportSubmittedFrom) {
          filteredData = data.filter(
            (d) =>
              d.status === tab.status &&
              d.submittedFrom === tab.reportSubmittedFrom &&
              d.isFocalPerson === true,
          );
          count = filteredData.length;
        } else if (tab.reportSubmittedTo) {
          filteredData = data.filter(
            (d) =>
              d.status === tab.status &&
              d.submittedTo === tab.reportSubmittedTo &&
              d.isFocalPerson === true,
          );
          count = filteredData.length;
        }

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

  useEffect(() => {
    setSelectedTab(0);
    setSelectedLabel("All");
    setFilteredData(data);
  }, [dashbaordType]);

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

  const dataToRender = searchTerm
    ? searchData
    : isIssuedTab
      ? issuedReportsData
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
      ) : userId && role && data && data.length > 0 ? (
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
                <div className="row d-flex">
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
                  {tabs
                    ?.filter(
                      (tab) =>
                        tab.status === -99 ||
                        tab.status === 6 ||
                        tab.role === role,
                    )
                    .map((tab) => (
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
                  {/* {dashbaordType === undefined && (
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
          {dataToRender?.map((d, i) => (
            <ProjectTile key={i} data={d} index={i} users={users} />
          ))}
        </div>
      ) : (
        <div
          className="alert alert-warning d-flex align-items-center"
          role="alert"
        >
          <BsExclamationTriangleFill size={24} className="me-2" />
          <div>No reports found.</div>
        </div>
      )}
    </>
  );
};

export default List;
