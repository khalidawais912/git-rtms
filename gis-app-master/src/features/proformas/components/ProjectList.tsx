"use client";
import type { ProjectsList } from "@/app/dashboard/components/Evaluation/types";
import Loader from "@/components/Loader/Loader";
import { getPcvList } from "@/features/pcv";
import apiClient from "@/services/client";
import { EVALUATION_MAIN_DASHBOARD_API } from "@/services/endpoints";
import { exportDataToExcelDynamicColumn } from "@/utils/exportToExcel";
import {
  ArrowLeft,
  ArrowUpDown,
  CalendarDays,
  ChevronLeft,
  Clock,
  Download,
  Filter,
  MapPin,
  PieChart,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { PROFORMA_TYPES, ProformaType, proformaErrorText } from "../adapters";
import {
  Column,
  ColumnKey,
  COLUMNS,
  distinct,
  EMPTY_FILTERS,
  filterRows,
  money,
  pc4Row,
  pc5Row,
  ProjectRow,
  RowFilters,
  sortRows,
  totalCost,
} from "../projectRows";
import { plural } from "../utils";
import styles from "./ProjectList.module.css";
import TypeSwitch from "./TypeSwitch";

const TITLE: Record<ProformaType, string> = { pc4: "Total PC(IV)s", pc5: "Total PC(V)s" };

/** PC-IV projects: the same call the dashboard's projects table made. */
const loadPc4 = async () => {
  const { data } = await apiClient.get<{ data: ProjectsList[] | null }>(
    `${EVALUATION_MAIN_DASHBOARD_API}/GetProjectsListByStatus?filter=all`,
  );
  return (data.data ?? []).map(pc4Row);
};

const loadPc5 = async () => (await getPcvList(false)).map(pc5Row);

const LOADERS: Record<ProformaType, () => Promise<ProjectRow[]>> = { pc4: loadPc4, pc5: loadPc5 };

type FilterKey = keyof RowFilters;

interface Props {
  initialType: ProformaType;
}

const cell = (col: Column, r: ProjectRow): ReactNode => {
  switch (col.key) {
    case "id":
      return <span className={styles.id}>{r.id}</span>;
    case "name":
      return (
        <>
          <span className={styles.nameText}>{r.name}</span>
          {r.nameNote && <span className={styles.sub}>{r.nameNote}</span>}
        </>
      );
    case "cost":
      return r.cost === undefined ? "–" : money(r.cost);
    case "sne":
      return r.sne === undefined ? "–" : r.sne ? <span className={styles.yes}>Yes</span> : "No";
    case "status":
      return r.status ? <span className={styles.status}>{r.status}</span> : "–";
    default:
      return r[col.key] || "–";
  }
};

const cellClass = (col: Column) =>
  col.kind === "num" ? styles.num : col.kind === "name" ? styles.name : col.kind === "wide" ? styles.wide : col.kind === "gs" ? styles.gs : undefined;

/**
 * Total PC(IV)s / Total PC(V)s (RTMES design): every proforma of the chosen type in one
 * plain table, with filters in a rail on the left, sortable columns, a page total and a
 * grand total of the cost. Opened from the Total tiles on the Secretary dashboard.
 */
const ProjectList = ({ initialType }: Props) => {
  const router = useRouter();
  const [type, setType] = useState<ProformaType>(initialType);
  const [data, setData] = useState<Partial<Record<ProformaType, ProjectRow[]>>>({});
  const [errors, setErrors] = useState<Partial<Record<ProformaType, string>>>({});
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<RowFilters>(EMPTY_FILTERS);
  const [railOpen, setRailOpen] = useState(false);
  const [sortBy, setSortBy] = useState<ColumnKey | null>(null);
  const [sortDir, setSortDir] = useState<1 | -1>(1);
  const focusRef = useRef<FilterKey | null>(null);

  useEffect(() => {
    PROFORMA_TYPES.forEach((t) =>
      LOADERS[t]()
        .then((rows) => setData((d) => ({ ...d, [t]: rows })))
        .catch((err) => {
          setData((d) => ({ ...d, [t]: [] }));
          setErrors((e) => ({ ...e, [t]: proformaErrorText(err) }));
        }),
    );
  }, []);

  useEffect(() => {
    router.replace(`/proformas/all?type=${type}`, { scroll: false });
  }, [type, router]);

  // Escape closes the filter rail.
  useEffect(() => {
    if (!railOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setRailOpen(false);
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => {
      const id = `pl-${focusRef.current ?? "search"}`;
      document.getElementById(id)?.focus();
    }, 60);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [railOpen]);

  const all = data[type];
  const columns = COLUMNS[type];

  const shown = useMemo(() => {
    if (!all) return [];
    const merged = { ...filters, search: `${filters.search} ${search}` };
    return sortRows(filterRows(all, merged), sortBy, sortDir);
  }, [all, filters, search, sortBy, sortDir]);

  const changeType = (t: ProformaType) => {
    setType(t);
    setSortBy(null);
    setFilters((f) => ({ ...f, district: "", sector: "", year: "", status: "" }));
  };

  const sortOn = (key: ColumnKey) => {
    setSortDir(sortBy === key ? ((-sortDir) as 1 | -1) : 1);
    setSortBy(key);
  };

  const openRail = (focus: FilterKey | null) => {
    focusRef.current = focus;
    setRailOpen(true);
  };

  const setFilter = (key: FilterKey, value: string) => setFilters((f) => ({ ...f, [key]: value }));
  const hasFilters = Object.values(filters).some(Boolean);

  const download = () => {
    exportDataToExcelDynamicColumn(
      columns.map((c) => ({ label: c.label, value: c.key })),
      shown.map((r) => ({
        ...r,
        cost: r.cost === undefined ? "" : r.cost,
        sne: r.sne === undefined ? "" : r.sne ? "Yes" : "No",
      })),
      `${TITLE[type]}.xlsx`,
    );
  };

  const railIcons: { key: FilterKey; label: string; icon: ReactNode; only?: ProformaType }[] = [
    { key: "search", label: "Search", icon: <Search size={20} /> },
    { key: "district", label: "District Name", icon: <MapPin size={20} /> },
    { key: "sector", label: "Sector Name", icon: <PieChart size={20} /> },
    { key: "year", label: "Proforma Year", icon: <CalendarDays size={20} />, only: "pc5" },
    { key: "status", label: "Status", icon: <Clock size={20} /> },
  ];

  const select = (key: "district" | "sector" | "year" | "status", label: string, all_: string) => (
    <label>
      {label}
      <select id={`pl-${key}`} value={filters[key]} onChange={(e) => setFilter(key, e.target.value)}>
        <option value="">{all_}</option>
        {distinct(all ?? [], key).map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </label>
  );

  const costIndex = columns.findIndex((c) => c.key === "cost");
  const footRow = (cls: string, label: string, rows: ProjectRow[]) => (
    <tr className={cls}>
      <td colSpan={costIndex}>{label}</td>
      <td className={styles.num}>{money(totalCost(rows))}</td>
      {columns.length - costIndex - 1 > 0 && <td colSpan={columns.length - costIndex - 1} />}
    </tr>
  );

  return (
    <div className={styles.page} data-type={type}>
      {/* ---------- Advance Search ---------- */}
      <aside className={`${styles.rail} ${railOpen ? styles.railOpen : ""}`} aria-label="Advance search">
        {!railOpen ? (
          <div className={styles.railIcons}>
            <button
              type="button"
              className={`${styles.railButton} ${styles.railToggle}`}
              onClick={() => openRail(null)}
              title="Open Advance Search"
              aria-label="Open Advance Search"
              aria-expanded={false}
            >
              <Filter size={20} />
            </button>
            <span className={styles.railSep} aria-hidden="true" />
            {railIcons
              .filter((i) => !i.only || i.only === type)
              .map((i) => (
                <button
                  key={i.key}
                  type="button"
                  className={styles.railButton}
                  onClick={() => openRail(i.key)}
                  title={i.label}
                  aria-label={i.label}
                >
                  {i.icon}
                  {filters[i.key] && <span className={styles.onDot} />}
                </button>
              ))}
          </div>
        ) : (
          <div className={styles.railPanel}>
            <div className={styles.railTop}>
              <h2>Advance Search</h2>
              <button
                type="button"
                className={styles.railButton}
                onClick={() => setRailOpen(false)}
                title="Close Advance Search"
                aria-label="Close Advance Search"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
            <label className={styles.search}>
              <Search size={17} />
              <input
                id="pl-search"
                type="search"
                placeholder="Search…"
                aria-label="Search"
                value={filters.search}
                onChange={(e) => setFilter("search", e.target.value)}
              />
            </label>
            {select("district", "District Name", "All districts")}
            {select("sector", "Sector Name", "All sectors")}
            {type === "pc5" && select("year", "Proforma Year", "All years")}
            {select("status", "Status", "All statuses")}
            {hasFilters && (
              <button type="button" className={styles.clear} onClick={() => setFilters(EMPTY_FILTERS)}>
                Clear all filters
              </button>
            )}
          </div>
        )}
      </aside>

      <section className={styles.main}>
        <div className={styles.head}>
          <Link href="/dashboard" className={styles.btn}>
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <h1>{TITLE[type]}</h1>
          <span className={styles.count}>
            {plural(shown.length)}
            {all && shown.length !== all.length ? ` of ${all.length}` : ""}
          </span>
          {filters.status && (
            <span className={styles.chip}>
              Status: {filters.status}
              <button type="button" onClick={() => setFilter("status", "")} aria-label="Show all statuses">
                ×
              </button>
            </span>
          )}
          <div className={styles.tools}>
            <label className={styles.search}>
              <Search size={18} />
              <input
                type="search"
                placeholder="Search name, GS No., agency…"
                aria-label="Search the list"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={download} disabled={!shown.length}>
              <Download size={18} /> Download
            </button>
          </div>
        </div>

        <TypeSwitch value={type} onChange={changeType} counts={{ pc4: data.pc4?.length, pc5: data.pc5?.length }} />

        {errors[type] && <p className={styles.error}>{errors[type]}</p>}

        {!all ? (
          <Loader />
        ) : (
          <div className={styles.box}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      className={c.kind === "num" ? styles.num : undefined}
                      aria-sort={sortBy === c.key ? (sortDir > 0 ? "ascending" : "descending") : undefined}
                    >
                      <button type="button" onClick={() => sortOn(c.key)}>
                        {c.label}
                        <ArrowUpDown size={14} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.length === 0 ? (
                  <tr className={styles.empty}>
                    <td colSpan={columns.length}>
                      {all.length === 0 ? "No proformas yet." : "No proformas match these filters."}
                    </td>
                  </tr>
                ) : (
                  shown.map((r) => (
                    <tr key={r.id}>
                      {columns.map((c) => (
                        <td key={c.key} className={cellClass(c)}>
                          {cell(c, r)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                {footRow(styles.pageTotal, `Page total (${shown.length ? 1 : 0}–${shown.length}) of ${TITLE[type]}`, shown)}
                {footRow(styles.grandTotal, `Grand total (${all.length}) of ${TITLE[type]}`, all)}
              </tfoot>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProjectList;
