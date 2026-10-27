"use client";
import { Filter, FilterData } from "../types";
import Icon from "./Icon";
import styles from "./MonitoringDashboard.module.css";

interface Props {
  applied: FilterData[];
  fields?: Filter[];
  onChange: (filters: FilterData[]) => void;
  onClear: () => void;
}

/** Chips for the filters in use; each can be removed on its own */
const ActiveFilters = ({ applied, fields, onChange, onClear }: Props) => {
  if (!applied.length) return null;
  const labelOf = (id: string) => fields?.find((f) => f.filterIdentifier === id)?.label ?? id;

  return (
    <div className={styles.activeFilters} aria-label="Filters in use">
      {applied.map((f) => (
        <span key={f.filterIdentifier} className={styles.afChip}>
          {labelOf(f.filterIdentifier)}: <b>{f.filterValues}</b>
          <button
            type="button"
            aria-label={`Remove ${labelOf(f.filterIdentifier)} filter`}
            onClick={() => onChange(applied.filter((x) => x.filterIdentifier !== f.filterIdentifier))}
          >
            <Icon name="x" />
          </button>
        </span>
      ))}
      <button type="button" className={styles.afClear} onClick={onClear}>
        Clear all
      </button>
    </div>
  );
};

export default ActiveFilters;
