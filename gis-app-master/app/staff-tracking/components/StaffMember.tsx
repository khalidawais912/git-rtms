import { STAFF_TRACKING_API } from "@/app/APIs";
import Button from "@/app/components/Button";
import apiClient from "@/app/services/api-client";
import { formatDateTime } from "@/app/utils";
import profilePic3 from "@/public/icons/profilePic3.svg";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import userAdd from "../../../public/icons/userAdd.svg";
import {
  getCurrentDate,
  StaffTracking,
  TrackingRequestData,
} from "./StaffTracking";

interface Props {
  setLiveTrackingRequestBody: Dispatch<SetStateAction<TrackingRequestData>>;
  setMapStatus: React.Dispatch<React.SetStateAction<boolean>>;
  getStaffWithCoordinates: (
    trackingRequestBody: TrackingRequestData
  ) => Promise<void>;
}

const StaffMember = ({ setLiveTrackingRequestBody, setMapStatus }: Props) => {
  const [data, setData] = useState<StaffTracking[]>();

  const getStaffWithCoordinates = async (
    trackingRequestBody: TrackingRequestData
  ) => {
    try {
      const response = await apiClient.post(
        STAFF_TRACKING_API,
        trackingRequestBody
      );
      if (response.data.data) {
        setData(response.data.data);
      } else {
        console.log("Something bad happend");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  };

  useEffect(() => {
    getStaffWithCoordinates({ userId: 0, visitId: 0, date: getCurrentDate() });
  }, []);

  return (
    <>
      <div>
        <Toaster />
      </div>
      <div
        className="col mb-3 ms-2 me-2"
        style={{ borderRadius: "15px", fontSize: ".9rem" }}
      >
        <div
          className="col"
          style={{
            marginRight: "10px",
            marginLeft: "10px",
            marginBottom: "15px",
            paddingTop: "20px",
          }}
        >
          <div className="row d-flex mb-1">
            <div className="col">
              <h4 className="fw-bold fs18px mt-2">Officers</h4>
            </div>
            <div className="col text-end">
              <Button
                className="btn rounded-pill fs14px color-sea-blue fw-normal"
                style={{
                  padding: "10px 20px 10px 20px",
                  background: "#E0EEFC",
                }}
                onClick={() => {
                  getStaffWithCoordinates({
                    userId: 0,
                    visitId: 0,
                    date: getCurrentDate(), //remember to set current date
                  });
                  setLiveTrackingRequestBody({
                    userId: 0,
                    visitId: 0,
                    date: getCurrentDate(), //remember to set current date
                  });
                  setMapStatus(false);
                }}
              >
                View All&nbsp;
                <Image src={userAdd} alt="userAdd" />
              </Button>
            </div>
          </div>
        </div>
        <div
          className="row d-flex p-4 pt-3 pb-2 m-0 bg-color-matte-light-blue shadow-sm"
          style={{ borderRadius: "10px" }}
        >
          {data && (
            <div
              className="col"
              style={{
                height: "760px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                overflowY: "scroll",
              }}
            >
              {data.map((d) => (
                <Button
                  key={d.userId}
                  className="btn w-100 row d-flex p-2 mb-2 shadow"
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #fff",
                    background: "rgba(255, 255, 255, 0.62)",
                  }}
                  onClick={() => {
                    getStaffWithCoordinates({
                      userId: parseInt(d.userId),
                      visitId: 0,
                      date: getCurrentDate(), //remember to set current date
                    });
                    setLiveTrackingRequestBody({
                      userId: parseInt(d.userId),
                      visitId: 0,
                      date: getCurrentDate(), //remember to set current date
                    });
                    setMapStatus(false);
                  }}
                >
                  <div className="col">
                    <div className="row d-flex">
                      <div className="col-lg-3 col-md-3 col-sm-12 ps-0">
                        {d.userPicture ? (
                          <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_API}${d.userPicture}`}
                            className="mb-1 img-fluid rounded-circle shadow"
                            style={{
                              objectFit: "cover",
                              objectPosition: "center top",
                              width: "70px",
                              height: "70px",
                            }}
                            alt="staffMember"
                          />
                        ) : (
                          <Image
                            src={profilePic3}
                            className="mb-1 img-fluid rounded-circle shadow"
                            width={70}
                            height={70}
                            alt="profilePic3"
                          />
                        )}
                      </div>
                      <div className="col-lg-5 col-md-6 col-sm-12 ps-0">
                        <p
                          className="fs-6 m-0 text-start text-wrap text-break fw-bold"
                          style={{
                            fontWeight: 500,
                          }}
                        >
                          {d.userName}
                        </p>
                        <p
                          className="fs11px mb-1 text-start text-wrap text-break fw-bold"
                          style={{
                            fontWeight: 500,
                            color: "#2DA0F4",
                          }}
                        >
                          {d.designation}
                        </p>
                      </div>
                      <div className="col text-end">
                        <p
                          className="m-0 fs11px text-wrap text-break"
                          style={{ color: "#0C8CE9" }}
                        >
                          {d.districtName}{" "}
                          <img
                            src="/icons/locationBlueMini.svg"
                            alt="locationBlueMini"
                          />
                        </p>
                        <p className="m-0 fs11px text-wrap text-break">
                          {d?.phoneNumber}{" "}
                          <img src="/icons/phone3.svg" alt="phone" />
                        </p>
                      </div>
                    </div>
                    <p
                      className="fs-6 m-0 fw-bold text-center"
                      style={{ color: "#7A889C" }}
                    >
                      Visit Plan
                    </p>
                    <div className="row d-flex justify-content-end m-0">
                      <div className="col">
                        <p className="fs14px m-0 fw-normal">
                          <span className="fw-bold">From:</span>{" "}
                          {formatDateTime(d.planStartDate, "date")}
                        </p>
                      </div>
                      <div className="col-1 p-0 img-fluid">
                        <img
                          src="/icons/verticalLine.svg"
                          alt="verticalLine"
                          className="img-fluid"
                          style={{ width: "100%", height: "20px" }}
                        />
                      </div>
                      <div className="col">
                        <p className="fs14px m-0 fw-normal">
                          <span className="fw-bold">To:</span>{" "}
                          {formatDateTime(d.planEndDate, "date")}
                        </p>
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StaffMember;
