import { formatDateTime } from "@/app/utils";
import profilePic3 from "@/public/icons/profilePic3.svg";
import Image from "next/image";
import { StaffTracking } from "./StaffTracking";

const StaffMemberInRecording = ({
  recordingData,
}: {
  recordingData: StaffTracking[];
}) => {
  return (
    <div className="col">
      <div
        className="p-2 mb-2 shadow"
        style={{
          borderRadius: "5px",
          border: "1px solid #fff",
          background: "rgba(255, 255, 255, 0.62)",
        }}
      >
        <div className="col">
          <div className="row d-flex flex-wrap m-0 ">
            <div className="col-auto">
              {recordingData[0]?.userPicture ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_BACKEND_API}${recordingData[0]?.userPicture}`}
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
            <div className="col-auto">
              <p
                className="fs-6 m-0 text-start text-wrap text-break fw-bold"
                style={{
                  fontWeight: 500,
                }}
              >
                {recordingData[0]?.userName}
              </p>
              <p
                className="fs11px mb-1 text-start text-wrap text-break fw-bold"
                style={{
                  fontWeight: 500,
                  color: "#2DA0F4",
                }}
              >
                {recordingData[0]?.designation}
              </p>
            </div>
            <div className="col-auto text-end">
              <p
                className="m-0 fs11px text-wrap text-break"
                style={{ color: "#0C8CE9" }}
              >
                {recordingData[0]?.districtName}{" "}
                <img src="/icons/locationBlueMini.svg" alt="locationBlueMini" />
              </p>
              <p className="m-0 fs11px text-wrap text-break">
                {recordingData[0]?.phoneNumber}{" "}
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
            <div className="col text-center">
              <p className="fs14px m-0 fw-normal">
                <span className="fw-bold">From:</span>{" "}
                {formatDateTime(recordingData[0]?.planStartDate, "date")}
              </p>
            </div>
            <div className="col-auto img-fluid">
              <img
                src="/icons/verticalLine.svg"
                alt="verticalLine"
                className="img-fluid"
                style={{ width: "100%", height: "20px" }}
              />
            </div>
            <div className="col text-center">
              <p className="fs14px m-0 fw-normal">
                <span className="fw-bold">To:</span>{" "}
                {formatDateTime(recordingData[0]?.planEndDate, "date")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffMemberInRecording;
