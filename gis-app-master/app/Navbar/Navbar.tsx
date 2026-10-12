"use client";
import Cookies from "js-cookie";
import { Lexend } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { FaPlay, FaYoutube } from "react-icons/fa";
import { useSelector } from "react-redux";
import Button from "../components/Button";
import GISMenu from "../components/GISMenu";
import Spinner from "../components/Spinner";
import UserDropDown from "../components/UserDropDown/UserDropDown";
import DashboardTypeFilter from "../dashboard/components/DashboardTypeFilter";
import DepartmentCategoryFilter from "../dashboard/components/DepartmentCategoryFilter";
import { RootState } from "../store";
import styles from "./Navbar.module.css";

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const Navbar = () => {
  const [currentType, setCurrentType] = useState<string | null>();
  const searchParams = useSearchParams();
  const currentParams = searchParams.toString();
  const currentPath = usePathname();

  useEffect(() => {
    const type = searchParams.get("dashboardType");
    console.log("searchParams type", type);
    setCurrentType(type);
  }, [searchParams]);

  const [role, setRole] = useState<string>();
  const [departmentId, setDepartmentId] = useState<number>();

  const currentTutorial = useSelector(
    (state: RootState) => state.tutorial.currentTutorial,
  );

  useEffect(() => {
    const userRole = Cookies.get("role");
    const departmentId = Cookies.get("departmentId");
    if (userRole) setRole(userRole);
    if (departmentId) setDepartmentId(parseInt(departmentId));
  }, []);

  const [isEnter, setEnter] = useState(false);

  console.log("backendURL: ", process.env.NEXT_PUBLIC_BACKEND_API);

  return (
    <nav
      className={`navbar navbar-expand-lg navbar-light p-0 ${
        currentType ? styles.bgGradientEvaluation : "bg-color-sea-blue"
      } ${lexend.className}`}
      style={{
        boxShadow: "0px 3px 3px 1px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand"
          href={`/${currentParams ? `?${currentParams}` : ""}`}
        >
          <Image
            src="/icons/logoNew1.svg"
            alt="logoNew"
            style={{
              filter: "drop-shadow(0px 0px .75px green)",
              width: "64px",
              height: "64px",
            }}
            width={64}
            height={64}
            priority
          />
        </Link>
        <Button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </Button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <GISMenu dashboardType={currentType} />
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" href="#">
                    Action
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="#">
                    Another action
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item" href="#">
                    Something else here
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
            {role !== "Special Role" && (
              <li className="nav-item p-1 me-3 mt-1">
                <Link href={currentTutorial} target="_blank">
                  <div
                    style={{
                      position: "relative",
                      display: "inline-block",
                      width: "fit-content",
                      height: "fit-content",
                    }}
                    onMouseEnter={() => setEnter(true)}
                    onMouseLeave={() => setEnter(false)}
                  >
                    {/* Background div */}
                    <FaPlay
                      size={16}
                      color={`${isEnter ? "white" : "rgba(255,255,255,0)"}`}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "10px",
                        height: "10px",
                        transform: "translate(-50%, -50%)",
                        zIndex: 0, // Make sure it's behind the icon
                        transition: "color .3s",
                      }}
                    />
                    {/* YouTube Icon */}
                    <FaYoutube
                      color={`${isEnter ? "red" : "white"}`}
                      size={40}
                      style={{ transition: "color .3s" }}
                    />
                  </div>
                </Link>
              </li>
            )}
            {currentPath !== "/charts" && (
              <>
                {(departmentId === 0 || departmentId === 1) &&
                role !== "Special Role" &&
                role?.toLowerCase() !== "dgme reports" ? (
                  <li className="nav-item p-1 me-3 m-auto">
                    <Suspense
                      fallback={
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <Spinner color="text-light" />
                        </div>
                      }
                    >
                      <DashboardTypeFilter />
                    </Suspense>
                  </li>
                ) : role === "Special Role" ||
                  !role ||
                  !departmentId ||
                  "Administrative Secretary" ? (
                  ""
                ) : (
                  <li className="nav-item p-1 me-3 m-auto">
                    <Suspense
                      fallback={
                        <div className="d-flex align-items-center justify-content-center h-100">
                          <Spinner color="text-light" />
                        </div>
                      }
                    >
                      <DepartmentCategoryFilter />
                    </Suspense>
                  </li>
                )}
              </>
            )}

            <li className="nav-item p-1 me-2">
              <Link href="https://smdp.punjab.gov.pk/" target="_blank">
                <Button
                  className="btn rounded-pill fw-6 m-auto"
                  style={{
                    background: "rgba(255, 255, 255, 0.62)",
                    color: "#424242",
                    fontSize: "0.813rem",
                    padding: "10px 15px",
                  }}
                >
                  SMDP
                </Button>
              </Link>
            </li>
            <li className="nav-item dropdown me-3">
              <UserDropDown />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
