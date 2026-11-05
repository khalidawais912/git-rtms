"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { createPcv, PcvApiError } from "../services";
import { PcvCreateResult } from "../types";
import { asBlockedCreate, blockedCreateText, yearLabel } from "../utils";
import styles from "./Pcv.module.css";

interface Props {
  onClose: () => void;
  /** Called after a 401, so the page can send the user to the login screen. */
  onSessionExpired: () => void;
}

/**
 * Starts the next PC-V of a project. One name is one project with up to five PC-Vs,
 * one a year. When the server refuses (409), `blockedReason` picks what to show:
 * an open PC-V to continue, the date the next year opens, or why no more can be added.
 */
const CreatePcvModal = ({ onClose, onSessionExpired }: Props) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState<{ result: PcvCreateResult; message: string }>();
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please type the name of the project.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const created = await createPcv(name);
      router.push(`/pc-v/${created.id}`);
    } catch (err) {
      setBusy(false);
      if (!(err instanceof PcvApiError)) {
        setError("Something went wrong.");
        return;
      }
      if (err.code === 401) {
        onSessionExpired();
        return;
      }
      const result = asBlockedCreate(err.data);
      if (err.code === 409 && result) setBlocked({ result, message: err.message });
      else setError(err.message);
    }
  };

  if (blocked) {
    const { result, message } = blocked;
    const openId = result.blockedReason === "openPcv" ? result.openPcvId : null;
    return (
      <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="pcv-blocked-title">
        <div className={styles.modal}>
          <h2 id="pcv-blocked-title" className={styles.modalTitle}>
            {result.blockedReason === "notOpenYet" ? "Not open yet" : "Cannot add this PC-V"}
          </h2>
          <p className={styles.modalText}>
            <strong>{result.name || name.trim()}</strong>
            {result.submissionNo ? ` · ${yearLabel(result.submissionNo)}` : ""}
          </p>
          <p className={styles.notice}>{blockedCreateText(result, message)}</p>
          <div className={styles.modalActions}>
            <button type="button" className={styles.secondaryButton} onClick={() => setBlocked(undefined)}>
              Change the name
            </button>
            {openId ? (
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => router.push(`/pc-v/${openId}`)}
              >
                Open that PC-V
              </button>
            ) : (
              <button type="button" className={styles.primaryButton} onClick={onClose}>
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="pcv-create-title">
      <form className={styles.modal} onSubmit={submit}>
        <h2 id="pcv-create-title" className={styles.modalTitle}>
          New PC-V
        </h2>
        <p className={styles.modalText}>
          Type the project name. A project gets up to five PC-Vs, one a year; the next year opens 12
          months after the previous PC-V is completed. The name cannot be changed later.
        </p>
        <label className={styles.fieldLabel} htmlFor="pcv-name">
          Name of the Project
        </label>
        <input
          id="pcv-name"
          autoFocus
          className={styles.modalInput}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="e.g. Construction of Rural Health Centre"
        />
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.modalActions}>
          <button type="button" className={styles.secondaryButton} onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryButton} disabled={busy}>
            {busy ? "Creating…" : "Create PC-V"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePcvModal;
