"use client";
import { PC_IV_WORKFLOW_API, REPORTS_HISTORY_API } from "@/shared/api/endpoints";
import Button from "@/shared/components/Button";
import CustomModal from "@/shared/components/CustomModal/CustomModal";
import Loader from "@/shared/components/Loader/Loader";
import apiClient, { AxiosError } from "@/shared/api/client";
import search3 from "@/public/icons/search3.svg";
import { raleway } from "@/shared/styles/fonts";
import Image from "next/image";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import DownloadWrapper from "../../components/DownloadWrapper";
import ReportNoting from "../../components/ReportNoting";
import ViewHistoryOnly from "../../components/ViewHistoryOnly";
import {
  APPROVED,
  ISSUED,
  REFERBACK,
  SUBMITTED,
} from "@/shared/constants/statuses";
import { ListProps, SubmittedReport, Tab } from "../../types";
import styles from "@/shared/styles/ReportList.module.css";
import AlertMessage from "@/shared/components/AlertMessage";
import useUserInfo from "@/shared/hooks/useUserInfo";

const List = ({
  users,
  officers,
  deputyDirectors,
  directors,
  refresh,
  setRefresh,
  loggedInUsername,
}: ListProps) => {
  const [data, setData] = useState<SubmittedReport[]>([]);
  const [issuedReportsData, setIssuedReportsData] =
    useState<SubmittedReport[]>();

  const { userId, role } = useUserInfo();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedTabLabel, setSelectedLabel] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const hasOpenedInitialModal = useRef(false);

  const [currentAutoOpenIndex, setCurrentAutoOpenIndex] = useState<number>(-1);
  const [shouldAutoOpen, setShouldAutoOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [filteredData, setFilteredData] = useState<
    SubmittedReport[] | undefined
  >();
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

          const sortedData = response.data.data.reports.sort(
            (a: any, b: any) =>
              new Date(a.submittedDate).getTime() -
              new Date(b.submittedDate).getTime(),
          );
          setData(sortedData);
        }
        setLoading(false);
      } catch (err) {
        setError((err as AxiosError).message);
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
        }
        setLoading(false);
      } catch (err) {
        setError((err as AxiosError).message);
        setLoading(false);
      }
    };

    handleSubmit();
  }, []);

  const hasManuallySelectedTab = useRef(false);

  const [tabs, setTabs] = useState<Tab[]>();

  useEffect(() => {
    const tabs = [
      {
        id: 1,
        label: "REFERBACK BY (DGM&E)",
        status: SUBMITTED,
        role: "administrative secretary",
        count: 0,
        filteredData: undefined,
      },
      {
        id: 2,
        label: "REFERBACK TO ATTACHED DEPT.",
        status: SUBMITTED,
        role: "administrative secretary",
        count: 0,
        filteredData: undefined,
      },
    ];

    if (data) {
      const updatedTabs: Tab[] = tabs.map((tab) => ({
        ...tab,
        filteredData: [],
      }));
      setTabs(updatedTabs);
    }
  }, [data]);

  useEffect(() => {
    if (!tabs) return;

    if (hasManuallySelectedTab.current) {
      if (selectedTab === 0) {
        setFilteredData(data);
      } else if (selectedTab === -98) {
        return;
      } else {
        const selected = tabs.find((t) => t.id === selectedTab);
        if (selected) {
          setFilteredData(selected.filteredData);
        }
      }
      return;
    }

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

  const getCommentEligibleReports = () => {
    if (!filteredData || selectedTabLabel === "All") return [];

    return filteredData.filter((d) => d.submittedTo === userId);
  };

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

  const handleCommentSubmitted = () => {
    setShouldAutoOpen(true);
  };

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
        <AlertMessage variant="danger">{error}, Please Try Again!</AlertMessage>
      ) : userId && role ? (
        <div
          className={`container-fluid p-3 mt-3 mb-4 ${raleway.className} ${styles.container}`}
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
                        className={`btn rounded-end rounded-pill text-white shadow-none border-end-0 pe-0 ${styles.searchButton}`}
                        type="submit"
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
                        className={`form-control border-start-0 rounded-pill rounded-start shadow-none fs14px bg-transparent py-2 ${styles.searchInput}`}
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
                        selectedTab === 0
                          ? `text-dark ${styles.activeTab}`
                          : "text-secondary"
                      }`}
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
                            ? `text-dark ${styles.activeTab}`
                            : "text-secondary"
                        }`}
                        onClick={() => {
                          hasManuallySelectedTab.current = true;
                          setSelectedTab(tab.id);
                          setSelectedLabel(tab.label);
                          setFilteredData(tab.filteredData);
                          setCurrentAutoOpenIndex(-1);
                          setShouldAutoOpen(false);
                          hasOpenedInitialModal.current = false;
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
                </div>
              </div>
            </div>
          </div>
          {dataToRender && dataToRender?.length > 0 ? (
            dataToRender?.map((d, i) => (
              <div
                key={i}
                className="col mb-2 position-relative overflow-hidden"
              >
                <div
                  className={`col p-3 ${styles.reportCard}`}
                >
                  <div className="row m-0">
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
                      <div className="row d-flex justify-content-between align-items-center mb-2">
                        <div className="col">
                          <p
                            className={`fs18px fw-bold m-0 ${styles.projectTitle}`}
                          >
                            <span>Project: </span> {d.projectName}
                          </p>
                        </div>

                        <div
                          className={`col-auto position-absolute p-0 ${styles.typeRibbon}`}
                        >
                          {d.reportType === 1 ? (
                            <span
                              className={`badge px-5 fw-bold py-2 fs-6 ${styles.monitoringBadge}`}
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

                      <div className="row d-flex justify-content-between">
                        <div className="col">
                          <p className="mb-2 fs18px fw-bold">Officer Name</p>
                          <p className="mb-0">
                            {d.intiallyUser}
                            <br />
                            <span>({d.intiallyDesignation})</span>
                          </p>
                        </div>

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
            <AlertMessage variant="warning" />
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default List;
