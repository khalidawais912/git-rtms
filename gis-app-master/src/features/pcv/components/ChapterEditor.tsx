"use client";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.snow.css";
import { DeltaOp, parseDelta, serializeDelta } from "../utils";
import styles from "./Pcv.module.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p className="text-secondary mb-0">Loading editor…</p>,
});

const TOOLBAR = [
  [{ header: [2, 3, false] }],
  ["bold", "italic", "underline"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "clean"],
];

interface Props {
  /** Quill delta string, read once: remount (change `key`) to load other content. */
  initialContent: string | null;
  readOnly: boolean;
  onChange: (content: string) => void;
  label: string;
}

/**
 * Chapter body as a Quill delta, the same editor as the older reports.
 * Uncontrolled: Quill keeps its own state and reports every change as a delta string.
 */
const ChapterEditor = ({ initialContent, readOnly, onChange, label }: Props) => {
  // Quill accepts a delta-like { ops } object; react-quill types it as its own Delta class.
  const initial = useMemo(
    () => ({ ops: parseDelta(initialContent) }) as unknown as string,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- read once, see Props
    [],
  );

  return (
    <div className={`${styles.editor} ${readOnly ? styles.readOnlyEditor : ""}`} aria-label={label}>
      <ReactQuill
        theme="snow"
        defaultValue={initial}
        readOnly={readOnly}
        modules={{ toolbar: readOnly ? false : TOOLBAR }}
        placeholder={readOnly ? "" : "Type here…"}
        onChange={(_html, _delta, source, editor) => {
          if (source !== "user") return;
          onChange(serializeDelta(editor.getContents().ops as DeltaOp[]));
        }}
      />
    </div>
  );
};

export default ChapterEditor;
