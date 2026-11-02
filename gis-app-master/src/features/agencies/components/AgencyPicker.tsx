"use client";
import { Building2, ChevronDown, Landmark, Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { getAgencyTree } from "../api";
import { AgencyItem, AgencyNode } from "../types";
import { flattenAgencies } from "../utils";
import styles from "./AgencyPicker.module.css";

interface Props {
  label: string;
  /** Selected agency ids: send as `sponsoringAgencyIds` / `executingAgencyIds`. */
  value: number[];
  onChange: (ids: number[]) => void;
  /**
   * Agencies already on the PC-IV (`sponsoringAgency` / `executingAgency` from the GET).
   * Names for the chips while the tree loads, or for an agency deleted since.
   */
  selected?: AgencyItem[];
  /** Pass the tree when several pickers share one load; otherwise the picker loads it. */
  tree?: AgencyNode[];
  disabled?: boolean;
  placeholder?: string;
}

/**
 * Picks any number of agencies for one side of a PC-IV (sponsoring or executing).
 * Top-level agencies and the agencies under them can both be picked.
 */
const AgencyPicker = ({
  label,
  value,
  onChange,
  selected = [],
  tree: givenTree,
  disabled = false,
  placeholder = "Choose agencies",
}: Props) => {
  const [loadedTree, setLoadedTree] = useState<AgencyNode[]>();
  const [loadError, setLoadError] = useState("");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const tree = givenTree ?? loadedTree;

  useEffect(() => {
    if (givenTree) return;
    let cancelled = false;
    getAgencyTree()
      .then((data) => !cancelled && setLoadedTree(data))
      .catch((err) => !cancelled && setLoadError(err instanceof Error ? err.message : "Could not load agencies."));
    return () => {
      cancelled = true;
    };
  }, [givenTree]);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  /** Name for every id: the live tree first, then what the PC-IV GET sent. */
  const names = useMemo(() => {
    const map = new Map<number, string>(selected.map((a) => [a.agencyId, a.agencyName]));
    flattenAgencies(tree ?? []).forEach((a) => map.set(a.id, a.agencyName));
    return map;
  }, [tree, selected]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return tree ?? [];
    // A top-level agency stays with all its children when it matches, else with the matching children
    return (tree ?? []).flatMap((main): AgencyNode[] => {
      if (main.agencyName.toLowerCase().includes(term)) return [main];
      const children = (main.children ?? []).filter((c) => c.agencyName.toLowerCase().includes(term));
      return children.length ? [{ ...main, children }] : [];
    });
  }, [tree, search]);

  const toggle = (id: number) =>
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);

  const option = (node: AgencyNode) => (
    <label key={node.id} className={`${styles.option} ${node.level === 2 ? styles.child : ""}`}>
      <input type="checkbox" checked={value.includes(node.id)} onChange={() => toggle(node.id)} />
      {node.level === 1 ? <Landmark size={15} /> : <Building2 size={15} />}
      <span>{node.agencyName}</span>
    </label>
  );

  return (
    <div className={styles.picker} ref={boxRef}>
      <span className={styles.label}>{label}</span>
      <div
        className={`${styles.control} ${disabled ? styles.disabled : ""}`}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <div className={styles.chips}>
          {value.length === 0 && <span className={styles.placeholder}>{placeholder}</span>}
          {value.map((id) => (
            <span key={id} className={styles.chip}>
              {names.get(id) ?? `Agency ${id}`}
              {!disabled && (
                <button
                  type="button"
                  aria-label={`Remove ${names.get(id) ?? "agency"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(id);
                  }}
                >
                  <X size={13} />
                </button>
              )}
            </span>
          ))}
        </div>
        <ChevronDown size={18} className={styles.caret} />
      </div>

      {open && (
        <div className={styles.menu} id={listId}>
          <label className={styles.search}>
            <Search size={15} />
            <input autoFocus placeholder="Find an agency" value={search} onChange={(e) => setSearch(e.target.value)} />
          </label>
          <div className={styles.options}>
            {loadError && <p className={styles.empty}>{loadError}</p>}
            {!loadError && !tree && <p className={styles.empty}>Loading agencies…</p>}
            {tree && visible.length === 0 && (
              <p className={styles.empty}>{search ? "No agency matches." : "No agencies yet."}</p>
            )}
            {visible.map((main) => (
              <div key={main.id}>
                {option(main)}
                {(main.children ?? []).map(option)}
              </div>
            ))}
          </div>
          {value.length > 0 && (
            <button type="button" className={styles.clear} onClick={() => onChange([])}>
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AgencyPicker;
