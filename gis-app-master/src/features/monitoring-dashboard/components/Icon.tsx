import styles from "./MonitoringDashboard.module.css";

/** Line icons from the RTMES design (24×24, stroke = currentColor) */
const PATHS = {
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10" /></>,
  chevR: <path d="m9 6 6 6-6 6" />,
  arrow: <path d="M7 17 17 7M8 7h9v9" />,
  x: <path d="M18 6 6 18M6 6l12 12" />,
  star: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18" /></>,
  filter: <path d="M3 5h18l-7 8.5V19l-4 2v-7.5z" />,
  screen: <><rect x="2" y="3" width="20" height="13" rx="2" /><path d="M8 21h8M12 16v5" /></>,
  download: <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />,
  folder: <><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="m9 13 2 2 4-4" /></>,
  route: <><circle cx="6" cy="19" r="2.5" /><circle cx="18" cy="5" r="2.5" /><path d="M8.5 19H17a3.5 3.5 0 0 0 0-7H7a3.5 3.5 0 0 1 0-7h8.5" /></>,
  check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  ban: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6M15 9l-6 6" /></>,
  calendar: <><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9.5h18M8 2.5v4M16 2.5v4" /><path d="m9 15 2 2 4-4" /></>,
  edit: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5" /><path d="M14 3v6h6v2" /><path d="m18.5 14.5 2 2-5 5H13.5v-2z" /></>,
  review: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4" /><path d="M14 3v6h6" /><circle cx="16" cy="16" r="3.5" /><path d="m21 21-2.5-2.5" /></>,
  building: <><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" /><path d="M16 9h3a1 1 0 0 1 1 1v11M2 21h20M8 7h4M8 11h4M8 15h4" /></>,
  doc: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6M8 13h8M8 17h5" /></>,
  clipboard: <><rect x="5" y="4" width="14" height="18" rx="2" /><path d="M9 4V3h6v1M9 11h6M9 15h4" /></>,
  pin: <><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
  expand: <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />,
  finance: <><path d="M3 21h18" /><rect x="4" y="12" width="3.5" height="6" /><rect x="10.25" y="8" width="3.5" height="10" /><rect x="16.5" y="4" width="3.5" height="14" /></>,
  car: <><path d="M5 17H3v-5l2-5h11l3 5h2v5h-2" /><circle cx="7.5" cy="17" r="2" /><circle cx="16.5" cy="17" r="2" /><path d="M9.5 17h5M5 12h14" /></>,
  userPin: <><circle cx="12" cy="7" r="4" /><path d="M5 21v-1a7 7 0 0 1 14 0v1" /></>,
  gauge: <><path d="M12 14l4-4" /><path d="M3.3 19a10 10 0 1 1 17.4 0" /></>,
  chart: <><path d="M3 3v18h18" /><path d="M7 15v2M11 11v6M15 7v10M19 12v5" /></>,
  shieldCheck: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="m9 12 2 2 4-4" /></>,
  umbrella: <><path d="M22 12a10 10 0 0 0-20 0z" /><path d="M12 12v7a2 2 0 0 0 4 0" /></>,
  box: <><path d="m21 8-9-5-9 5v8l9 5 9-5z" /><path d="m3 8 9 5 9-5M12 13v8" /></>,
  back: <path d="M19 12H5M11 6l-6 6 6 6" />,
} as const;

export type IconName = keyof typeof PATHS;

interface Props {
  name: IconName;
  className?: string;
}

const Icon = ({ name, className }: Props) => (
  <svg
    className={className ? `${styles.icon} ${className}` : styles.icon}
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    {PATHS[name]}
  </svg>
);

export default Icon;
