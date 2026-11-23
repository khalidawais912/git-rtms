"use client";
import { REQUIRED_FOR_TYPES, RequiredForCode } from "../requiredFor";
import styles from "./DocumentCategories.module.css";

interface Props {
  /** The ticked proformas; [] = optional. */
  value: RequiredForCode[];
  onChange: (codes: RequiredForCode[]) => void;
  /** Ticked "Required document"; kept by the caller so an untick remembers the proformas. */
  required: boolean;
  onRequiredChange: (required: boolean) => void;
  disabled?: boolean;
}

const ALL = REQUIRED_FOR_TYPES.map((t) => t.code);

/**
 * "Required document" and, when ticked, "Required for": All, or one or more of PC-IV, PC-V and Monitoring.
 * All is the same as ticking the three.
 */
const RequiredForFields = ({ value, onChange, required, onRequiredChange, disabled }: Props) => {
  const allOn = ALL.every((c) => value.includes(c));

  const box = (key: string, label: string, on: boolean, toggle: () => void, extra = "", note?: string) => (
    <label key={key} className={`${styles.reqOption} ${extra} ${on ? styles.reqOn : ""}`}>
      <input type="checkbox" className={styles.check} checked={on} disabled={disabled} onChange={toggle} />
      <span className={styles.reqName}>{label}</span>
      {note && <small>{note}</small>}
    </label>
  );

  return (
    <div className={styles.reqBox}>
      <label className={styles.reqToggle}>
        <input
          type="checkbox"
          className={styles.check}
          checked={required}
          disabled={disabled}
          onChange={() => {
            // Every proforma by default, as most documents are needed everywhere
            if (!required && !value.length) onChange(ALL);
            onRequiredChange(!required);
          }}
        />
        <span>
          <b>Required document</b>
          <small>Staff must upload it. Leave unticked if it is optional.</small>
        </span>
      </label>

      {required && (
        <fieldset className={styles.reqFor}>
          <legend>
            Required for <span className={styles.star}>*</span>
          </legend>
          <p>Where must staff upload this document?</p>
          {box("all", "All", allOn, () => onChange(allOn ? [] : ALL), styles.reqAll, "PC-IV, PC-V and Monitoring")}
          <p className={styles.reqOr}>or choose one or more</p>
          <div className={styles.reqGrid}>
            {REQUIRED_FOR_TYPES.map((t) =>
              box(t.code, t.name, value.includes(t.code), () =>
                onChange(value.includes(t.code) ? value.filter((c) => c !== t.code) : [...value, t.code]),
              ),
            )}
          </div>
        </fieldset>
      )}
    </div>
  );
};

export default RequiredForFields;
