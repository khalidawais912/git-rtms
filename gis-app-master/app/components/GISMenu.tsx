"use client";
import reportAnalysis2 from "@/public/icons/reportAnalysis2.svg";
import staffTrackingIcon from "@/public/icons/staffTracking.svg";
import userProjects from "@/public/icons/userProjects.svg";
import vehicleTrackingIcon from "@/public/icons/vehicleTracking.svg";
import visitSchedule from "@/public/icons/visitSchedule.svg";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import clock2 from "../../public/icons/clock-2.svg";
import cross from "../../public/icons/cross-2.svg";
import dashboard from "../../public/icons/dashboard.svg";
import db from "../../public/icons/db.svg";
import departments from "../../public/icons/departments.svg";
import downArrow from "../../public/icons/down-arrow.svg";
import driver from "../../public/icons/driver.svg";
import group from "../../public/icons/group.svg";
import newVisitPlan from "../../public/icons/newVisitPlan.svg";
import process from "../../public/icons/process.svg";
import qr from "../../public/icons/qr.svg";
import rightsWhite from "../../public/icons/rightsWhite.svg";
import rolesWhite from "../../public/icons/rolesWhite.svg";
import superGroupWhite from "../../public/icons/superGroupWhite.svg";
import truck from "../../public/icons/truck.svg";
import user3White from "../../public/icons/user3White.svg";
import visits from "../../public/icons/visits.svg";
import Button from "./Button";

interface Data {
  name: string;
  nameId: string;
  link: string;
  icon: any;
  backgroundColor: string;
}

