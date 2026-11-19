"use client";
import Loader from "@/components/Loader/Loader";
import { APPROVED, REFERBACK, SUBMITTED } from "@/constants/statuses";
import { formatDateTime } from "@/features/proformas/utils";
import { Officer, ReportHistoryUser } from "@/features/users";
import { useEffectEvent } from "@/hooks/useEffectEvent";
import apiClient, { AxiosError } from "@/services/client";
import { PROJECT_API, REPORTS_HISTORY_API, SINGLE_PROJECT_DASHBOARD_API } from "@/services/endpoints";
import { backendFileUrl } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  ChevronUp,
  Clock,
  Drone,
  ExternalLink,
  FileCheck2,
  Files,
  FileText,
  Play,
  SquarePen,
  Undo2,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { z } from "zod";
import styles from "@/features/proformas/components/Proformas.module.css";
import { annexFiles, fileKind, issuedFiles, nextStatus, ProjectGroup, ReportFile, videoFiles } from "../reportFiles";
import { ReportHistory, SubmittedReport } from "../types";
import FileMenu from "./FileMenu";
import rr from "./ReportReview.module.css";

// TipTap needs the browser
const RemarksEditor = dynamic(() => import("@/components/RemarksEditor/RemarksEditor"), { ssr: false });

export type ReportDrawerMode = "act" | "history";

const schema = z.object({
  id: z.number().optional().default(0),
  visitId: z.number().optional().default(-1),
  projectId: z.number().optional().default(-1),
  submittedFrom: z.number().optional().default(-1),
  submittedUser: z.number().optional().default(-1),
  submittedTo: z.number({ invalid_type_error: "Please select Director!" }).optional(),
  remarks: z.string().min(1, { message: "Please add Remarks!" }).trim(),
  reportPath: z.string().optional().default(""),
  lastStatus: z.number().optional().default(-1),
  status: z.number().optional().default(-1),
  reportType: z.number().optional().default(1),
  sDate: z.string().optional().default(new Date().toISOString()),
});

type NotingForm = z.infer<typeof schema>;

/** The tabs whose reports wait for this user's comment (as on the old screen). */
const COMMENT_TABS = [
  "SUBMITTED BY (AD)",
  "APPROVED BY (DG)",
  "REFERBACK BY (DIRECTOR)",
  "SUBMITTED BY (DD)",
  "REFERBACK BY (DG)",
  "SUBMITTED BY (DIRECTOR)",
];
/** The tabs where the next person is chosen from a list. */
const FORWARD_TABS = ["APPROVED BY (DG)", "SUBMITTED BY (AD)", "SUBMITTED BY (DIRECTOR)"];

const FORM_ID = "report-noting-form";

interface Props {
  report: SubmittedReport;
  mode: ReportDrawerMode;
  selectedTabLabel: string;
  role: string;
  userId: number;
  users: ReportHistoryUser[];
  deputyDirectors: Officer[];
  directors: Officer[];
  departmentHead: Officer;
  onClose: () => void;
  /** The comment was saved: reload the list (and open the next report waiting). */
  onActed: () => void;
}

const Section = ({ icon, title, defaultOpen, children }: { icon: ReactNode; title: string; defaultOpen: boolean; children: ReactNode }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={styles.section}>
      <button type="button" className={styles.sectionHead} aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className={styles.sectionIcon}>{icon}</span>
        <h3>{title}</h3>
        <span className={styles.chevron} aria-hidden="true">
          <ChevronUp size={18} />
        </span>
      </button>
      {/* hidden, not removed: a folded Comment keeps what was typed */}
      <div hidden={!open}>{children}</div>
    </section>
  );
};

/** A document, an issued report or a video in the centre panel: PDF in a frame, a picture, or a player. */
const FileView = ({ file }: { file: ReportFile }) => {
  const url = backendFileUrl(file.path);
  const kind = fileKind(file.path);
  /** The picture or video did not load (e.g. the file is missing on the server). */
  const [failed, setFailed] = useState(false);
  if (kind === "pdf") return <iframe key={file.id} className={styles.pdfFrame} src={url} title={file.name} />;
  return (
    <div className={rr.viewer}>
      {kind === "image" && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={file.name} onError={() => setFailed(true)} />
      ) : kind === "video" && !failed ? (
        <video key={file.id} src={url} controls autoPlay onError={() => setFailed(true)} />
      ) : (
        <div className={rr.other}>
          <Files size={40} />
          {failed ? "This file could not be loaded from the server." : "This file cannot be shown here."}
          <a className={styles.btn} href={url} target="_blank" rel="noreferrer">
            <ExternalLink size={18} /> Open it in a new tab
          </a>
        </div>
      )}
    </div>
  );
};

