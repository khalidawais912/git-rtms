"use client";
import { FormEvent, useState } from "react";
import { AGENCY_NAME_MAX } from "../constants";
import styles from "./Agencies.module.css";

interface Props {
  initialValue: string;
  /** Throw to keep the form open and show the message (e.g. 409 duplicate name). */
  onSubmit: (name: string) => Promise<void>;
  onCancel: () => void;
}

/** Rename in place: one text field, Save and Cancel. */
const RenameAgencyForm = ({ initialValue, onSubmit, onCancel }: Props) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      setError("Please type a name.");
      return;
    }
    setBusy(true);
    try {
      await onSubmit(value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} onClick={(e) => e.stopPropagation()}>
      <div className={styles.inlineForm}>
        <input
          autoFocus
          className={styles.textInput}
          value={value}
          placeholder="Agency name"
          aria-label="Agency name"
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Escape" && onCancel()}
          maxLength={AGENCY_NAME_MAX}
        />
        <button type="submit" className={styles.addButton} disabled={busy}>
          Save
        </button>
        <button type="button" className={styles.ghostButton} onClick={onCancel} disabled={busy}>
          Cancel
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default RenameAgencyForm;
