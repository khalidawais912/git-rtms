"use client";
import search3 from "@/public/icons/search3.svg";
import { ReportHistoryUser } from "@/features/users";
import AlertMessage from "@/shared/components/AlertMessage";
import Button from "@/shared/components/Button";
import CustomModal from "@/shared/components/CustomModal/CustomModal";
import Loader from "@/shared/components/Loader/Loader";
import useUserInfo from "@/shared/hooks/useUserInfo";
import { raleway } from "@/shared/styles/fonts";
import styles from "@/shared/styles/ReportList.module.css";
import Image from "next/image";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { getPcivHistory, getPcivInbox, PcivApiError } from "../api";
import {
  PCIV_FINAL_STATUSES,
  PCIV_STATUS_CLASS,
  PCIV_STATUS_NAME,
} from "../constants";
import { PcivInboxReport, PcivPanelLabels } from "../types";
import {
  buildPcivInboxTabs,
  isPendingWithUser,
  PcivTabDefinition,
} from "../utils";
import PcivReportModal from "./PcivReportModal";

const ALL_TAB_ID = 0;

interface Props {
  users: ReportHistoryUser[];
  title?: string;
  /** Optional export button for the rows on screen (e.g. the page's DownloadWrapper). */
  renderDownload?: (rows: PcivInboxReport[], fileName: string) => ReactNode;
  /** Page-specific tabs; defaults to Pending / Sent / Completed / Cancelled. */
  tabDefinitions?: PcivTabDefinition[];
  /** Wording of the workflow buttons inside the modal. */
  panelLabels?: PcivPanelLabels;
  /** Text of the row's open button; defaults to "Take Action" / "View History". */
  rowButtonLabel?: (row: PcivInboxReport, pending: boolean, tabLabel: string) => string;
  /**
   * Load each open PC-IV's history so tabs can tell a refer back from a submit or
   * forward (the inbox has the same status for both). One request per open PC-IV.
   */
  withLastAction?: boolean;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

/**
 * The PC-IV inbox: every PC-IV the user has now or last acted on, split into
 * "Pending with me", "Sent by me", "Completed" and "Cancelled". Opening a row shows
 * its history and the workflow buttons the server gives this user.
 */
const PcivInboxList = ({
  users,
  title = "List of Reports",
  renderDownload,
  tabDefinitions,
  panelLabels,
  rowButtonLabel,
  withLastAction = false,
}: Props) => {
  const { userId } = useUserInfo();
  const [refresh, setRefresh] = useState(false);
  const [data, setData] = useState<PcivInboxReport[]>();
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const [selectedTab, setSelectedTab] = useState<number>();
  const [searchTerm, setSearchTerm] = useState("");

  // Open the first pending PC-IV on load, and the next one after each action.
  const shouldOpenPending = useRef(true);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const inbox = await getPcivInbox(userId);
        let reports = inbox.reports;
        if (withLastAction) {
          reports = await Promise.all(
            reports.map(async (report) => {
              if (PCIV_FINAL_STATUSES.includes(report.status)) return report;
              const history = await getPcivHistory(report.pcivId);
              return { ...report, lastAction: history[0]?.action ?? null };
            }),
          );
        }
        setData(
          [...reports].sort(
            (a, b) =>
              new Date(a.submittedDate).getTime() -
              new Date(b.submittedDate).getTime(),
          ),
        );
      } catch (err) {
        setError(err instanceof PcivApiError ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId, refresh, withLastAction]);

  const tabs = useMemo(
    () =>
      data && userId ? buildPcivInboxTabs(data, userId, tabDefinitions) : [],
    [data, userId, tabDefinitions],
  );

  // First "waiting for me" tab that has rows, otherwise All
  useEffect(() => {
    if (selectedTab !== undefined || tabs.length === 0) return;
    const pending = tabs.find((t) => t.pending && t.count > 0);
    setSelectedTab(pending ? pending.id : ALL_TAB_ID);
  }, [tabs, selectedTab]);

  const selected = tabs.find((t) => t.id === selectedTab);
  const selectedLabel = selected?.label ?? "All";
  const tabRows = selected ? selected.filteredData : data ?? [];

