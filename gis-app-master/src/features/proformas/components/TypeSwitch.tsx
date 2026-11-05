"use client";
import { PROFORMA_ADAPTERS, PROFORMA_TYPES, ProformaType } from "../adapters";
import styles from "./TypeSwitch.module.css";

interface Props {
  value: ProformaType;
  onChange: (type: ProformaType) => void;
  /** Total of each type; undefined while it loads. */
  counts: Partial<Record<ProformaType, number>>;
}

/** "Choose proforma type": PC-IV or PC-V, the chosen one marked "Showing" (RTMES design). */
const TypeSwitch = ({ value, onChange, counts }: Props) => (
  <div className={styles.wrap}>
    <p className={styles.question} id="proforma-type-question">
      <b>Choose proforma type</b>The list below shows only the type you choose.
    </p>
    <div className={styles.seg} role="radiogroup" aria-labelledby="proforma-type-question">
      {PROFORMA_TYPES.map((t) => {
        const a = PROFORMA_ADAPTERS[t];
        const active = t === value;
        const n = counts[t];
        return (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={active}
            data-type={t}
            className={`${styles.opt} ${active ? styles.active : ""}`}
            onClick={() => !active && onChange(t)}
          >
            <span className={styles.radio} aria-hidden="true" />
            <span className={styles.text}>
              <b>
                {a.label}
                <span className={styles.on}>Showing</span>
              </b>
              <small>
                {a.description}
                <span className={styles.off}> · Click to view</span>
              </small>
            </span>
            <span className={styles.num}>
              Total <b>{n === undefined ? "…" : n}</b> {n === 1 ? "proforma" : "proformas"}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

export default TypeSwitch;
