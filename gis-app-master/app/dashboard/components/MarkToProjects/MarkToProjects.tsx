import { MARK_TO_EVALUATION_API } from "@/app/APIs";
import DeleteModal from "@/app/components/DeleteModal";
import Actions from "@/app/components/Table/Actions";
import TableData from "@/app/components/Table/TableData";
import TableHeading from "@/app/components/Table/TableHeading";
import apiClient, {
  AxiosError,
  BaseResponse,
  ErrorResponse,
} from "@/app/services/api-client";
import { SetStateAction, useEffect, useState } from "react";
import { PiCircleFill } from "react-icons/pi";
import { toast } from "react-toastify";
import Form from "./Form";
import axios from "axios";
import CustomModal from "@/app/components/CustomModal/CustomModal";
import { HiOutlineDotsVertical } from "react-icons/hi";

interface MarkEvaluationProject {
  id: number;
  projectId: number;
  projectName: string;
  pciCost: number;
  utilization: number;
  physicalProgress: number;
  totalMonitoringVisit: number;
  requestForPCIV: false;
  letterofRequestPCIV: string;
  requestForPCIVDate: string;
  submittedPCIVDate: string;
  createdAt: string;
  updatedAt: string;
}

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

  const handleUpdate = async (projectId: number) => {
    // const response = await apiClient.put(MARK_TO_EVALUATION_API, {
    //   id: projectId,
    //   requestForPCIV: true,
    //   letterofRequestPCIV: "string",
    //   requestForPCIVDate: "2026-10-01T07:29:11.146Z",
    //   submittedPCIVDate: "2026-10-01T07:29:11.146Z",
    // });
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await apiClient.delete<ErrorResponse>(
        `${MARK_TO_EVALUATION_API}/${id}`,
      );
      console.log("response", response);
      toast.success(response.data.responseMessage);
      setRefresh((prev) => !prev);
    } catch (err) {
      console.log("err", err);
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
