"use client";
import { useEffect, useState } from "react";
import { codesOf, newlyRequired, requiredForBody, requiredForName, RequiredForCode } from "../requiredFor";
import { DocumentCategoryNode } from "../types";
import styles from "./DocumentCategories.module.css";
import RequiredForFields from "./RequiredForFields";

interface Props {
  document: DocumentCategoryNode;
  /** The server keeps several proformas per document (build with script 036). */
  several: boolean;
  /** requiredFor as sent: a list of codes ([] = optional) or, on the older build, one code or null. */
  onSave: (requiredFor: string[] | string | null) => Promise<void>;
  onClose: () => void;
}

/**
 * Changes "Required for" on one document. Making it required for a proforma asks first, as records saved
 * before then show the document as missing until it is added and uploaded.
 */
const RequiredForModal = ({ document, several, onSave, onClose }: Props) => {
  const before = codesOf(document);
  const [codes, setCodes] = useState<RequiredForCode[]>(before);
  const [required, setRequired] = useState(before.length > 0);
  /** The proformas that become required, while the confirm is shown. */
  const [confirming, setConfirming] = useState<RequiredForCode[] | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  const after = required ? codes : [];
  const unchanged = requiredForName(after) === requiredForName(before);

  const send = async () => {
    const body = requiredForBody(after, several);
    if ("error" in body) {
      setConfirming(null);
      setError(body.error);
      return;
    }
    setBusy(true);
    try {
      // Optional: [] on the 036 build, null before it
      await onSave(body.value ?? (several ? [] : null));
    } catch (err) {
      setConfirming(null);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  const save = () => {
    if (required && !codes.length) {
      setError("Choose where staff must upload this document.");
      return;
    }
    const body = requiredForBody(after, several);
    if ("error" in body) {
      setError(body.error);
      return;
    }
    const added = newlyRequired(before, after);
    if (added.length) setConfirming(added);
    else send();
  };

  return (
    <div className={styles.modalBackdrop} onMouseDown={() => !busy && onClose()}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="required-for-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="required-for-title" className={styles.modalTitle}>
          Required for
        </h2>
        <p className={styles.modalHint} style={{ marginTop: -12 }}>
          “{document.docCategoryName}” · now <b>{requiredForName(before)}</b>
        </p>

        {confirming ? (
          <div className={styles.reqConfirm} role="alert">
            <b>
              Make “{document.docCategoryName}” required for {requiredForName(confirming)}?
            </b>
            <p>
              Every {requiredForName(confirming).replace(/ \+ /g, " and ").replace(/^All$/, "PC-IV, PC-V and monitoring visit")}{" "}
              will need it. Records saved before show it as missing until it is added and uploaded.
            </p>
          </div>
        ) : (
          <RequiredForFields
            value={codes}
            onChange={(next) => {
              setCodes(next);
              setError("");
            }}
            required={required}
            onRequiredChange={(next) => {
              setRequired(next);
              setError("");
            }}
            disabled={busy}
          />
        )}

        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.modalActions}>
          {confirming ? (
            <>
              <button type="button" className={styles.modalCancel} onClick={() => setConfirming(null)} disabled={busy}>
                Back
              </button>
              <button type="button" className={styles.modalSave} onClick={send} disabled={busy}>
                {busy ? "Saving…" : "Yes, make it required"}
              </button>
            </>
          ) : (
            <>
              <button type="button" className={styles.modalCancel} onClick={onClose} disabled={busy}>
                Cancel
              </button>
              <button type="button" className={styles.modalSave} onClick={save} disabled={busy || unchanged}>
                {busy ? "Saving…" : "Save"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequiredForModal;
