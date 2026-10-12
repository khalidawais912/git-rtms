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
import DragableTable from "./DragableTable/DragableTable";
import ToggleBetweenModals from "@/app/components/ToggleBetweenModals";

export interface SectorItem {
  id: number;
  title: string;
}

const PPTSlideGenerator = () => {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [slidePath, setSlidePath] = useState<string>("");
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [priority, setPriority] = useState<number[]>([]);
  const [sectorNames, setSectorNames] = useState<string[]>([]);
  const [sectors, setSectors] = useState<SectorItem[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handlePriorityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const isChecked = e.target.checked;

    setPriority((prev) =>
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

    if (priority.length <= 0) {
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
      priority,
      toDate: new Date(toDate).toISOString().split("T")[0],
      fromDate: new Date(fromDate).toISOString().split("T")[0],
      sector: sectors.map((sector) => sector.title),
    });
    try {
      setSubmitting(true);
      const response = await apiClient.post(
        `${GENERATE_REPORT_API}/GeneratePowerPoint`,
        {
          pirority: priority,
          toDate: new Date(toDate).toISOString().split("T")[0],
          fromDate: new Date(fromDate).toISOString().split("T")[0],
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
    if (priority.length <= 0) {
      toast.info("Please Select Atleast one Priority!");
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
      pirority: priority,
      toDate: new Date(toDate).toISOString().split("T")[0],
      fromDate: new Date(fromDate).toISOString().split("T")[0],
      sector: [""],
    });
    try {
      const response = await apiClient.post(
        `${GENERATE_REPORT_API}/GetSectorAsync`,
        {
          pirority: priority,
          toDate: new Date(toDate).toISOString().split("T")[0],
          fromDate: new Date(fromDate).toISOString().split("T")[0],
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
  }, [priority, fromDate, toDate]);

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
    if (priority.length > 0 || fromDate.length > 0 || toDate.length > 0)
      getSectors();
  }, [priority, fromDate, toDate, getSectors]);

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
    setPriority([]);
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
          className={`btn col-auto py-2 shadow-none mb-2 me-2 text-light text-nowrap`}
          style={{
            background: `#fcb103`,
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px",
          }}
        >
          Generate PPT Slide
        </Button>
      }
      body={
        <div
          className="bg-white p-4"
          style={{
            borderRadius: "15px",
          }}
        >
          <h3 className="fw-bold text-center">Generate PPT Slide</h3>
          <div className="row m-0 d-flex flex-wrap">
            <div
              className={`${
                sectors.length > 0 ? "col-lg-6" : "col-lg-12"
              } col-md-12 col-sm-12`}
            >
              <div className="col">
                <div className="d-flex flex-wrap m-0">
                  <div className="col p-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="0"
                        onChange={handlePriorityChange}
                        checked={priority.includes(0)}
                        id="averageCheck"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="averageCheck"
                      >
                        Average
                      </label>
                    </div>
                  </div>
                  <div className="col p-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="1"
                        onChange={handlePriorityChange}
                        checked={priority.includes(1)}
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
                        onChange={handlePriorityChange}
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
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
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
                {priority.length > 0 && sectorNames.length > 0 && (
                  <div className="col">
                    <div className="row justify-content-between m-0">
                      <div className="col-auto">
                        <h3 className="fw-bold m-0">Sectors</h3>
                      </div>
                      <div className="col-auto">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            onChange={handleSelectAllChange}
                            checked={selectAll}
                            id="select-all"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="select-all"
                          >
                            Select All
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap m-0">
                      {sectorNames?.map((sector, i) => (
                        <div key={i} className="col-auto p-2">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              value={sector}
                              onChange={handleSectorChange}
                              checked={sectors.some((s) => s.title === sector)}
                              id={sector}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={sector}
                            >
                              {sector}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="row m-0 justify-content-center">
                  <div className="col-auto">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn bg-color-sea-blue text-white"
                    >
                      Generate {isSubmitting && <Spinner color="text-light" />}
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

export default PPTSlideGenerator;
