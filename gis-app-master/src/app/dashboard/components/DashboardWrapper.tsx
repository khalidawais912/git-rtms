import { PropsWithChildren } from "react";
import styles from "@/app/dashboard/components/Dashboard.module.css";

const DashboardWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="shadow-sm"
      style={{
        padding: "5px",
        backgroundImage: "url(/images/dashboard-border.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        borderRadius: "10px",
      }}
    >
      <div
        className={styles.bgBlur}
        style={{
          borderRadius: "10px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardWrapper;
