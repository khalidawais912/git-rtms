"use client";
import CustomModal from "@/components/CustomModal/CustomModal";
import { formatAmountWithCommas } from "@/utils";
import { MainDashboard } from "../types";
import { millionsToBillions, percent } from "../utils";
import Icon from "./Icon";
import styles from "./MonitoringDashboard.module.css";

/** Allocation figures shown under "Details" (same fixed values as the old Approved Cost card) */
const ALLOCATION_FIGURES = [
  { value: "7409", label: "Total Scheme" },
  { value: "842.00 B", label: "Original Allocation" },
  { value: "842.00 B", label: "Revised Allocation" },
  { value: "514.64 B", label: "P&D Release" },
  { value: "498.07 B", label: "Controlling Release" },
  { value: "472.76 B", label: "Spending Release" },
  { value: "249.86 B", label: "Utilization" },
];

/** Approved cost against expenditure (backend amounts are in millions) */
const BudgetPanel = ({ data }: { data?: MainDashboard }) => {
  const used = percent(data?.expenditure, data?.approvedCost);

  return (
    <div className={styles.panel}>
      <div className={styles.panelH}>
        <h2>Budget &amp; spending</h2>
        <CustomModal
          HeaderRightPos={0}
          HeaderTopPos={17}
          buttonColumn={styles.pushRight}
          size="xl"
          modalId="approvedCost"
          button={
            <button type="button" className={`${styles.click} ${styles.more}`}>
              Details <Icon name="chevR" />
            </button>
          }
          body={
            <div className={`${styles.root} ${styles.modalBody}`}>
              <h3>Allocation &amp; releases</h3>
              <div className={styles.figures}>
                {ALLOCATION_FIGURES.map((f) => (
                  <div key={f.label} className={styles.figure}>
                    <b className={styles.num}>{f.value}</b>
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          }
        />
      </div>
      <div className={styles.kv} title={`${data ? formatAmountWithCommas(data.approvedCost) : 0} M`}>
        <span>Approved cost</span>
        <b className={styles.num}>
          Rs {millionsToBillions(data?.approvedCost)} <small>Bn</small>
        </b>
      </div>
      <div className={styles.kv} style={{ border: 0 }} title={`${data ? formatAmountWithCommas(data.expenditure) : 0} M`}>
        <span>Expenditure</span>
        <b className={styles.num}>
          Rs {millionsToBillions(data?.expenditure)} <small>Bn</small>
        </b>
      </div>
      <div className={styles.bar}>
        <span style={{ width: `${Math.min(used, 100)}%`, background: "var(--info)", minWidth: 8 }} />
      </div>
      <div className={styles.used}>
        <span>Budget used</span>
        <b className={styles.num}>{used.toFixed(2)}%</b>
      </div>
    </div>
  );
};

export default BudgetPanel;
