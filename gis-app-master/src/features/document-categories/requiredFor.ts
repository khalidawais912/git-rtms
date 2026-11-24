import { DocumentCategoryNode } from "./types";

/** The proformas a document can be required for (Document Rules, scripts 034–036). */
export const REQUIRED_FOR_TYPES = [
  { code: "PCIV", name: "PC-IV" },
  { code: "PCV", name: "PC-V" },
  { code: "Monitoring", name: "Monitoring" },
] as const;

export type RequiredForCode = (typeof REQUIRED_FOR_TYPES)[number]["code"];

const ALL_CODES: RequiredForCode[] = REQUIRED_FOR_TYPES.map((t) => t.code);
const order = (codes: RequiredForCode[]) => ALL_CODES.filter((c) => codes.includes(c));

/**
 * True on the API build with script 036: a document can be required for several proformas, the tree carries
 * `requiredForCodes`, and requiredFor is sent as a list of codes. The build before keeps one value.
 */
export const supportsSeveral = (tree?: DocumentCategoryNode[]): boolean =>
  !!tree?.some((n) => "requiredForCodes" in n || supportsSeveral(n.children));

/** The build before 036 numbered one value: 1 PC-IV, 2 PC-V, 3 Monitoring, 4 All. */
const LEGACY: Record<number, RequiredForCode[]> = { 1: ["PCIV"], 2: ["PCV"], 3: ["Monitoring"], 4: ALL_CODES };

/** The proformas a document is required for now; [] = optional. */
export const codesOf = (node: Pick<DocumentCategoryNode, "requiredFor" | "requiredForCodes">): RequiredForCode[] => {
  if (Array.isArray(node.requiredForCodes)) {
    const codes = node.requiredForCodes.map((c) => c.toLowerCase());
    if (codes.includes("all")) return ALL_CODES;
    return ALL_CODES.filter((c) => codes.includes(c.toLowerCase()));
  }
  return node.requiredFor ? (LEGACY[node.requiredFor] ?? []) : [];
};

/** "PC-IV + PC-V", "All" or "Optional", as the server names them. */
export const requiredForName = (codes: RequiredForCode[]) =>
  !codes.length
    ? "Optional"
    : codes.length === ALL_CODES.length
      ? "All"
      : order(codes)
          .map((c) => REQUIRED_FOR_TYPES.find((t) => t.code === c)!.name)
          .join(" + ");

/**
 * What is sent as `requiredFor` for the ticked proformas: the list of codes (["PCIV", "PCV"]) on the 036 build,
 * one code on the build before ("All" when all three); null = optional. A choice the old build cannot keep
 * gives a message instead, so nothing wrong is saved.
 */
export const requiredForBody = (
  codes: RequiredForCode[],
  several: boolean,
): { value: string[] | string | null } | { error: string } => {
  const picked = order(codes);
  if (!picked.length) return { value: null };
  if (several) return { value: picked };
  if (picked.length === ALL_CODES.length) return { value: "All" };
  if (picked.length === 1) return { value: picked[0] };
  return {
    error:
      "This server saves one proforma or All for now. Choose one, or All, until the new document rules build is deployed.",
  };
};

/** The proformas that become newly required, for the confirm before saving. */
export const newlyRequired = (before: RequiredForCode[], after: RequiredForCode[]) =>
  order(after.filter((c) => !before.includes(c)));
