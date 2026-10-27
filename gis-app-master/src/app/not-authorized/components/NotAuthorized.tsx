import { PiWarningBold } from "react-icons/pi";
import BackButton from "./BackButton";
import HomeButton from "./HomeButton";

const NotAuthorized = () => {
  return (
    <div
      className={`container`}
      style={{
        position: "relative",
        zIndex: "2",
      }}
    >
      <div className="row d-flex justify-content-center">
        <div
          className="col"
          style={{
            position: "fixed",
            padding: "60px 50px",
            borderRadius: "25px",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <div className="d-flex justify-content-center mb-4">
            <div
              className="d-flex justify-content-center align-items-center rounded-circle"
              style={{
                width: "171px",
                height: "171px",
                background: "#FFF1F2",
              }}
            >
              <PiWarningBold size={85.5} style={{ color: "#AA3C31" }} />
            </div>
          </div>
          <h1
            className="fw-8 text-center"
            style={{ fontSize: "72px", marginBottom: "32px" }}
          >
            You have no Rights allowed!
          </h1>
          <p className="text-center fs-5 mb-5">
            Unfortunately, you dont have access please contact Admin.
          </p>
          <div className="row d-flex gap-2 justify-content-center">
            <BackButton />
            <HomeButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
