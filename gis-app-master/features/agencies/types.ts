/**
 * Agencies (Frontend guide: Agencies and PC-IV).
 * Two levels only: a top-level agency (level 1) can have children (level 2); a child cannot.
 * Both levels can be picked as a sponsoring or executing agency on a PC-IV.
 */

/** An agency as it appears on a PC-IV (`sponsoringAgency` / `executingAgency` lists). */
export interface AgencyItem {
  agencyId: number;
  agencyName: string;
}

/** One agency from GET /api/agencies (tree), /main, /{id}/children or /{id}. */
export interface AgencyNode {
  id: number;
  agencyName: string;
  /** null = top-level agency. */
  parentAgencyId: number | null;
  level: 1 | 2;
  /** Number of agencies under it (always 0 on level 2). */
  childCount: number;
  /** Show "Add agency under it". False on level 2. */
  canAddChild: boolean;
  /** Only on the tree (GET /api/agencies). */
  children?: AgencyNode[];
  createdAt?: string | null;
  updatedAt?: string | null;
}

/**
 * The agency part of a PC-IV create / update / chapter 1 save.
 * Left out (undefined) on update = keep that side as saved; [] = clear it.
 */
export interface PcivAgencyIds {
  sponsoringAgencyIds?: number[];
  executingAgencyIds?: number[];
}
