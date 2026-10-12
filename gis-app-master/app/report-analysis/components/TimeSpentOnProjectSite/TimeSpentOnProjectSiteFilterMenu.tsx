"use client";

import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import Spinner from "@/app/components/Spinner";
import { ProjectsList } from "@/app/dashboard/components/ProjectsTable/ProjectsTable";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface Props {
  selectedIndex: number;
  setSelectedIndex: Dispatch<SetStateAction<number>>;
  projectsData: ProjectsList[] | undefined;
  setProjectsData: Dispatch<SetStateAction<ProjectsList[] | undefined>>;
  filteredData: ProjectsList[] | undefined;
  setFilteredData: Dispatch<SetStateAction<ProjectsList[] | undefined>>;
  getProjectsList: (status: string) => void;
}

const TimeSpentOnProjectSiteFilterMenu = ({
  selectedIndex,
  setSelectedIndex,
  projectsData,
  setProjectsData,
  filteredData,
  setFilteredData,
  getProjectsList,
}: Props) => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [slidePath, setSlidePath] = useState<string>("");
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [isSubmitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setProjectsData([]);
    getProjectsList("BeingMonitored");
  };

  useEffect(() => {
    console.log("fromDate", new Date(fromDate).toLocaleDateString("en-GB"));
    console.log("toDate", new Date(toDate).toLocaleDateString("en-GB"));

    const dateFilteredData =
      projectsData &&
      projectsData.filter((d) => {
        const visitDate = new Date(d.visitStartDate);
        const startDate = fromDate ? new Date(fromDate) : null;
        const endDate = toDate ? new Date(toDate) : null;

        if (startDate && endDate) {
          return visitDate >= startDate && visitDate <= endDate;
        } else if (startDate) {
          return visitDate >= startDate;
        } else if (endDate) {
          return visitDate <= endDate;
        }

        return true;
      });
    setFilteredData(dateFilteredData);
  }, [projectsData]);

  useEffect(() => {
    if (isSubmitting) setSubmitting(false);
  }, [isSubmitted]);

  useEffect(() => {
    if (slidePath) {
      window.open(slidePath, "_blank");
    }
  }, [slidePath]);

  return (
    <CustomModal
      HeaderTopPos={0}
      HeaderRightPos={0}
      size="lg"
      modalId="tsops-modal"
      buttonColumn="col-auto"
      button={
        <Button
          onClick={() => setSelectedIndex(-12)}
          className={`btn rounded-pill fw-5 fs14px ${
            selectedIndex === -12 ? "bg-color-sea-blue text-white" : ""
          }`}
          style={{
            border: "1px solid #EDF1F3",
            padding: "14px",
            boxShadow: "0px 3px 5px rgba(228, 229, 231, 0.24)",
          }}
        >
          Time Spent on Project Site
        </Button>
      }
      body={
        <div className="bg-white rounded-3 p-4">
          <h3 className="fw-bold text-center">Time Spent on Project Site</h3>
          <form onSubmit={handleSubmit}>
            <div className="d-flex">
              <div className="col mb-3 p-2">
                <label htmlFor="fromDate" className="form-label">
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="form-control"
                  id="fromDate"
                  aria-describedby="emailHelp"
                />
              </div>
              <div className="col mb-3 p-2">
                <label htmlFor="toDate" className="form-label">
                  To Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
              >
                Filter {isSubmitting && <Spinner />}
              </button>
            </div>
          </form>
        </div>
      }
    />
  );
};

export default TimeSpentOnProjectSiteFilterMenu;
