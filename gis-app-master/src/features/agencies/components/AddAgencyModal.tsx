"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AGENCY_NAME_MAX } from "../constants";
import styles from "./Agencies.module.css";

interface Props {
  title: string;
  placeholder: string;
  hint: string;
  /** Throw to keep the pop-up open and show the message under the input (e.g. 409 duplicate). */
  onSave: (name: string) => Promise<void>;
  onClose: () => void;
}

/** Add pop-up for a top-level agency or a child: one name, Cancel and Save. */
const AddAgencyModal = ({ title, placeholder, hint, onSave, onClose }: Props) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Agency name is required.");
      inputRef.current?.focus();
      return;
    }
    setBusy(true);
    try {
      await onSave(name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className={styles.modalBackdrop} onMouseDown={() => !busy && onClose()}>
      <form
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-agency-title"
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="add-agency-title" className={styles.modalTitle}>
          {title}
        </h2>
        <label htmlFor="add-agency-name" className={styles.modalLabel}>
          Agency name
        </label>
        <input
          ref={inputRef}
          id="add-agency-name"
          autoFocus
          className={styles.modalInput}
          placeholder={placeholder}
          value={name}
          maxLength={AGENCY_NAME_MAX}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
        />
        {error ? <p className={styles.error}>{error}</p> : <p className={styles.modalHint}>{hint}</p>}
        <div className={styles.modalActions}>
          <button type="button" className={styles.modalCancel} onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className={styles.modalSave} disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAgencyModal;
