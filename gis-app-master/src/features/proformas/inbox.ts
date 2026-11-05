import { PCIV_FINAL_STATUSES, PcivInboxReport } from "@/features/pciv";
import { PROFORMA_ADAPTERS, PROFORMA_TYPES, ProformaType } from "./adapters";
import { PROFORMA_TABS, ProformaTabId } from "./utils";

/**
 * The user's proformas of one type, oldest first. The newest history action tells a
 * submitted proforma from a referred-back one, so the open ones each load their history.
 */
export const loadInbox = async (type: ProformaType, userId: number): Promise<PcivInboxReport[]> => {
  const adapter = PROFORMA_ADAPTERS[type];
  const inbox = await adapter.inbox(userId);
  const reports = await Promise.all(
    inbox.reports.map(async (report) => {
      if (PCIV_FINAL_STATUSES.includes(report.status)) return report;
      const history = await adapter.history(report.pcivId);
      return { ...report, lastAction: history[0]?.action ?? null };
    }),
  );
  return reports.sort((a, b) => new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime());
};

/** The numbers of the tiles that open the tabs: the rows those tabs show. */
export interface TileRowCounts {
  attached: number;
  referback: number;
}

export const tileRowCounts = (rows: PcivInboxReport[], userId: number): TileRowCounts => {
  const count = (id: ProformaTabId) => {
    const tab = PROFORMA_TABS.find((t) => t.id === id)!;
    return rows.filter((r) => tab.match(r, userId)).length;
  };
  return { attached: count("attached"), referback: count("referbackByDgme") + count("referbackToDept") };
};

/** Tile numbers per type; a type that fails to load is left out, and its tiles show "–". */
export const loadTileRowCounts = async (userId: number) => {
  const result: Partial<Record<ProformaType, TileRowCounts>> = {};
  await Promise.all(
    PROFORMA_TYPES.map(async (type) => {
      try {
        result[type] = tileRowCounts(await loadInbox(type, userId), userId);
      } catch {
        // the tile shows "–"
      }
    }),
  );
  return result;
};