  const term = searchTerm.trim().toLowerCase();
  const rows = term
    ? tabRows.filter((d) =>
        [d.projectName, d.gsNo, d.intiallyUser, d.intiallyDesignation]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term)),
      )
    : tabRows;

  useEffect(() => {
    if (!shouldOpenPending.current || !data || !userId) return;
    shouldOpenPending.current = false;
    const next = data.find((d) => isPendingWithUser(d, userId));
    if (!next) return;
    setTimeout(() => {
      (
        document.querySelector(
          `[data-bs-target="#pciv${next.pcivId}"]`,
        ) as HTMLElement | null
      )?.click();
    }, 500);
  }, [data, userId]);

  const onDone = () => {
    shouldOpenPending.current = true;
    setRefresh((prev) => !prev);
  };

  if (isLoading && !data) return <Loader />;
  if (error) {
    return <AlertMessage variant="danger">{error}, Please Try Again!</AlertMessage>;
  }
  if (!userId || !data) return null;

  const tabButton = (id: number, label: string, count: number) => (
    <div key={id} className="col-auto">
      <Button
        className={`btn shadow-none rounded-0 fw-bold position-relative ${
          selectedTab === id ? `text-dark ${styles.activeTab}` : "text-secondary"
        }`}
        onClick={() => setSelectedTab(id)}
      >
        {label}
        {count > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {count}
          </span>
        )}
      </Button>
    </div>
  );

  return (
    <div className={`container-fluid p-3 mt-3 mb-4 ${raleway.className} ${styles.container}`}>
      <div className="row d-flex justify-content-between">
        <div className="col-auto my-auto">
          <h5 className="fs18px fw-bold">{title}</h5>
        </div>
        <div className="col-auto">
          <div className="row d-flex justify-content-end mb-3">
            {renderDownload && (
              <div className="col-auto my-auto">
                {renderDownload(rows, selectedLabel)}
              </div>
            )}
            <div className="col">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <button
                    className={`btn rounded-end rounded-pill text-white shadow-none border-end-0 pe-0 ${styles.searchButton}`}
                    type="submit"
                  >
                    <Image src={search3} alt="search" width={18} height={18} />
                  </button>
                  <input
                    type="text"
                    className={`form-control border-start-0 rounded-pill rounded-start shadow-none fs14px bg-transparent py-2 ${styles.searchInput}`}
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row d-flex align-items-center mb-3">
        {tabButton(ALL_TAB_ID, "All", data.length)}
        {tabs.map((tab) => tabButton(tab.id, tab.label, tab.count))}
      </div>

      {rows.length === 0 ? (
        <AlertMessage variant="warning" />
      ) : (
        rows.map((d, i) => {
          const pending = isPendingWithUser(d, userId);
          return (
            <div key={d.pcivId} className="col mb-2 position-relative overflow-hidden">
              <div className={`col p-3 ${styles.reportCard}`}>
                <div className="row m-0">
                  <div
                    className={`col-auto rounded-3 p-3 ${
                      PCIV_STATUS_CLASS[d.status] ?? "bg-info text-dark"
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
                        <p className={`fs18px fw-bold m-0 ${styles.projectTitle}`}>
                          <span>Project: </span> {d.projectName}
                        </p>
                      </div>
                      <div className={`col-auto position-absolute p-0 ${styles.typeRibbon}`}>
                        <span className="badge bg-color-evaluation-theme-blue px-5 fw-bold py-2 fs-6">
                          PC-IV
                        </span>
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
                              {formatDate(d.submittedDate)}
                              <br />
                              {formatTime(d.submittedDate)}
                            </>
                          ) : (
                            "N/A"
                          )}
                        </p>
                      </div>

                      <div className="col">
                        <p className="mb-2 fs18px fw-bold">Status</p>
                        <p className="mb-0">
                          {d.statusName ?? PCIV_STATUS_NAME[d.status] ?? d.status}
                        </p>
                      </div>

                      <div className="col d-flex justify-content-end align-items-end pe-5">
                        <CustomModal
                          isFullscreen
                          modalId={`pciv${d.pcivId}`}
                          buttonColumn="col-auto"
                          button={
                            <Button
                              className="btn shadow-sm py-2 px-3 fs20px rounded-pill fw-bold"
                              style={{
                                background: "rgba(0, 57, 206,.05)",
                                color: "#0039CE",
                              }}
                            >
                              {rowButtonLabel
                                ? rowButtonLabel(d, pending, selectedLabel)
                                : pending
                                  ? "Take Action"
                                  : "View History"}
                            </Button>
                          }
                          body={(close) => (
                            <PcivReportModal
                              report={d}
                              userId={userId}
                              users={users}
                              onDone={onDone}
                              onClose={close}
                              labels={panelLabels}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default PcivInboxList;
