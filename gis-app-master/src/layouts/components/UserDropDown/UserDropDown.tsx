"use client";
import { FEEDBACK_API } from "@/services/endpoints";
import { FeedbackItem } from "@/features/feedback";
import apiClient from "@/services/client";
import feedback from "@/public/icons/feedback.svg";
import signOut from "@/public/icons/signOut.svg";
import { clearSession, getSession } from "@/utils/session";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import ChangePasswordForm from "./ChangePasswordForm";
import styles from "@/components/DownloadDropDown/Dropdown.module.css";
import UploadProfileImgAndSign from "./UploadProfileImgAndSign";
import navStyles from "../Navbar/Navbar.module.css";
import { useEffectEvent } from "@/hooks/useEffectEvent";

/** "super_admin" → "SA", "umar shafiq" → "US" */
const initials = (name: string) =>
  name
    .split(/[\s_.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "U";

const UserDropDown = () => {
  const [roleLabel, setRoleLabel] = useState("");
  const [show, setShow] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState<number>();
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState<string>();
  const [firstName, setFirstName] = useState<string>();
  const [lastName, setLastName] = useState<string>();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const email = getSession("email") || "";
    const userName = getSession("userName") || "";
    const userId = getSession("userId") || "";
    const role = getSession("role") || "";
    const firstName = getSession("deptUserFirstName");
    const lastName = getSession("deptUserLastName");

    if (firstName) setFirstName(firstName);
    if (lastName) setLastName(lastName);
    setUserEmail(email);
    setUserName(userName);
    setUserId(parseInt(userId));
    setRole(role.toLowerCase());
    setRoleLabel(role);
  }, [router]);

  const handleLogout = () => {
    clearSession();
    setShow(false);
    window.location.href = "/login";
  };

  useEffect(() => {
    if (typeof window === "undefined") return; // Prevents SSR crash
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const [, setCurrentTime] = useState("");

  useEffect(() => {
    const formatTime = (date: Date) => {
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const isPM = hours >= 12;
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const ampm = isPM ? "PM" : "AM";
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(formatTime(now));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const [data, setData] = useState<FeedbackItem[]>();
  const onUserIdChange = useEffectEvent(() => {
    const handleSubmit = async (userId: number) => {
      try {
        const response = await apiClient.get(
          `${FEEDBACK_API}/GetFeedBackByReportingTo?reportingTo=${userId}`,
        );
        setData(response.data.data);
      } catch (err) {
        console.error("Submission error:", err);
      }
    };
    if (userId && role === "director") handleSubmit(userId);
  });
  useEffect(() => onUserIdChange(), [userId, onUserIdChange]);

  return (
    <>
      {userName ? (
        <div className={styles.dropdown} ref={dropdownRef}>
          <button
            type="button"
            className={navStyles.user}
            onClick={() => setShow(!show)}
            aria-label="Account menu"
            aria-expanded={show}
            title={[firstName, lastName].filter(Boolean).join(" ") || undefined}
          >
            <span className={navStyles.avatar}>{initials(userName)}</span>
            <span className={navStyles.userMeta}>
              <span className={navStyles.userName}>{userName}</span>
              <span className={navStyles.userRole}>{roleLabel}</span>
            </span>
            <svg className={navStyles.icon} style={{ width: 16, height: 16, opacity: 0.75 }} viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 9 6 6 6-6" />
            </svg>
            {role === "director" && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {data && data.length > 0
                  ? data.filter((d) => d.status === 0).length
                  : ""}
              </span>
            )}
          </button>
          <div
            className={`fs12px ${styles.dropdownContent} ${
              show && styles.show
            }`}
            style={{ zIndex: 5, right: 0, minWidth: 240 }}
          >
            <div className="row d-flex align-items-center m-0 pt-1">
              <div className="col-auto m-auto ms-1 mt-1 mb-1 p-0">
                <Image unoptimized
                  className="img-fluid rounded-circle m-0"
                  src="/icons/logoNew.svg"
                  style={{ objectFit: "cover" }}
                  alt="profilePic"
                  width={50}
                  height={50}
                />
              </div>
              <div className="col p-0 m-auto ms-1 p-1">
                <p className="m-0 text-dark fs13px fw-6 text-break text-wrap">
                  {userName}
                </p>
                <p
                  className="fs11px text-start text-wrap text-break"
                  style={{
                    color: "#575757",
                    marginTop: "-2px",
                    marginBottom: 0,
                  }}
                >
                  {userEmail}
                </p>
              </div>
            </div>
            {role === "director" && (
              <Link href="/feedback" target="_blank" className="fw-normal">
                <div className="position-relative">
                  <Image
                    src={feedback}
                    alt="feedback"
                    width={20}
                    height={20}
                    className="me-2 mb-1"
                  />
                  FeedBack
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {data && data.length > 0
                      ? data.filter((d) => d.status === 0).length
                      : ""}
                  </span>
                </div>
              </Link>
            )}
            <div className="pt-0 pb-0 ps-3 pe-3">
              <div className="dropdown-divider m-0"></div>
            </div>
            <ChangePasswordForm userName={userName} />
            {role === "administrative secretary" && userId && (
              <UploadProfileImgAndSign userId={userId} />
            )}
            <div className="pt-0 pb-0 ps-3 pe-3">
              <div className="dropdown-divider m-0"></div>
            </div>
            <Button
              onClick={handleLogout}
              className="btn text-nowrap fs12px fw-normal shadow-none text-start w-100"
              style={{ padding: "6px 16px" }}
            >
              <Image
                src={signOut}
                alt="signOut"
                width={20}
                height={20}
                className="me-2 mb-1"
              />
              Sign out
            </Button>
          </div>
        </div>
      ) : !userName ? (
        ""
      ) : (
        <div className="d-flex align-items-center justify-content-center h-100">
          <Spinner color="text-light" />
        </div>
      )}
    </>
  );
};

export default UserDropDown;
