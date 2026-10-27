"use client";
import { FormEvent, useState } from "react";
import styles from "./DocumentCategories.module.css";

interface Props {
  initialValue?: string;
  placeholder: string;
  submitLabel: string;
  /** Throw to keep the form open and show the message. */
  onSubmit: (name: string) => Promise<void>;
  onCancel?: () => void;
  /** Clear the field after a successful add (not used when renaming). */
  resetOnSubmit?: boolean;
}

/** One text field with a save button; used for every add and rename. */
const InlineNameForm = ({
  initialValue = "",
  placeholder,
  submitLabel,
  onSubmit,
  onCancel,
  resetOnSubmit = false,
}: Props) => {
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
      setError("");
      if (resetOnSubmit) setValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
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
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && onCancel?.()}
          maxLength={150}
        />
        <button type="submit" className={styles.addButton} disabled={busy}>
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" className={styles.ghostButton} onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default InlineNameForm;
