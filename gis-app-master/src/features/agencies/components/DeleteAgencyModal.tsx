"use client";
import { useEffect, useState } from "react";
import styles from "./Agencies.module.css";

interface Props {
  name: string;
  /** What else goes with it. */
  message: string;
  /** Throw to keep the pop-up open and show the server's message (409: used on a PC-IV). */
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

/** Delete confirmation: "Keep it" or "Delete". */
const DeleteAgencyModal = ({ name, message, onConfirm, onClose }: Props) => {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  const confirm = async () => {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  return (
    <div className={styles.modalBackdrop} onMouseDown={() => !busy && onClose()}>
      <div
        className={`${styles.modal} ${styles.modalSmall}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-agency-title"
        aria-describedby="delete-agency-text"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="delete-agency-title" className={styles.modalTitle}>
          Delete “{name}”?
        </h2>
        <p id="delete-agency-text" className={styles.modalText}>
          {message}
        </p>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.modalActions}>
          <button type="button" className={styles.modalCancel} onClick={onClose} disabled={busy} autoFocus>
            Keep it
          </button>
          <button type="button" className={styles.modalDelete} onClick={confirm} disabled={busy || !!error}>
            {busy ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAgencyModal;
