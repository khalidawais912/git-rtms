"use client";
import Button from "@/components/Button";
import { FiPlus } from "react-icons/fi";
import Form from "./Form";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useAttributes } from "@/features/attributes";
import { REPORT_API } from "@/services/endpoints";
import { toast } from "react-toastify";
import apiClient, { AxiosError } from "@/services/client";
import { ReportTab } from "../types";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader/Loader";

const MasterReport = () => {
  const [show, setShow] = useState(false);
  const { data: attributes } = useAttributes();
  const [tabs, setTabs] = useState<ReportTab[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [, setRefreshTabs] = useState(false);

  useEffect(() => {
    const handleSubmit = async () => {
      setLoading(true);

      try {
        const response = await apiClient.get(REPORT_API + "/GetALL");
        if (response.status === 404) {
          toast.error(response.data);
        }
        setTabs(response.data);
        setLoading(false);
      } catch (err) {
        console.error((err as AxiosError).message);
        toast.error((err as AxiosError).message);
        setLoading(false);
      }
    };
    handleSubmit();
  }, []);

  useEffect(() => {
    if (!isLoading && tabs.length > 0) {
      router.push("/report-analysis/list");
    }
  }, [isLoading, tabs, router]);

  return (
    <div
      className="p-3 bg-white"
      style={{
        border: "1px solid #E2E4E5",
        borderRadius: "10px",
        height: "calc(100vh - 125px)",
      }}
    >
      <p className="fs22px">Report Analysis</p>
      {isLoading ? (
        <Loader />
      ) : tabs.length === 0 ? (
        <div
          className="col-xl-5 col-lg-7 col-md-8 col-sm-12 col-12 text-center"
          style={{
            position: "fixed",
            padding: "60px 50px",
            borderRadius: "25px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <Button className="btn" onClick={handleShow}>
            <div>
              <FiPlus size={24} />
            </div>
            <p className="fs14px fw-5 mb-1 ">No Master Report</p>
            <p className="fs12px mb-1 " style={{ color: "#595959" }}>
              There is no master report. Click on icon to create your first
              master report.
            </p>
          </Button>
          <Modal show={show} onHide={handleClose} fullscreen={true}>
            <Modal.Body>
              <Form
                setRefreshTabs={setRefreshTabs}
                handleClose={handleClose}
                attributes={attributes}
                show={show}
              />
            </Modal.Body>
          </Modal>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default MasterReport;

