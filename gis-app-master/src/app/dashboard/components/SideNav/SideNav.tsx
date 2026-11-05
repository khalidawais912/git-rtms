import { useState } from "react";
import styles from "./Sidenav.module.css";

interface SideNavProps {
  onToggle: (expanded: boolean) => void;
}

const SideNav: React.FC<SideNavProps> = ({ onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidenav = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onToggle(newState); // Notify parent about the change
  };

  return (
    <div className={`${styles.sidenav} ${isExpanded ? styles.expanded : ""}`}>
      <button
        className="btn btn-dark mb-3"
        onClick={toggleSidenav}
        aria-label="Toggle navigation"
      >
        ☰
      </button>
      <a href="#" className="nav-link text-white">
        Home
      </a>
      <a href="#" className="nav-link text-white">
        About
      </a>
      <a href="#" className="nav-link text-white">
        Services
      </a>
      <a href="#" className="nav-link text-white">
        Contact
      </a>
    </div>
  );
};

export default SideNav;
