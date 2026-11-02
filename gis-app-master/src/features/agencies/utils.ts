import { AgencyItem, AgencyNode } from "./types";

/** One label for a PC-IV's agencies: "Finance Department, Planning Department". */
export const joinAgencyNames = (agencies?: AgencyItem[] | null) =>
  (agencies ?? []).map((a) => a.agencyName).join(", ");

/** Ids to send back in `sponsoringAgencyIds` / `executingAgencyIds`. */
export const agencyIdsOf = (agencies?: AgencyItem[] | null) =>
  (agencies ?? []).map((a) => a.agencyId);

/** Every agency in the tree, top-level ones first, each followed by its children. */
export const flattenAgencies = (tree: AgencyNode[]): AgencyNode[] =>
  tree.flatMap((node) => [node, ...flattenAgencies(node.children ?? [])]);
