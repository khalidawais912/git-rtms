import { useEditor, EditorContent, Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link2,
  Image,
  Table,
  Undo,
  Redo,
  Highlighter,
  Quote,
  Minus,
  Heading1,
  Heading2,
  Heading3,
  CheckCircle,
  ImageIcon,
  TableIcon,
} from "lucide-react";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { useCallback, useEffect, useRef, useState } from "react";

// Enhanced dictionary with common words
const DICTIONARY = new Set([
  "the",
  "be",
  "to",
  "of",
  "and",
  "a",
  "in",
  "that",
  "have",
  "i",
  "it",
  "for",
  "not",
  "on",
  "with",
  "he",
  "as",
  "you",
  "do",
  "at",
  "this",
  "but",
  "his",
  "by",
  "from",
  "they",
  "we",
  "say",
  "her",
  "she",
  "or",
  "an",
  "will",
  "my",
  "one",
  "all",
  "would",
  "there",
  "their",
  "what",
  "so",
  "up",
  "out",
  "if",
  "about",
  "who",
  "get",
  "which",
  "go",
  "me",
  "when",
  "make",
  "can",
  "like",
  "time",
  "no",
  "just",
  "him",
  "know",
  "take",
  "people",
  "into",
  "year",
  "your",
  "good",
  "some",
  "could",
  "them",
  "see",
  "other",
  "than",
  "then",
  "now",
  "look",
  "only",
  "come",
  "its",
  "over",
  "think",
  "also",
  "back",
  "after",
  "use",
  "two",
  "how",
  "our",
  "work",
  "first",
  "well",
  "way",
  "even",
  "new",
  "want",
  "because",
  "any",
  "these",
  "give",
  "day",
  "most",
  "us",
  "hello",
  "world",
  "text",
  "editor",
  "professional",
  "enterprise",
  "level",
  "developer",
  "code",
  "rich",
  "spell",
  "checking",
  "grammar",
  "correction",
  "functionality",
  "implement",
  "easy",
  "free",
  "suggest",
  "document",
  "content",
  "write",
  "typing",
  "example",
  "demo",
  "test",
  "is",
  "was",
  "are",
  "were",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "should",
  "could",
  "may",
  "might",
  "must",
  "shall",
  "can",
  "need",
  "dare",
  "ought",
  "used",
  "never",
  "ever",
  "always",
  "sometimes",
  "often",
  "seldom",
  "rarely",
  "usually",
  "generally",
  "normally",
  "currently",
  "recently",
  "immediately",
  "quickly",
  "slowly",
  "carefully",
  "writing",
  "document",
  "spellcheck",
  "grammarly",
  "correction",
  "word",
  "words",
  "letter",
  "letters",
  "sentence",
  "sentences",
  "paragraph",
  "paragraphs",
  "style",
  "styles",
  "format",
  "formats",
  "bold",
  "italic",
  "underline",
  "highlight",
  "color",
  "colors",
  "font",
  "fonts",
  "size",
  "sizes",
  "align",
  "alignment",
  "center",
  "left",
  "right",
  "justify",
  "list",
  "lists",
  "table",
  "tables",
  "image",
  "images",
  "link",
  "links",
  "url",
  "urls",
  "http",
  "https",
  "www",
]);

// Common misspellings and their corrections
const COMMON_CORRECTIONS: Record<string, string[]> = {
  teh: ["the"],
  recieve: ["receive"],
  occured: ["occurred"],
  untill: ["until"],
  wich: ["which"],
  alot: ["a lot"],
  definately: ["definitely"],
  seperate: ["separate"],
  occassion: ["occasion"],
  aquire: ["acquire"],
  embarass: ["embarrass"],
  existance: ["existence"],
  experiance: ["experience"],
  grammer: ["grammar"],
  harrass: ["harass"],
  ignorence: ["ignorance"],
  immediatly: ["immediately"],
  incidently: ["incidentally"],
  independant: ["independent"],
  knowlege: ["knowledge"],
  occassionally: ["occasionally"],
  peice: ["piece"],
  realy: ["really"],
  reccomend: ["recommend"],
  rythm: ["rhythm"],
  sience: ["science"],
  succesful: ["successful"],
  tommorrow: ["tomorrow"],
  tounge: ["tongue"],
  truely: ["truly"],
  usefull: ["useful"],
  wierd: ["weird"],
  profesional: ["professional"],
  speling: ["spelling"],
  incorectly: ["incorrectly"],
};

