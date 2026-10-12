"use client";
import { FEEDBACK_API } from "@/app/APIs";
import { Feedback } from "@/app/feedback/components/Feedback";
import apiClient from "@/app/services/api-client";
import downArrowBold from "@/public/icons/downArrowBold.svg";
import feedback from "@/public/icons/feedback.svg";
import signOut from "@/public/icons/signOut.svg";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import Spinner from "../Spinner";
import ChangePasswordForm from "./ChangePasswordForm";
import styles from "./UserDropDown.module.css";
import UploadProfileImgAndSign from "./UploadProfileImgAndSign";

const UserDropDown = () => {
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
    const email = Cookies.get("email") || "";
    const userName = Cookies.get("userName") || "";
    const userId = Cookies.get("userId") || "";
    const role = Cookies.get("role") || "";
    const firstName = Cookies.get("deptUserFirstName");
    const lastName = Cookies.get("deptUserLastName");

    if (firstName) setFirstName(firstName);
    if (lastName) setLastName(lastName);
    setUserEmail(email);
    setUserName(userName);
    setUserId(parseInt(userId));
    setRole(role.toLowerCase());
  }, [router]);

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

  const [currentTime, setCurrentTime] = useState("");

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

  const [data, setData] = useState<Feedback[]>();
  useEffect(() => {
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
  }, [userId]);

  return (
    <>
      {userName ? (
        <div className={styles.dropdown} ref={dropdownRef}>
          <Button
            className="btn btn-sm badge rounded-pill shadow-sm p-0 position-relative"
            onClick={() => setShow(!show)}
            style={{
              padding: "5px 15px 5px 8px",
              background: "rgba(255, 255, 255, 0.62)",
            }}
          >
            <div className="row d-flex align-items-center gx-2 py-1">
              <div className="col-auto">
                <img
                  className="img-fluid rounded-circle m-0"
                  src="/icons/logoNew.svg"
                  style={{ objectFit: "cover" }}
                  alt="profilePic"
                  width={40}
                  height={40}
                />
              </div>
              <div className="col">
                <p className="m-0 text-dark text-start fs13px fw-6">
                  {userName}
                </p>
                <p
                  className="m-0 text-start mt-1 fs11px fw-normal"
                  style={{ color: "#575757" }}
                >
                  {/* {currentTime} */}
                  {firstName} {lastName}
                </p>
              </div>
              <div className="col-auto ps-2 pe-3">
                <Image src={downArrowBold} alt="downArrowBold" />
              </div>
            </div>
            {role === "director" && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {data && data.length > 0
                  ? data.filter((d) => d.status === 0).length
                  : ""}
              </span>
            )}
          </Button>
          <div
            className={`fs12px ${styles.dropdownContent} ${
              show && styles.show
            }`}
            style={{ zIndex: 5 }}
          >
            <div className="row d-flex align-items-center m-0 pt-1">
              <div className="col-auto m-auto ms-1 mt-1 mb-1 p-0">
                <img
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
            {/* <Link href="" className="fw-normal">
          <Image
            src={settingBlack}
            alt="settingBlack"
            width={20}
            height={20}
            className="me-2 mb-1"
          />
          Settings
        </Link> */}
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
