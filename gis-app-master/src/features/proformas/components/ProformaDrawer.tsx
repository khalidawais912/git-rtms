"use client";
import Loader from "@/components/Loader/Loader";
import {
  PCIV_ACTION,
  PCIV_ACTION_LABEL,
  PcivButton,
  PcivButtonsResponse,
  PcivInboxReport,
  PcivPerson,
  PcivReportTrail,
} from "@/features/pciv";
import { ReportHistoryUser } from "@/features/users";
import { getSession } from "@/utils/session";
import { ArrowLeft, ChevronUp, Clock, Eye, ExternalLink, Files, FileText, Send, Undo2, X } from "lucide-react";
import dynamic from "next/dynamic";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { ProformaAdapter, ProformaDocument, proformaErrorCode, proformaErrorText } from "../adapters";
import { documentLine, formatDateTime } from "../utils";
import styles from "./Proformas.module.css";

// TipTap needs the browser
const RemarksEditor = dynamic(() => import("@/components/RemarksEditor/RemarksEditor"), { ssr: false });

export type DrawerMode = "act" | "history";

interface Props {
  adapter: ProformaAdapter;
  row: PcivInboxReport;
  mode: DrawerMode;
  userId: number;
  users: ReportHistoryUser[];
  onClose: () => void;
  /** A button succeeded: reload the list (and open the next waiting proforma). */
  onActed: () => void;
}

const BUTTON_LABEL: Record<PcivButton, string> = {
  submit: "Submit",
  forward: "Forward",
  referBack: "Referback",
  complete: "Complete",
  cancel: "Cancel",
};
const REMARKS_REQUIRED = new Set<PcivButton>(["referBack", "cancel"]);
const NEEDS_PERSON = new Set<PcivButton>(["submit", "forward"]);
const CONFIRM = new Set<PcivButton>(["complete", "cancel"]);

interface SectionProps {
  icon: ReactNode;
  title: string;
  /** History and Attached Documents start folded; Take Action starts open. */
  defaultOpen: boolean;
  children: ReactNode;
}

const Section = ({ icon, title, defaultOpen, children }: SectionProps) => {
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
      {open && children}
    </section>
  );
};

/**
 * Take Action / Proforma History drawer (RTMES design): the history of the proforma, its
 * attached documents, then the buttons the server gives this user. Ticking "Referback" turns the action
 * into a refer back; otherwise it is forwarded to the next level (or completed / cancelled).
 * The proforma's PDF opens in a panel to the left of the drawer.
 */
