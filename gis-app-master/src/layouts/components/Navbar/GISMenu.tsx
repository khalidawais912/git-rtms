"use client";
import { getRights } from "@/utils/session";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./GISMenu.module.css";
import navStyles from "./Navbar.module.css";

/* Line icons from the RTMES design (24×24, stroke = currentColor) */
const ICONS: Record<string, ReactNode> = {
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /></>,
  fingerprint: <path d="M12 11v3a8 8 0 0 1-1.5 4.5M8 13a4 4 0 0 1 8-2v3a12 12 0 0 1-.6 3.8M5 16.5A10 10 0 0 1 5 9a7 7 0 0 1 12-2.8M19.5 9a9 9 0 0 1 .5 3v1" />,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></>,
  wallet: <><path d="M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5" /><path d="M17 14h.01" /></>,
  car: <><path d="M5 17H3v-5l2-5h11l3 5h2v5h-2" /><circle cx="7.5" cy="17" r="2" /><circle cx="16.5" cy="17" r="2" /><path d="M9.5 17h5M5 12h14" /></>,
  userPin: <><circle cx="12" cy="7" r="4" /><path d="M5 21v-1a7 7 0 0 1 14 0v1" /></>,
  calendar: <><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /><path d="m9 15 2 2 4-4" /></>,
  plus: <><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>,
  folder: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="m9 13 2 2 4-4" /></>,
  clipboard: <><rect x="5" y="4" width="14" height="18" rx="2" /><path d="M9 4V3h6v1M9 11h6M9 15h4" /></>,
  sector: <><circle cx="12" cy="12" r="9" /><path d="M12 3v9l7 5" /></>,
  building: <><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M16 9h3a1 1 0 0 1 1 1v11M2 21h20M8 7h4M8 11h4M8 15h4" /></>,
  chart: <><path d="M3 3v18h18" /><path d="M7 15v2M11 11v6M15 7v10M19 12v5" /></>,
  tree: <><rect x="9" y="2" width="6" height="5" rx="1" /><rect x="2" y="17" width="6" height="5" rx="1" /><rect x="16" y="17" width="6" height="5" rx="1" /><path d="M12 7v5M5 17v-3h14v3" /></>,
  files: <><path d="M15 2H8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7z" /><path d="M15 2v5h5M4 7v13a2 2 0 0 0 2 2h10" /></>,
  docCats: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M8 12h8M8 15.5h5" /></>,
  steering: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="2" /><path d="M3.5 10.5 10 12M14 12l6.5-1.5M12 14v7" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" /></>,
  shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="m9 12 2 2 4-4" /></>,
  key: <><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9M17 6l3 3M15 8l2 2" /></>,
  layers: <><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /></>,
  sliders: <><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12" /><circle cx="16" cy="6" r="2" /><circle cx="10" cy="12" r="2" /><circle cx="18" cy="18" r="2" /></>,
  tag: <><path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z" /><circle cx="7.5" cy="7.5" r="1.5" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
};

