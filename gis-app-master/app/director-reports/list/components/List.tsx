"use client";
import { REPORTS_HISTORY_API } from "@/shared/api/endpoints";
import Button from "@/shared/components/Button";
import Loader from "@/shared/components/Loader/Loader";
import apiClient, { AxiosError } from "@/shared/api/client";
import search3 from "@/public/icons/search3.svg";
import { raleway } from "@/shared/styles/fonts";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import DownloadWrapper from "../../components/DownloadWrapper";
import { APPROVED, REFERBACK, SUBMITTED } from "@/shared/constants/statuses";
import ProjectTile from "./ProjectTile";
import { ListProps, SubmittedReport, Tab } from "../../types";
import AlertMessage from "@/shared/components/AlertMessage";
import styles from "@/shared/styles/ReportList.module.css";
import useUserInfo from "@/shared/hooks/useUserInfo";

const List = ({ dashbaordType, users, refresh }: ListProps) => {
  const [data, setData] = useState<SubmittedReport[]>([]);
  const [issuedReportsData, setIssuedReportsData] =
    useState<SubmittedReport[]>();

  const { userId, role } = useUserInfo();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [selectedTabLabel, setSelectedLabel] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
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
          `${REPORTS_HISTORY_API}/GetSubmittedReports?submittedTo=${userId}`,
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

  useEffect(() => {
    setSelectedTab(0);
    setSelectedLabel("All");
    setFilteredData(data);
  }, [dashbaordType]);

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
        <AlertMessage variant="danger">{error}, Please Try Again!</AlertMessage>
      ) : userId && role && data && data.length > 0 ? (
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
                <div className="row d-flex">
                  <div className="col-auto">
                    <Button
                      className={`btn shadow-none rounded-0 fw-bold position-relative ${
                        selectedTab === 0
                          ? `text-dark ${styles.activeTab}`
                          : "text-secondary"
                      }`}
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
                              ? `text-dark ${styles.activeTab}`
                              : "text-secondary"
                          }`}
                          onClick={() => {
                            hasManuallySelectedTab.current = true;
                            setSelectedTab(tab.id);
                            setSelectedLabel(tab.label);
                            setFilteredData(tab.filteredData);
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
          {dataToRender?.map((d, i) => (
            <ProjectTile key={i} data={d} index={i} users={users} />
          ))}
        </div>
      ) : (
        <AlertMessage variant="warning" />
      )}
    </>
  );
};

export default List;
