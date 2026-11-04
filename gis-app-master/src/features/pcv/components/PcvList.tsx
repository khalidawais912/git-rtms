"use client";
import Loader from "@/components/Loader/Loader";
import { CalendarCheck, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PCV_STATUS_CLASS, PCV_STATUS_NAME } from "../constants";
import { getPcvList, PcvApiError } from "../services";
import { PcvListItem } from "../types";
import { formatPcvDate, pcvNameOf, yearLabel } from "../utils";
import CreatePcvModal from "./CreatePcvModal";
import styles from "./Pcv.module.css";
import PcvPageHeader from "./PcvPageHeader";

type Scope = "mine" | "department";

const SCOPES: { id: Scope; label: string }[] = [
  { id: "mine", label: "Created by me" },
  { id: "department", label: "My department" },
];

/**
 * PC-Vs (annual performance reports) of the user's department. "Created by me"
 * asks the server for `mine=true`; "My department" for all of the department's.
 */
const PcvList = () => {
  const router = useRouter();
  const [scope, setScope] = useState<Scope>("mine");
  const [rows, setRows] = useState<PcvListItem[]>();
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<number | "">("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setRows(undefined);
    setError("");
    getPcvList(scope === "mine")
      .then((data) => !cancelled && setRows(data))
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof PcvApiError && err.code === 401) router.push("/login");
        setError(err instanceof PcvApiError ? err.message : "Something went wrong.");
        setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [scope, router]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (rows ?? []).filter(
      (r) =>
        (status === "" || r.status === status) &&
        (!term || pcvNameOf(r).toLowerCase().includes(term)),
    );
  }, [rows, search, status]);

  return (
    <div className={styles.page}>
      <PcvPageHeader
        backHref="/dashboard"
        backLabel="Back to Dashboard"
        trail={[{ label: "Projects" }, { label: "PC-V" }]}
      />

      <div className={styles.titleRow}>
        <div className={styles.titleBlock}>
          <div className={styles.titleIcon}>
            <CalendarCheck size={30} />
          </div>
          <div>
            <h1 className={styles.title}>PC-V</h1>
            <p className={styles.subtitle}>
              Annual performance reports. Each project gets up to five, one a year after completion.
            </p>
          </div>
        </div>
        <div className={styles.titleActions}>
          <button type="button" className={styles.primaryButton} onClick={() => setCreating(true)}>
            <Plus size={18} /> New PC-V
          </button>
        </div>
      </div>

      {error && <p className={styles.errorBox}>{error}</p>}

      <div className={styles.card}>
        <div className={styles.toolbar}>
          <div className={styles.tabs} role="tablist">
            {SCOPES.map((s) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={scope === s.id}
                className={`${styles.tab} ${scope === s.id ? styles.tabActive : ""}`}
                onClick={() => setScope(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <select
              className={styles.select}
              style={{ width: "auto" }}
              value={status}
              onChange={(e) => setStatus(e.target.value ? Number(e.target.value) : "")}
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              {Object.entries(PCV_STATUS_NAME).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
            <label className={styles.searchBox}>
              <Search size={18} />
              <input
                placeholder="Find a project"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
        </div>

        {!rows ? (
          <Loader />
        ) : visible.length === 0 ? (
          <p className={styles.empty}>
            {rows.length === 0 ? "No PC-Vs yet." : "No PC-V matches the filters."}
          </p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name of the Project</th>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Last updated</th>
                  <th aria-label="Open" />
                </tr>
              </thead>
              <tbody>
                {visible.map((row, i) => (
                  <tr key={row.id}>
                    <td>{i + 1}</td>
                    <td className={styles.nameCell}>{pcvNameOf(row)}</td>
                    <td>
                      <span className={styles.yearPill}>{yearLabel(row.submissionNo)}</span>
                    </td>
                    <td>
                      <span className={`badge ${PCV_STATUS_CLASS[row.status] ?? "bg-secondary"}`}>
                        {row.statusName || PCV_STATUS_NAME[row.status] || `Status ${row.status}`}
                      </span>
                    </td>
                    <td>{formatPcvDate(row.updatedAt || row.createdAt)}</td>
                    <td className="text-end">
                      <Link
                        href={`/pc-v/${row.id}`}
                        className={`${styles.secondaryButton} ${styles.smallButton} text-decoration-none`}
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {creating && (
        <CreatePcvModal onClose={() => setCreating(false)} onSessionExpired={() => router.push("/login")} />
      )}
    </div>
  );
};

export default PcvList;
