"use client";
import AlertMessage from "@/components/AlertMessage";
import Loader from "@/components/Loader/Loader";
import { APPROVED, REFERBACK, SUBMITTED } from "@/constants/statuses";
import styles from "@/features/proformas/components/Proformas.module.css";
import { formatDate, formatTime } from "@/features/proformas/utils";
import { Officer, ReportHistoryUser } from "@/features/users";
import { useEffectEvent } from "@/hooks/useEffectEvent";
import useUserInfo from "@/hooks/useUserInfo";
import apiClient, { AxiosError } from "@/services/client";
import { REPORTS_HISTORY_API } from "@/services/endpoints";
import { DashboardTypeEnum } from "@/types/dashboard";
import { ArrowLeft, Calendar, Clock, ExternalLink, FileCheck2, Search, SquarePen, Users } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from "react";
import DownloadWrapper from "../../components/DownloadWrapper";
import ReportDrawer, { ReportDrawerMode } from "../../components/ReportDrawer";
import rr from "../../components/ReportReview.module.css";
import { SubmittedReport, Tab } from "../../types";

interface Props {
  dashbaordType: DashboardTypeEnum | undefined;
  users: ReportHistoryUser[];
  officers: Officer[];
  deputyDirectors: Officer[];
  directors: Officer[];
  departmentHead: Officer;
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  loggedInUsername: string;
}

const ALL = 0;
const ISSUED_TAB = -98;

/** The same report on the list and in the drawer (Issued rows all have id 0). */
const reportKey = (d: SubmittedReport) => `${d.visitId}-${d.projectId}-${d.reportType}`;

const plural = (n: number) => `${n} ${n === 1 ? "report" : "reports"}`;

/**
 * List of Reports (Report review on the dashboard), RTMES design: the old tabs with their counts,
 * one card per report and a Comment / View History button that opens the drawer on the right.
 */
