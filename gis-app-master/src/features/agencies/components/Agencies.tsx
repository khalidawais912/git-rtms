"use client";
import Loader from "@/components/Loader/Loader";
import { ArrowLeft, Building2, ChevronRight, Home, Landmark, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  AgencyApiError,
  canManageAgencies,
  createAgency,
  deleteAgency,
  getAgencyTree,
  renameAgency,
} from "../api";
import { AgencyNode } from "../types";
import AddAgencyModal from "./AddAgencyModal";
import styles from "./Agencies.module.css";
import DeleteAgencyModal from "./DeleteAgencyModal";
import RenameAgencyForm from "./RenameAgencyForm";

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

const errorMessage = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong.");

/**
 * Setup screen for agencies (top-level agency → agencies under it), on /api/agencies.
 * Everyone can see the list; Add, Rename and Delete show only when /can-manage says so.
 */
const Agencies = () => {
  const router = useRouter();
  const [tree, setTree] = useState<AgencyNode[]>();
  const [canManage, setCanManage] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [mainId, setMainId] = useState<number>();
  const [search, setSearch] = useState("");
  /** Which "Add" pop-up is open. */
  const [adding, setAdding] = useState<"main" | "child" | null>(null);
  /** The agency whose delete pop-up is open. */
  const [deleting, setDeleting] = useState<AgencyNode | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  /** 401 → login, 403 → toast; returns true when the error was handled that way. */
  const leaveOnAuthError = useCallback(
    (err: unknown) => {
      if (!(err instanceof AgencyApiError)) return false;
      if (err.code === 401) {
        router.push("/login");
        return true;
      }
      if (err.code === 403) {
        // The user lost the owner role while the screen was open: back to read-only
        toast.error(err.message);
        setCanManage(false);
        setAdding(null);
        setDeleting(null);
        setEditingId(null);
        return true;
      }
      return false;
    },
    [router],
  );

  /** The server's tree is the only source; never patched by hand. */
  const reload = useCallback(async () => {
    const data = await getAgencyTree();
    setTree(data);
    return data;
  }, []);

  useEffect(() => {
    const open = async () => {
      try {
        const [allowed] = await Promise.all([canManageAgencies(), reload()]);
        setCanManage(allowed);
      } catch (err) {
        if (!leaveOnAuthError(err)) setLoadError(errorMessage(err));
      }
    };
    open();
  }, [reload, leaveOnAuthError]);

  const mains = useMemo(() => tree ?? [], [tree]);
  const main = mains.find((a) => a.id === mainId) ?? mains[0];
  const children = main?.children ?? [];

  const visibleMains = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return mains;
    // A top-level agency shows when its own name or a child's name matches
    return mains.filter(
      (a) =>
        a.agencyName.toLowerCase().includes(term) ||
        (a.children ?? []).some((c) => c.agencyName.toLowerCase().includes(term)),
    );
  }, [mains, search]);

  /**
   * Runs a change, then refetches the tree (selection is kept by id).
   * Re-throws so the form or pop-up stays open and shows the server's message.
   */
  const change = async <T,>(action: () => Promise<T>, done: (result: T) => string) => {
    try {
      const result = await action();
      await reload();
      setEditingId(null);
      toast.success(done(result));
      return result;
    } catch (err) {
      if (leaveOnAuthError(err)) return undefined;
      // 404: someone else changed the tree; show the current one
      if (err instanceof AgencyApiError && err.code === 404) await reload().catch(() => undefined);
      throw err;
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const removed = await change(
      () => deleteAgency(deleting.id),
      (childrenRemoved) =>
        childrenRemoved
          ? `“${deleting.agencyName}” and ${plural(childrenRemoved, "agency", "agencies")} under it deleted`
          : `“${deleting.agencyName}” deleted`,
    );
    if (removed !== undefined) setDeleting(null);
  };

  const deleteMessage = (node: AgencyNode) =>
    `${node.childCount ? `${plural(node.childCount, "agency", "agencies")} under it will be deleted too. ` : ""}` +
    "If it or an agency under it is selected on a PC-IV, nothing is deleted.";

  const renderRow = (node: AgencyNode, selectable: boolean) => (
    <div
      key={node.id}
      className={`${styles.row} ${selectable && node.id === main?.id ? styles.rowActive : ""}`}
      onClick={selectable ? () => setMainId(node.id) : undefined}
    >
      <span className={styles.rowIcon}>
        {node.level === 1 ? <Landmark size={18} /> : <Building2 size={18} />}
      </span>
      {editingId === node.id ? (
        <div className={styles.rowText}>
          <RenameAgencyForm
            initialValue={node.agencyName}
            onCancel={() => setEditingId(null)}
            onSubmit={async (name) => {
              await change(
                () => renameAgency(node.id, name),
                () => "Renamed",
              );
            }}
          />
        </div>
      ) : (
        <>
          <div className={styles.rowText}>
            <p className={styles.rowName}>{node.agencyName}</p>
            {node.level === 1 && (
              <p className={styles.rowMeta}>{plural(node.childCount, "agency", "agencies")} under it</p>
            )}
          </div>
          {canManage && (
            <>
              <button
                type="button"
                className={styles.iconButton}
                aria-label={`Rename ${node.agencyName}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(node.id);
                }}
              >
                <Pencil size={17} />
              </button>
              <button
                type="button"
                className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                aria-label={`Delete ${node.agencyName}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleting(node);
                }}
              >
                <Trash2 size={17} />
              </button>
            </>
          )}
        </>
      )}
    </div>
  );

  if (loadError) {
    return (
      <div className={styles.page}>
        <p className={styles.notice}>{loadError}</p>
      </div>
    );
  }
  if (!tree) return <Loader />;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button type="button" className={styles.backButton} onClick={() => router.push("/dashboard")}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/dashboard">
            <Home size={16} /> All Modules
          </Link>
          <ChevronRight size={16} />
          <span>Administration</span>
          <ChevronRight size={16} />
          <span className={styles.breadcrumbCurrent}>Agencies</span>
        </nav>
      </div>

      <div className={styles.titleRow}>
        <div className={styles.titleBlock}>
          <div className={styles.titleIcon}>
            <Landmark size={30} />
          </div>
          <div>
            <h1 className={styles.title}>Agencies</h1>
            <p className={styles.subtitle}>
              The sponsoring and executing agencies that can be picked on a PC-IV. A renamed agency shows
              its new name on every PC-IV.
            </p>
          </div>
        </div>
      </div>

      {!canManage && (
        <p className={styles.notice}>You can view agencies. Only an owner can add, rename or delete them.</p>
      )}

      <div className={styles.steps}>
        {[
          ["Add a top-level agency", "For example “Finance Department”"],
          ["Add agencies under it", "For example “Budget Wing”. There is no third level"],
        ].map(([title, hint], i) => (
          <div key={title} className={styles.step}>
            <div className={styles.stepTrack}>
              <span className={styles.stepNumber}>{i + 1}</span>
              <span className={styles.stepLine} />
            </div>
            <p className={styles.stepTitle}>{title}</p>
            <p className={styles.stepHint}>{hint}</p>
          </div>
        ))}
      </div>

      <div className={styles.columns}>
        {/* ---------- Step 1: top-level agencies ---------- */}
        <section className={styles.panel}>
          <header className={styles.panelHeader}>
            <span className={styles.panelIcon}>
              <Landmark size={20} />
            </span>
            <div className={styles.panelHeading}>
              <p className={styles.eyebrow}>Step 1</p>
              <h2 className={styles.panelTitle}>Top-level agencies</h2>
              <div className={styles.chips}>
                <span className={styles.countPill}>{plural(mains.length, "agency", "agencies")}</span>
              </div>
            </div>
          </header>
          <div className={styles.panelBody}>
            {canManage && (
              <button type="button" className={styles.primaryButton} onClick={() => setAdding("main")}>
                <span className={styles.plusCircle}>
                  <Plus size={18} />
                </span>
                Add top-level agency
              </button>
            )}
            <label className={styles.searchBox}>
              <Search size={18} />
              <input
                placeholder="Find an agency"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
          <div className={styles.list}>
            {visibleMains.length === 0 && (
              <p className={styles.empty}>{search ? "No agency matches." : "No agencies yet."}</p>
            )}
            {visibleMains.map((a) => renderRow(a, true))}
          </div>
        </section>

        {/* ---------- Step 2: agencies under the selected one ---------- */}
        <section className={`${styles.panel} ${styles.panelSub}`}>
          <header className={styles.panelHeader}>
            <span className={styles.panelIcon}>
              <Building2 size={20} />
            </span>
            <div className={styles.panelHeading}>
              <p className={styles.eyebrow}>Step 2</p>
              <h2 className={styles.panelTitle}>Agencies under it</h2>
              <div className={styles.chips}>
                {main && (
                  <span className={styles.pathChip}>
                    <Landmark size={13} /> {main.agencyName}
                  </span>
                )}
                <span className={styles.countPill}>{plural(children.length, "agency", "agencies")}</span>
              </div>
            </div>
          </header>
          {!main ? (
            <p className={styles.empty}>Add a top-level agency first.</p>
          ) : (
            <>
              {canManage && main.canAddChild && (
                <div className={styles.panelBody}>
                  <button type="button" className={styles.dashedButton} onClick={() => setAdding("child")}>
                    <span className={styles.plusCircle}>
                      <Plus size={18} />
                    </span>
                    Add agency under {main.agencyName}
                  </button>
                </div>
              )}
              <div className={styles.list}>
                {children.length === 0 && (
                  <p className={styles.empty}>No agencies under {main.agencyName} yet.</p>
                )}
                {children.map((c) => renderRow(c, false))}
              </div>
            </>
          )}
        </section>
      </div>

      {deleting && (
        <DeleteAgencyModal
          name={deleting.agencyName}
          message={deleteMessage(deleting)}
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}

      {adding === "main" && (
        <AddAgencyModal
          title="Add top-level agency"
          placeholder="For example: Finance Department"
          hint="It can be picked on a PC-IV, and agencies can be added under it."
          onClose={() => setAdding(null)}
          onSave={async (name) => {
            const created = await change(
              () => createAgency(name, null),
              () => "Agency added",
            );
            if (!created) return;
            setAdding(null);
            setMainId(created.id);
          }}
        />
      )}

      {adding === "child" && main && (
        <AddAgencyModal
          title={`Add agency under ${main.agencyName}`}
          placeholder="For example: Budget Wing"
          hint={`It is added under “${main.agencyName}” and can be picked on a PC-IV.`}
          onClose={() => setAdding(null)}
          onSave={async (name) => {
            const created = await change(
              () => createAgency(name, main.id),
              () => "Agency added",
            );
            if (created) setAdding(null);
          }}
        />
      )}
    </div>
  );
};

export default Agencies;
