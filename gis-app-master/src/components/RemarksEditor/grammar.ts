/**
 * Spelling and grammar suggestions from LanguageTool (https://languagetool.org).
 * The public server needs no key; set NEXT_PUBLIC_LANGUAGETOOL_URL to use our own server
 * instead, so remarks do not leave the network. The text is sent only when the user presses
 * "Check grammar".
 */
import axios from "axios";

export const GRAMMAR_URL =
  process.env.NEXT_PUBLIC_LANGUAGETOOL_URL?.trim() || "https://api.languagetool.org/v2/check";

/** One suggestion, with offsets into the plain text that was checked. */
export interface GrammarSuggestion {
  id: string;
  /** Start and end in the checked text. */
  from: number;
  to: number;
  /** The words to change, and what to put instead. */
  original: string;
  replacement: string;
  /** Other replacements the checker offered, best first. */
  alternatives: string[];
  /** "Spelling", "Grammar", "Punctuation", "Style". */
  kind: string;
  /** The checker's explanation. */
  message: string;
}

interface LanguageToolMatch {
  message: string;
  offset: number;
  length: number;
  replacements: { value: string }[];
  rule?: { id?: string; issueType?: string; category?: { id?: string } };
}

const kindOf = (m: LanguageToolMatch) => {
  const t = `${m.rule?.issueType ?? ""} ${m.rule?.category?.id ?? ""}`.toLowerCase();
  if (t.includes("misspelling") || t.includes("typos")) return "Spelling";
  if (t.includes("punctuation") || t.includes("typographical")) return "Punctuation";
  if (t.includes("style") || t.includes("redundancy")) return "Style";
  return "Grammar";
};

/** LanguageTool matches → suggestions (pure, for tests). Matches with no replacement are left out. */
export const toSuggestions = (text: string, matches: LanguageToolMatch[]): GrammarSuggestion[] =>
  matches
    .filter((m) => m.replacements.length > 0)
    .map((m, i) => ({
      id: `${m.offset}-${m.length}-${i}`,
      from: m.offset,
      to: m.offset + m.length,
      original: text.slice(m.offset, m.offset + m.length),
      replacement: m.replacements[0].value,
      alternatives: m.replacements.slice(1, 4).map((r) => r.value),
      kind: kindOf(m),
      message: m.message,
    }))
    .filter((s) => s.original !== s.replacement)
    .sort((a, b) => a.from - b.from);

export const checkGrammar = async (text: string): Promise<GrammarSuggestion[]> => {
  const body = new URLSearchParams({ text, language: "en-US" });
  try {
    const { data } = await axios.post<{ matches?: LanguageToolMatch[] }>(GRAMMAR_URL, body, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 20000,
    });
    return toSuggestions(text, data.matches ?? []);
  } catch (err) {
    const status = axios.isAxiosError(err) ? err.response?.status : undefined;
    if (status === 429) throw new Error("Too many checks in a short time. Wait a minute and try again.");
    if (status === 413) throw new Error("The text is too long to check at once. Check a shorter part.");
    throw new Error("The grammar check could not be reached. Check the internet connection and try again.");
  }
};

/**
 * After a suggestion is applied, the ones after it move by the change in length;
 * any that overlapped it are dropped.
 */
export const shiftAfterApply = (list: GrammarSuggestion[], applied: GrammarSuggestion) => {
  const delta = applied.replacement.length - (applied.to - applied.from);
  return list
    .filter((s) => s.id !== applied.id && (s.to <= applied.from || s.from >= applied.to))
    .map((s) => (s.from >= applied.to ? { ...s, from: s.from + delta, to: s.to + delta } : s));
};

/** Plain text of a ProseMirror-like document, blocks split by "\n", with a map back to positions. */
export interface TextMap {
  text: string;
  /** Each text run: where it starts in `text` and in the document. */
  runs: { start: number; length: number; pos: number }[];
}

interface DocLike {
  descendants: (cb: (node: NodeLike, pos: number) => boolean | void) => void;
}

interface NodeLike {
  isTextblock: boolean;
  isText: boolean;
  text?: string;
  type: { name: string };
  forEach: (cb: (child: NodeLike, offset: number) => void) => void;
}

export const textMap = (doc: DocLike): TextMap => {
  let text = "";
  const runs: TextMap["runs"] = [];
  doc.descendants((node, pos) => {
    if (!node.isTextblock) return true;
    if (text) text += "\n";
    node.forEach((child, offset) => {
      if (child.isText && child.text) {
        runs.push({ start: text.length, length: child.text.length, pos: pos + 1 + offset });
        text += child.text;
      } else if (child.type.name === "hardBreak") {
        text += "\n";
      }
    });
    return false;
  });
  return { text, runs };
};

/** Document position of a text offset; undefined when it falls between blocks. */
export const posAt = (map: TextMap, offset: number) => {
  const run = map.runs.find((r) => offset >= r.start && offset <= r.start + r.length);
  return run ? run.pos + (offset - run.start) : undefined;
};
