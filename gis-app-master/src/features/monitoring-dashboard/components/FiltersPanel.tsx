"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Filter, FilterData } from "../types";
import Icon from "./Icon";
import styles from "./MonitoringDashboard.module.css";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Fields from the filter settings API (District, Year, …) */
  fields?: Filter[];
  applied: FilterData[];
  onApply: (filters: FilterData[]) => void;
  onReset: () => void;
}

/** Side panel with the user's filter fields; nothing is sent until "Show results" */
const FiltersPanel = ({ open, onClose, fields, applied, onApply, onReset }: Props) => {
  const [draft, setDraft] = useState<FilterData[]>(applied);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Start from the applied filters every time the panel opens
  useEffect(() => {
    if (open) setDraft(applied);
  }, [open, applied]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const valueOf = (id: string) => draft.find((f) => f.filterIdentifier === id)?.filterValues ?? "";

  const setValue = (id: string, value: string) =>
    setDraft((prev) => {
      const rest = prev.filter((f) => f.filterIdentifier !== id);
      return value ? [...rest, { filterIdentifier: id, filterValues: value }] : rest;
    });

  if (!mounted) return null;

  // Portal: the panel must sit above the app's top bar
  return createPortal(
    <div className={styles.root} style={{ padding: 0, background: "none" }}>
      <div className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`} onClick={onClose} />
      <aside
        className={`${styles.filterPanel} ${open ? styles.filterOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashFilterTitle"
        aria-hidden={!open}
      >
        <div className={styles.panelHead}>
          <span className={styles.cardIco}>
            <Icon name="filter" />
          </span>
          <div>
            <h2 id="dashFilterTitle">Filters</h2>
            <p>Narrow down what the dashboard shows</p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close filters">
            <Icon name="x" />
          </button>
        </div>

        <form className={styles.filterBody} onSubmit={(e) => e.preventDefault()}>
          {!fields && <div className={styles.fEmpty}>Loading filters…</div>}
          {fields?.length === 0 && <div className={styles.fEmpty}>No filters are set up for your account.</div>}
          {fields?.map((field) => {
            const id = `dash-filter-${field.filterIdentifier}`;
            return (
              <div key={field.filterIdentifier} className={styles.fGroup}>
                <label className={styles.fLabel} htmlFor={id}>
                  {field.label}
                </label>
                <select
                  id={id}
                  className={styles.fSelect}
                  value={valueOf(field.filterIdentifier)}
                  onChange={(e) => setValue(field.filterIdentifier, e.target.value)}
                >
                  <option value="">All</option>
                  {field.filterValues.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </form>

        <div className={styles.filterFoot}>
          <button
            type="button"
            className={styles.btn}
            onClick={() => {
              onReset();
              onClose();
            }}
          >
            Reset all
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            <Icon name="check" />
            Show results
          </button>
        </div>
      </aside>
    </div>,
    document.body,
  );
};

export default FiltersPanel;
