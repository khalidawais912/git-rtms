"use client";
import { ChevronDown, Files, FileText } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ProformaDocument } from "../adapters";
import { documentLine } from "../utils";
import styles from "./Proformas.module.css";

interface Props {
  /** undefined while they load. */
  documents?: ProformaDocument[];
  /** The document open in its panel. */
  activeId?: ProformaDocument["id"];
  onSelect: (doc: ProformaDocument) => void;
}

/** "Attached Documents n ⌄" in the PDF panel's header; choosing one opens it in its own panel. */
const DocumentsMenu = ({ documents, activeId, onSelect }: Props) => {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // Outside click, a click into the PDF (the window loses focus) or Escape closes the menu.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("blur", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("blur", close);
    };
  }, [open]);

  return (
    <div className={styles.docsMenu} ref={root}>
      <button
        type="button"
        className={styles.docsToggle}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
      >
        <Files size={20} />
        Attached Documents
        <b>{documents?.length ?? "–"}</b>
        <span className={styles.docsChevron}>
          <ChevronDown size={18} className={open ? styles.docsChevronOpen : ""} />
        </span>
      </button>

      {open && (
        <div className={styles.docsList}>
          {!documents ? (
            <p className={styles.muted}>Loading…</p>
          ) : documents.length === 0 ? (
            <p className={styles.muted}>No documents attached.</p>
          ) : (
            documents.map((doc) => (
              <button
                key={doc.id}
                type="button"
                className={`${styles.docsItem} ${doc.id === activeId ? styles.docsItemOn : ""}`}
                aria-current={doc.id === activeId}
                onClick={() => {
                  onSelect(doc);
                  setOpen(false);
                }}
              >
                <FileText size={20} />
                <span>
                  <b>{doc.name}</b>
                  <small>{documentLine(doc)}</small>
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentsMenu;
