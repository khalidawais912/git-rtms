"use client";

import { GENERATE_REPORT_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import Spinner from "@/app/components/Spinner";
import apiClient, {
  AxiosError,
  ErrorResponse,
} from "@/app/services/api-client";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { toast } from "react-toastify";
import ToggleBetweenModals from "@/app/components/ToggleBetweenModals";
import DragableTable from "./PPTSlideGenerator/DragableTable/DragableTable";

export interface SectorItem {
  id: number;
  title: string;
}

const MasterReport = () => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [slidePath, setSlidePath] = useState<string>("");
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [mrStatus, setMRStatus] = useState<number[]>([]);
  const [sectorNames, setSectorNames] = useState<string[]>([]);
  const [sectors, setSectors] = useState<SectorItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectAllMRStatus, setSelectAllMRStatus] = useState(false);

  const masterReportStatues = [
    { label: "Gs No." },
    { label: "Project Name" },
    { label: "Cost" },
    { label: "Start Duration" },
    { label: "End Duration" },
    { label: "Visited By" },
    { label: "Physical Progress" },
    { label: "Date of Visit" },
    { label: "Sponsoring Dept." },
    { label: "Executing Dept." },
    { label: "Name of Contractor" },
    { label: "Name of RE" },
    { label: "No. of Critical" },
    { label: "No. of Average" },
    { label: "No. of Good" },
    { label: "MRI" },
    { label: "Rating (Color)" },
    { label: "Sector" },
    { label: "Stake Holder" },
  ];

  const handleSelectAllMRStatus = () => {
    if (selectAllMRStatus) {
      setMRStatus([]); // Unselect all
    } else {
      const allValues = masterReportStatues.map((_, i) => i); // [0, 1, 2, ...]
      setMRStatus(allValues); // Select all
    }
    setSelectAllMRStatus(!selectAllMRStatus); // Toggle state
  };

  const handleMRStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const isChecked = e.target.checked;

    setMRStatus((prev) =>
      isChecked ? [...prev, value] : prev.filter((v) => v !== value),
    );
  };

  const handleSectorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSectors((prev) => {
      let updated;
      if (e.target.checked) {
        const newItem = {
          id: prev.length + 1,
          title: value,
        };
        updated = [...prev, newItem];
      } else {
        updated = prev.filter((item) => item.title !== value);
      }

      setSelectAll(updated.length === sectorNames.length); // Update "Select All" state
      // Recalculate IDs dynamically based on current order
      return updated.map((item, index) => ({
        ...item,
        id: index + 1,
      }));
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSectors([]); // Unselect all
    } else {
      const allSectorObjects = sectorNames.map((title, index) => ({
        id: index + 1,
        title,
      }));
      setSectors(allSectorObjects); // Select all
    }
    setSelectAll(!selectAll); // Toggle state
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (mrStatus.length <= 0) {
      toast.error("Please Select Atleast one Priority!");
      return;
    }
    if (fromDate.length <= 0) {
      toast.error("Please select 'From Date'!");
      return;
    }
    if (toDate.length <= 0) {
      toast.error("Please select 'To Date'!");
      return;
    }
    if (sectors.length <= 0) {
      toast.error("Please select Atleast one Sector!");
      return;
    }
    console.log("fromDate", new Date(fromDate).toISOString().split("T")[0]);
    console.log("toDate", new Date(toDate).toISOString().split("T")[0]);
    console.log("response object", {
      mrStatus,
      toDate: new Date(toDate).toISOString().split("T")[0],
      fromDate: new Date(fromDate).toISOString().split("T")[0],
      sector: sectors.map((sector) => sector.title),
    });
    try {
      setSubmitting(true);
      const response = await apiClient.post(
        `${GENERATE_REPORT_API}/GeneratePowerPoint`,
        {
          pirority: mrStatus,
          to: new Date(toDate).toISOString().split("T")[0],
          from: new Date(fromDate).toISOString().split("T")[0],
          sector: sectors.map((sector) => sector.title),
        },
      );

      console.log(response);
      toast.success("PPT Generated Successfully");
      setSlidePath(
        process.env.NEXT_PUBLIC_BACKEND_API + "/" + response.data.data,
      );
    } catch (err) {
      setSubmitting(false);
      console.error("Submission error:", err);
      toast.error(
        (err as AxiosError<ErrorResponse>).response?.data.responseMessage ||
          (err as AxiosError<ErrorResponse>).message,
      );
    } finally {
      setSubmitting(false); // Always run after try/catch
    }
  };

  const getSectors = useCallback(async () => {
    if (mrStatus.length <= 0) {
      toast.info("Please Select Atleast one Master Report Status!");
      return;
    }
    if (fromDate.length <= 0) {
      toast.info("Please select 'From Date'!");
      return;
    }
    if (toDate.length <= 0) {
      toast.info("Please select 'To Date'!");
      return;
    }
    console.log("sectors async data: ", {
      pirority: mrStatus,
      to: new Date(toDate).toISOString().split("T")[0],
      from: new Date(fromDate).toISOString().split("T")[0],
      sector: [""],
    });
    try {
      const response = await apiClient.post(
        `${GENERATE_REPORT_API}/GetSectorAsync`,
        {
          pirority: mrStatus,
          to: new Date(toDate).toISOString().split("T")[0],
          from: new Date(fromDate).toISOString().split("T")[0],
          sector: [""],
        },
      );

      console.log(response);
      setSectorNames(response.data.data);
      toast.success("Sectors Obtained Successfully");
    } catch (err) {
      setSectorNames([]);
      console.error("Submission error:", err);
      toast.error(
        (err as AxiosError<ErrorResponse>).response?.data.responseMessage ||
          (err as AxiosError<ErrorResponse>).message,
      );
    }
  }, [mrStatus, fromDate, toDate]);

  useEffect(() => {
    setSelectAllMRStatus(mrStatus.length === masterReportStatues.length);
  }, [mrStatus]);

  // const getSectors = async () => {
  //   if (priority.length <= 0) {
  //     toast.info("Please Select Atleast one Priority!");
  //     return;
  //   }
  //   if (fromDate.length <= 0) {
  //     toast.info("Please select 'From Date'!");
  //     return;
  //   }
  //   if (toDate.length <= 0) {
  //     toast.info("Please select 'To Date'!");
  //     return;
  //   }
  //   console.log("sectors async data: ", {
  //     pirority: priority,
  //     to: new Date(toDate).toISOString().split("T")[0],
  //     from: new Date(fromDate).toISOString().split("T")[0],
  //     sector: [""],
  //   });
  //   try {
  //     const response = await apiClient.post(
  //       `${GENERATE_REPORT_API}/GetSectorAsync`,
  //       {
  //         pirority: priority,
  //         to: new Date(toDate).toISOString().split("T")[0],
  //         from: new Date(fromDate).toISOString().split("T")[0],
  //         sector: [""],
  //       }
  //     );

  //     console.log(response);
  //     setSectorNames(response.data.data);
  //     toast.success("Sectors Obtained Successfully");
  //   } catch (err) {
  //     setSectorNames([]);
  //     console.error("Submission error:", err);
  //     toast.error(
  //       (err as AxiosError<ErrorResponse>).response?.data.responseMessage ||
  //         (err as AxiosError<ErrorResponse>).message
  //     );
  //   }
  // };

  useEffect(() => {
    if (mrStatus.length > 0 || fromDate.length > 0 || toDate.length > 0)
      getSectors();
  }, [mrStatus, fromDate, toDate, getSectors]);

  useEffect(() => {
    if (slidePath) {
      window.open(slidePath, "_blank");
    }
  }, [slidePath]);

  const resetComponent = () => {
    setFromDate("");
    setToDate("");
    setSlidePath("");
    setSubmitting(false);
    setMRStatus([]);
    setSectorNames([]);
    setSectors([]);
    setSelectAll(false);
  };

  return (
    <CustomModal
      HeaderTopPos={0}
      HeaderRightPos={0}
      size="xl"
      modalId="ppt-modal"
      button={
        <Button
          onClick={resetComponent}
          className={`btn col-auto py-2 shadow-none mb-2 me-2 text-light`}
          style={{
            background: `#fcb103`,
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px",
          }}
        >
          Master Report
        </Button>
      }
      body={
        <div
          className="bg-white p-4"
          style={{
            borderRadius: "15px",
          }}
        >
          <h3 className="fw-bold text-center">Master Report</h3>

          <div className="row m-0 d-flex flex-wrap">
            <div
              className={`${
                sectors.length > 0 ? "col-lg-6" : "col-lg-12"
              } col-md-12 col-sm-12`}
            >
              <div className="col">
                <div className="row d-flex flex-wrap">
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
                <div className="row d-flex flex-wrap  m-0">
                  {masterReportStatues.map((status, i) => (
                    <div className="col-auto p-2" key={i}>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={i}
                          onChange={handleMRStatusChange}
                          checked={mrStatus.includes(i)}
                          id={status.label}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={status.label}
                        >
                          {status.label}
                        </label>
                      </div>
                    </div>
                  ))}
                  {/* <div className="col p-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="1"
                        onChange={handleMRStatusChange}
                        checked={mrStatus.includes(1)}
                        id="mediumCheck"
                      />
                      <label className="form-check-label" htmlFor="mediumCheck">
                        Medium
                      </label>
                    </div>
                  </div>
                  <div className="col p-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="2"
                        onChange={handleMRStatusChange}
                        checked={priority.includes(2)}
                        id="criticalCheck"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="criticalCheck"
                      >
                        Critical
                      </label>
                    </div>
                  </div> */}
                </div>
                <div className="col-auto d-flex justify-content-end">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      onChange={handleSelectAllMRStatus}
                      checked={selectAllMRStatus}
                      id="select-all"
                    />
                    <label className="form-check-label" htmlFor="select-all">
                      Select All
                    </label>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row m-0 justify-content-center">
                  <div className="col-auto">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn bg-color-sea-blue text-white"
                    >
                      Generate Report{" "}
                      {isSubmitting && <Spinner color="text-light" />}
                    </Button>
                  </div>
                  <div className="col-auto">
                    <Button
                      type="button"
                      className="btn btn-warning text-white"
                      onClick={resetComponent}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </form>
            </div>
            {sectors.length > 0 && (
              <div
                className="col-lg-6 col-md-12 col-sm-12"
                style={{ overflowY: "scroll", height: "600px" }}
              >
                <DragableTable sectors={sectors} setSectors={setSectors} />
              </div>
            )}
          </div>
        </div>
      }
    />
  );
};

export default MasterReport;
