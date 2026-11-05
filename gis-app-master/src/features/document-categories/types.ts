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
  children: DocumentCategoryNode[];
}
