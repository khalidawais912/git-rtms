import Link from "next/link";
import { RiHomeLine } from "react-icons/ri";

const HomeButton = () => {
  return (
    <Link
      href="/"
      className="btn d-flex align-items-center rounded-pill fw-5 fs18px bg-color-evaluation-theme-blue text-white w-auto"
      style={{
        border: "1px solid #CBD5E1",
        padding: "16px 24px",
        gap: "12px",
      }}
    >
      Take Me Home
      <RiHomeLine size={24} />
    </Link>
  );
};

export default HomeButton;
