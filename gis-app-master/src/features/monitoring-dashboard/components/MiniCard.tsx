import { CSSProperties, ReactNode } from "react";
import Icon, { IconName } from "./Icon";
import styles from "./MonitoringDashboard.module.css";

interface Props {
  icon: IconName;
  value: ReactNode;
  label: string;
  /** Card colour, e.g. "var(--violet)" */
  color: string;
  className?: string;
  /** Shows the green "All clear" chip */
  allClear?: boolean;
  /** Red count in the corner */
  badge?: number;
  disabled?: boolean;
  /** Render as a span (inside a link) instead of a button */
  as?: "button" | "span";
}

/** Small coloured card with icon, number and label (design: .mini) */
const MiniCard = ({
  icon,
  value,
  label,
  color,
  className = "",
  allClear,
  badge,
  disabled,
  as = "button",
}: Props) => {
  const Tag = as;
  return (
    <Tag
      {...(as === "button" ? { type: "button" as const } : {})}
      className={`${styles.click} ${styles.mini} ${className}`}
      style={{ "--tc": color } as CSSProperties}
      aria-disabled={disabled || undefined}
    >
      <span className={styles.mi}>
        <Icon name={icon} />
      </span>
      <span>
        <b className={styles.num}>{value}</b>
        <small>{label}</small>
      </span>
      {allClear && (
        <span className={styles.clearChip}>
          <Icon name="check" />
          All clear
        </span>
      )}
      {!!badge && <span className={`${styles.badge} ${styles.num}`}>{badge}</span>}
    </Tag>
  );
};

export default MiniCard;