const ProformaDrawer = ({ adapter, row, mode, userId, users, onClose, onActed }: Props) => {
  const id = row.pcivId;
  const [history, setHistory] = useState<PcivReportTrail[]>();
  const [view, setView] = useState<PcivButtonsResponse>();
  const [targets, setTargets] = useState<PcivPerson[]>([]);
  const [loadError, setLoadError] = useState("");
  const [toUserId, setToUserId] = useState<number>();
  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [isReferBack, setReferBack] = useState(false);
  const [busy, setBusy] = useState<PcivButton | null>(null);
  const [pdfPath, setPdfPath] = useState<string | null>(null);
  const [documents, setDocuments] = useState<ProformaDocument[]>();
  /** A document shown inside the drawer, over it. */
  const [openDoc, setOpenDoc] = useState<ProformaDocument | null>(null);

  const load = useCallback(async () => {
    setLoadError("");
    try {
      const [trail, buttons, docs] = await Promise.all([
        adapter.history(id),
        mode === "act" ? adapter.buttons(id) : Promise.resolve(undefined),
        adapter.documents(id).catch(() => [] as ProformaDocument[]),
      ]);
      setHistory(trail);
      setDocuments(docs);
      setView(buttons);
      const people =
        buttons && buttons.buttons.some((b) => NEEDS_PERSON.has(b)) ? await adapter.forwardTargets(id) : [];
      setTargets(people);
      setToUserId(people.length === 1 ? people[0].userId : undefined);
    } catch (err) {
      setHistory((h) => h ?? []);
      setDocuments((d) => d ?? []);
      setLoadError(proformaErrorText(err));
    }
  }, [adapter, id, mode]);

  useEffect(() => {
    load();
  }, [load]);

  // Escape closes the PDF first, then the drawer; the page behind does not scroll.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openDoc) setOpenDoc(null);
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
  }, [pdfPath, openDoc, onClose]);

  const userName = useCallback((uid: number) => users.find((u) => u.id === uid)?.fullName, [users]);

  // The person who last sent it to this user (not by a refer back) gets the refer back.
  const referBackTo = useMemo(() => {
    const sentToMe = history?.find((h) => h.mark_to === userId && h.action !== PCIV_ACTION.REFER_BACK);
    return sentToMe ? userName(sentToMe.mark_From) : undefined;
  }, [history, userId, userName]);

  const myName =
    [getSession("deptUserFirstName"), getSession("deptUserLastName")].filter(Boolean).join(" ") ||
    getSession("userName") ||
    "";

  const press = async (button: PcivButton) => {
    if (REMARKS_REQUIRED.has(button) && !remarks.trim()) {
      setRemarksError("Remarks are required.");
      return;
    }
    if (NEEDS_PERSON.has(button) && !toUserId) return;
    if (CONFIRM.has(button) && !window.confirm(`${BUTTON_LABEL[button]} this ${adapter.label}? This cannot be undone.`)) {
      return;
    }
    setRemarksError("");
    setBusy(button);
    try {
      const result = await adapter.press(id, button, { remarks: remarks.trim(), toUserId });
      toast.success(`${BUTTON_LABEL[button]}: now ${result.statusName}`);
      onActed();
    } catch (err) {
      toast.error(proformaErrorText(err));
      const code = proformaErrorCode(err);
      // 403 / 409: someone else acted or the step changed; show the current buttons
      if (code === 403 || code === 409) await load();
    } finally {
      setBusy(null);
    }
  };

  const buttons = view?.buttons ?? [];
  const has = (b: PcivButton) => buttons.includes(b);
  const shown: PcivButton[] = isReferBack ? ["referBack"] : buttons.filter((b) => b !== "referBack");
  const personNeeded = shown.some((b) => NEEDS_PERSON.has(b));

  const kicker = `${mode === "act" ? "Take Action" : "Proforma History"} · ${adapter.label} · GS No. ${row.gsNo || "–"}`;

  return (
    <div className={styles.drawerRoot} data-type={adapter.type}>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />

      {pdfPath && (
        <aside className={styles.pdfPanel} aria-label={`${adapter.label} PDF`}>
          <div className={styles.pdfHead}>
            <span className={styles.headIcon}>
              <FileText size={22} />
            </span>
            <div className={styles.headTitle}>
              <small>Proforma PDF · GS No. {row.gsNo || "–"}</small>
              <h2>{row.projectName}</h2>
            </div>
            <a className={styles.btn} href={adapter.fileUrl(pdfPath)} target="_blank" rel="noreferrer">
              <ExternalLink size={18} /> Open in new window
            </a>
            <button type="button" className={styles.close} onClick={() => setPdfPath(null)} aria-label="Close the PDF">
              <X size={20} />
            </button>
          </div>
          <iframe className={styles.pdfFrame} src={adapter.fileUrl(pdfPath)} title={`${row.projectName} PDF`} />
        </aside>
      )}

      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-label={kicker}>
        <div className={styles.drawerHead}>
          <span className={styles.headIcon}>{mode === "act" ? <Send size={22} /> : <Clock size={22} />}</span>
          <div className={styles.headTitle}>
            <small>{kicker}</small>
            <h2>{row.projectName}</h2>
          </div>
          <button
            type="button"
            className={`${styles.btn} ${styles.pdfButton} ${pdfPath && pdfPath === row.reportPath ? styles.pdfButtonOn : ""}`}
            onClick={() => setPdfPath(pdfPath === row.reportPath ? null : row.reportPath)}
            disabled={!row.reportPath}
            title={row.reportPath ? undefined : "The PDF of this proforma is not ready yet"}
            aria-pressed={!!pdfPath && pdfPath === row.reportPath}
          >
            <FileText size={18} /> {pdfPath && pdfPath === row.reportPath ? "Close PDF" : "View PDF"}
          </button>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className={styles.drawerBody}>
          {loadError && <p className={styles.errorBox}>{loadError}</p>}

          <Section icon={<Clock size={20} />} title="Proforma History List" defaultOpen={mode === "history"}>
            <div className={styles.history}>
              {!history ? (
                <Loader />
              ) : history.length === 0 ? (
                <p className={styles.muted}>No history yet.</p>
              ) : (
                history.map((h) => (
                  <article key={h.id} className={styles.step}>
                    <div className={styles.stepTop}>
                      <b>{h.action !== null ? (PCIV_ACTION_LABEL[h.action] ?? "Updated") : "Marked"}</b>
                      {h.actor_role && <span>by {h.actor_role}</span>}
                      {h.pciv_pdf_path && (
                        <button type="button" className={styles.btn} onClick={() => setPdfPath(h.pciv_pdf_path)}>
                          <FileText size={17} /> View PDF
                        </button>
                      )}
                    </div>
                    <dl className={styles.meta}>
                      <div>
                        <dt>From:</dt>
                        <dd>{userName(h.mark_From) ?? "–"}</dd>
                      </div>
                      <div>
                        <dt>To:</dt>
                        <dd>{userName(h.mark_to) ?? "–"}</dd>
                      </div>
                      <div>
                        <dt>Date:</dt>
                        <dd>{formatDateTime(h.mark_date)}</dd>
                      </div>
                    </dl>
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

          <Section icon={<Files size={20} />} title="Attached Documents" defaultOpen={false}>
            {!documents ? (
              <div className={styles.history}>
                <Loader />
              </div>
            ) : documents.length === 0 ? (
              <div className={styles.history}>
                <p className={styles.muted}>No documents attached.</p>
              </div>
            ) : (
              <ul className={styles.docs}>
                {documents.map((doc) => (
                  <li key={doc.id}>
                    <span className={styles.docIcon}>
                      <FileText size={22} />
                    </span>
                    <span className={styles.docText}>
                      <b>{doc.name}</b>
                      <small>{documentLine(doc)}</small>
                    </span>
                    <button type="button" className={styles.btn} onClick={() => setOpenDoc(doc)}>
                      <Eye size={18} /> View PDF
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {mode === "act" && (
            <Section icon={<Send size={20} />} title="Take Action" defaultOpen>
              <div className={styles.act}>
                <dl className={styles.factsBox}>
                  <div>
                    <dt>Project:</dt>
                    <dd>
                      (Gs. No- {row.gsNo || "–"}) {row.projectName}
                    </dd>
                  </div>
                  {myName && (
                    <div>
                      <dt>Name:</dt>
                      <dd>{myName}</dd>
                    </div>
                  )}
                </dl>

                {!view && !loadError ? (
                  <Loader />
                ) : view ? (
                  <>
                    <div className={styles.with}>
                      <span className={styles.statusChip}>{view.statusName}</span>
                      {view.withUser && <span>With: {view.withUser}</span>}
                    </div>
                    {view.note && <p className={styles.note}>{view.note}</p>}

                    {buttons.length === 0 ? (
                      <p className={styles.muted}>There is nothing for you to do on this {adapter.label} now.</p>
                    ) : (
                      <>
                        <div>
                          <div className={styles.label}>Description Level</div>
                          <div>
                            <RemarksEditor
                              placeholder="Description"
                              ariaLabel="Description Level"
                              onChange={(value) => {
                                setRemarks(value);
                                setRemarksError("");
                              }}
                            />
                          </div>
                          {remarksError && <p className={styles.fieldError}>{remarksError}</p>}
                        </div>

                        {has("referBack") && (
                          <label className={`${styles.check} ${isReferBack ? styles.checkOn : ""}`}>
                            <input type="checkbox" checked={isReferBack} onChange={() => setReferBack(!isReferBack)} />
                            Referback: {referBackTo ?? "one level back"}
                          </label>
                        )}

                        {personNeeded && (
                          <div className={styles.forwardTo}>
                            <Send size={20} />
                            {targets.length === 0 ? (
                              <span className="text-danger">There is no one to forward to.</span>
                            ) : targets.length === 1 ? (
                              <span>
                                Forward To:{" "}
                                <b>
                                  {targets[0].name} ({targets[0].designation})
                                </b>
                              </span>
                            ) : (
                              <select
                                value={toUserId ?? ""}
                                onChange={(e) => setToUserId(e.target.value ? Number(e.target.value) : undefined)}
                                aria-label="Forward to"
                              >
                                <option value="">Select the person to forward to</option>
                                {targets.map((p) => (
                                  <option key={p.userId} value={p.userId}>
                                    {p.name} ({p.designation})
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : null}
              </div>
            </Section>
          )}
        </div>

        <div className={styles.drawerFoot}>
          <button type="button" className={styles.btn} onClick={onClose}>
            Close
          </button>
          {mode === "act" &&
            shown.map((button) => {
              const disabled = busy !== null || (NEEDS_PERSON.has(button) && !toUserId);
              const rose = button === "referBack" || button === "cancel";
              return (
                <button
                  key={button}
                  type="button"
                  disabled={disabled}
                  onClick={() => press(button)}
                  className={`${styles.btn} ${rose ? styles.btnRose : styles.btnPrimary}`}
                >
                  {button === "referBack" ? <Undo2 size={18} /> : <Send size={18} />}
                  {busy === button ? "Please wait…" : BUTTON_LABEL[button]}
                </button>
              );
            })}
        </div>

        {openDoc && (
          <section className={styles.docView} aria-label={`Attached document: ${openDoc.name}`}>
            <div className={styles.docHead}>
              <button type="button" className={`${styles.btn} ${styles.docBack}`} onClick={() => setOpenDoc(null)} autoFocus>
                <ArrowLeft size={18} /> {mode === "act" ? "Back to Take Action" : "Back to Proforma History"}
              </button>
              <div className={styles.headTitle}>
                <small>Attached Document</small>
                <h2>{openDoc.name}</h2>
              </div>
              <a
                className={`${styles.btn} ${styles.docNew}`}
                href={adapter.fileUrl(openDoc.path)}
                target="_blank"
                rel="noreferrer"
                title="Open in new window"
                aria-label="Open in new window"
              >
                <ExternalLink size={18} />
              </a>
            </div>
            <iframe className={styles.pdfFrame} src={adapter.fileUrl(openDoc.path)} title={openDoc.name} />
          </section>
        )}
      </aside>
    </div>
  );
};

export default ProformaDrawer;
