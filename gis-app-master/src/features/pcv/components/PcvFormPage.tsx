"use client";
import Loader from "@/components/Loader/Loader";
import { getAgencyTree, agencyIdsOf } from "@/features/agencies";
import AgencyPicker from "@/features/agencies/components/AgencyPicker";
import { AgencyNode } from "@/features/agencies/types";
import { useSectors } from "@/features/sectors/hooks/useSectors";
import { CalendarCheck, FileText, Save, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { PCV_SIGNATURE_TYPES, PCV_STATUS_CLASS, PCV_STATUS_NAME } from "../constants";
import {
  generatePcvPreview,
  getPcv,
  getPcvButtons,
  PcvApiError,
  pcvFileUrl,
  saveAllPcv,
  saveChapter,
  updatePcvHeader,
  uploadInitiatedBySignature,
} from "../services";
import { PcvButtonsResponse, PcvForm, PcvHeaderUpdate, PcvMain } from "../types";
import { isPcvEditableStatus, yearLabel } from "../utils";
import ChapterEditor from "./ChapterEditor";
import ChapterPhotos from "./ChapterPhotos";
import styles from "./Pcv.module.css";
import PcvPageHeader from "./PcvPageHeader";
import PcvWorkflowPanel from "./PcvWorkflowPanel";

interface Props {
  pcvId: number;
}

interface HeaderDraft {
  sectorId: number | null;
  sponsoringAgencyIds: number[];
  executingAgencyIds: number[];
  initiatedByName: string;
}

const headerOf = (main: PcvMain): HeaderDraft => ({
  sectorId: main.sectorId ?? null,
  sponsoringAgencyIds: agencyIdsOf(main.sponsoringAgency),
  executingAgencyIds: agencyIdsOf(main.executingAgency),
  initiatedByName: main.initiatedByName ?? "",
});

const message = (err: unknown) => (err instanceof PcvApiError ? err.message : "Something went wrong.");

/**
 * One PC-V. The department fills item 1 (read-only name), the header and chapters 2 to 16
 * while the PC-V is In Process or Referred Back; everyone else sees it read-only.
 * The workflow panel on the side shows the buttons the server gives this user.
 */
const PcvFormPage = ({ pcvId }: Props) => {
  const router = useRouter();
  const { data: sectors } = useSectors();

  const [form, setForm] = useState<PcvForm>();
  const [view, setView] = useState<PcvButtonsResponse>();
  const [viewError, setViewError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [tree, setTree] = useState<AgencyNode[]>();

  const [header, setHeader] = useState<HeaderDraft>();
  const [headerDirty, setHeaderDirty] = useState(false);
  /** Chapter text being edited, by chapter number (Quill delta strings). */
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const [dirtyChapters, setDirtyChapters] = useState<Set<number>>(new Set());
  /** Bumped on every reload so the editors read the new content. */
  const [version, setVersion] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);

  // Read inside load() without making it depend on every keystroke.
  const dirtyRef = useRef({ headerDirty, dirtyChapters, drafts });
  dirtyRef.current = { headerDirty, dirtyChapters, drafts };

  const sessionExpired = useCallback(() => {
    toast.error("Your session has expired. Please log in again.");
    router.push("/login");
  }, [router]);

  /** Loads the PC-V and its buttons. Unsaved edits are kept unless `discard` is set. */
  const load = useCallback(
    async (discard = false) => {
      try {
        const [data, buttons] = await Promise.all([
          getPcv(pcvId),
          getPcvButtons(pcvId).catch((err) => {
            if (err instanceof PcvApiError && err.code === 401) throw err;
            setViewError(message(err));
            return undefined;
          }),
        ]);
        const kept = discard ? undefined : dirtyRef.current;
        setForm(data);
        setView(buttons);
        if (buttons) setViewError("");
        if (!kept?.headerDirty) {
          setHeader(headerOf(data.pcvMain));
          setHeaderDirty(false);
        }
        setDrafts(
          Object.fromEntries(
            data.chapters.map((c) => [
              c.chapterNo,
              kept?.dirtyChapters.has(c.chapterNo) ? kept.drafts[c.chapterNo] : (c.content ?? ""),
            ]),
          ),
        );
        if (!kept) setDirtyChapters(new Set());
        setVersion((v) => v + 1);
        setLoadError("");
      } catch (err) {
        if (err instanceof PcvApiError && err.code === 401) {
          sessionExpired();
          return;
        }
        setLoadError(message(err));
      }
    },
    [pcvId, sessionExpired],
  );

  useEffect(() => {
    load(true);
  }, [load]);

  useEffect(() => {
    getAgencyTree()
      .then(setTree)
      .catch(() => setTree([]));
  }, []);

  const hasUnsaved = headerDirty || dirtyChapters.size > 0;

  // Warn before closing the tab with unsaved edits.
  useEffect(() => {
    if (!hasUnsaved) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [hasUnsaved]);

  if (loadError && !form) {
    return (
      <div className={styles.page}>
        <PcvPageHeader backHref="/pc-v" backLabel="Back to PC-V list" trail={[{ label: "PC-V", href: "/pc-v" }, { label: "Not found" }]} />
        <p className={styles.errorBox}>{loadError}</p>
      </div>
    );
  }
  if (!form || !header) return <Loader />;

  const main = form.pcvMain;
  const canEdit = view ? view.canEdit : isPcvEditableStatus(main.status);
  const status = view?.status ?? main.status;
  const statusName = view?.statusName || main.statusName || PCV_STATUS_NAME[status];

  const changeHeader = (patch: Partial<HeaderDraft>) => {
    setHeader({ ...header, ...patch });
    setHeaderDirty(true);
  };

  const changeChapter = (chapterNo: number, content: string) => {
    setDrafts((d) => ({ ...d, [chapterNo]: content }));
    setDirtyChapters((s) => new Set(s).add(chapterNo));
  };

  /** Runs one save action; returns false when it failed. */
  const run = async (key: string, action: () => Promise<unknown>, done: string) => {
    setBusy(key);
    try {
      await action();
      toast.success(done);
      return true;
    } catch (err) {
      if (err instanceof PcvApiError && err.code === 401) sessionExpired();
      else toast.error(message(err));
      // 409: locked or the step changed; show the current state
      if (err instanceof PcvApiError && err.code === 409) await load();
      return false;
    } finally {
      setBusy(null);
    }
  };

  const headerUpdate = (): PcvHeaderUpdate => ({
    sectorId: header.sectorId,
    sponsoringAgencyIds: header.sponsoringAgencyIds,
    executingAgencyIds: header.executingAgencyIds,
    initiatedByName: header.initiatedByName.trim(),
  });

  const saveHeader = async () => {
    if (await run("header", () => updatePcvHeader(pcvId, headerUpdate()), "Header saved")) {
      setHeaderDirty(false);
      await load();
    }
  };

  const saveOneChapter = async (chapterNo: number) => {
    const ok = await run(
      `chapter-${chapterNo}`,
      () => saveChapter(pcvId, chapterNo, drafts[chapterNo] ?? ""),
      `Chapter ${chapterNo} saved`,
    );
    if (ok) {
      setDirtyChapters((s) => {
        const next = new Set(s);
        next.delete(chapterNo);
        return next;
      });
    }
  };

  const saveEverything = async () => {
    const ok = await run(
      "all",
      async () => {
        // Agencies are saved through the header call; Save everything sends the whole pcvMain.
        if (headerDirty) await updatePcvHeader(pcvId, headerUpdate());
        await saveAllPcv(
          { ...main, sectorId: header.sectorId, initiatedByName: header.initiatedByName.trim() },
          form.chapters.map((c) => ({ chapterNo: c.chapterNo, content: drafts[c.chapterNo] ?? "" })),
        );
      },
      "PC-V saved",
    );
    if (ok) await load(true);
  };

  const uploadSignature = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (await run("signature", () => uploadInitiatedBySignature(pcvId, file), "Signature uploaded")) {
      await load();
    }
  };

  const preview = async () => {
    if (hasUnsaved && !window.confirm("The preview shows the saved PC-V, without your unsaved changes. Continue?")) {
      return;
    }
    setBusy("preview");
    try {
      const path = await generatePcvPreview(pcvId);
      const url = pcvFileUrl(path);
      if (url) window.open(url, "_blank", "noopener");
    } catch (err) {
      if (err instanceof PcvApiError && err.code === 401) sessionExpired();
      else toast.error(message(err));
    } finally {
      setBusy(null);
    }
  };

  const signatureUrl = pcvFileUrl(main.initiatedBySignaturePath);
  const isBusy = busy !== null;

  return (
    <div className={styles.page}>
      <PcvPageHeader
        backHref="/pc-v"
        backLabel="Back to PC-V list"
        trail={[{ label: "PC-V", href: "/pc-v" }, { label: main.projectName }]}
      />

      <div className={styles.titleRow}>
        <div className={styles.titleBlock}>
          <div className={styles.titleIcon}>
            <CalendarCheck size={30} />
          </div>
          <div>
            <h1 className={styles.title}>{main.projectName}</h1>
            <p className={styles.subtitle}>
              <span className={styles.yearPill}>{yearLabel(main.submissionNo)}</span>{" "}
              <span className={`badge ms-2 ${PCV_STATUS_CLASS[status] ?? "bg-secondary"}`}>{statusName}</span>
            </p>
          </div>
        </div>
      </div>

      {!canEdit && (
        <p className={styles.notice}>
          This PC-V is read-only for you. The department can edit it only while it is In Process or Referred Back.
        </p>
      )}
      {hasUnsaved && <p className={styles.notice}>You have unsaved changes.</p>}

      <div className={styles.layout}>
        <div>
          {/* ---------- item 1 and the header ---------- */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleWrap}>
                <span className={styles.chapterNo}>1</span>
                <div>
                  <h2 className={styles.sectionTitle}>Name of the Project</h2>
                  <p className={styles.sectionSubtitle}>Set when the PC-V was created. It cannot be changed.</p>
                </div>
              </div>
            </div>
            <div className={styles.fieldGrid}>
              <div className={styles.fieldFull}>
                <div className={styles.readOnlyValue}>{main.projectName}</div>
              </div>

              <div>
                <label className={styles.fieldLabel} htmlFor="pcv-sector">
                  Sector
                </label>
                <select
                  id="pcv-sector"
                  className={styles.select}
                  value={header.sectorId ?? ""}
                  disabled={!canEdit}
                  onChange={(e) => changeHeader({ sectorId: e.target.value ? Number(e.target.value) : null })}
                >
                  <option value="">Select a sector</option>
                  {(sectors ?? []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={styles.fieldLabel} htmlFor="pcv-initiated-by">
                  Initiated By (name)
                </label>
                <input
                  id="pcv-initiated-by"
                  className={styles.textInput}
                  value={header.initiatedByName}
                  disabled={!canEdit}
                  onChange={(e) => changeHeader({ initiatedByName: e.target.value })}
                  placeholder="Name of the officer"
                />
              </div>

              <div>
                <AgencyPicker
                  label="Sponsoring agencies"
                  value={header.sponsoringAgencyIds}
                  onChange={(ids) => changeHeader({ sponsoringAgencyIds: ids })}
                  selected={main.sponsoringAgency ?? []}
                  tree={tree}
                  disabled={!canEdit}
                />
              </div>
              <div>
                <AgencyPicker
                  label="Executing agencies"
                  value={header.executingAgencyIds}
                  onChange={(ids) => changeHeader({ executingAgencyIds: ids })}
                  selected={main.executingAgency ?? []}
                  tree={tree}
                  disabled={!canEdit}
                />
              </div>

              <div className={styles.fieldFull}>
                <span className={styles.fieldLabel}>Initiated By (signature)</span>
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  {signatureUrl ? (
                    <Image
                      unoptimized
                      width={240}
                      height={110}
                      src={signatureUrl}
                      alt="Initiated By signature"
                      className={styles.signature}
                    />
                  ) : (
                    <span className="text-secondary">No signature yet. It is needed before you submit.</span>
                  )}
                  {canEdit && (
                    <label className={`${styles.secondaryButton} ${styles.smallButton} mb-0`}>
                      <Upload size={16} /> {busy === "signature" ? "Uploading…" : signatureUrl ? "Replace" : "Upload"}
                      <input
                        type="file"
                        accept={PCV_SIGNATURE_TYPES}
                        hidden
                        onChange={uploadSignature}
                        disabled={isBusy}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
            {canEdit && (
              <div className={styles.sectionFooter}>
                {headerDirty && <span className={styles.unsaved}>Unsaved</span>}
                <button
                  type="button"
                  className={`${styles.secondaryButton} ${styles.smallButton}`}
                  onClick={saveHeader}
                  disabled={isBusy || !headerDirty}
                >
                  {busy === "header" ? "Saving…" : "Save header"}
                </button>
              </div>
            )}
          </section>

          {/* ---------- chapters 2 to 16 ---------- */}
          {form.chapters.map((chapter) => {
            const dirty = dirtyChapters.has(chapter.chapterNo);
            return (
              <section key={chapter.chapterNo} id={`chapter-${chapter.chapterNo}`} className={styles.section}>
                <div className={styles.sectionHeader}>
                  <div className={styles.sectionTitleWrap}>
                    <span className={styles.chapterNo}>{chapter.chapterNo}</span>
                    <div>
                      <h2 className={styles.sectionTitle}>{chapter.title}</h2>
                      {chapter.subtitle && <p className={styles.sectionSubtitle}>{chapter.subtitle}</p>}
                    </div>
                  </div>
                </div>
                <ChapterEditor
                  key={`${chapter.chapterNo}-${version}`}
                  label={`Chapter ${chapter.chapterNo}: ${chapter.title}`}
                  initialContent={drafts[chapter.chapterNo] ?? chapter.content}
                  readOnly={!canEdit}
                  onChange={(content) => changeChapter(chapter.chapterNo, content)}
                />
                {chapter.allowsPhotos && (
                  <ChapterPhotos
                    pcvId={pcvId}
                    chapterNo={chapter.chapterNo}
                    photos={chapter.photos ?? []}
                    readOnly={!canEdit}
                    onChanged={() => load()}
                  />
                )}
                {canEdit && (
                  <div className={styles.sectionFooter}>
                    {dirty && <span className={styles.unsaved}>Unsaved</span>}
                    <button
                      type="button"
                      className={`${styles.secondaryButton} ${styles.smallButton}`}
                      onClick={() => saveOneChapter(chapter.chapterNo)}
                      disabled={isBusy || !dirty}
                    >
                      {busy === `chapter-${chapter.chapterNo}` ? "Saving…" : `Save chapter ${chapter.chapterNo}`}
                    </button>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* ---------- side: save, preview, workflow ---------- */}
        <aside className={styles.side}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>This PC-V</h2>
            <p className={styles.sectionSubtitle}>
              {canEdit
                ? "Save each chapter as you go, or save everything at once."
                : "Open the PDF to read the PC-V as it will be printed."}
            </p>
            <div className="d-grid gap-2 mt-3">
              {canEdit && (
                <button type="button" className={styles.primaryButton} onClick={saveEverything} disabled={isBusy}>
                  <Save size={18} /> {busy === "all" ? "Saving…" : "Save everything"}
                </button>
              )}
              <button type="button" className={styles.secondaryButton} onClick={preview} disabled={isBusy}>
                <FileText size={18} /> {busy === "preview" ? "Preparing PDF…" : "Preview PDF"}
              </button>
            </div>
          </section>

          {view ? (
            <PcvWorkflowPanel
              pcvId={pcvId}
              view={view}
              hasUnsavedChanges={hasUnsaved}
              onDone={() => load()}
              onSessionExpired={sessionExpired}
            />
          ) : (
            viewError && <p className={styles.errorBox}>Workflow: {viewError}</p>
          )}
        </aside>
      </div>
    </div>
  );
};

export default PcvFormPage;
