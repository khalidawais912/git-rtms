"use client";
import Loader from "@/components/Loader/Loader";
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  Home,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  canManageDocumentCategories,
  createDocumentCategory,
  DocumentCategoryApiError,
  deleteDocumentCategory,
  getDocumentCategories,
  renameDocumentCategory,
} from "../services";
import { DocumentCategoryNode } from "../types";
import styles from "./DocumentCategories.module.css";
import AddCategoryModal from "./AddCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import InlineNameForm from "./InlineNameForm";

const plural = (n: number, one: string, many = `${one}s`) =>
  `${n} ${n === 1 ? one : many}`;

const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : "Something went wrong.";

const deleteBlockedReason = (node: DocumentCategoryNode) =>
  `Used on ${plural(node.usedOnPcivCount, "PC-IV")}. Rename instead.`;

/**
 * Super Admin screen for the document category tree
 * (main category → sub-category → document), on /api/document-category.
 */
const DocumentCategories = () => {
  const router = useRouter();
  const [tree, setTree] = useState<DocumentCategoryNode[]>();
  const [canManage, setCanManage] = useState<boolean>();
  const [loadError, setLoadError] = useState("");
  const [categoryId, setCategoryId] = useState<number>();
  const [subId, setSubId] = useState<number>();
  const [search, setSearch] = useState("");
  /** Which "Add" pop-up is open. */
  const [adding, setAdding] = useState<"main" | "sub" | "document" | null>(null);
  /** The row whose delete pop-up is open. */
  const [deleting, setDeleting] = useState<{
    node: DocumentCategoryNode;
    message: string;
    done: string;
  } | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  /** 401 → login, 403 → back; returns true when the error was handled that way. */
  const leaveOnAuthError = useCallback(
    (err: unknown) => {
      if (!(err instanceof DocumentCategoryApiError)) return false;
      if (err.code === 401) {
        router.push("/login");
        return true;
      }
      if (err.code === 403) {
        toast.error(err.message);
        router.back();
        return true;
      }
      return false;
    },
    [router],
  );

  /** The server's tree is the only source; never patched by hand. */
  const reload = useCallback(async () => {
    const data = await getDocumentCategories();
    setTree(data);
    return data;
  }, []);

  useEffect(() => {
    const open = async () => {
      try {
        const allowed = await canManageDocumentCategories();
        setCanManage(allowed);
        if (allowed) await reload();
      } catch (err) {
        if (!leaveOnAuthError(err)) setLoadError(errorMessage(err));
      }
    };
    open();
  }, [reload, leaveOnAuthError]);

  const categories = useMemo(() => tree ?? [], [tree]);
  const category = categories.find((c) => c.id === categoryId) ?? categories[0];
  const sub = category?.children.find((s) => s.id === subId) ?? category?.children[0];

  const visibleCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    return term
      ? categories.filter((c) => c.docCategoryName.toLowerCase().includes(term))
      : categories;
  }, [categories, search]);

  /**
   * Runs a change, then refetches the tree (selection is kept by id).
   * Re-throws so the form keeps open and shows the message under the input.
   */
  const change = async <T,>(action: () => Promise<T>, done: string) => {
    try {
      const result = await action();
      await reload();
      setEditingId(null);
      toast.success(done);
      return result;
    } catch (err) {
      if (leaveOnAuthError(err)) return undefined;
      // 404: someone else changed the tree; show the current one
      if (err instanceof DocumentCategoryApiError && err.code === 404) await reload();
      throw err;
    }
  };

  /** Opens the delete pop-up; the text says what goes with it and where staff stop seeing it. */
  const remove = (node: DocumentCategoryNode, childWord: string, done: string) => {
    const children = node.childCount
      ? `Its ${plural(node.childCount, childWord, childWord === "sub-category" ? "sub-categories" : undefined)} will be removed too. `
      : "";
    const where =
      node.level === 1
        ? "in the app’s “Document type” list"
        : node.level === 2
          ? `under “${category?.docCategoryName ?? ""}”`
          : `under “${category?.docCategoryName ?? ""} › ${sub?.docCategoryName ?? ""}”`;
    setDeleting({ node, done, message: `${children}Staff will no longer see it ${where}.` });
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await change(() => deleteDocumentCategory(deleting.node.id), deleting.done);
      setDeleting(null);
    } catch (err) {
      // 409: it was used on a PC-IV after the screen loaded; show the current tree
      await reload().catch(() => undefined);
      throw err;
    }
  };

  if (loadError) {
    return (
      <div className={styles.page}>
        <p className={styles.notice}>{loadError}</p>
      </div>
    );
  }
  if (canManage === undefined || (canManage && !tree)) return <Loader />;
  if (!canManage) {
    return (
      <div className={styles.page}>
        <p className={styles.notice}>Only the Super Admin can manage document categories.</p>
      </div>
    );
  }

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
          <span>Reports &amp; Documents</span>
          <ChevronRight size={16} />
          <span className={styles.breadcrumbCurrent}>Document Categories</span>
        </nav>
      </div>

      <div className={styles.titleRow}>
        <div className={styles.titleBlock}>
          <div className={styles.titleIcon}>
            <FolderOpen size={30} />
          </div>
          <div>
            <h1 className={styles.title}>Document Categories</h1>
            <p className={styles.subtitle}>
              Set up the document lists that field staff choose from when they upload documents in the
              mobile app.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.steps}>
        {[
          ["Add a main category", "For example “ECM Document”"],
          ["Add its sub-categories", "For example “PC Doc”, “Letters”"],
          ["Map documents to each sub-category", "For example “PC-I”, “PC-II”. Staff tick these in the app"],
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
        {/* ---------- Step 1: main categories ---------- */}
        <section className={styles.panel}>
          <header className={styles.panelHeader}>
            <span className={styles.panelIcon}>
              <FolderOpen size={20} />
            </span>
            <div className={styles.panelHeading}>
              <p className={styles.eyebrow}>Step 1</p>
              <h2 className={styles.panelTitle}>Main categories</h2>
              <div className={styles.chips}>
                <span className={styles.countPill}>
                  {plural(categories.length, "category", "categories")}
                </span>
              </div>
            </div>
          </header>
          <div className={styles.panelBody}>
            <button type="button" className={styles.primaryButton} onClick={() => setAdding("main")}>
              <span className={styles.plusCircle}>
                <Plus size={18} />
              </span>
              Add main category
            </button>
            <label className={styles.searchBox}>
              <Search size={18} />
              <input
                placeholder="Find a main category"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
          </div>
          <div className={styles.list}>
            {visibleCategories.length === 0 && (
              <p className={styles.empty}>{search ? "No main category matches." : "No main categories yet."}</p>
            )}
            {visibleCategories.map((c) => (
              <div
                key={c.id}
                className={`${styles.row} ${c.id === category?.id ? styles.rowActive : ""}`}
                onClick={() => {
                  setCategoryId(c.id);
                  setSubId(undefined);
                }}
              >
                <span className={styles.rowIcon}>
                  <FolderOpen size={18} />
                </span>
                {editingId === c.id ? (
                  <div className={styles.rowText}>
                    <InlineNameForm
                      initialValue={c.docCategoryName}
                      placeholder="Main category name"
                      submitLabel="Save"
                      onCancel={() => setEditingId(null)}
                      onSubmit={async (name) => {
                        await change(() => renameDocumentCategory(c.id, name), "Renamed");
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <div className={styles.rowText}>
                      <p className={styles.rowName}>{c.docCategoryName}</p>
                      <p className={styles.rowMeta}>
                        {plural(c.childCount, "sub-category", "sub-categories")}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label={`Rename ${c.docCategoryName}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(c.id);
                      }}
                    >
                      <Pencil size={17} />
                    </button>
                    <button
                      type="button"
                      className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                      aria-label={`Delete ${c.docCategoryName}`}
                      title={c.canDelete ? undefined : deleteBlockedReason(c)}
                      disabled={!c.canDelete}
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(c, "sub-category", "Main category deleted");
                      }}
                    >
                      <Trash2 size={17} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Step 2: sub-categories ---------- */}
        <section className={`${styles.panel} ${styles.panelSub}`}>
          <header className={styles.panelHeader}>
            <span className={styles.panelIcon}>
              <Folder size={20} />
            </span>
            <div className={styles.panelHeading}>
              <p className={styles.eyebrow}>Step 2</p>
              <h2 className={styles.panelTitle}>Sub-categories</h2>
              <div className={styles.chips}>
                {category && (
                  <span className={styles.pathChip}>
                    <FolderOpen size={13} /> {category.docCategoryName}
                  </span>
                )}
                <span className={styles.countPill}>
                  {plural(category?.childCount ?? 0, "sub-category", "sub-categories")}
                </span>
              </div>
            </div>
          </header>
          {!category ? (
            <p className={styles.empty}>Add a main category first.</p>
          ) : (
            <>
              {category.canAddChild && (
                <div className={styles.panelBody}>
                  <button type="button" className={styles.dashedButton} onClick={() => setAdding("sub")}>
                    <span className={styles.plusCircle}>
                      <Plus size={18} />
                    </span>
                    Add sub-category
                  </button>
                </div>
              )}
              <div className={styles.list}>
                {category.children.length === 0 && (
                  <p className={styles.empty}>No sub-categories under {category.docCategoryName} yet.</p>
                )}
                {category.children.map((s) => (
                  <div
                    key={s.id}
                    className={`${styles.row} ${s.id === sub?.id ? styles.rowActive : ""}`}
                    onClick={() => setSubId(s.id)}
                  >
                    <span className={styles.rowIcon}>
                      <Folder size={18} />
                    </span>
                    {editingId === s.id ? (
                      <div className={styles.rowText}>
                        <InlineNameForm
                          initialValue={s.docCategoryName}
                          placeholder="Sub-category name"
                          submitLabel="Save"
                          onCancel={() => setEditingId(null)}
                          onSubmit={async (name) => {
                            await change(() => renameDocumentCategory(s.id, name), "Renamed");
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <div className={styles.rowText}>
                          <p className={styles.rowName}>{s.docCategoryName}</p>
                          <p className={styles.rowMeta}>{plural(s.childCount, "document")}</p>
                        </div>
                        <button
                          type="button"
                          className={styles.iconButton}
                          aria-label={`Rename ${s.docCategoryName}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(s.id);
                          }}
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                          aria-label={`Delete ${s.docCategoryName}`}
                          title={s.canDelete ? undefined : deleteBlockedReason(s)}
                          disabled={!s.canDelete}
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(s, "document", "Sub-category deleted");
                          }}
                        >
                          <Trash2 size={17} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        {/* ---------- Step 3: documents ---------- */}
        <section className={`${styles.panel} ${styles.panelDocs}`}>
          <header className={styles.panelHeader}>
            <span className={styles.panelIcon}>
              <FileText size={20} />
            </span>
            <div className={styles.panelHeading}>
              <p className={styles.eyebrow}>Step 3</p>
              <h2 className={styles.panelTitle}>Documents</h2>
              <div className={styles.chips}>
                {category && sub && (
                  <span className={styles.pathChip}>
                    <Folder size={13} /> {category.docCategoryName} › {sub.docCategoryName}
                  </span>
                )}
                <span className={styles.countPill}>{plural(sub?.childCount ?? 0, "document")}</span>
              </div>
            </div>
          </header>
          {!category || !sub ? (
            <p className={styles.empty}>Add a sub-category first.</p>
          ) : (
            <>
              <div className={styles.panelBody}>
                {sub.canAddChild ? (
                  <button type="button" className={styles.primaryButton} onClick={() => setAdding("document")}>
                    <span className={styles.plusCircle}>
                      <Plus size={18} />
                    </span>
                    Add document
                  </button>
                ) : (
                  <p className={styles.fieldLabel}>
                    Documents can no longer be added to “{sub.docCategoryName}”: it is already used on a PC-IV.
                  </p>
                )}
                <p className={styles.hint}>
                  Staff tick these in the app under {category.docCategoryName} › {sub.docCategoryName}.
                </p>
              </div>
              <div className={styles.list}>
                {sub.children.length === 0 && <p className={styles.empty}>No documents yet.</p>}
                {sub.children.map((d, i) => (
                  <div key={d.id} className={styles.docRow}>
                    <span className={styles.docNumber}>{i + 1}</span>
                    {editingId === d.id ? (
                      <div className={styles.rowText}>
                        <InlineNameForm
                          initialValue={d.docCategoryName}
                          placeholder="Document name"
                          submitLabel="Save"
                          onCancel={() => setEditingId(null)}
                          onSubmit={async (name) => {
                            await change(() => renameDocumentCategory(d.id, name), "Renamed");
                          }}
                        />
                      </div>
                    ) : (
                      <>
                        <p className={styles.docName}>{d.docCategoryName}</p>
                        <button
                          type="button"
                          className={styles.iconButton}
                          aria-label={`Rename ${d.docCategoryName}`}
                          onClick={() => setEditingId(d.id)}
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          type="button"
                          className={`${styles.iconButton} ${styles.iconButtonDanger}`}
                          aria-label={`Delete ${d.docCategoryName}`}
                          title={d.canDelete ? undefined : deleteBlockedReason(d)}
                          disabled={!d.canDelete}
                          onClick={() => remove(d, "document", "Document removed")}
                        >
                          <Trash2 size={17} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      {deleting && (
        <DeleteCategoryModal
          name={deleting.node.docCategoryName}
          message={deleting.message}
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}

      {adding === "main" && (
        <AddCategoryModal
          title="Add main category"
          label="Main category name"
          placeholder="For example: ECM Document"
          hint="Staff see this name in the app’s “Document type” list."
          onClose={() => setAdding(null)}
          onSave={async (name) => {
            const created = await change(
              () => createDocumentCategory(name, null),
              "Main category added",
            );
            if (!created) return;
            setAdding(null);
            setCategoryId(created.id);
            setSubId(undefined);
          }}
        />
      )}

      {adding === "sub" && category && (
        <AddCategoryModal
          title="Add sub-category"
          label="Sub-category name"
          placeholder="For example: Letters"
          hint={`It is added under “${category.docCategoryName}”.`}
          onClose={() => setAdding(null)}
          onSave={async (name) => {
            const created = await change(
              () => createDocumentCategory(name, category.id),
              "Sub-category added",
            );
            if (!created) return;
            setAdding(null);
            setSubId(created.id);
          }}
        />
      )}

      {adding === "document" && category && sub && (
        <AddCategoryModal
          title="Add document"
          label="Document name"
          placeholder="For example: Letter 1"
          hint={`Staff tick this in the app under ${category.docCategoryName} › ${sub.docCategoryName}.`}
          onClose={() => setAdding(null)}
          allowAddMore
          onSave={async (name, addMore) => {
            const created = await change(
              () => createDocumentCategory(name, sub.id),
              `“${name.trim()}” added`,
            );
            if (created && !addMore) setAdding(null);
          }}
        />
      )}
    </div>
  );
};

export default DocumentCategories;
