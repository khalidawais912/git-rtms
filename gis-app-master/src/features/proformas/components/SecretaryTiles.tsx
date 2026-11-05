"use client";
import { Building2, CalendarCheck, ChevronRight, Files, FileSearch, Send, Undo2 } from "lucide-react";
import Link from "next/link";
import { CSSProperties, ReactNode } from "react";
import { ProformaType } from "../adapters";
import { ProjectView } from "../projectRows";
import { ProformaTabId } from "../utils";
import styles from "./SecretaryTiles.module.css";

/** A count per type; undefined = the server does not send it yet (shown as "–"). */
export type TypeCounts = Partial<Record<ProformaType, number>>;

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

const show = (n?: number) => (n === undefined ? "–" : n.toLocaleString("en-US"));
const listHref = (type: ProformaType, tab: ProformaTabId) => `/proformas?type=${type}&tab=${tab}`;
/** Total PC(IV)s / Total PC(V)s: the projects table of that type. */
const totalHref = (type: ProformaType) => `/proformas/all?type=${type}`;
const tableHref = (type: ProformaType, view: ProjectView) => `${totalHref(type)}&view=${view}`;

interface SplitTile {
  key: keyof Omit<SecretaryCounts, "totalPc4" | "totalPc5">;
  label: string;
  icon: ReactNode;
  color: string;
  /** Where a half opens: the list to act from (Forward / Refer back), or the table. */
  href: (type: ProformaType) => string;
}

const SPLIT_TILES: SplitTile[] = [
  { key: "attached", label: "Submitted by Attached Dept.", icon: <Building2 size={22} />, color: "var(--brand)", href: (t) => listHref(t, "attached") },
  { key: "takeUp", label: "Take-up for Evaluation", icon: <FileSearch size={22} />, color: "var(--indigo)", href: (t) => tableHref(t, "takeUp") },
  { key: "referback", label: "Referback", icon: <Undo2 size={22} />, color: "var(--rose)", href: (t) => `/proformas?type=${t}&list=referback&tab=referbackByDgme` },
  { key: "submittedToDgme", label: "Submitted To DGM&E", icon: <Send size={22} />, color: "var(--info)", href: (t) => tableHref(t, "submittedToDgme") },
];

const color = (tc: string) => ({ "--tc": tc }) as CSSProperties;

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
      <Link href={totalHref("pc4")} className={styles.tile} style={color("var(--pc4)")}>
        <span className={styles.icon}>
          <Files size={22} />
        </span>
        <span className={styles.value}>{show(counts.totalPc4)}</span>
        <span className={styles.label}>Total PC(IV)s</span>
        {totalBand}
      </Link>

      <Link href={totalHref("pc5")} className={styles.tile} style={color("var(--pc5)")}>
        <span className={styles.icon}>
          <CalendarCheck size={22} />
        </span>
        <span className={styles.value}>{show(counts.totalPc5)}</span>
        <span className={styles.label}>Total PC(V)s</span>
        {totalBand}
      </Link>

      {SPLIT_TILES.map((tile) => {
        const c = counts[tile.key];
        return (
          <div key={tile.key} className={`${styles.tile} ${styles.split}`} style={color(tile.color)}>
            <span className={styles.icon}>{tile.icon}</span>
            <span className={styles.splitLabel}>{tile.label}</span>
            <span className={styles.halves}>
              {(["pc4", "pc5"] as ProformaType[]).map((type) => (
                <Link
                  key={type}
                  href={tile.href(type)}
                  className={styles.half}
                  aria-label={`${tile.label}: open the ${type === "pc4" ? "PC-IV" : "PC-V"} list`}
                >
                  <span className={styles.halfLabel}>{type === "pc4" ? "PC-IV" : "PC-V"}</span>
                  <b>{show(c[type])}</b>
                  <span className={styles.go}>
                    <ChevronRight size={16} />
                  </span>
                </Link>
              ))}
            </span>
          </div>
        );
      })}
    </section>
  );
};

export default SecretaryTiles;
