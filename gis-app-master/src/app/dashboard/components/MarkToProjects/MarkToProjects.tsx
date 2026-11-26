import { MARK_TO_EVALUATION_API } from "@/services/endpoints";
import DeleteModal from "@/components/DeleteModal";
import Actions from "@/components/Table/Actions";
import TableData from "@/components/Table/TableData";
import TableHeading from "@/components/Table/TableHeading";
import apiClient, { AxiosError } from "@/services/client";
import { BaseResponse, ErrorResponse } from "@/services/types";
import { useEffect, useState } from "react";
import { PiCircleFill } from "react-icons/pi";
import { toast } from "react-toastify";
import Form from "./Form";
import axios from "axios";
import CustomModal from "@/components/CustomModal/CustomModal";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MarkEvaluationProject } from "../../types";
import { dateTime } from "@/app/report-history/reportFiles";
import DownloadDropDown from "@/components/DownloadDropDown/DownloadDropDown";
import { exportToPDFNew } from "@/utils";
import { exportToExcelNewOne } from "@/utils/exportToExcel";

const TITLE = "Mark to Evaluation Projects";

/** The table's columns, for the PDF and Excel downloads */
const EXPORT_COLUMNS = [
  { header: "ID", dataKey: "id" },
  { header: "Project ID", dataKey: "projectId" },
  { header: "Project Name", dataKey: "projectName" },
  { header: "Marked Date", dataKey: "markedDate" },
  { header: "PCI Cost", dataKey: "pciCost" },
  { header: "Utilization", dataKey: "utilization" },
  { header: "Physical Progress", dataKey: "physicalProgress" },
  { header: "Total Monitoring Visit", dataKey: "totalMonitoringVisit" },
  { header: "Request for PCIV", dataKey: "requestForPCIV" },
  { header: "Letter of Request PCIV", dataKey: "letterofRequestPCIV" },
  { header: "Request for PCIV Date", dataKey: "requestForPCIVDate" },
  { header: "Submitted PCIV Date", dataKey: "submittedPCIVDate" },
] as const;

type ExportRow = Record<(typeof EXPORT_COLUMNS)[number]["dataKey"], string | number>;

const exportRows = (data: MarkEvaluationProject[]): ExportRow[] =>
  data.map((d) => ({
    id: d.id,
    projectId: d.projectId,
    projectName: d.projectName?.trim() ?? "",
    markedDate: d.createdAt ? dateTime(d.createdAt) : "",
    pciCost: d.pciCost ?? "",
    utilization: d.utilization ?? "",
    physicalProgress: d.physicalProgress ?? "",
    totalMonitoringVisit: d.totalMonitoringVisit ?? "",
    requestForPCIV: d.requestForPCIV ? "Yes" : "",
    letterofRequestPCIV: d.letterofRequestPCIV ?? "",
    requestForPCIVDate: d.requestForPCIVDate ?? "",
    submittedPCIVDate: d.submittedPCIVDate ?? "",
  }));
interface Props {
  role: string;
}

