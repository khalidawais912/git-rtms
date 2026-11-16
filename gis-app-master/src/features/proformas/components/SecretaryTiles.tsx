"use client";
import { Building2, CalendarCheck, ChevronRight, Files, FileSearch, Send, Undo2 } from "lucide-react";
import Link from "next/link";
import { ProformaType } from "../adapters";
import { ProjectView } from "../projectRows";
import { ProformaTabId } from "../utils";
import styles from "./SecretaryTiles.module.css";
import { show, SplitTile, SplitTileCard, tileColor, TypeCounts } from "./SplitTiles";

export type { TypeCounts };

export interface SecretaryCounts {
  totalPc4?: number;
  totalPc5?: number;
  submittedToDgme: TypeCounts;
  takeUp: TypeCounts;
  referback: TypeCounts;
  attached: TypeCounts;
}

interface Props {
  counts: SecretaryCounts;
}

const listHref = (type: ProformaType, tab: ProformaTabId) => `/proformas?type=${type}&tab=${tab}`;
/** Total PC(IV)s / Total PC(V)s: the projects table of that type. */
const totalHref = (type: ProformaType) => `/proformas/all?type=${type}`;
const tableHref = (type: ProformaType, view: ProjectView) => `${totalHref(type)}&view=${view}`;

type SplitKey = keyof Omit<SecretaryCounts, "totalPc4" | "totalPc5">;

/** Where a half opens: the list to act from (Forward / Refer back), or the table. */
const SPLIT_TILES: (Omit<SplitTile, "counts" | "key"> & { key: SplitKey })[] = [
  { key: "attached", label: "Submitted by Attached Dept.", icon: <Building2 size={22} />, color: "var(--brand)", href: (t) => listHref(t, "attached") },
  { key: "takeUp", label: "Take-up for Evaluation", icon: <FileSearch size={22} />, color: "var(--indigo)", href: (t) => tableHref(t, "takeUp") },
  { key: "referback", label: "Referback", icon: <Undo2 size={22} />, color: "var(--rose)", href: (t) => `/proformas?type=${t}&list=referback&tab=referbackByDgme` },
  { key: "submittedToDgme", label: "Submitted To DGM&E", icon: <Send size={22} />, color: "var(--info)", href: (t) => tableHref(t, "submittedToDgme") },
];

/**
 * The Secretary's status tiles (RTMES design): Total PC(IV)s and Total PC(V)s, then one tile
 * per status: its name on top, then two halves (PC-IV n › | PC-V n ›). Attached Dept. and
 * Referback open the List of Proformas to act from; the others open the table of that type.
 * No total of both types is shown.
 */
const SecretaryTiles = ({ counts }: Props) => {
  const totalBand = (
    <span className={`${styles.band} ${styles.bandOne}`}>
      <span className={styles.bandButton}>
        <span className={styles.bandLabel}>Open the full list</span>
        <ChevronRight size={16} />
      </span>
    </span>
  );

  return (
    <section className={styles.tiles} aria-label="PC-IV and PC-V status">
      <Link href={totalHref("pc4")} className={styles.tile} style={tileColor("var(--pc4)")}>
        <span className={styles.icon}>
          <Files size={22} />
        </span>
        <span className={styles.value}>{show(counts.totalPc4)}</span>
        <span className={styles.label}>Total PC(IV)s</span>
        {totalBand}
      </Link>

      <Link href={totalHref("pc5")} className={styles.tile} style={tileColor("var(--pc5)")}>
        <span className={styles.icon}>
          <CalendarCheck size={22} />
        </span>
        <span className={styles.value}>{show(counts.totalPc5)}</span>
        <span className={styles.label}>Total PC(V)s</span>
        {totalBand}
      </Link>

      {SPLIT_TILES.map((tile) => (
        <SplitTileCard key={tile.key} tile={{ ...tile, counts: counts[tile.key] }} />
      ))}
    </section>
  );
};

export default SecretaryTiles;