const Svg = ({ name, className = styles.icon }: { name: string; className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
    {ICONS[name]}
  </svg>
);

interface Module {
  name: string;
  /** Right that shows this module */
  nameId: string;
  link: string;
  icon: string;
}

interface Group {
  title: string;
  color: string;
  modules: Module[];
}

/** Modules by group; a user sees only those their rights allow */
const GROUPS: Group[] = [
  {
    title: "Dashboards",
    color: "var(--cat-brand)",
    modules: [
      { name: "Main Dashboard", nameId: "dashboard", link: "/dashboard", icon: "home" },
      { name: "Attendance Dashboard", nameId: "dashboard-attendance", link: "/dashboard-attendance", icon: "fingerprint" },
      { name: "TO Dashboard", nameId: "dashboard-to", link: "/dashboard-to", icon: "briefcase" },
      { name: "DDO Dashboard", nameId: "dashboard-ddo", link: "/dashboard-ddo", icon: "wallet" },
    ],
  },
  {
    title: "Field Tracking",
    color: "var(--cat-cyan)",
    modules: [
      { name: "Vehicle Tracking", nameId: "vehicle-tracking", link: "/vehicle-tracking", icon: "car" },
      { name: "Staff Tracking", nameId: "staff-tracking", link: "/staff-tracking", icon: "userPin" },
      { name: "Visit Plans", nameId: "visit-plans", link: "/visit-plans", icon: "calendar" },
      { name: "New Visit Plan", nameId: "new-visit-plan", link: "/new-visit-plan", icon: "plus" },
    ],
  },
  {
    title: "Projects",
    color: "var(--cat-violet)",
    modules: [
      { name: "Projects", nameId: "projects", link: "/projects", icon: "folder" },
      { name: "User Projects", nameId: "user-projects", link: "/user-projects", icon: "clipboard" },
      { name: "Sectors", nameId: "sectors", link: "/sectors", icon: "sector" },
      { name: "Departments", nameId: "departments", link: "/departments", icon: "building" },
    ],
  },
  {
    title: "Reports & Documents",
    color: "var(--cat-indigo)",
    modules: [
      { name: "Report Analysis", nameId: "report-analysis", link: "/report-analysis", icon: "chart" },
      { name: "File Process Hierarchy", nameId: "process", link: "/process", icon: "tree" },
      { name: "Project Document Names", nameId: "project-document-names", link: "/project-document-names", icon: "files" },
      { name: "Document Categories", nameId: "document-categories", link: "/document-categories", icon: "docCats" },
    ],
  },
  {
    title: "Fleet",
    color: "var(--cat-rose)",
    modules: [
      { name: "Vehicles", nameId: "vehicles", link: "/vehicles", icon: "car" },
      { name: "Drivers", nameId: "drivers", link: "/drivers", icon: "steering" },
    ],
  },
  {
    title: "Administration",
    color: "var(--cat-slate)",
    modules: [
      { name: "Users", nameId: "users", link: "/users", icon: "users" },
      { name: "Roles", nameId: "roles", link: "/roles", icon: "shield" },
      { name: "Rights", nameId: "rights", link: "/rights", icon: "key" },
      { name: "Super Group", nameId: "super-group", link: "/super-group", icon: "layers" },
      { name: "Attribute Groups", nameId: "attribute-groups", link: "/attribute-groups", icon: "sliders" },
      { name: "Attributes", nameId: "attributes", link: "/attributes", icon: "tag" },
    ],
  },
];

const GISMenu = ({ dashboardType }: { dashboardType: string | null | undefined }) => {
  const [show, setShow] = useState(false);
  const [rights, setRights] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<number | "all">("all");
  const [mounted, setMounted] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentParams = searchParams.toString();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setRights(getRights());
  }, [router]);

  // Groups with only the modules this user may open
  const allowed = useMemo(() => {
    const has = new Set(rights.map((r) => r.toLowerCase()));
    return GROUPS.map((g) => ({ ...g, modules: g.modules.filter((m) => has.has(m.nameId)) })).filter(
      (g) => g.modules.length,
    );
  }, [rights]);

  const total = allowed.reduce((n, g) => n + g.modules.length, 0);

  const close = () => setShow(false);
  const open = () => {
    setQuery("");
    setActiveGroup("all");
    setShow(true);
  };

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => searchRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShow(false);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [show]);

  const q = query.trim().toLowerCase();
  let index = 0; // tile order, for the slide-in delay
  const tiles = allowed.flatMap((g, gi) =>
    activeGroup !== "all" && activeGroup !== gi
      ? []
      : g.modules
          .filter((m) => !q || m.name.toLowerCase().includes(q))
          .map((m) => ({ ...m, color: g.color, i: index++ })),
  );

  return (
    <>
      {rights?.length <= 1 ? (
        <span className={navStyles.menuLabel}>
          {dashboardType ? "Evaluation Dashboard" : "Monitoring Dashboard"}
        </span>
      ) : (
        <button type="button" className={navStyles.menuBtn} onClick={open} aria-haspopup="dialog" aria-expanded={show}>
          <Svg name="grid" className={navStyles.icon} />
          <span>All Modules</span>
        </button>
      )}

      {mounted &&
        createPortal(
          <div className={`${styles.layer} ${show ? styles.open : ""}`}>
            <div className={styles.backdrop} onClick={close} />
            <div
              className={styles.panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="allModulesTitle"
              aria-hidden={!show}
            >
              <div className={styles.head}>
                <div>
                  <h2 id="allModulesTitle">All Modules</h2>
                  <p>Choose where you want to go</p>
                </div>
                <label className={styles.search}>
                  <Svg name="search" />
                  <input
                    ref={searchRef}
                    type="search"
                    placeholder="Search modules…"
                    aria-label="Search modules"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <button type="button" className={styles.close} onClick={close} aria-label="Close menu">
                  <Svg name="x" />
                </button>
              </div>

              <div className={styles.legend} role="toolbar" aria-label="Filter modules by group">
                <button
                  type="button"
                  className={activeGroup === "all" ? styles.active : ""}
                  onClick={() => setActiveGroup("all")}
                >
                  <i />
                  All <b>{total}</b>
                </button>
                {allowed.map((g, gi) => (
                  <button
                    key={g.title}
                    type="button"
                    className={activeGroup === gi ? styles.active : ""}
                    style={{ "--gc": g.color } as CSSProperties}
                    onClick={() => setActiveGroup(gi)}
                  >
                    <i />
                    {g.title} <b>{g.modules.length}</b>
                  </button>
                ))}
              </div>

              <div className={styles.grid}>
                {tiles.map((m) => (
                  <Link
                    key={m.nameId}
                    href={`${m.link}${currentParams ? `?${currentParams}` : ""}`}
                    className={`${styles.link} ${pathname === m.link || pathname?.startsWith(`${m.link}/`) ? styles.current : ""}`}
                    style={{ "--gc": m.color, "--i": m.i } as CSSProperties}
                    onClick={close}
                    tabIndex={show ? undefined : -1}
                  >
                    <span className={styles.ico}>
                      <Svg name={m.icon} />
                    </span>
                    <span>{m.name}</span>
                  </Link>
                ))}
                {!tiles.length && <div className={styles.empty}>No module matches “{query}”.</div>}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default GISMenu;
