"use client";
import { Check, ChevronDown, FileText } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import { ReportFile } from "../reportFiles";
import rr from "./ReportReview.module.css";

interface Props {
  icon: ReactNode;
  /** "Documents", "Issued" (words in rr.lw drop in a narrow panel) */
  label: ReactNode;
  /** The full name, for the tooltip and the menu, e.g. "Relevant Documents". */
  title: string;
  /** undefined while they load. */
  files?: ReportFile[];
  activeId?: string;
  onSelect: (file: ReportFile) => void;
}

/** A toolbar dropdown in the PDF panel: one row per file; choosing one opens it in the centre panel. */
const FileMenu = ({
  icon,
  label,
  title,
  files,
  activeId,
  onSelect,
}: Props) => {
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

  const empty = files?.length === 0;

  return (
    <div className={rr.menuWrap} ref={root}>
      <button
        type="button"
        className={rr.barBtn}
        title={
          !files
            ? `${title}: loading…`
            : empty
              ? `No ${title.toLowerCase()}`
              : title
        }
        aria-haspopup="true"
        aria-expanded={open}
        disabled={empty}
        onClick={() => setOpen(!open)}
      >
        {icon}
        <span>{label}</span>
        <span className={rr.barCount}>{files?.length ?? "–"}</span>
        <span className={rr.barChev}>
          <ChevronDown size={16} />
        </span>
      </button>

      {open && (
        <div className={rr.menu} role="menu" aria-label={title}>
          {!files ? (
            <p className="m-0 p-2 text-secondary">Loading…</p>
          ) : (
            files.map((file) => (
              <button
                key={file.id}
                type="button"
                role="menuitem"
                className={`${rr.menuItem} ${file.id === activeId ? rr.menuItemOn : ""}`}
                aria-current={file.id === activeId}
                onClick={() => {
                  onSelect(file);
                  setOpen(false);
                }}
              >
                <span className={rr.menuIcon}>
                  <FileText size={20} />
                </span>
                <span className={rr.menuText}>
                  <b>{file.name}</b>
                  {file.note && <small>{file.note}</small>}
                </span>
                {file.id === activeId && (
                  <Check size={20} className={rr.menuOn} />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FileMenu;