// Custom Spell Check Extension
const SpellCheckExtension = Extension.create({
  name: "spellCheck",

  addProseMirrorPlugins() {
    const checkSpelling = (text: string): boolean => {
      const normalized = text.toLowerCase().replace(/['']/g, "'");
      return DICTIONARY.has(normalized) || /^\d+$/.test(text);
    };

    return [
      new Plugin({
        key: new PluginKey("spellCheck"),
        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, oldState) {
            if (!tr.docChanged) return oldState;

            const decorations: Decoration[] = [];
            const doc = tr.doc;

            doc.descendants((node, pos) => {
              if (node.isText && node.text) {
                // Fix: Use Array.from to convert iterator to array
                const wordMatches = Array.from(
                  node.text.matchAll(/\b[a-zA-Z]+(?:'[a-zA-Z]+)?\b/g)
                );

                for (const match of wordMatches) {
                  const word = match[0];
                  const from = pos + match.index!;
                  const to = from + word.length;

                  if (word.length > 2 && !checkSpelling(word)) {
                    decorations.push(
                      Decoration.inline(from, to, {
                        class: "spell-error",
                        "data-word": word,
                      })
                    );
                  }
                }
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

interface SuggestionPopup {
  word: string;
  suggestions: string[];
  x: number;
  y: number;
  from: number;
  to: number;
}

const RichTextEditor: React.FC = () => {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [spellCheckEnabled, setSpellCheckEnabled] = useState(true);
  const [suggestionPopup, setSuggestionPopup] =
    useState<SuggestionPopup | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        // Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Highlight.configure({
          multicolor: true,
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-600 underline hover:text-blue-800",
          },
        }),
        // Image.configure({
        //   inline: true,
        //   HTMLAttributes: {
        //     class: "max-w-full h-auto rounded-lg",
        //   },
        // }),
        // Table.configure({
        //   resizable: true,
        // }),
        TableRow,
        TableCell,
        TableHeader,
        Placeholder.configure({
          placeholder: "Start typing your document...",
        }),
        CharacterCount,
        ...(spellCheckEnabled ? [SpellCheckExtension] : []), // Fix: Use spread operator
      ],
      content:
        "<p>Hello World! This is a profesional rich text editor with speling checking capabilities. Try typing some words incorectly (like teh, recieve, or definately) to see the spell checker in action. Hover over any underlined word to see suggestions!</p>",
      editorProps: {
        attributes: {
          class:
            "prose prose-lg max-w-none focus:outline-none min-h-[400px] px-8 py-6",
          spellcheck: "false",
        },
      },
      immediatelyRender: false,
    },
    [spellCheckEnabled]
  ); // Fix: Add dependency array

  // Get spelling suggestions
  const getSuggestions = useCallback((word: string): string[] => {
    const normalized = word.toLowerCase();

    // Check common corrections first
    if (COMMON_CORRECTIONS[normalized]) {
      return COMMON_CORRECTIONS[normalized];
    }

    // Levenshtein distance for suggestions
    const suggestions: Array<{ word: string; distance: number }> = [];
    const maxDistance = word.length <= 4 ? 1 : 2;

    const levenshteinDistance = (a: string, b: string): number => {
      const matrix = [];
      for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
      }
      for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
      }
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
          }
        }
      }
      return matrix[b.length][a.length];
    };

    DICTIONARY.forEach((dictWord) => {
      const distance = levenshteinDistance(normalized, dictWord);
      if (distance <= maxDistance) {
        suggestions.push({ word: dictWord, distance });
      }
    });

    return suggestions
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3) // Limit to 3 suggestions like Grammarly
      .map((s) => s.word);
  }, []);

  // Handle mouse over for misspelled words
  useEffect(() => {
    if (!editorRef.current || !editor || !spellCheckEnabled) return;

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.classList.contains("spell-error")) {
        const word = target.getAttribute("data-word");
        if (!word) return;

        const rect = target.getBoundingClientRect();
        const suggestions = getSuggestions(word);

        // Get the position in the editor
        const view = editor.view;
        const pos = view.posAtCoords({ left: rect.left, top: rect.top });

        if (pos) {
          setSuggestionPopup({
            word,
            suggestions,
            x: rect.left + window.scrollX,
            y: rect.bottom + window.scrollY + 5,
            from: pos.pos,
            to: pos.pos + word.length,
          });
        }
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as HTMLElement;

      // Don't hide if moving to the popup
      if (popupRef.current?.contains(relatedTarget)) {
        return;
      }

      if (target.classList.contains("spell-error")) {
        setTimeout(() => {
          if (!popupRef.current?.matches(":hover")) {
            setSuggestionPopup(null);
          }
        }, 100);
      }
    };

    const editorElement = editorRef.current;
    editorElement.addEventListener("mouseover", handleMouseOver);
    editorElement.addEventListener("mouseout", handleMouseOut);

    return () => {
      editorElement.removeEventListener("mouseover", handleMouseOver);
      editorElement.removeEventListener("mouseout", handleMouseOut);
    };
  }, [editor, spellCheckEnabled, getSuggestions]);

  // Handle suggestion click
  const applySuggestion = (suggestion: string) => {
    if (!editor || !suggestionPopup) return;

    // Find and replace the misspelled word
    const { state } = editor;
    const { doc } = state;
    let targetPos = -1;
    let targetEnd = -1;

    doc.descendants((node, pos) => {
      if (node.isText && node.text) {
        // Fix: Use Array.from to convert iterator to array
        const wordMatches = Array.from(
          node.text.matchAll(/\b[a-zA-Z]+(?:'[a-zA-Z]+)?\b/g)
        );

        for (const match of wordMatches) {
          const word = match[0];
          const from = pos + match.index!;
          const to = from + word.length;

          if (
            word.toLowerCase() === suggestionPopup.word.toLowerCase() &&
            Math.abs(from - suggestionPopup.from) < 5
          ) {
            targetPos = from;
            targetEnd = to;
            return false;
          }
        }
      }
    });

    if (targetPos !== -1 && targetEnd !== -1) {
      editor
        .chain()
        .focus()
        .setTextSelection({ from: targetPos, to: targetEnd })
        .insertContent(suggestion)
        .run();
    }

    setSuggestionPopup(null);
  };

  // Toolbar button component
  const ToolbarButton: React.FC<{
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title?: string;
  }> = ({ onClick, active, disabled, children, title }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-all ${
        active
          ? "bg-blue-100 text-blue-700 shadow-sm"
          : "hover:bg-gray-100 text-gray-700"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-gray-300 mx-1" />;

  const addLink = () => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkDialog(false);
    }
  };

  const addImage = () => {
    if (imageUrl) {
      // editor?.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageDialog(false);
    }
  };

  const insertTable = () => {
    editor
      ?.chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  };

  if (!editor) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        .spell-error {
          border-bottom: 2px wavy #ef4444;
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 2px;
        }
        .spell-error:hover {
          background-color: rgba(239, 68, 68, 0.1);
        }
      `}</style>

      <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="border-b border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-wrap items-center gap-1">
            {/* Text Format */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive("bold")}
              title="Bold (Ctrl+B)"
            >
              <Bold size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive("italic")}
              title="Italic (Ctrl+I)"
            >
              <Italic size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive("underline")}
              title="Underline (Ctrl+U)"
            >
              <Underline size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive("strike")}
              title="Strikethrough"
            >
              <Strikethrough size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              active={editor.isActive("highlight")}
              title="Highlight"
            >
              <Highlighter size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              active={editor.isActive("code")}
              title="Code"
            >
              <Code size={18} />
            </ToolbarButton>

            <Divider />

            {/* Headings */}
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              active={editor.isActive("heading", { level: 1 })}
              title="Heading 1"
            >
              <Heading1 size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              active={editor.isActive("heading", { level: 2 })}
              title="Heading 2"
            >
              <Heading2 size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              active={editor.isActive("heading", { level: 3 })}
              title="Heading 3"
            >
              <Heading3 size={18} />
            </ToolbarButton>

            <Divider />

            {/* Lists */}
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive("bulletList")}
              title="Bullet List"
            >
              <List size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive("orderedList")}
              title="Numbered List"
            >
              <ListOrdered size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive("blockquote")}
              title="Quote"
            >
              <Quote size={18} />
            </ToolbarButton>

            <Divider />

            {/* Alignment */}
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              active={editor.isActive({ textAlign: "left" })}
              title="Align Left"
            >
              <AlignLeft size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              active={editor.isActive({ textAlign: "center" })}
              title="Align Center"
            >
              <AlignCenter size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              active={editor.isActive({ textAlign: "right" })}
              title="Align Right"
            >
              <AlignRight size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              active={editor.isActive({ textAlign: "justify" })}
              title="Justify"
            >
              <AlignJustify size={18} />
            </ToolbarButton>

            <Divider />

            {/* Insert */}
            <ToolbarButton
              onClick={() => setShowLinkDialog(true)}
              title="Insert Link"
            >
              <Link2 size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => setShowImageDialog(true)}
              title="Insert Image"
            >
              <ImageIcon size={18} />
            </ToolbarButton>
            <ToolbarButton onClick={insertTable} title="Insert Table">
              <TableIcon size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              title="Horizontal Line"
            >
              <Minus size={18} />
            </ToolbarButton>

            <Divider />

            {/* History */}
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo (Ctrl+Z)"
            >
              <Undo size={18} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo (Ctrl+Y)"
            >
              <Redo size={18} />
            </ToolbarButton>

            <Divider />

            {/* Spell Check Toggle */}
            <div className="flex items-center gap-2 ml-auto">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={spellCheckEnabled}
                  onChange={(e) => {
                    setSpellCheckEnabled(e.target.checked);
                    setSuggestionPopup(null);
                  }}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Spell Check</span>
              </label>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="relative" ref={editorRef}>
          <EditorContent editor={editor} />

          {/* Grammarly-style suggestion popup */}
          {suggestionPopup && (
            <div
              ref={popupRef}
              className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 py-1 min-w-[160px] max-w-[240px]"
              style={{
                left: `${suggestionPopup.x}px`,
                top: `${suggestionPopup.y}px`,
              }}
              onMouseLeave={() => {
                setTimeout(() => {
                  setSuggestionPopup(null);
                }, 150);
              }}
            >
              {suggestionPopup.suggestions.length > 0 ? (
                suggestionPopup.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => applySuggestion(suggestion)}
                    className="w-full px-3 py-2 text-left hover:bg-blue-50 text-sm text-gray-800 font-medium transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg flex items-center gap-2"
                  >
                    <CheckCircle
                      size={12}
                      className="text-green-500 opacity-70"
                    />
                    {suggestion}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-gray-500 italic">
                  No suggestions
                </div>
              )}
            </div>
          )}
        </div>

        {/* Link Dialog */}
        {showLinkDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Insert Link</h3>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowLinkDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={addLink}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Dialog */}
        {showImageDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h3 className="text-lg font-semibold mb-4">Insert Image</h3>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowImageDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={addImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Image
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RichTextEditor;
