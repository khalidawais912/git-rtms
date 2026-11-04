"use client";
import DownloadWrapper from "@/app/pc-iv-review/components/DownloadWrapper";
import Loader from "@/components/Loader/Loader";
import { PcivInboxReport, isPendingWithUser } from "@/features/pciv";
import { useReportHistoryUsers } from "@/features/users";
import useUserInfo from "@/hooks/useUserInfo";
import { ArrowLeft, Calendar, CircleCheck, Clock, Search, Send, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PROFORMA_ADAPTERS, PROFORMA_TYPES, ProformaType, proformaErrorCode, proformaErrorText } from "../adapters";
import { formatDate, formatTime, plural, PROFORMA_TABS, ProformaTabId, statusText, statusTone } from "../utils";
import ProformaDrawer, { DrawerMode } from "./ProformaDrawer";
import styles from "./Proformas.module.css";
import TypeSwitch from "./TypeSwitch";

interface Props {
  initialType: ProformaType;
  initialTab: ProformaTabId;
}

type Inboxes = Partial<Record<ProformaType, PcivInboxReport[]>>;

const toneClass = { ok: styles.statusOk, wait: styles.statusWait, no: "" };

/**
 * List of Proformas (RTMES design): PC-IV and PC-V the user has now or last acted on,
 * one type at a time, split by step. A proforma waiting for the user gets "Take Action",
 * every other one "View History"; both open the drawer. The first waiting proforma opens
 * by itself, and after each action the next one does, so the user works through the queue.
 */