/**
 * Comment / Report History drawer (RTMES design, Monitoring List of Reports): the report's history,
 * then the comment (Referback, the next officer, Approved / Forward). "View PDF" opens the report in a
 * panel on the left; its toolbar opens a relevant document, an issued report or the videos in a panel
 * between the PDF and the drawer.
 */
const ReportDrawer = ({
  report,
  mode,
  selectedTabLabel,
  role,
  userId,
  users,
  deputyDirectors,
  directors,
  departmentHead,
  onClose,
  onActed,
}: Props) => {
  const {
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NotingForm>({ resolver: zodResolver(schema), defaultValues: { remarks: "" } });

  const [history, setHistory] = useState<ReportHistory[]>();
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [isReferback, setReferback] = useState(false);
  const [isMarked, setMarked] = useState(false);

  const [pdfPath, setPdfPath] = useState<string | null>(null);
  /** The centre panel: a file, or the videos (a file inside it = one video open). */
  const [centre, setCentre] = useState<{ view: "file" | "videos"; file?: ReportFile } | null>(null);
  const [documents, setDocuments] = useState<ReportFile[]>();
  const [issued, setIssued] = useState<ReportFile[]>();
  const [videos, setVideos] = useState<ReportFile[]>();

  const submittedTo = watch("submittedTo");
  const last = history?.[0];

  // The history, newest first
  useEffect(() => {
    let live = true;
    apiClient
      .get(`${REPORTS_HISTORY_API}/GetReportHistory`, {
        params: { visitId: report.visitId, ProjectId: report.projectId, reportType: report.reportType },
      })
      .then((res) => {
        if (!live) return;
        const rows: ReportHistory[] = res.data?.data ?? [];
        setHistory([...rows].sort((a, b) => (b.sDate || "").localeCompare(a.sDate || "")));
      })
      .catch((err) => {
        if (!live) return;
        setHistory([]);
        setLoadError((err as AxiosError).message);
      });
    return () => {
      live = false;
    };
  }, [report.visitId, report.projectId, report.reportType]);

  // The files of the PDF toolbar. These two calls are slow (15-20 s on the server), so they start
  // as soon as the drawer opens, each on its own, and are ready by the time the PDF is opened.
  useEffect(() => {
    let live = true;
    apiClient
      .get(`${PROJECT_API}/${report.projectId}`, { params: { visitId: report.visitId }, skipAppLoader: true })
      .then((res) => (res.data?.data?.groups ?? []) as ProjectGroup[])
      .catch(() => [] as ProjectGroup[])
      .then((groups) => {
        if (!live) return;
        setDocuments(annexFiles(groups));
        setVideos(videoFiles(groups));
      });
    apiClient
      .get(SINGLE_PROJECT_DASHBOARD_API, {
        params: { projectid: report.projectId, visitId: report.visitId },
        skipAppLoader: true,
      })
      .then((res) => (res.data?.data?.reports ?? []) as { reportPath?: string | null }[])
      .catch(() => [])
      .then((reports) => {
        if (live) setIssued(issuedFiles(reports, report.reportPath));
      });
    return () => {
      live = false;
    };
  }, [report.projectId, report.visitId, report.reportPath]);

  // ----- the old Report Noting rules: who the comment goes to by default -----
  const onHistoryOrChoice = useEffectEvent(() => {
    if (!last) return;
    if (role === "deputy director" && last.status === APPROVED) {
      setValue("submittedTo", report.intiallyUserId);
    } else if (role === "deputy director" && last.status === REFERBACK) {
      setReferback(true);
      setValue("submittedTo", report.intiallyUserId);
    } else if (role === "director" && last.status === REFERBACK) {
      setReferback(true);
    }
  });
  useEffect(() => onHistoryOrChoice(), [history, submittedTo, role, onHistoryOrChoice]);

  const onHistory = useEffectEvent(() => {
    if (role === "director" && last?.status === SUBMITTED) {
      setValue("submittedTo", last.submittedFrom);
      setReferback(true);
    }
  });
  useEffect(() => onHistory(), [history, onHistory]);

  // Escape closes the centre panel, then the PDF, then the drawer; the page behind does not scroll.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (centre) setCentre(null);
      else if (pdfPath) setPdfPath(null);
      else onClose();
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [centre, pdfPath, onClose]);

  const userName = useCallback((id: number) => users.find((u) => u.id === id)?.fullName, [users]);

  const closePdf = () => {
    setPdfPath(null);
    setCentre(null);
  };

  const onSubmit = async (form: NotingForm) => {
    if (!role) return;
    const body = {
      ...form,
      visitId: report.visitId,
      projectId: report.projectId,
      submittedFrom: userId,
      submittedUser: report.intiallyUserId,
      reportPath: report.reportPath,
      status: nextStatus(role, report.status, isReferback),
      reportType: report.reportType,
    };
    try {
      setSubmitting(true);
      await apiClient.post(`${REPORTS_HISTORY_API}/MarkedReport`, body);
      toast.success("Report Marked Successfully");
      onActed();
    } catch (err) {
      setSubmitting(false);
      console.error((err as AxiosError).message);
      toast.error("An unexpected error occured.");
    }
  };

  const canComment =
    mode === "act" &&
    !!last &&
    last.submittedTo === userId &&
    COMMENT_TABS.includes(selectedTabLabel) &&
    [SUBMITTED, REFERBACK, APPROVED].includes(last.status);

  const referbackName =
    role === "deputy director" && last?.status === REFERBACK
      ? report.intiallyUser
      : userName(report.submittedFrom);

  const showForwardSelect =
    !isReferback &&
    !isMarked &&
    FORWARD_TABS.includes(selectedTabLabel) &&
    ((role === "deputy director" && last?.status === SUBMITTED) ||
      (role === "director" && (last?.status === SUBMITTED || last?.status === APPROVED)) ||
      (role === "department head" && last?.status === SUBMITTED));

  const actionLabel = isReferback
    ? "Referback"
    : role === "deputy director"
      ? "Reviewed & Forward To"
      : isMarked
        ? "For Approval"
        : "Approved";
  const showAction = canComment && (isReferback || ["deputy director", "director", "department head"].includes(role));

  const kicker = `${mode === "act" ? "Comment" : "Report History"} · GS No. ${report.gsNo || "–"}`;
  const pdfOn = pdfPath !== null && pdfPath === report.reportPath;
  const centreTitle =
    centre?.view === "videos" ? (centre.file ? centre.file.name : "Videos") : (centre?.file?.name ?? "");

  return (
    <div className={`${styles.drawerRoot} ${rr.mon}`} data-doc={centre ? "open" : undefined}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />

      {pdfPath && (
        <div className={styles.panels}>
          <aside className={`${styles.pdfPanel} ${rr.pdfPanel}`} aria-label="Report PDF">
            <div className={styles.pdfHead}>
              <span className={styles.headIcon}>
                <FileText size={22} />
              </span>
              <div className={styles.headTitle}>
                <small>Report PDF · GS No. {report.gsNo || "–"}</small>
                <h2>{report.projectName}</h2>
              </div>
              <button type="button" className={styles.close} onClick={closePdf} aria-label="Close the PDF">
                <X size={20} />
              </button>
            </div>
            <div className={rr.bar}>
              <FileMenu
                icon={<Files size={18} />}
                label={
                  <>
                    <span className={rr.lw}>Relevant </span>Documents
                  </>
                }
                title="Relevant Documents"
                files={documents}
                activeId={centre?.view === "file" ? centre.file?.id : undefined}
                onSelect={(file) => setCentre({ view: "file", file })}
              />
              <FileMenu
                icon={<FileCheck2 size={18} />}
                label={
                  <>
                    Issued<span className={rr.lw}> Reports</span>
                  </>
                }
                title="Issued Reports"
                files={issued}
                activeId={centre?.view === "file" ? centre.file?.id : undefined}
                onSelect={(file) => setCentre({ view: "file", file })}
              />
              <button
                type="button"
                className={`${rr.barBtn} ${rr.vidBtn}`}
                title={!videos ? "Videos: loading…" : videos.length === 0 ? "No videos" : "Videos (Drone, Mobile, etc)"}
                aria-pressed={centre?.view === "videos"}
                disabled={videos?.length === 0}
                onClick={() => setCentre(centre?.view === "videos" ? null : { view: "videos" })}
              >
                <Drone size={18} />
                <span>
                  <span className={rr.lw}>Drone </span>Videos
                </span>
                <span className={rr.barCount}>{videos?.length ?? "–"}</span>
              </button>
              <a
                className={rr.newWindow}
                href={backendFileUrl(pdfPath)}
                target="_blank"
                rel="noreferrer"
                title="Open the PDF in a new window"
                aria-label="Open the PDF in a new window"
              >
                <ExternalLink size={18} />
              </a>
            </div>
            <iframe key={pdfPath} className={styles.pdfFrame} src={backendFileUrl(pdfPath)} title={`${report.projectName} PDF`} />
          </aside>

          {centre && (
            <aside className={styles.docPanel} aria-label={centreTitle}>
              <div className={styles.pdfHead}>
                <span className={`${styles.headIcon} ${rr.docHeadIcon}`}>
                  {centre.view === "videos" ? <Drone size={22} /> : <Files size={22} />}
                </span>
                {centre.view === "videos" && centre.file && (
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.iconOnly}`}
                    onClick={() => setCentre({ view: "videos" })}
                    title="All videos"
                    aria-label="Back to all videos"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                <div className={styles.headTitle}>
                  {centre.view === "videos" && (
                    <small>
                      {videos?.length ?? 0} videos · GS No. {report.gsNo || "–"}
                    </small>
                  )}
                  <h2>{centreTitle}</h2>
                </div>
                {centre.file && (
                  <a
                    className={`${styles.btn} ${styles.iconOnly}`}
                    href={backendFileUrl(centre.file.path)}
                    target="_blank"
                    rel="noreferrer"
                    title="Open in a new tab"
                    aria-label="Open in a new tab"
                  >
                    <ExternalLink size={18} />
                  </a>
                )}
                <button type="button" className={styles.close} onClick={() => setCentre(null)} aria-label="Close">
                  <X size={20} />
                </button>
              </div>
              {centre.file ? (
                <FileView key={centre.file.id} file={centre.file} />
              ) : (
                <div className={rr.vids}>
                  <ul className={rr.vgrid}>
                    {(videos ?? []).map((v) => (
                      <li key={v.id}>
                        <button type="button" className={rr.vc} onClick={() => setCentre({ view: "videos", file: v })}>
                          <span className={rr.vthumb}>
                            {fileKind(v.path) === "image" && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={backendFileUrl(v.path)} alt="" onError={(e) => (e.currentTarget.hidden = true)} />
                            )}
                            <Drone size={18} />
                            <span className={rr.vplay}>
                              <Play size={20} fill="currentColor" />
                            </span>
                          </span>
                          <b>{v.name}</b>
                          <small>{v.note}</small>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          )}
        </div>
      )}

      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-label={kicker}>
        <div className={`${styles.drawerHead} ${rr.drawerHead}`}>
          <span className={styles.headIcon}>{mode === "act" ? <SquarePen size={22} /> : <Clock size={22} />}</span>
          <div className={styles.headTitle}>
            <small>{kicker}</small>
            <h2>{report.projectName}</h2>
          </div>
          <button
            type="button"
            className={`${styles.btn} ${styles.pdfButton} ${rr.viewPdf} ${pdfOn ? styles.pdfButtonOn : ""}`}
            onClick={() => (pdfOn ? closePdf() : setPdfPath(report.reportPath))}
            disabled={!report.reportPath}
            title={report.reportPath ? undefined : "The PDF of this report is not ready yet"}
            aria-pressed={pdfOn}
          >
            <FileText size={18} /> {pdfOn ? "Close PDF" : "View PDF"}
          </button>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className={styles.drawerBody}>
          {loadError && <p className={styles.errorBox}>{loadError}, Please Try Again!</p>}

          <Section icon={<Clock size={20} />} title="Report History List" defaultOpen={mode === "history"}>
            <div className={styles.history}>
              {!history ? (
                <Loader />
              ) : history.length === 0 ? (
                <p className={styles.muted}>No history yet.</p>
              ) : (
                history.map((h) => (
                  <article key={h.id} className={styles.step}>
                    <div className={rr.stepTop}>
                      <div className={rr.route}>
                        <div>
                          <small>From</small>
                          <b>{userName(h.submittedFrom) ?? "–"}</b>
                        </div>
                        <ArrowRight size={18} aria-hidden="true" />
                        <div>
                          <small>To</small>
                          <b>{userName(h.submittedTo) ?? "–"}</b>
                        </div>
                      </div>
                      {h.reportPath && (
                        <button type="button" className={`${styles.btn} ${rr.pdfSmall}`} onClick={() => setPdfPath(h.reportPath)}>
                          <FileText size={17} /> View PDF Report
                        </button>
                      )}
                    </div>
                    <p className={rr.date}>
                      <Calendar size={17} aria-hidden="true" />
                      Date: <b>{formatDateTime(h.sDate)}</b>
                    </p>
                    <div>
                      <div className={styles.label}>Comments</div>
                      <div className={styles.comment}>
                        {h.remarks ? <ReactMarkdown>{h.remarks}</ReactMarkdown> : <span className={styles.muted}>–</span>}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </Section>

          {mode === "act" && (
            <Section icon={<SquarePen size={20} />} title="Comment" defaultOpen>
              <div className={styles.act}>
                <dl className={styles.factsBox}>
                  <div>
                    <dt>Project:</dt>
                    <dd>
                      (Gs. No- {report.gsNo || "–"}) {report.projectName}
                    </dd>
                  </div>
                  <div>
                    <dt>Name:</dt>
                    <dd>{report.intiallyUser}</dd>
                  </div>
                </dl>

                {!history ? (
                  <Loader />
                ) : !canComment ? (
                  <p className={rr.done}>Response Submitted</p>
                ) : (
                  <form id={FORM_ID} className={styles.act} style={{ padding: 0 }} onSubmit={handleSubmit(onSubmit)}>
                    <div>
                      <div className={styles.label}>Description Level</div>
                      <Controller
                        name="remarks"
                        control={control}
                        render={({ field }) => (
                          <RemarksEditor placeholder="Description" ariaLabel="Description Level" onChange={field.onChange} />
                        )}
                      />
                      {errors.remarks && <p className={styles.fieldError}>{errors.remarks.message}</p>}
                    </div>

                    {role !== "director" && (report.status === SUBMITTED || report.status === REFERBACK) && (
                      <label className={`${styles.check} ${isReferback ? styles.checkOn : ""}`}>
                        <input
                          type="checkbox"
                          checked={isReferback}
                          disabled={role === "deputy director" && last?.status === REFERBACK}
                          onChange={() => {
                            setReferback(!isReferback);
                            setMarked(false);
                            setValue(
                              "submittedTo",
                              role === "deputy director" && last?.status === REFERBACK
                                ? report.intiallyUserId
                                : report.submittedFrom,
                            );
                          }}
                        />
                        Referback: {referbackName ?? "–"}
                      </label>
                    )}

                    {role === "director" && selectedTabLabel !== "APPROVED BY (DG)" && (
                      <select
                        className={rr.select}
                        value={submittedTo || ""}
                        aria-label="Select Deputy Director"
                        onChange={(e) => {
                          setValue("submittedTo", parseInt(e.target.value));
                          setReferback(true);
                          setMarked(false);
                        }}
                      >
                        <option value="">Select Deputy Director</option>
                        {deputyDirectors.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.designation}
                          </option>
                        ))}
                      </select>
                    )}

                    {role === "director" && last?.status !== APPROVED && last?.status !== REFERBACK && (
                      <label className={`${styles.check} ${isMarked ? styles.checkOn : ""}`}>
                        <input
                          type="checkbox"
                          checked={isMarked}
                          onChange={() => {
                            const on = !isMarked;
                            setMarked(on);
                            setReferback(false);
                            setValue("submittedTo", on ? departmentHead.id : undefined);
                          }}
                        />
                        Mark To: DEPARTMENT HEAD
                      </label>
                    )}

                    {!isReferback && !isMarked && FORWARD_TABS.includes(selectedTabLabel) &&
                      (showForwardSelect ? (
                        <select
                          className={rr.select}
                          value={submittedTo || ""}
                          aria-label={role === "director" ? "Select Deputy Director" : "Select Director"}
                          onChange={(e) => setValue("submittedTo", parseInt(e.target.value))}
                        >
                          <option value="">{role === "director" ? "Select Deputy Director" : "Select Director"}</option>
                          {(role === "director" ? deputyDirectors : directors).map((o) => (
                            <option key={o.id} value={o.id}>
                              {o.designation}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className={styles.muted}>Submitted To: {report.intiallyUser}</p>
                      ))}
                    {errors.submittedTo && <p className={styles.fieldError}>{errors.submittedTo.message}</p>}
                  </form>
                )}
              </div>
            </Section>
          )}
        </div>

        <div className={`${styles.drawerFoot} ${rr.drawerFoot}`}>
          <button type="button" className={styles.btn} onClick={onClose}>
            Close
          </button>
          {showAction && (
            <button
              type="submit"
              form={FORM_ID}
              disabled={isSubmitting || !submittedTo}
              className={`${styles.btn} ${isReferback ? styles.btnRose : styles.btnPrimary}`}
            >
              {isReferback ? <Undo2 size={18} /> : <Check size={18} />}
              {isSubmitting ? "Please wait…" : actionLabel}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ReportDrawer;
