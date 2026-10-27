"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./DocumentCategories.module.css";

interface Props {
  title: string;
  label: string;
  placeholder: string;
  hint: string;
  /**
   * Throw to keep the pop-up open and show the message under the input.
   * `addMore` is true for "Save & add more": the caller keeps the pop-up open.
   */
  onSave: (name: string, addMore: boolean) => Promise<void>;
  onClose: () => void;
  /** Show "Save & add more" (used for documents). */
  allowAddMore?: boolean;
}

/** Add pop-up for every level (main category, sub-category, document): one name, Cancel and Save. */
const AddCategoryModal = ({
  title,
  label,
  placeholder,
  hint,
  onSave,
  onClose,
  allowAddMore = false,
}: Props) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"save" | "more" | null>(null);
  /** Names saved with "Save & add more" while this pop-up was open. */
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
      setError("Category name is required.");
      inputRef.current?.focus();
      return;
    }
    setBusy(addMore ? "more" : "save");
    try {
      await onSave(name, addMore);
      if (addMore) {
        // Ready for the next one
        setAdded((prev) => [...prev, name.trim()]);
        setName("");
        setBusy(null);
        inputRef.current?.focus();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(null);
      inputRef.current?.focus();
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
        aria-labelledby="add-category-title"
        onSubmit={submit}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h2 id="add-category-title" className={styles.modalTitle}>
          {title}
        </h2>
        <label htmlFor="add-category-name" className={styles.modalLabel}>
          {label}
        </label>
        <input
          ref={inputRef}
          id="add-category-name"
          autoFocus
          className={styles.modalInput}
          placeholder={placeholder}
          value={name}
          maxLength={150}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
        />
        {error ? <p className={styles.error}>{error}</p> : <p className={styles.modalHint}>{hint}</p>}
        {added.length > 0 && (
          <p className={styles.modalAdded} aria-live="polite">
            Added: {added.join(", ")}
          </p>
        )}
        <div className={styles.modalActions}>
          <button type="button" className={styles.modalCancel} onClick={onClose} disabled={!!busy}>
            {added.length ? "Done" : "Cancel"}
          </button>
          {allowAddMore && (
            <button
              type="button"
              className={styles.modalSecondary}
              onClick={() => save(true)}
              disabled={!!busy}
            >
              {busy === "more" ? "Saving…" : "Save & add more"}
            </button>
          )}
          <button type="submit" className={styles.modalSave} disabled={!!busy}>
            {busy === "save" ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategoryModal;
