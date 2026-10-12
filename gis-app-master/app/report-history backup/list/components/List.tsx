"use client";
import { REPORTS_HISTORY_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import apiClient from "@/app/services/api-client";
import { addDayToFormattedDate, getFormattedDate } from "@/app/utils";
import search3 from "@/public/icons/search3.svg";
import Cookies from "js-cookie";
import { Raleway } from "next/font/google";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReportNoting from "../../components/ReportNoting";
import {
  APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE,
  D_REFERBACK_ID,
  DD_REFERBACK_ID,
  // DD_USER_ID,
  DG_REFERBACK_ID,
  DG_USER_ID,
  // D_USER_ID,
  ISSUED_By_AD,
  REVIEWED_AND_APPROVED_BY_DG_TO_D,
  REVIEWED_AND_FORWARD_BY_D_TO_DG,
  REVIEWED_AND_FORWARD_BY_DD_TO_D,
  SUBMITTED_BY_AD_TO_DD,
} from "../../statuses";

const raleway = Raleway({
  subsets: ["latin"],
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
  sDate: string;
  submittedDate: string;
  issuanceDate: string;
  reportType: number;
  lastStatus: number;
  intiallyUserId: number;
  intiallyUser: string;
  intiallyDesignation: string;
}

// export interface StatusTab {
//   label: string;
//   status: number;
//   submittedFrom: number;
//   submittedTo: number;
// }

const List = () => {
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState<SubmittedReport[]>([]);
  const [tabCounts, setTabCounts] = useState<Record<number, number>>({});

  const [userId, setUserId] = useState<number>();
  const [role, setRole] = useState<string>();
  const [DD_USER_ID, setDD_USER_ID] = useState<number>(0);
  const [D_USER_ID, setD_USER_ID] = useState<number>(0);

  // useBackground("/images/bg2.png", true);

  // useEffect(() => {
  //   const id = Cookies.get("userId");
  //   const role = Cookies.get("role");

  //   if ((id && parseInt(id) === 28) || (id && parseInt(id) === 26)) {
  //     setDD_USER_ID(28);
  //     setD_USER_ID(26);
  //   } else if ((id && parseInt(id) === 29) || (id && parseInt(id) === 27)) {
  //     setDD_USER_ID(29);
  //     setD_USER_ID(27);
  //   }

  //   if (id) {
  //     const convertedId = parseInt(id);
  //     setUserId(convertedId);

  //     if (convertedId === 28 || convertedId === 26) {
  //       setDD_USER_ID(28);
  //       setD_USER_ID(26);
  //     } else if (convertedId === 29 || convertedId === 27) {
  //       setDD_USER_ID(29);
  //       setD_USER_ID(27);
  //     } else if (convertedId === 51 || convertedId === 52) {
  //       setDD_USER_ID(51);
  //       setD_USER_ID(52);
  //     } else if (convertedId === 50) {
  //       setDD_USER_ID(28);
  //       setD_USER_ID(26);
  //     }
  //   }
  //   if (role) setRole(role.toLowerCase());
  // }, []);

  useEffect(() => {
    const id = Cookies.get("userId");
    const role = Cookies.get("role");

    if (id) {
      const convertedId = parseInt(id);
      setUserId(convertedId);

      setDD_USER_ID(28);
      setD_USER_ID(26);
    }
    if (role) setRole(role.toLowerCase());
  }, []);

  const [status, setStatus] = useState(0);

  const [selectedButton, setSelectedButton] = useState(0);
  // State for filtered data
  const [filteredData, setFilteredData] = useState<SubmittedReport[]>([]);

  useEffect(() => {
    const handleSubmit = async (userId: number) => {
      try {
        const response = await apiClient.get(
          `${REPORTS_HISTORY_API}/GetSubmittedReports?submittedTo=${userId}`,
        );
        setData(response.data.data);
        calculateTabCounts(response.data.data);
        console.log("original data", response.data.data);
      } catch (err) {
        console.error("Submission error:", err);
      }
    };
    if (userId) handleSubmit(userId);
  }, [userId, refresh]);

  const calculateTabCounts = (data: SubmittedReport[]) => {
    const counts: Record<number, number> = {};

    tabs.forEach((tab) => {
      const { status, reportSubmittedFrom, reportSubmittedTo } = tab;

      let count = 0;

      if (status === SUBMITTED_BY_AD_TO_DD && role === "deputy director") {
        const filtered = data.filter(
          (d) => d.submittedTo === DD_USER_ID && d.lastStatus === status,
        );

        const latestByProjectId = new Map();
        filtered.forEach((item) => latestByProjectId.set(item.projectId, item));
        count = latestByProjectId.size;
      } else if (status === -99 && role === "deputy director") {
        const filtered = data
          .filter((d) => d.submittedTo === reportSubmittedTo)
          .filter((d) => d.submittedFrom !== D_USER_ID);

        const latestByProjectId = new Map();
        filtered.forEach((item) => latestByProjectId.set(item.projectId, item));
        count = latestByProjectId.size;

        // count = data
        //   .filter((d) => d.submittedTo === reportSubmittedTo)
        //   .filter((d) => d.submittedFrom !== D_USER_ID).length;
      } else if (status === -99) {
        const filtered = data.filter(
          (d) =>
            d.submittedFrom === reportSubmittedFrom &&
            d.submittedTo === reportSubmittedTo,
        );

        const latestByProjectId = new Map();
        filtered.forEach((item) => latestByProjectId.set(item.projectId, item));
        count = latestByProjectId.size;

        // count = data.filter(
        //   (d) =>
        //     d.submittedFrom === reportSubmittedFrom &&
        //     d.submittedTo === reportSubmittedTo
        // ).length;
      } else if (status === DD_REFERBACK_ID) {
        const filtered = data.filter(
          (d) =>
            d.submittedFrom === reportSubmittedFrom && d.lastStatus === status,
        );

        const latestByProjectId = new Map();
        filtered.forEach((item) => latestByProjectId.set(item.projectId, item));
        count = latestByProjectId.size;

        // count = data.filter(
        //   (d) =>
        //     d.submittedFrom === reportSubmittedFrom && d.lastStatus === status
        // ).length;
      } else if (status === ISSUED_By_AD) {
        const filtered = data
          .filter(
            (d) =>
              d.lastStatus === status &&
              d.submittedFrom === reportSubmittedFrom,
          )
          .filter((d) => d.submittedTo !== reportSubmittedTo);

        const latestByProjectId = new Map();
        filtered.forEach((item) => latestByProjectId.set(item.projectId, item));
        count = latestByProjectId.size;

        // count = data
        //   .filter(
        //     (d) =>
        //       d.lastStatus === status && d.submittedFrom === reportSubmittedFrom
        //   )
        //   .filter((d) => d.submittedTo !== reportSubmittedTo).length;
      } else if (
        status === REVIEWED_AND_FORWARD_BY_D_TO_DG &&
        role === "director general"
      ) {
        // Step 1: Get the latest record for each projectId from the full dataset
        const latestByProjectId = new Map();

        data.forEach((item) => {
          latestByProjectId.set(item.projectId, item);
        });

        const latestRecords = Array.from(latestByProjectId.values());

        // Step 2: Apply your role/status-specific filters
        const filtered = latestRecords
          .filter((d) => d.submittedTo === reportSubmittedTo)
          .filter((d) => d.submittedFrom === reportSubmittedFrom)
          .filter((d) => d.lastStatus === REVIEWED_AND_FORWARD_BY_D_TO_DG);

        // Step 3: Count only the filtered unique/latest projects
        count = filtered.length;
      } else {
        const filtered = data.filter(
          (d) =>
            d.lastStatus === status &&
            d.submittedFrom === reportSubmittedFrom &&
            d.submittedTo === reportSubmittedTo,
        );

        const latestByProjectId = new Map();
        filtered.forEach((item) => latestByProjectId.set(item.projectId, item));
        count = latestByProjectId.size;

        // count = data.filter(
        //   (d) =>
        //     d.lastStatus === status &&
        //     d.submittedFrom === reportSubmittedFrom &&
        //     d.submittedTo === reportSubmittedTo
        // ).length;
      }

      counts[status] = count;
    });

    setTabCounts(counts);
  };

  const getLatestUniqueProjects = (
    data: SubmittedReport[] | undefined,
    filterFn: (project: SubmittedReport) => boolean,
  ): SubmittedReport[] => {
    if (!data) return [];

    const filtered = data.filter(filterFn);
    const latestByProjectId = new Map<string | number, SubmittedReport>();

    filtered.forEach((item) => {
      latestByProjectId.set(item.projectId, item);
    });

    return Array.from(latestByProjectId.values());
  };

  // const configureDDId = (loggedInUserId: number | undefined) => {
  //   return loggedInUserId === DD_USER_ID ? DD_USER_ID : DDE_USER_ID;
  // };

  // const configureDId = (loggedInUserId: number) => {
  //   return loggedInUserId === D_USER_ID ? D_USER_ID : DE_USER_ID;
  // };

  const handleFilterData = (
    data: SubmittedReport[],
    status: number,
    submittedFrom: number,
    submittedTo: number,
  ) => {
    console.log(
      "Data inside filterDataFn",
      status,
      submittedFrom,
      submittedTo,
      data,
    );
    if (role === "deputy director" && status === SUBMITTED_BY_AD_TO_DD) {
      setStatus(status);
      const uniqueLatestProjects = getLatestUniqueProjects(
        data,
        (d) => d.submittedTo === DD_USER_ID && d.lastStatus === status,
      );

      setFilteredData(uniqueLatestProjects);
      console.log("uniqueLatestProjects", uniqueLatestProjects);
    } else if (status === -99 && role === "deputy director") {
      setStatus(status);
      const filteredProjects = data
        ?.filter((d) => d.submittedTo === submittedTo)
        .filter((d) => d.submittedFrom !== D_USER_ID);

      // Create a Map to store only the latest record for each projectId
      const latestByProjectId = new Map();

      // Traverse the array from start to end
      filteredProjects.forEach((item) => {
        // This will overwrite older records with the same projectId
        latestByProjectId.set(item.projectId, item);
      });

      const uniqueLatestProjects = Array.from(latestByProjectId.values());
      setFilteredData(uniqueLatestProjects);
      console.log("uniqueLatestProjects", uniqueLatestProjects);
    } else if (status === -99) {
      setStatus(status);
      const filteredProjects = data?.filter(
        (d) =>
          d.submittedFrom === submittedFrom && d.submittedTo === submittedTo,
      );

      // Create a Map to store only the latest record for each projectId
      const latestByProjectId = new Map();

      // Traverse the array from start to end
      filteredProjects.forEach((item) => {
        // This will overwrite older records with the same projectId
        latestByProjectId.set(item.projectId, item);
      });

      const uniqueLatestProjects = Array.from(latestByProjectId.values());
      setFilteredData(uniqueLatestProjects);
      console.log("uniqueLatestProjects", uniqueLatestProjects);
    } else if (status === DD_REFERBACK_ID) {
      setStatus(status);
      const filteredProjects = data?.filter(
        (d) => d.submittedFrom === submittedFrom && d.lastStatus === status,
      );

      // Create a Map to store only the latest record for each projectId
      const latestByProjectId = new Map();

      // Traverse the array from start to end
      filteredProjects.forEach((item) => {
        // This will overwrite older records with the same projectId
        latestByProjectId.set(item.projectId, item);
      });

      const uniqueLatestProjects = Array.from(latestByProjectId.values());
      setFilteredData(uniqueLatestProjects);
      console.log("uniqueLatestProjects", uniqueLatestProjects);
    } else if (status === ISSUED_By_AD) {
      setStatus(status);

      const filteredProjects = data
        ?.filter(
          (d) => d.lastStatus === status && d.submittedFrom === submittedFrom,
        )
        .filter((d) => d.submittedTo !== submittedTo);

      // Create a Map to store only the latest record for each projectId
      const latestByProjectId = new Map();

      // Traverse the array from start to end
      filteredProjects.forEach((item) => {
        // This will overwrite older records with the same projectId
        latestByProjectId.set(item.projectId, item);
      });

      const uniqueLatestProjects = Array.from(latestByProjectId.values());
      setFilteredData(uniqueLatestProjects);
      console.log("uniqueLatestProjects", uniqueLatestProjects);

      // setFilteredData(
      //   data
      //     ?.filter(
      //       (d) => d.lastStatus === status && d.submittedFrom === submittedFrom
      //     )
      //     .filter((d) => d.submittedTo !== submittedTo)
      // );
    } else if (
      status === REVIEWED_AND_FORWARD_BY_D_TO_DG &&
      role === "director general"
    ) {
      setStatus(status);
      // Step 1: Get latest record per projectId first
      const latestByProjectId = new Map<number, SubmittedReport>();

      data.forEach((item) => {
        latestByProjectId.set(item.projectId, item); // overwrites older entries
      });

      const latestRecords = Array.from(latestByProjectId.values());

      // Step 2: Now filter the latest records
      const filteredProjects = latestRecords
        .filter((d) => d.submittedTo === submittedTo)
        .filter((d) => d.submittedFrom === submittedFrom)
        .filter((d) => d.lastStatus === REVIEWED_AND_FORWARD_BY_D_TO_DG);

      setFilteredData(filteredProjects);
      console.log("filteredProjects", filteredProjects);
    } else if (role === "director general" && status === 6) {
      setStatus(status);
      setFilteredData(data?.filter((d) => d.lastStatus === status));
    } else {
      setStatus(status);
      const filteredProjects = data?.filter(
        (d) =>
          d.lastStatus === status &&
          d.submittedFrom === submittedFrom &&
          d.submittedTo === submittedTo,
      );

      // Create a Map to store only the latest record for each projectId
      const latestByProjectId = new Map();

      // Traverse the array from start to end
      filteredProjects.forEach((item) => {
        // This will overwrite older records with the same projectId
        latestByProjectId.set(item.projectId, item);
      });

      const uniqueLatestProjects = Array.from(latestByProjectId.values());
      setFilteredData(uniqueLatestProjects);
      console.log("uniqueLatestProjects", uniqueLatestProjects);
      //--------
      // setFilteredData(
      //   data?.filter(
      //     (d) =>
      //       d.lastStatus === status &&
      //       d.submittedFrom === submittedFrom &&
      //       d.submittedTo === submittedTo
      //   )
      // );
    }
  };

  // useEffect(() => {
  //   console.log("filteredData", filteredData);
  //   console.log("data", data);
  // }, [filteredData]);

  const tabs = [
    {
      label: "All",
      status: -99,
      reportSubmittedFrom:
        role === "deputy director"
          ? -99
          : role === "director"
            ? DD_USER_ID
            : role === "director general"
              ? D_USER_ID
              : -99,
      reportSubmittedTo:
        role === "deputy director"
          ? DD_USER_ID
          : role === "director"
            ? D_USER_ID
            : role === "director general"
              ? DG_USER_ID
              : -99,
      nextSubmittedTo:
        role === "deputy director"
          ? D_USER_ID
          : role === "director"
            ? DG_USER_ID
            : role === "director general"
              ? D_USER_ID
              : -99,
    },
    {
      label: "SUBMITTED BY (AD)",
      status: SUBMITTED_BY_AD_TO_DD,
      role: "deputy director",
      reportSubmittedFrom: -99,
      reportSubmittedTo: DD_USER_ID,
      nextSubmittedTo: D_USER_ID,
    }, // FOR DD

    {
      label: "SUBMITTED BY (DD)",
      status: REVIEWED_AND_FORWARD_BY_DD_TO_D,
      role: "director",
      reportSubmittedFrom: DD_USER_ID,
      reportSubmittedTo: D_USER_ID,
      nextSubmittedTo: DG_USER_ID,
    }, // FOR D
    {
      label: "SUBMITTED TO (DIRECTOR)",
      status: REVIEWED_AND_FORWARD_BY_DD_TO_D,
      role: "deputy director",
      reportSubmittedFrom: DD_USER_ID,
      reportSubmittedTo: D_USER_ID,
    }, // FOR DD
    {
      label: "SUBMITTED TO (DG)",
      status: REVIEWED_AND_FORWARD_BY_D_TO_DG,
      role: "director",
      reportSubmittedFrom: D_USER_ID,
      reportSubmittedTo: DG_USER_ID,
    }, // FOR D
    {
      label: "SUBMITTED BY (DIRECTOR)",
      status: REVIEWED_AND_FORWARD_BY_D_TO_DG,
      role: "director general",
      reportSubmittedFrom: D_USER_ID,
      reportSubmittedTo: DG_USER_ID,
      nextSubmittedTo: D_USER_ID,
    }, // FOR DG
    {
      label: "APPROVED AND MARK TO (DIRECTOR)",
      status: REVIEWED_AND_APPROVED_BY_DG_TO_D,
      role: "director general",
      reportSubmittedFrom: DG_USER_ID,
      reportSubmittedTo: D_USER_ID,
    }, // FOR D
    {
      label: "APPROVED BY (DG)",
      status: REVIEWED_AND_APPROVED_BY_DG_TO_D,
      role: "director",
      reportSubmittedFrom: DG_USER_ID,
      reportSubmittedTo: D_USER_ID,
      nextSubmittedTo: DD_USER_ID,
    }, // FOR D
    {
      label: "APPROVED BY (DG)",
      status: APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE,
      role: "deputy director",
      reportSubmittedFrom: D_USER_ID,
      reportSubmittedTo: DD_USER_ID,
      nextSubmittedTo: -99,
    }, // FOR DD
    {
      label: "REFERBACK BY (DIRECTOR)",
      status: D_REFERBACK_ID,
      role: "deputy director",
      reportSubmittedFrom: D_USER_ID,
      reportSubmittedTo: DD_USER_ID,
    }, // FOR DD
    {
      label: "REFERBACK TO (AD)",
      status: DD_REFERBACK_ID,
      role: "deputy director",
      reportSubmittedFrom: DD_USER_ID,
      reportSubmittedTo: -99,
    }, // FOR DD
    {
      label: "REFERBACK BY (DG)",
      status: DG_REFERBACK_ID,
      role: "director",
      reportSubmittedFrom: DG_USER_ID,
      reportSubmittedTo: D_USER_ID,
    }, // FOR D
    {
      label: "REFERBACK TO (DD)",
      status: D_REFERBACK_ID,
      role: "director",
      reportSubmittedFrom: D_USER_ID,
      reportSubmittedTo: DD_USER_ID,
    }, // FOR D
    {
      label: "REFERBACK TO (DIRECTOR)",
      status: DG_REFERBACK_ID,
      role: "director general",
      reportSubmittedFrom: DG_USER_ID,
      reportSubmittedTo: D_USER_ID,
    }, // FOR D
    {
      label: "ISSUED",
      status: ISSUED_By_AD,
      reportSubmittedFrom:
        role === "deputy director"
          ? DD_USER_ID
          : role === "director"
            ? D_USER_ID
            : role === "director general"
              ? DG_USER_ID
              : -99,
      reportSubmittedTo:
        role === "deputy director"
          ? D_USER_ID
          : role === "director"
            ? DG_USER_ID
            : role === "director general"
              ? -99
              : -99,
    }, // FOR ALL
  ];

  useEffect(() => {
    if (data && role && userId) {
      const currentStatus =
        role === "deputy director"
          ? 0
          : role === "director"
            ? 1
            : role === "director general"
              ? 2
              : -99;

      const currentSubmittedFrom =
        role === "deputy director"
          ? D_USER_ID
          : role === "director"
            ? DD_USER_ID
            : role === "director general"
              ? D_USER_ID
              : -99;

      setSelectedButton(currentStatus);
      handleFilterData(data, currentStatus, currentSubmittedFrom, userId);
    }
  }, [data, role, userId]);

  return (
    <>
      {userId && role && data && (
        <div
          className={`container-fluid p-3 mt-3 mb-4 ${raleway.className}`}
          style={{
            background:
              "linear-gradient(to bottom right, rgba(239, 239, 239, 0.6) , rgba(255, 255, 255, 0.08))",
            border: "1px solid rgba(255, 255, 255, 0.29)",
            borderRadius: "15px",
          }}
        >
          <div className="row d-flex justify-content-between m-0">
            <div className="col-auto my-auto">
              <h5 className="fs18px fw-bold">List of Reports</h5>
            </div>

            <div className="col-auto">
              <div className="row d-flex m-0 justify-content-end mb-3">
                {/* <div className="col-auto text-start">
                <select
                  className="form-select w-100 rounded-pill bg-transparent px-3"
                  style={{
                    outline: "none",
                    border: "1px solid rgba(38, 50, 56,.6)",
                  }}
                  aria-label="Officer Name"
                  name="officerName"
                >
                  <option value="">Search By Officer&nbsp;&nbsp;⌵</option>
                  <option value="">officer name</option>
                  <option value="">officer name</option>
                </select>
              </div> */}
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
                        // value={searchTerm}
                        // onChange={handleChange}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="col m-auto">
            <div className="row d-flex m-0 mb-3">
              <div className="col">
                <div className="row d-flex m-0">
                  {tabs
                    .filter(
                      (tab) =>
                        tab.status === -99 ||
                        tab.status === 6 ||
                        tab.role === role,
                    )
                    .map((tab) => (
                      <div key={tab.status} className="col-auto">
                        <Button
                          className={`btn shadow-none rounded-0 fw-bold position-relative ${
                            selectedButton === tab.status
                              ? "text-dark"
                              : "text-secondary"
                          }`}
                          style={{
                            borderBottom: `${
                              selectedButton === tab.status
                                ? "3px solid #0c8ce9"
                                : ""
                            }`,
                          }}
                          onClick={() => {
                            setSelectedButton(tab.status);
                            handleFilterData(
                              data,
                              tab.status,
                              tab.reportSubmittedFrom,
                              tab.reportSubmittedTo,
                            );
                            console.log("tab click data", data);
                          }}
                        >
                          {tab.label}
                          {(tabCounts[tab.status] || 0) > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                              {tabCounts[tab.status]}
                            </span>
                          )}
                        </Button>
                      </div>
                    ))}
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
          {filteredData?.map((d, i) => (
            <div key={d.id} className="col mb-2">
              <div
                className="col p-3"
                style={{
                  background: "#FAFAFA",
                  borderRadius: "12px",
                  border: "1px solid rgba(0, 0, 0,.1)",
                }}
              >
                <div className="row m-0">
                  <div
                    className={`col-auto rounded-3 p-3 ${
                      d.lastStatus === ISSUED_By_AD
                        ? "bg-success text-light"
                        : d.lastStatus === DD_REFERBACK_ID ||
                            d.lastStatus === D_REFERBACK_ID ||
                            d.lastStatus === DG_REFERBACK_ID
                          ? "bg-danger text-light"
                          : d.lastStatus === SUBMITTED_BY_AD_TO_DD ||
                              d.lastStatus ===
                                REVIEWED_AND_FORWARD_BY_DD_TO_D ||
                              d.lastStatus === REVIEWED_AND_FORWARD_BY_D_TO_DG
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
                    <p
                      className="mb-2 fs18px fw-bold"
                      style={{ color: "263238" }}
                    >
                      <span>Project: </span> {d.projectName}
                    </p>
                    <div className="row d-flex justify-content-between m-0">
                      <div className="col">
                        <p
                          className="mb-0 mb-2 fs18px fw-bold me-3"
                          style={{ color: "#263238" }}
                        >
                          Officer Name
                        </p>
                        <p
                          className="mb-0 fw-normal me-3"
                          style={{ color: "#263238", fontWeight: "500" }}
                        >
                          {d.intiallyUser}
                          <br />
                          <span>({d.intiallyDesignation})</span>
                        </p>
                      </div>
                      <div className="col">
                        <p
                          className="mb-0 mb-2 fs18px fw-bold me-3"
                          style={{ color: "#263238", fontWeight: "500" }}
                        >
                          Submitted Date
                        </p>
                        <p
                          className="mb-0 me-3"
                          style={{ color: "#263238", fontWeight: "500" }}
                        >
                          {new Date(d.sDate).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                          <br />
                          {new Date(d.sDate).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>

                      {status === 6 && (
                        <div className="col">
                          <p
                            className="mb-0 mb-2 fs18px fw-bold me-3"
                            style={{ color: "#263238", fontWeight: "500" }}
                          >
                            Issued Date
                          </p>
                          <p
                            className="mb-0 me-3"
                            style={{ color: "#263238", fontWeight: "500" }}
                          >
                            {new Date(d.issuanceDate).toLocaleDateString(
                              "en-GB",
                              {
                                weekday: "short",
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      )}
                      {/* <div className="col-auto mb-2">
                  <p
                    className="mb-2 fs18px fw-bold"
                    style={{ color: "#263238", fontWeight: "500" }}
                  >
                    Last Status
                  </p>
                  <p
                    className="mb-0 fs14px"
                    style={{ color: "#263238", fontWeight: "500" }}
                  >
                    <RenderStatusBadge status={d.lastStatus} />
                  </p>
                </div> */}
                      {/* hide comment button if status === 1 */}
                      <div className="col d-flex justify-content-end align-items-end">
                        <CustomModal
                          isFullscreen={true}
                          modalId={`comment${d.id}`}
                          buttonColumn="col-auto"
                          button={
                            <Button
                              className="btn shadow-sm py-2 px-3 fs20px rounded-pill fw-bold"
                              style={{
                                background: "rgba(0, 57, 206,.05)",
                                color: "#0039CE",
                              }}
                            >
                              {(role === "deputy director" &&
                                d.lastStatus === SUBMITTED_BY_AD_TO_DD) ||
                              (role === "deputy director" &&
                                d.lastStatus === D_REFERBACK_ID) ||
                              (role === "deputy director" &&
                                d.lastStatus ===
                                  APPROVED_BY_DG_AND_FORWARD_BY_D_TO_DD_FOR_ISSUEANCE) ||
                              (role === "director" &&
                                d.lastStatus ===
                                  REVIEWED_AND_FORWARD_BY_DD_TO_D) ||
                              (role === "director" &&
                                d.lastStatus ===
                                  REVIEWED_AND_APPROVED_BY_DG_TO_D) ||
                              (role === "director" &&
                                d.lastStatus === DG_REFERBACK_ID) ||
                              (role === "director general" &&
                                d.lastStatus ===
                                  REVIEWED_AND_FORWARD_BY_D_TO_DG)
                                ? "Comment"
                                : d.lastStatus === ISSUED_By_AD
                                  ? "Issued"
                                  : "Submitted"}
                            </Button>
                          }
                          body={
                            <ReportNoting
                              data={d}
                              setRefresh={setRefresh}
                              refresh={refresh}
                              role={role}
                              userId={userId}
                            />
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default List;
