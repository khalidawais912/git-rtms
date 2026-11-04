"use client";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { Editor, EditorContent, Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  RemoveFormatting,
  SpellCheck,
  SquareCode,
  Undo2,
} from "lucide-react";
import { ReactNode, useState } from "react";
import {
  checkGrammar,
  GrammarSuggestion,
  posAt,
  shiftAfterApply,
  textMap,
} from "./grammar";
import { JsonNode, toMarkdown } from "./markdown";
import styles from "./RemarksEditor.module.css";

interface Props {
  /** Called with the remarks as Markdown on every change ("" when empty). */
  onChange: (markdown: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
}

/* ---------- grammar underlines ---------- */

const flagsKey = new PluginKey<DecorationSet>("grammarFlags");

/** Underlines the words the grammar check flagged; the marks follow the text as it changes. */
const GrammarFlags = Extension.create({
  name: "grammarFlags",
  addProseMirrorPlugins() {
    return [
      new Plugin<DecorationSet>({
        key: flagsKey,
        state: {
          init: () => DecorationSet.empty,
          apply: (tr, set) => {
            const next = tr.getMeta(flagsKey) as DecorationSet | undefined;
            return next ?? set.map(tr.mapping, tr.doc);
          },
        },
        props: { decorations: (state) => flagsKey.getState(state) },
      }),
    ];
  },
});

const showFlags = (editor: Editor, list: GrammarSuggestion[]) => {
  const map = textMap(editor.state.doc);
  const decos = list.flatMap((s) => {
    const from = posAt(map, s.from);
    const to = posAt(map, s.to);
    return from !== undefined && to !== undefined && to > from
      ? [Decoration.inline(from, to, { class: "grammar-flag", title: `${s.kind}: ${s.replacement || "remove"}` })]
      : [];
  });
  editor.view.dispatch(editor.state.tr.setMeta(flagsKey, DecorationSet.create(editor.state.doc, decos)));
};

/* ---------- toolbar ---------- */

interface ToolProps {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

const Tool = ({ label, icon, onClick, active, disabled }: ToolProps) => (
  <button
    type="button"
    className={`${styles.tool} ${active ? styles.toolOn : ""}`}
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    aria-pressed={active}
    // keep the selection in the editor
    onMouseDown={(e) => e.preventDefault()}
  >
    {icon}
  </button>
);

/**
 * Rich text editor for workflow remarks: headings, bold, italic, code, links, lists, quotes,
 * code blocks and rules, undo / redo, the browser's spell check, and a "Check grammar"
 * button (LanguageTool) whose suggestions can be applied one by one or all at once.
 * The remarks are passed on as Markdown, the format the workflow history shows.
 */
const RemarksEditor = ({ onChange, placeholder = "Description", ariaLabel = "Remarks", disabled }: Props) => {
  const [suggestions, setSuggestions] = useState<GrammarSuggestion[]>();
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editable: !disabled,
    extensions: [
      // Underline and strike are left out: Markdown (how remarks are stored) cannot show them.
      StarterKit.configure({
        underline: false,
        strike: false,
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
      GrammarFlags,
    ],
    editorProps: {
      attributes: { spellcheck: "true", lang: "en", "aria-label": ariaLabel, "aria-multiline": "true", role: "textbox" },
    },
    onUpdate: ({ editor: e, transaction }) => {
      onChange(toMarkdown(e.getJSON() as JsonNode));
      // Typing makes the suggestions' offsets stale.
      if (transaction.docChanged && !transaction.getMeta("grammarApply")) {
        setSuggestions(undefined);
        setCheckError("");
        showFlags(e, []);
      }
    },
  });

  if (!editor) return <div className={styles.editor} style={{ minHeight: 220 }} />;

  const run = () => editor.chain().focus();

  const setLink = () => {
    const current = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link address (leave empty to remove the link)", current ?? "https://");
    if (url === null) return;
    if (!url.trim() || url.trim() === "https://") run().extendMarkRange("link").unsetLink().run();
    else run().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const check = async () => {
    const { text } = textMap(editor.state.doc);
    if (!text.trim()) {
      setCheckError("Write something first.");
      return;
    }
    setChecking(true);
    setCheckError("");
    try {
      const list = await checkGrammar(text);
      setSuggestions(list);
      showFlags(editor, list);
    } catch (err) {
      setSuggestions(undefined);
      setCheckError(err instanceof Error ? err.message : "The grammar check could not be reached. Try again.");
    } finally {
      setChecking(false);
    }
  };

  const apply = (s: GrammarSuggestion, list = suggestions ?? [], replacement = s.replacement) => {
    s = { ...s, replacement };
    const map = textMap(editor.state.doc);
    const from = posAt(map, s.from);
    const to = posAt(map, s.to);
    if (from === undefined || to === undefined || map.text.slice(s.from, s.to) !== s.original) {
      // The text moved under it: drop this one.
      const rest = list.filter((x) => x.id !== s.id);
      setSuggestions(rest);
      showFlags(editor, rest);
      return rest;
    }
    const tr = editor.state.tr.setMeta("grammarApply", true);
    if (s.replacement) tr.insertText(s.replacement, from, to);
    else tr.delete(from, to);
    editor.view.dispatch(tr);
    const rest = shiftAfterApply(list, s);
    setSuggestions(rest);
    showFlags(editor, rest);
    return rest;
  };

  const applyAll = () => {
    // Last first, so earlier offsets stay right.
    let rest = suggestions ?? [];
    [...rest].sort((a, b) => b.from - a.from).forEach((s) => {
      rest = apply(s, rest);
    });
  };

  const ignore = (s: GrammarSuggestion) => {
    const rest = (suggestions ?? []).filter((x) => x.id !== s.id);
    setSuggestions(rest);
    showFlags(editor, rest);
  };

  const dismiss = () => {
    setSuggestions(undefined);
    showFlags(editor, []);
  };

  const words = (editor.storage.characterCount as { words: () => number }).words();
  const lines = Math.max(1, textMap(editor.state.doc).text.split("\n").filter((l) => l.trim()).length);

  return (
    <div className={styles.editor}>
      <div className={styles.bar} role="toolbar" aria-label="Text formatting">
        <Tool label="Undo" icon={<Undo2 size={18} />} onClick={() => run().undo().run()} disabled={!editor.can().undo()} />
        <Tool label="Redo" icon={<Redo2 size={18} />} onClick={() => run().redo().run()} disabled={!editor.can().redo()} />
        <span className={styles.sep} />
        <Tool label="Bold" icon={<Bold size={18} />} onClick={() => run().toggleBold().run()} active={editor.isActive("bold")} />
        <Tool label="Italic" icon={<Italic size={18} />} onClick={() => run().toggleItalic().run()} active={editor.isActive("italic")} />
        <Tool label="Heading" icon={<Heading2 size={18} />} onClick={() => run().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} />
        <Tool label="Small heading" icon={<Heading3 size={18} />} onClick={() => run().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} />
        <span className={styles.sep} />
        <Tool label="Bullet list" icon={<List size={18} />} onClick={() => run().toggleBulletList().run()} active={editor.isActive("bulletList")} />
        <Tool label="Numbered list" icon={<ListOrdered size={18} />} onClick={() => run().toggleOrderedList().run()} active={editor.isActive("orderedList")} />
        <Tool label="Quote" icon={<Quote size={18} />} onClick={() => run().toggleBlockquote().run()} active={editor.isActive("blockquote")} />
        <span className={styles.sep} />
        <Tool label="Inline code" icon={<Code size={18} />} onClick={() => run().toggleCode().run()} active={editor.isActive("code")} />
        <Tool label="Code block" icon={<SquareCode size={18} />} onClick={() => run().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} />
        <Tool label="Link" icon={<Link2 size={18} />} onClick={setLink} active={editor.isActive("link")} />
        <Tool label="Line" icon={<Minus size={18} />} onClick={() => run().setHorizontalRule().run()} />
        <Tool label="Clear formatting" icon={<RemoveFormatting size={18} />} onClick={() => run().unsetAllMarks().clearNodes().run()} />
        <button
          type="button"
          className={styles.check}
          onClick={check}
          disabled={checking || disabled}
          onMouseDown={(e) => e.preventDefault()}
        >
          <SpellCheck size={17} /> {checking ? "Checking…" : "Check grammar"}
        </button>
      </div>

      <div className={styles.area}>
        <EditorContent editor={editor} />
      </div>
      <div className={styles.foot}>
        <span>lines: {lines}</span>
        <span>words: {words}</span>
      </div>

      {checkError && <p className={`${styles.message} ${styles.messageError}`}>{checkError}</p>}
      {suggestions && suggestions.length === 0 && (
        <p className={`${styles.message} ${styles.messageOk}`}>No grammar or spelling mistakes found.</p>
      )}
      {suggestions && suggestions.length > 0 && (
        <div className={styles.suggest}>
          <div className={styles.suggestHead}>
            {suggestions.length} {suggestions.length === 1 ? "suggestion" : "suggestions"}
            <button type="button" onClick={applyAll}>
              Apply all
            </button>
            <button type="button" onClick={dismiss}>
              Dismiss
            </button>
          </div>
          <ul className={styles.list}>
            {suggestions.map((s) => (
              <li key={s.id} className={styles.item} title={s.message}>
                <span className={styles.kind}>{s.kind}</span>
                <span className={styles.from}>{s.original}</span>→
                <span className={styles.to}>{s.replacement || "(remove)"}</span>
                {s.alternatives.map((alt) => (
                  <button key={alt} type="button" className={styles.alt} onClick={() => apply(s, suggestions, alt)} title="Use this instead">
                    {alt}
                  </button>
                ))}
                <span className={styles.message}>{s.message}</span>
                <span className={styles.actions}>
                  <button type="button" className={styles.apply} onClick={() => apply(s)}>
                    Apply
                  </button>
                  <button type="button" onClick={() => ignore(s)}>
                    Ignore
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RemarksEditor;