const GISMenu = ({
  dashboardType,
}: {
  dashboardType: string | null | undefined;
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [rights, setRights] = useState([]);

  const router = useRouter();

  const searchParams = useSearchParams();
  const currentParams = searchParams.toString();

  useEffect(() => {
    const rights = JSON.parse(Cookies.get("rights") || "[]");
    setRights(rights);
  }, [router]);

  const [filteredMenu, setFilteredMenu] = useState<Data[]>();

  useEffect(() => {
    const data: Data[] = [
      {
        name: "Main Dashboard",
        nameId: "dashboard",
        link: "/dashboard",
        icon: dashboard,
        backgroundColor: "linear-gradient(to bottom right, #5746DD , #26AE92)",
      },
      // {
      //   name: "DG Dashboard",
      //   nameId: "dashboard",
      //   link: "/dashboard",
      //   icon: dashboard,
      //   backgroundColor: "linear-gradient(to bottom right, #3e86d6 , #235aa6)",
      // },
      {
        name: "Attendance Dashboard",
        nameId: "dashboard-attendance",
        link: "/dashboard-attendance",
        icon: dashboard,
        backgroundColor: "linear-gradient(to bottom right, #43abd1 , #2680ad)",
      },
      // {
      //   name: "Director Dashboard",
      //   nameId: "dashboard",
      //   link: "/dashboard",
      //   icon: dashboard,
      //   backgroundColor: "linear-gradient(to bottom right, #4364d9 , #211fab)",
      // },
      // {
      //   name: "Deputy Director Dashboard",
      //   nameId: "dashboard",
      //   link: "/dashboard",
      //   icon: dashboard,
      //   backgroundColor: "linear-gradient(to bottom right, #3d76d1 , #217a9c)",
      // },
      // {
      //   name: "Officer Dashboard",
      //   nameId: "dashboard-officer",
      //   link: "/dashboard-officer",
      //   icon: dashboard,
      //   backgroundColor: "linear-gradient(to bottom right, #5746DD , #26AE92)",
      // },
      // {
      //   name: "IT Dashboard",
      //   nameId: "dashboard-it",
      //   link: "/dashboard-it",
      //   icon: dashboard,
      //   backgroundColor: "linear-gradient(to bottom right, #5746DD , #26AE92)",
      // },
      {
        name: "TO Dashboard",
        nameId: "dashboard-to",
        link: "/dashboard-to",
        icon: dashboard,
        backgroundColor: "linear-gradient(to bottom right, #3c74c2 , #2352a6)",
      },
      {
        name: "DDO Dashboard",
        nameId: "dashboard-ddo",
        link: "/dashboard-ddo",
        icon: dashboard,
        backgroundColor: "linear-gradient(to bottom right, #5746DD , #26AE92)",
      },
      // {
      //   name: "Summary Dashboard",
      //   nameId: "dashboard-summary",
      //   link: "/department-dashboard-summary",
      //   icon: dashboard,
      //   backgroundColor:
      //     "linear-gradient(to bottom right, red ,#E48E6E , yellow)",
      // },
      {
        name: "Vehicle Tracking",
        nameId: "vehicle-tracking",
        link: "/vehicle-tracking",
        icon: vehicleTrackingIcon,
        backgroundColor: "linear-gradient(to bottom right, #a82897 , #2871a8)",
      },
      {
        name: "Staff Tracking",
        nameId: "staff-tracking",
        link: "/staff-tracking",
        icon: staffTrackingIcon,
        backgroundColor: "linear-gradient(to bottom right, #7f28a8 , #a82828)",
      },
      {
        name: "Sectors",
        nameId: "sectors",
        link: "/sectors",
        icon: clock2,
        backgroundColor: "linear-gradient(to bottom right, #7b9cc9 , #b4cdf0)",
      },
      {
        name: "Projects",
        nameId: "projects",
        link: "/projects",
        icon: qr,
        backgroundColor: "linear-gradient(to bottom right, #8B5ABF , #5345DF)",
      },
      {
        name: "User Projects",
        nameId: "user-projects",
        link: "/user-projects",
        icon: userProjects,
        backgroundColor: "linear-gradient(to bottom right, #542487 , #41c4c2)",
      },
      {
        name: "Super Group",
        nameId: "super-group",
        link: "/super-group",
        icon: superGroupWhite,
        backgroundColor: "linear-gradient(to bottom right, #28A897 , #E73A80)",
      },
      {
        name: "Attribute Groups",
        nameId: "attribute-groups",
        link: "/attribute-groups",
        icon: group,
        backgroundColor: "linear-gradient(to bottom right, #22B46A , #096764)",
      },
      {
        name: "Attributes",
        nameId: "attributes",
        link: "/attributes",
        icon: db,
        backgroundColor: "linear-gradient(to bottom right, #F08630 , #E75161)",
      },
      {
        name: "Users",
        nameId: "users",
        link: "/users",
        icon: user3White,
        backgroundColor: "linear-gradient(to bottom right, #E8A070 , #DA4A6A)",
      },
      {
        name: "Roles",
        nameId: "roles",
        link: "/roles",
        icon: rolesWhite,
        backgroundColor: "linear-gradient(to bottom right, #e2e870 , #daaf4a)",
      },
      {
        name: "Rights",
        nameId: "rights",
        link: "/rights",
        icon: rightsWhite,
        backgroundColor: "linear-gradient(to bottom right, brown , pink)",
      },
      {
        name: "Vehicles",
        nameId: "vehicles",
        link: "/vehicles",
        icon: truck,
        backgroundColor: "linear-gradient(to bottom right, #A33CB2 , #E73A80)",
      },
      {
        name: "Drivers",
        nameId: "drivers",
        link: "/drivers",
        icon: driver,
        backgroundColor: "linear-gradient(to bottom right, #db4444 , #ad2323)",
      },
      {
        name: "Visit Plans",
        nameId: "visit-plans",
        link: "/visit-plans",
        icon: visitSchedule,
        backgroundColor: "linear-gradient(to bottom right, #259799, #1b4d9e )",
      },
      // {
      //   name: "Visits New",
      //   nameId: "visits-new",
      //   link: "/visits-new",
      //   icon: visits,
      //   backgroundColor: "linear-gradient(to bottom right, #28A811 , yellow)",
      // },
      {
        name: "Departments",
        nameId: "departments",
        link: "/departments",
        icon: departments,
        backgroundColor: "linear-gradient(to bottom right, #d3db44 , #23ad91)",
      },
      {
        name: "New Visit Plan",
        nameId: "new-visit-plan",
        link: "/new-visit-plan",
        icon: newVisitPlan,
        backgroundColor: "linear-gradient(to bottom right, #964614 , #118fa8)",
      },
      {
        name: "Report Analysis",
        nameId: "report-analysis",
        link: "/report-analysis",
        icon: reportAnalysis2,
        backgroundColor: "linear-gradient(to bottom right, #1137a8 , #363636)",
      },
      {
        name: "File Process Hirarchy",
        nameId: "process",
        link: "/process",
        icon: process,
        backgroundColor: "linear-gradient(to bottom right, #a8118f , #11a89b)",
      },

      // {
      //   name: "Visits",
      //   nameId: "visits",
      //   link: "/visits",
      //   icon: visits,
      //   backgroundColor: "linear-gradient(to bottom right, #28A897 , yellow)",
      // },
      // {
      //   name: "Visits Scheduled",
      //   nameId: "visitsScheduled",
      //   link: "/visitsScheduled",
      //   icon: visitSchedule,
      //   backgroundColor: "linear-gradient(to bottom right, #28A897 , violet)",
      // },
      {
        name: "Project Document Names",
        nameId: "project-document-names",
        link: "/project-document-names",
        icon: process,
        backgroundColor: "linear-gradient(to bottom right, #a8118f , #11a89b)",
      },
    ];

    if (rights) {
      // Filter data based on rights
      const filteredData = data.filter((item) =>
        rights.some(
          (right: string) => right.toLowerCase() === item.nameId.toLowerCase(),
        ),
      );
      console.log("rights filtered", filteredData);
      setFilteredMenu(filteredData);
    }
  }, [router, rights]);

  return (
    <>
      {rights?.length <= 1 ? (
        <label
          className="nav-link text-white badge rounded-pill fw-6"
          style={{
            padding: "12px 15px 12px 15px",
            fontSize: "22px",
            letterSpacing: 1,
          }}
        >
          {dashboardType ? "Evaluation Dashboard" : "Monitoring Dashboard"}
        </label>
      ) : (
        <Button
          type="button"
          className="nav-link btn btn-sm text-white badge rounded-pill bg-color-light-blue shadow-sm fs-6 fw-6"
          style={{
            padding: "12px 15px 12px 15px",
            fontSize: "22px",
            letterSpacing: 1,
          }}
          onClick={handleShow}
        >
          {dashboardType ? "Evaluation Dashboard" : "Monitoring Dashboard"}
          &nbsp;
          <Image src={downArrow} alt="down arrow" />
        </Button>
      )}

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="gismenu-modal"
        backdropClassName="custom-backdrop"
      >
        <Modal.Body className="bg-transparent">
          <div
            className="container-fluid border border-white pt-3 pb-3 ps-4 pe-4 bg-blur"
            style={{
              borderRadius: "20px",
              marginTop: "30px",
            }}
          >
            <div className="col">
              <Button className="btn p-0" onClick={() => setShow(!show)}>
                <Image src={cross} alt="cross" width={30} />
              </Button>
            </div>
            <div className="row d-flex justify-content-center p-4">
              {filteredMenu?.map((d) => (
                <Link
                  href={`${d.link}${currentParams ? `?${currentParams}` : ""}`}
                  key={d.name}
                  className="col text-center text-decoration-none mb-2"
                  onClick={() => setShow(!show)}
                >
                  <motion.div
                    className="col"
                    // style={{ borderRadius: "10px" }}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                      // boxShadow: "0px 2.5px 3px .5px rgba(0, 0, 0, 0.6)",
                    }}
                  >
                    <div
                      className="col text-center"
                      style={{
                        backgroundImage: d.backgroundColor,
                        borderRadius: "10px",
                        padding: "40px 45px",
                      }}
                    >
                      <Image src={d.icon} alt={d.icon} width={40} height={40} />
                    </div>
                  </motion.div>
                  <div
                    className="col text-center fw-bold mt-1 fs18px"
                    style={{ color: "#676767" }}
                  >
                    {d.name === "Summary Dashboard" ? (
                      <>
                        Summary <br />
                        Dashboard
                      </>
                    ) : (
                      d.name
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GISMenu;
