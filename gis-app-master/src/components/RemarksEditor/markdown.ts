/**
 * TipTap document (JSON) → Markdown, for remarks. The workflow stores remarks as Markdown
 * (the history shows them with react-markdown), so the editor keeps to what Markdown can hold:
 * headings, bold, italic, inline code, links, lists, quotes, code blocks, rules and line breaks.
 */
export interface JsonMark {
  type: string;
  attrs?: Record<string, unknown>;
}

export interface JsonNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: JsonNode[];
  text?: string;
  marks?: JsonMark[];
}

/** Characters Markdown would read as formatting. */
const escapeText = (text: string) => text.replace(/([\\`*_[\]#])/g, "\\$1");

const inline = (nodes: JsonNode[] = []): string =>
  nodes
    .map((node) => {
      if (node.type === "hardBreak") return "  \n";
      if (node.type !== "text" || !node.text) return "";
      const marks = node.marks ?? [];
      const has = (t: string) => marks.some((m) => m.type === t);
      if (has("code")) return `\`${node.text.replace(/`/g, "\\`")}\``;
      // Keep the spaces outside the markers: "** bold**" is not bold in Markdown.
      const [, lead, core, trail] = node.text.match(/^(\s*)([\s\S]*?)(\s*)$/) ?? ["", "", node.text, ""];
      if (!core) return node.text;
      let out = escapeText(core);
      if (has("italic")) out = `*${out}*`;
      if (has("bold")) out = `**${out}**`;
      const link = marks.find((m) => m.type === "link");
      if (link && typeof link.attrs?.href === "string") out = `[${out}](${link.attrs.href})`;
      return `${lead}${out}${trail}`;
    })
    .join("");

const indent = (text: string, prefix: string) =>
  text
    .split("\n")
    .map((line, i) => (i === 0 ? line : line ? prefix + line : line))
    .join("\n");

const block = (node: JsonNode): string => {
  switch (node.type) {
    case "paragraph":
      return inline(node.content);
    case "heading": {
      const level = Math.min(Math.max(Number(node.attrs?.level) || 1, 1), 6);
      return `${"#".repeat(level)} ${inline(node.content)}`;
    }
    case "blockquote":
      return blocks(node.content)
        .split("\n")
        .map((line) => (line ? `> ${line}` : ">"))
        .join("\n");
    case "codeBlock":
      return `\`\`\`\n${(node.content ?? []).map((c) => c.text ?? "").join("")}\n\`\`\``;
    case "horizontalRule":
      return "---";
    case "bulletList":
      return (node.content ?? []).map((item) => `- ${indent(blocks(item.content), "  ")}`).join("\n");
    case "orderedList": {
      const start = Number(node.attrs?.start) || 1;
      return (node.content ?? [])
        .map((item, i) => {
          const marker = `${start + i}. `;
          return marker + indent(blocks(item.content), " ".repeat(marker.length));
        })
        .join("\n");
    }
    default:
      return node.content ? blocks(node.content) : inline([node]);
  }
};

const blocks = (nodes: JsonNode[] = []) =>
  nodes
    .map(block)
    .filter((text, i, all) => text !== "" || (i > 0 && i < all.length - 1))
    .join("\n\n");

/** The Markdown for a TipTap document; "" when it has no text. */
export const toMarkdown = (doc: JsonNode): string => blocks(doc.content).trim();
