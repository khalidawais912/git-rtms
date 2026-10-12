"use client";
import Button from "@/app/components/Button";
import { useRouter } from "next/navigation";
import { FaChevronLeft } from "react-icons/fa";
import Cookies from "js-cookie";

const BackButton = () => {
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("email");
    Cookies.remove("userName");
    Cookies.remove("userId");
    Cookies.remove("role");
    Cookies.remove("rights");
    Cookies.remove("departmentId");
    Cookies.remove("deptUserFirstName");
    Cookies.remove("deptUserLastName");
    window.location.href = "/login";
  };

  return (
    <Button
      className="btn d-flex align-items-center rounded-pill fw-5 fs18px w-auto"
      style={{
        border: "1px solid #CBD5E1",
        color: "#475569",
        padding: "16px 24px",
        gap: "12px",
      }}
      onClick={() => handleLogout()}
    >
      <FaChevronLeft size={24} />
      Log out
    </Button>
  );
};

export default BackButton;