const List = ({
  dashbaordType,
  users,
  deputyDirectors,
  directors,
  departmentHead,
  refresh,
  setRefresh,
  loggedInUsername,
}: Props) => {
  const [data, setData] = useState<SubmittedReport[]>([]);
  const [issuedReportCount, setIssuedReportCount] = useState<number>(0);
  const [issuedReportsData, setIssuedReportsData] = useState<SubmittedReport[]>();

  const { userId, role } = useUserInfo();
  const [selectedTab, setSelectedTab] = useState<number>(ALL);
  const [selectedTabLabel, setSelectedLabel] = useState<string>("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<SubmittedReport[] | undefined>();

  /** The report open in the drawer. */
  const [open, setOpen] = useState<{ report: SubmittedReport; mode: ReportDrawerMode }>();
  /** Open the first report waiting for this user's comment (on load, on a tab and after a comment). */
  const [openNext, setOpenNext] = useState(true);
  /** Reports commented on here; skipped until the list has reloaded without them. */
  const done = useRef(new Set<string>());

  useEffect(() => {
    const load = async (userId: number) => {
      setLoading(true);
      try {
        const response = await apiClient.get(`${REPORTS_HISTORY_API}/GetSubmittedReports?submittedTo=${userId}`);
        if (response.data.data) {
          const sortedData = response.data.data.reports.sort(
            (a: SubmittedReport, b: SubmittedReport) =>
              new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime(),
          );
          setData(sortedData);
        }
        setLoading(false);
      } catch (err) {
        setError((err as AxiosError).message);
        console.error("Submission error:", err);
        setLoading(false);
      }
    };
    if (userId) load(userId);
  }, [userId, refresh]);

  const userRole = useMemo(() => {
    const username = loggedInUsername.toLowerCase();
    if (username.includes("monitoring")) return "MONITORING";
    if (username.includes("evaluation")) return "EVALUATION";
    return "ALL";
  }, [loggedInUsername]);

  const issuedDataFiltered = useMemo(() => {
    if (userRole === "MONITORING") return issuedReportsData?.filter((d) => d.reportType === 1);
    if (userRole === "EVALUATION") return issuedReportsData?.filter((d) => d.reportType === 0);
    return issuedReportsData;
  }, [issuedReportsData, userRole]);

  useEffect(() => {
    if (issuedDataFiltered) setIssuedReportCount(issuedDataFiltered.length);
  }, [issuedDataFiltered]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get(`${REPORTS_HISTORY_API}/GetIssuedReports`);
        if (response.data.data) {
          setIssuedReportsData(
            response.data.data.sort((a: SubmittedReport, b: SubmittedReport) => b.visitId - a.visitId),
          );
        }
        setLoading(false);
      } catch (err) {
        setError((err as AxiosError).message);
        console.error("Submission error:", err);
        setLoading(false);
      }
    };
    load();
  }, []);

  const hasManuallySelectedTab = useRef(false);
  const [tabs, setTabs] = useState<Tab[]>();

  const onDataChange = useEffectEvent(() => {
    const definitions = [
      { id: 1, label: "SUBMITTED BY (AD)", status: SUBMITTED, role: "deputy director", reportSubmittedTo: userId },
      { id: 2, label: "SUBMITTED BY (DD)", status: SUBMITTED, role: "director", reportSubmittedTo: userId },
      { id: 3, label: "SUBMITTED TO (DIRECTOR)", status: SUBMITTED, role: "deputy director", reportSubmittedFrom: userId },
      { id: 4, label: "SUBMITTED TO (DG)", status: SUBMITTED, role: "director", reportSubmittedFrom: userId },
      { id: 5, label: "SUBMITTED BY (DIRECTOR)", status: SUBMITTED, role: "department head", reportSubmittedTo: userId },
      { id: 6, label: "APPROVED AND MARK TO (DIRECTOR)", status: APPROVED, role: "department head", reportSubmittedFrom: userId },
      { id: 7, label: "APPROVED BY (DG)", status: APPROVED, role: "director", reportSubmittedTo: userId },
      { id: 8, label: "APPROVED BY (DG)", status: APPROVED, role: "deputy director", reportSubmittedTo: userId },
      { id: 9, label: "REFERBACK BY (DIRECTOR)", status: REFERBACK, role: "deputy director", reportSubmittedTo: userId },
      { id: 10, label: "REFERBACK TO (AD)", status: REFERBACK, role: "deputy director", reportSubmittedFrom: userId },
      { id: 11, label: "REFERBACK BY (DG)", status: REFERBACK, role: "director", reportSubmittedTo: userId },
      { id: 12, label: "REFERBACK TO (DD)", status: REFERBACK, role: "director", reportSubmittedFrom: userId },
      { id: 13, label: "REFERBACK TO (DIRECTOR)", status: REFERBACK, role: "department head", reportSubmittedFrom: userId },
    ];

    if (!data) return;
    setTabs(
      definitions.map((tab) => {
        const filtered = data.filter(
          (d) =>
            d.status === tab.status &&
            d.isFocalPerson === true &&
            (tab.reportSubmittedFrom
              ? d.submittedFrom === tab.reportSubmittedFrom
              : tab.reportSubmittedTo
                ? d.submittedTo === tab.reportSubmittedTo
                : false),
        );
        return { ...tab, count: filtered.length, filteredData: filtered };
      }),
    );
  });
  useEffect(() => onDataChange(), [data, onDataChange]);

  useEffect(() => {
    if (!tabs) return;

    // A tab the user chose stays chosen
    if (hasManuallySelectedTab.current) {
      if (selectedTab === ALL) setFilteredData(data);
      else if (selectedTab !== ISSUED_TAB) {
        const selected = tabs.find((t) => t.id === selectedTab);
        if (selected) setFilteredData(selected.filteredData);
      }
      return;
    }

    // Otherwise the first tab of this role with reports waiting
    const tabWithRecord = tabs.find(
      (tab) => tab.role === role && tab.count > 0 && [1, 8, 9, 2, 7, 11, 5].includes(tab.id),
    );
    if (tabWithRecord) {
      setSelectedTab(tabWithRecord.id);
      setSelectedLabel(tabWithRecord.label);
      setFilteredData(tabWithRecord.filteredData);
    } else {
      setSelectedTab(ALL);
      setSelectedLabel("All");
      setFilteredData(data);
    }
  }, [tabs, role, selectedTab, data]);

  const isIssuedTab = selectedTab === ISSUED_TAB;
  const inTab = isIssuedTab ? issuedDataFiltered : filteredData;

  const shown = useMemo(() => {
    const words = searchTerm.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) return inTab;
    return inTab?.filter((item) => {
      const text = [item.id, item.gsNo, item.intiallyDesignation, item.intiallyUser, item.projectId, item.projectName, item.visitId]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return words.every((w) => text.includes(w));
    });
  }, [inTab, searchTerm]);

  /** "Comment" for a report waiting for this user in a step tab; "View History" otherwise. */
  const modeOf = useCallback(
    (d: SubmittedReport): ReportDrawerMode =>
      selectedTab !== ALL && !isIssuedTab && d.submittedTo === userId ? "act" : "history",
    [selectedTab, isIssuedTab, userId],
  );

  // The first report waiting for this user's comment opens by itself
  useEffect(() => {
    if (!openNext || open || !userId || !filteredData || selectedTab === ALL || isIssuedTab || isLoading) return;
    setOpenNext(false);
    const next = filteredData.find((d) => d.submittedTo === userId && !done.current.has(reportKey(d)));
    if (next) setOpen({ report: next, mode: "act" });
  }, [openNext, open, userId, filteredData, selectedTab, isIssuedTab, isLoading]);

  const chooseTab = (id: number, label: string, rows?: SubmittedReport[]) => {
    hasManuallySelectedTab.current = true;
    setSelectedTab(id);
    setSelectedLabel(label);
    if (rows) setFilteredData(rows);
    setOpenNext(id !== ALL && id !== ISSUED_TAB);
  };

  const closeDrawer = useCallback(() => setOpen(undefined), []);

  const onActed = () => {
    if (open) done.current.add(reportKey(open.report));
    setOpen(undefined);
    setOpenNext(true);
    setRefresh((prev) => !prev);
  };

  const allCount = data.filter(
    (d) => (d.submittedTo === userId || d.submittedFrom === userId) && d.isFocalPerson === true,
  ).length;

  const backHref = dashbaordType ? `/dashboard?dashboardType=${dashbaordType}` : "/dashboard";

  if (isLoading && !open) return <Loader />;
  if (error) return <AlertMessage variant="danger">{error}, Please Try Again!</AlertMessage>;
  if (!userId || !role) return null;

  return (
    <div className={`${styles.page} ${rr.mon}`}>
      <div className={styles.head}>
        <Link href={backHref} className={styles.btn}>
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        <h1>List of Reports</h1>
        <span className={styles.count}>{plural(shown?.length ?? 0)}</span>
        <div className={`${styles.tools} ${rr.tools}`}>
          <label className={`${styles.search} ${rr.search}`}>
            <Search size={18} />
            <input
              type="search"
              placeholder="Search project, GS No., officer…"
              aria-label="Search the reports"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
          {shown && <DownloadWrapper data={shown} fileName={isIssuedTab ? "Issued" : selectedTabLabel || "Reports"} />}
        </div>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="Reports by step">
        <button
          type="button"
          role="tab"
          aria-selected={selectedTab === ALL}
          className={`${styles.tab} ${selectedTab === ALL ? styles.tabActive : ""}`}
          onClick={() => chooseTab(ALL, "All", data)}
        >
          All
          <b>{allCount}</b>
        </button>
        {tabs
          ?.filter((tab) => tab.role === role)
          .map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selectedTab === tab.id}
              className={`${styles.tab} ${selectedTab === tab.id ? styles.tabActive : ""}`}
              onClick={() => chooseTab(tab.id, tab.label, tab.filteredData)}
            >
              {tab.label}
              <b>{tab.count}</b>
            </button>
          ))}
        {dashbaordType === undefined && (
          <button
            type="button"
            role="tab"
            aria-selected={isIssuedTab}
            className={`${styles.tab} ${isIssuedTab ? styles.tabActive : ""}`}
            onClick={() => chooseTab(ISSUED_TAB, "Issued")}
          >
            Issued
            <b>{issuedReportCount}</b>
          </button>
        )}
        <Link href="/director-reports" target="_blank" className={`${styles.tab} ${rr.tabLink}`}>
          Ongoing Process <ExternalLink size={17} />
        </Link>
      </div>

      {!shown || shown.length === 0 ? (
        <p className={styles.empty}>No reports in this step.</p>
      ) : (
        <div className={styles.list} role="tabpanel">
          {shown.map((d, i) => {
            const mode = modeOf(d);
            return (
              <article
                key={`${reportKey(d)}-${i}`}
                className={`${styles.card} ${rr.card} ${mode === "act" ? styles.cardAct : ""}`}
              >
                <div className={`${styles.cardTop} ${rr.top}`}>
                  <span className={`${styles.chip} ${rr.chipTint}`}>
                    Sr# <b>{i + 1}</b>
                  </span>
                  <span className={`${styles.chip} ${rr.chipTint}`}>
                    GS No. <b>{d.gsNo || "–"}</b>
                  </span>
                </div>
                {(d.reportType === 1 || d.reportType === 0) && (
                  <span className={`${rr.ribbon} ${d.reportType === 0 ? rr.ribbonEval : ""}`}>
                    {d.reportType === 1 ? "Monitoring" : "Evaluation"}
                  </span>
                )}
                <div className={styles.cardBody}>
                  <h3>{d.projectName}</h3>
                  <dl className={`${styles.facts} ${isIssuedTab ? rr.factsThree : rr.factsTwo}`}>
                    <div>
                      <Users size={18} />
                      <div>
                        <dt>Officer Name</dt>
                        <dd>
                          {d.intiallyUser || "–"}
                          {d.intiallyDesignation && (
                            <>
                              <br />
                              <small>{d.intiallyDesignation}</small>
                            </>
                          )}
                        </dd>
                      </div>
                    </div>
                    <div>
                      <Calendar size={18} />
                      <div>
                        <dt>Submitted Date</dt>
                        <dd>
                          {d.submittedDate ? (
                            <>
                              {formatDate(d.submittedDate)}
                              <br />
                              <small>{formatTime(d.submittedDate)}</small>
                            </>
                          ) : (
                            "N/A"
                          )}
                        </dd>
                      </div>
                    </div>
                    {isIssuedTab && (
                      <div>
                        <FileCheck2 size={18} />
                        <div>
                          <dt>Issued Date</dt>
                          <dd>{d.issuanceDate ? formatDate(d.issuanceDate) : "N/A"}</dd>
                        </div>
                      </div>
                    )}
                  </dl>
                </div>
                {mode === "act" ? (
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={() => setOpen({ report: d, mode: "act" })}
                  >
                    <SquarePen size={18} /> Comment
                  </button>
                ) : (
                  <button type="button" className={styles.btn} onClick={() => setOpen({ report: d, mode: "history" })}>
                    <Clock size={18} /> View History
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}

      {open && (
        <ReportDrawer
          key={`${reportKey(open.report)}-${open.mode}`}
          report={open.report}
          mode={open.mode}
          selectedTabLabel={selectedTabLabel}
          role={role}
          userId={userId}
          users={users}
          deputyDirectors={deputyDirectors}
          directors={directors}
          departmentHead={departmentHead}
          onClose={closeDrawer}
          onActed={onActed}
        />
      )}
    </div>
  );
};

export default List;