const MarkToProjects = ({ role }: Props) => {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [data, setData] = useState<MarkEvaluationProject[]>();

  useEffect(() => {
    const controller = new AbortController();

    const handleSubmit = async () => {
      try {
        const response = await apiClient.get<
          BaseResponse<MarkEvaluationProject[]>
        >(MARK_TO_EVALUATION_API, {
          signal: controller.signal,
        });
        setData(response.data.data);
      } catch (error) {
        // Ignore errors triggered by intentional controller.abort()
        if (axios.isCancel(error)) {
          return;
        }
        // Handle actual network or API errors here
        console.error("Failed to fetch projects:", error);
      }
    };

    handleSubmit();

    return () => controller.abort();
  }, [refresh]);


  const handleDelete = async (id: number) => {
    try {
      const response = await apiClient.delete<ErrorResponse>(
        `${MARK_TO_EVALUATION_API}/${id}`,
      );
      toast.success(response.data.responseMessage);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.error("err", err);
      toast.error(
        (err as AxiosError<ErrorResponse>).response?.data.responseMessage ||
          "Please try again later!",
      );
    }
  };

  return (
    <div
      className={`w-100 bg-white`}
      style={{
        borderRadius: "14px",
        marginTop: "0px",
        border: "1px solid #CBD5E1",
      }}
    >
      <div
        className="row d-flex align-items-center m-0"
        style={{ padding: "17.33px 26px" }}
      >
        <div className="col p-0">
          <div className="row align-items-center">
            <div className="col-auto mb-1 mb-lg-0">
              <h4 className="m-0" style={{ fontWeight: 800 }}>
                Mark to Evaluation Projects
              </h4>
            </div>
            <div className="col-auto mb-2 mb-lg-0">
              <span
                className="badge rounded-pill fs13px fw-6"
                style={{ color: "#1C6BA6", border: "1.08px solid #1C6BA6" }}
              >
                <div className="row align-items-center">
                  <div className="col-auto pe-0">
                    <PiCircleFill
                      size={8}
                      style={{ color: "#1C6BA6", marginBottom: "2px" }}
                    />
                  </div>
                  <div className="col ps-1">
                    {data?.length} Mark to Evaluation Projects
                  </div>
                </div>
              </span>
            </div>
          </div>
        </div>
        {/* Leaves room for the modal's close button on the right */}
        {!!data?.length && (
          <div className="col-auto p-0" style={{ marginRight: 48 }}>
            <DownloadDropDown
              onClickPdf={() => exportToPDFNew([...EXPORT_COLUMNS], exportRows(data), new Date(), TITLE)}
              onClickExcel={() => exportToExcelNewOne([...EXPORT_COLUMNS], exportRows(data), TITLE)}
            />
          </div>
        )}
      </div>
      <div
        className="table-responsive mb-2"
        style={{
          height: "calc(100vh - 135px)",
          overflow: "auto",
        }}
      >
        <table className="table table-hover mb-0">
          <thead>
            <tr
              className="position-sticky top-0 bg-white"
              style={{ zIndex: 3 }}
            >
              <TableHeading name="ID" />
              <TableHeading name="PROJECT ID" />
              <TableHeading name="PROJECT NAME" />
              <TableHeading name="MARKED DATE" />
              <TableHeading name="PCI COST" />
              <TableHeading name="UTILIZATION" />
              <TableHeading name="PHYSICAL PROGRESS" />
              <TableHeading name="TOTAL MONITORING VISIT" />
              <TableHeading name="REQUEST FOR PCIV" />
              <TableHeading name={"letter of Request PCIV".toUpperCase()} />
              <TableHeading name={"request For PCIV Date".toUpperCase()} />
              <TableHeading name={"submitted PCIV Date".toUpperCase()} />
              <TableHeading name="ACTIONS" />
            </tr>
          </thead>
          <tbody>
            {data?.map((d) => (
              <tr key={d.id}>
                <TableData>{d.id}</TableData>
                <TableData>{d.projectId}</TableData>
                <TableData>{d.projectName}</TableData>
                {/* createdAt: when the project was marked to evaluation */}
                <TableData className="text-nowrap">{d.createdAt ? dateTime(d.createdAt) : "–"}</TableData>
                <TableData>{d.pciCost}</TableData>
                <TableData>{d.utilization}</TableData>
                <TableData>{d.physicalProgress}</TableData>
                <TableData>{d.totalMonitoringVisit}</TableData>
                <TableData>{d.requestForPCIV}</TableData>
                <TableData>{d.letterofRequestPCIV}</TableData>
                <TableData>{d.requestForPCIVDate}</TableData>
                <TableData>{d.submittedPCIVDate}</TableData>
                <TableData>
                  {role.toLowerCase() === "director" && (
                    <Actions
                      deleteNode={
                        <DeleteModal handleDelete={handleDelete} id={d.id} />
                      }
                    />
                  )}

                  {role.toLowerCase() === "deputy director" && (
                    <Actions
                      formNode={
                        <CustomModal
                          button={
                            <HiOutlineDotsVertical
                              size={26}
                              style={{ color: "#475569" }}
                            />
                          }
                          body={<Form setRefresh={setRefresh} id={d.id} />}
                          modalId={d.id + "form"}
                        />
                      }
                    />
                  )}
                </TableData>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarkToProjects;
