/**
 * One node of GET /api/document-category (Project Documents Frontend Guide, section 3).
 * Level 1 = main category (Step 1), 2 = sub-category (Step 2), 3 = document (Step 3).
 */
export interface DocumentCategoryNode {
  id: number;
  docCategoryName: string;
  parentId: number | null;
  level: 1 | 2 | 3;
  /** "3 sub-categories", "2 documents", and the delete confirm text. */
  childCount: number;
  /** Show "Add sub-category" / "Add document". False on level 3 and on a sub-category already ticked on a PC-IV. */
  canAddChild: boolean;
  /** False when the category is used on a PC-IV; rename is still allowed. */
  canDelete: boolean;
  usedOnPcivCount: number;
  /** True on a document (level 3). */
  isDocument?: boolean;
  /**
   * Where staff must upload this document; null = optional. Script 036: bits 1 PC-IV, 2 PC-V, 4 Monitoring
   * (7 All); the build before: 1 PC-IV, 2 PC-V, 3 Monitoring, 4 All. Read it with codesOf().
   */
  requiredFor?: number | null;
  /** Script 036: the ticked proformas, e.g. ["PCIV", "PCV"]. */
  requiredForCodes?: string[] | null;
  /** "PC-IV", "PC-IV + PC-V", "All" or "Optional". */
  requiredForName?: string | null;
  children: DocumentCategoryNode[];
}
