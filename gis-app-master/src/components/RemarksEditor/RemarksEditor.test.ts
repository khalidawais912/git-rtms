import { describe, expect, it } from "vitest";
import { posAt, shiftAfterApply, textMap, toSuggestions } from "./grammar";
import { JsonNode, toMarkdown } from "./markdown";

const p = (...content: JsonNode[]): JsonNode => ({ type: "paragraph", content });
const t = (text: string, ...marks: string[]): JsonNode => ({ type: "text", text, marks: marks.map((type) => ({ type })) });
const doc = (...content: JsonNode[]): JsonNode => ({ type: "doc", content });

describe("toMarkdown", () => {
  it("writes paragraphs, marks and headings", () => {
    expect(
      toMarkdown(
        doc(
          { type: "heading", attrs: { level: 2 }, content: [t("Findings")] },
          p(t("Cost is "), t("over budget ", "bold"), t("by "), t("10%", "italic"), t(".")),
        ),
      ),
    ).toBe("## Findings\n\nCost is **over budget** by *10%*.");
  });

  it("writes lists, quotes, code and links", () => {
    const md = toMarkdown(
      doc(
        { type: "bulletList", content: [{ type: "listItem", content: [p(t("One"))] }, { type: "listItem", content: [p(t("Two"))] }] },
        { type: "orderedList", attrs: { start: 1 }, content: [{ type: "listItem", content: [p(t("First"))] }] },
        { type: "blockquote", content: [p(t("Quoted"))] },
        { type: "codeBlock", content: [t("a = 1")] },
        p({ type: "text", text: "site", marks: [{ type: "link", attrs: { href: "https://x.pk" } }] }),
      ),
    );
    expect(md).toBe("- One\n- Two\n\n1. First\n\n> Quoted\n\n```\na = 1\n```\n\n[site](https://x.pk)");
  });

  it("escapes Markdown characters and returns '' for an empty editor", () => {
    expect(toMarkdown(doc(p(t("a*b_c #1"))))).toBe("a\\*b\\_c \\#1");
    expect(toMarkdown(doc(p()))).toBe("");
  });
});

describe("grammar helpers", () => {
  it("toSuggestions reads LanguageTool matches", () => {
    const text = "plsada chedk the sentence. He go home.";
    const s = toSuggestions(text, [
      { message: "Grammar", offset: 30, length: 2, replacements: [{ value: "goes" }, { value: "went" }], rule: { issueType: "grammar" } },
      { message: "Possible spelling mistake", offset: 7, length: 5, replacements: [{ value: "check" }, { value: "cheek" }], rule: { issueType: "misspelling" } },
      { message: "No fix", offset: 0, length: 6, replacements: [], rule: { issueType: "misspelling" } },
    ]);
    expect(s.map((x) => [x.from, x.to, x.original, x.replacement, x.alternatives, x.kind])).toEqual([
      [7, 12, "chedk", "check", ["cheek"], "Spelling"],
      [30, 32, "go", "goes", ["went"], "Grammar"],
    ]);
  });

  it("shiftAfterApply moves later suggestions by the length change", () => {
    const base = { alternatives: [], kind: "Grammar", message: "" };
    const list = [
      { ...base, id: "a", from: 0, to: 3, original: "Teh", replacement: "The" },
      { ...base, id: "b", from: 13, to: 15, original: "go", replacement: "goes" },
      { ...base, id: "c", from: 20, to: 22, original: "is", replacement: "are" },
    ];
    const next = shiftAfterApply(list, list[1]);
    expect(next.map((s) => [s.id, s.from, s.to])).toEqual([
      ["a", 0, 3],
      ["c", 22, 24],
    ]);
  });

  it("textMap and posAt map text offsets back to document positions", () => {
    // doc: <p>Ab</p><p>Cd</p>  → positions: p1 text at 1, p2 text at 5
    const para = (text: string) => ({
      isTextblock: true,
      isText: false,
      type: { name: "paragraph" },
      forEach: (cb: (c: unknown, o: number) => void) =>
        cb({ isText: true, isTextblock: false, text, type: { name: "text" }, forEach: () => {} }, 0),
    });
    const fakeDoc = {
      descendants: (cb: (n: unknown, pos: number) => boolean | void) => {
        cb(para("Ab"), 0);
        cb(para("Cd"), 4);
      },
    };
    const map = textMap(fakeDoc as never);
    expect(map.text).toBe("Ab\nCd");
    expect(posAt(map, 0)).toBe(1);
    expect(posAt(map, 3)).toBe(5);
    expect(posAt(map, 5)).toBe(7);
  });
});
