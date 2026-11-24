"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { requiredForBody, RequiredForCode } from "../requiredFor";
import styles from "./DocumentCategories.module.css";
import RequiredForFields from "./RequiredForFields";

interface Props {
  /** "Staff tick this in the app under ECM Document › P&D Doc." */
  hint: string;
  /** The server keeps several proformas per document (build with script 036). */
  several: boolean;
  /**
   * requiredFor: what the server is sent (["PCIV", "PCV"], or one code on the older build); undefined for an
   * optional document, which the guide says to leave out. Throw to keep the pop-up open and show the message.
   */
  onSave: (name: string, requiredFor: string[] | string | undefined, addMore: boolean) => Promise<void>;
  onClose: () => void;
}

/** Add document pop-up: the name, "Required document" and, when required, the proformas that need it. */
const AddDocumentModal = ({ hint, several, onSave, onClose }: Props) => {
  const [name, setName] = useState("");
  const [required, setRequired] = useState(false);
  const [codes, setCodes] = useState<RequiredForCode[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"save" | "more" | null>(null);
  const [added, setAdded] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  const save = async (addMore: boolean) => {
    if (!name.trim()) {
      setError("Document name is required.");
      inputRef.current?.focus();
      return;
    }
    let requiredFor: string[] | string | undefined;
    if (required) {
      if (!codes.length) {
        setError("Choose where staff must upload this document.");
        return;
      }
      const body = requiredForBody(codes, several);
      if ("error" in body) {
        setError(body.error);
        return;
      }
      requiredFor = body.value ?? undefined;
    }
    setBusy(addMore ? "more" : "save");
    try {
      await onSave(name, requiredFor, addMore);
      if (addMore) {
        // Ready for the next one; the Required choice stays, as the next document is often alike
        setAdded((prev) => [...prev, name.trim()]);
        setName("");
        setBusy(null);
        inputRef.current?.focus();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(null);
    }
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    save(false);
  };

  return (
    <div className={styles.modalBackdrop} onMouseDown={() => !busy && onClose()}>
      <form
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-document-title"
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="add-document-title" className={styles.modalTitle}>
          Add document
        </h2>
        <label htmlFor="add-document-name" className={styles.modalLabel}>
          Document name <span className={styles.star}>*</span>
        </label>
        <input
          ref={inputRef}
          id="add-document-name"
          autoFocus
          className={styles.modalInput}
          placeholder="For example: PC-I"
          value={name}
          maxLength={150}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
        />
        <p className={styles.modalHint}>{hint}</p>

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
          disabled={!!busy}
        />

        {error && <p className={styles.error}>{error}</p>}
        {added.length > 0 && (
          <p className={styles.modalAdded} aria-live="polite">
            Added: {added.join(", ")}
          </p>
        )}
        <div className={styles.modalActions}>
          <button type="button" className={styles.modalCancel} onClick={onClose} disabled={!!busy}>
            {added.length ? "Done" : "Cancel"}
          </button>
          <button type="button" className={styles.modalSecondary} onClick={() => save(true)} disabled={!!busy}>
            {busy === "more" ? "Saving…" : "Save & add more"}
          </button>
          <button type="submit" className={styles.modalSave} disabled={!!busy}>
            {busy === "save" ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDocumentModal;