const ProformaList = ({ initialType, initialTab }: Props) => {
  const router = useRouter();
  const { userId } = useUserInfo();
  const { data: users } = useReportHistoryUsers();

  const [type, setType] = useState<ProformaType>(initialType);
  const [tab, setTab] = useState<ProformaTabId>(initialTab);
  const [search, setSearch] = useState("");
  const [inboxes, setInboxes] = useState<Inboxes>({});
  const [errors, setErrors] = useState<Partial<Record<ProformaType, string>>>({});
  const [open, setOpen] = useState<{ row: PcivInboxReport; mode: DrawerMode; type: ProformaType }>();
  /** Open the next waiting proforma once the list (re)loads. */
  const [openNext, setOpenNext] = useState(true);

  const adapter = PROFORMA_ADAPTERS[type];

  const load = useCallback(async () => {
    if (!userId) return;
    await Promise.all(
      PROFORMA_TYPES.map(async (t) => {
        try {
          const inbox = await PROFORMA_ADAPTERS[t].inbox(userId);
          const rows = [...inbox.reports].sort(
            (a, b) => new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime(),
          );
          setInboxes((prev) => ({ ...prev, [t]: rows }));
          setErrors((prev) => ({ ...prev, [t]: "" }));
        } catch (err) {
          if (proformaErrorCode(err) === 401) router.push("/login");
          setInboxes((prev) => ({ ...prev, [t]: prev[t] ?? [] }));
          setErrors((prev) => ({ ...prev, [t]: proformaErrorText(err) }));
        }
      }),
    );
  }, [userId, router]);

  useEffect(() => {
    load();
  }, [load]);

  // Keep the type and tab in the address, so a refresh or a shared link opens the same list.
  useEffect(() => {
    router.replace(`/proformas?type=${type}&tab=${tab}`, { scroll: false });
  }, [type, tab, router]);

  const rows = inboxes[type];

  const found = useMemo(() => {
    const words = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return (rows ?? []).filter((r) => {
      const text = [r.projectName, r.gsNo, r.intiallyUser, r.intiallyDesignation, statusText(r)]
        .join(" ")
        .toLowerCase();
      return words.every((w) => text.includes(w));
    });
  }, [rows, search]);

  const tabCounts = useMemo(
    () =>
      Object.fromEntries(
        PROFORMA_TABS.map((t) => [t.id, userId ? found.filter((r) => t.match(r, userId)).length : 0]),
      ) as Record<ProformaTabId, number>,
    [found, userId],
  );

  const shown = useMemo(() => {
    const definition = PROFORMA_TABS.find((t) => t.id === tab)!;
    return userId ? found.filter((r) => definition.match(r, userId)) : [];
  }, [found, tab, userId]);

  // The first proforma waiting for this user opens by itself (on load and after each action).
  useEffect(() => {
    if (!openNext || !rows || !userId || open) return;
    setOpenNext(false);
    const next = rows.find((r) => isPendingWithUser(r, userId));
    if (next) setOpen({ row: next, mode: "act", type });
  }, [openNext, rows, userId, open, type]);

  const changeType = (t: ProformaType) => {
    setType(t);
    setOpenNext(false);
  };

  const closeDrawer = useCallback(() => setOpen(undefined), []);

  const onActed = () => {
    setOpen(undefined);
    setOpenNext(true);
    load();
  };

  return (
    <div className={styles.page} data-type={type}>
      <div className={styles.head}>
        <Link href="/dashboard" className={styles.btn}>
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>
        <h1>List of Proformas</h1>
        <span className={styles.count}>{plural(shown.length)}</span>
        <div className={styles.tools}>
          <label className={styles.search}>
            <Search size={18} />
            <input
              type="search"
              placeholder="Search project, GS No., officer…"
              aria-label="Search the proformas"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <DownloadWrapper data={shown} fileName={`${adapter.label} ${PROFORMA_TABS.find((t) => t.id === tab)?.label}`} />
        </div>
      </div>

      <TypeSwitch
        value={type}
        onChange={changeType}
        counts={{ pc4: inboxes.pc4?.length, pc5: inboxes.pc5?.length }}
      />

      <div className={styles.tabs} role="tablist" aria-label="Proformas by step">
        {PROFORMA_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === tab}
            className={`${styles.tab} ${t.id === tab ? styles.tabActive : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            <b>{tabCounts[t.id]}</b>
          </button>
        ))}
      </div>

      {errors[type] && <p className={styles.errorBox}>{errors[type]}</p>}

      {!rows || !userId ? (
        <Loader />
      ) : shown.length === 0 ? (
        <p className={styles.empty}>No proformas in this step.</p>
      ) : (
        <div className={styles.list} role="tabpanel">
          {shown.map((r, i) => {
            const pending = isPendingWithUser(r, userId);
            return (
              <article key={r.pcivId} className={`${styles.card} ${pending ? styles.cardAct : ""}`}>
                <div className={styles.cardTop}>
                  <span className={styles.chip}>
                    Sr# <b>{i + 1}</b>
                  </span>
                  <span className={styles.chip}>
                    GS No. <b>{r.gsNo || "–"}</b>
                  </span>
                  <span className={styles.typeTag}>{adapter.label}</span>
                </div>
                <div className={styles.cardBody}>
                  <h3>{r.projectName}</h3>
                  <dl className={styles.facts}>
                    <div>
                      <Users size={18} />
                      <div>
                        <dt>Officer Name</dt>
                        <dd>
                          {r.intiallyUser}
                          {r.intiallyDesignation ? ` (${r.intiallyDesignation})` : ""}
                        </dd>
                      </div>
                    </div>
                    <div>
                      <Calendar size={18} />
                      <div>
                        <dt>Submitted Date</dt>
                        <dd>
                          {formatDate(r.submittedDate)}
                          <br />
                          <small>{formatTime(r.submittedDate)}</small>
                        </dd>
                      </div>
                    </div>
                    <div>
                      <CircleCheck size={18} />
                      <div>
                        <dt>Status</dt>
                        <dd>
                          <span className={`${styles.status} ${toneClass[statusTone(r.status)]}`}>
                            {statusText(r)}
                          </span>
                        </dd>
                      </div>
                    </div>
                  </dl>
                </div>
                {pending ? (
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={() => setOpen({ row: r, mode: "act", type })}
                  >
                    <Send size={18} /> Take Action
                  </button>
                ) : (
                  <button type="button" className={styles.btn} onClick={() => setOpen({ row: r, mode: "history", type })}>
                    <Clock size={18} /> View History
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}

      {open && userId && (
        <ProformaDrawer
          key={`${open.type}-${open.row.pcivId}-${open.mode}`}
          adapter={PROFORMA_ADAPTERS[open.type]}
          row={open.row}
          mode={open.mode}
          userId={userId}
          users={users ?? []}
          onClose={closeDrawer}
          onActed={onActed}
        />
      )}
    </div>
  );
};

export default ProformaList;
