"use client";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { CSSProperties, ReactNode } from "react";
import { ProformaType } from "../adapters";
import styles from "./SecretaryTiles.module.css";

/** A count per type; undefined = the server does not send it yet (shown as "–"). */
export type TypeCounts = Partial<Record<ProformaType, number>>;

export interface SplitTile {
  key: string;
  label: string;
  icon: ReactNode;
  color: string;
  counts: TypeCounts;
  /** Where a half opens. */
  href: (type: ProformaType) => string;
  /** A short line under a half's number, e.g. "To Evaluator". */
  notes?: Partial<Record<ProformaType, string>>;
}

const TYPES: ProformaType[] = ["pc4", "pc5"];
const TYPE_LABEL: Record<ProformaType, string> = { pc4: "PC-IV", pc5: "PC-V" };

export const show = (n?: number) => (n === undefined ? "–" : n.toLocaleString("en-US"));

export const tileColor = (tc: string) => ({ "--tc": tc }) as CSSProperties;

/** One status tile (RTMES design): icon and name on top, then two halves, PC-IV n › | PC-V n ›. */
export const SplitTileCard = ({ tile, wide }: { tile: SplitTile; wide?: boolean }) => (
  <div className={`${styles.tile} ${styles.split} ${wide ? styles.quarter : ""}`} style={tileColor(tile.color)}>
    <span className={styles.icon}>{tile.icon}</span>
    <span className={styles.splitLabel}>{tile.label}</span>
    <span className={styles.halves}>
      {TYPES.map((type) => {
        const note = tile.notes?.[type];
        return (
          <Link
            key={type}
            href={tile.href(type)}
            className={`${styles.half} ${note ? styles.halfNoted : ""}`}
            aria-label={`${tile.label}: open the ${TYPE_LABEL[type]} list`}
          >
            <span className={styles.halfLabel}>{TYPE_LABEL[type]}</span>
            <b>{show(tile.counts[type])}</b>
            {note && <span className={styles.halfNote}>{note}</span>}
            <span className={styles.go}>
              <ChevronRight size={16} />
            </span>
          </Link>
        );
      })}
    </span>
  </div>
);

/** A row of status tiles, four to a row. */
const SplitTiles = ({ tiles, label }: { tiles: SplitTile[]; label: string }) => (
  <section className={styles.tiles} aria-label={label}>
    {tiles.map((tile) => (
      <SplitTileCard key={tile.key} tile={tile} wide />
    ))}
  </section>
);

export default SplitTiles;
