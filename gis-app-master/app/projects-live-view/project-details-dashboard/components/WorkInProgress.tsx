import Button from "@/app/components/Button";
import Card from "./Card";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiGridFourBold } from "react-icons/pi";
import Image from "next/image";

const WorkInProgress = () => {
  return (
    <Card>
      <div
        className="row justify-content-between align-items-center"
        style={{ marginBottom: "7px" }}
      >
        <div className="col-auto">
          <p className="m-0 fs10px fw-bold text-white">Work in Progress</p>
        </div>
        <div className="col-auto">
          <div className="btn-group" role="group" aria-label="Basic example">
            <Button
              className="btn rounded-end rounded-pill text-white d-flex align-items-center justify-content-center"
              style={{
                background: "#141518",
                border: ".43px solid #1D1F25",
                padding: "8px", // smaller vertical padding
                lineHeight: 1, // makes height tight
              }}
            >
              <GiHamburgerMenu style={{ padding: "2px 1px" }} size={16} />{" "}
              {/* increased icon size */}
            </Button>
            <Button
              className="btn rounded-start rounded-pill text-white d-flex align-items-center justify-content-center"
              style={{
                background: "#141518",
                border: ".43px solid #1D1F25",
                padding: "8px",
                lineHeight: 1,
              }}
            >
              <PiGridFourBold style={{ padding: "2px 1px" }} size={16} />
            </Button>
          </div>
        </div>
      </div>
      <div className="row d-flex" style={{ gap: "7px", marginBottom: "7px" }}>
        <div className="col p-0">
          <div className="position-relative">
            <div
              className="col-auto p-0 overflow-hidden"
              style={{ borderRadius: "5px", height: "82px" }}
            >
              <Image
                className="img-fluid w-100 h-100"
                style={{
                  objectFit: "cover",
                  objectPosition: "center", // ✅ ensures content is centered
                }}
                src="/images/observationImage.png"
                alt="observationImage"
                width={167}
                height={94}
              />
            </div>

            {/* Text overlay */}
            <div
              className="position-absolute text-white"
              style={{
                bottom: "5px",
                left: "0",
                textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                fontWeight: "600",
                zIndex: 2,
              }}
            >
              <p className="fw-normal fs5px m-0" style={{ paddingLeft: "6px" }}>
                Water Accumulation at Site
              </p>
            </div>

            {/* Gradient overlay */}
            <div
              className="position-absolute w-100 bottom-0"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
                borderBottomRightRadius: "5px",
                borderBottomLeftRadius: "5px",
                height: "28px",
              }}
            ></div>
          </div>
        </div>
        <div className="col p-0">
          <div className="position-relative">
            <div
              className="col-auto p-0 overflow-hidden"
              style={{ borderRadius: "5px", height: "82px" }}
            >
              <Image
                className="img-fluid w-100 h-100"
                style={{
                  objectFit: "cover",
                  objectPosition: "center", // ✅ ensures content is centered
                }}
                src="/images/observationImage.png"
                alt="observationImage"
                width={167}
                height={94}
              />
            </div>

            {/* Text overlay */}
            <div
              className="position-absolute text-white"
              style={{
                bottom: "5px",
                left: "0",
                textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                fontWeight: "600",
                zIndex: 2,
              }}
            >
              <p className="fw-normal fs5px m-0" style={{ paddingLeft: "6px" }}>
                Water Accumulation at Site
              </p>
            </div>

            {/* Gradient overlay */}
            <div
              className="position-absolute w-100 bottom-0"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
                borderBottomRightRadius: "5px",
                borderBottomLeftRadius: "5px",
                height: "28px",
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="row d-flex" style={{ gap: "7px" }}>
        <div className="col p-0">
          <div className="position-relative">
            <div
              className="col-auto p-0 overflow-hidden"
              style={{ borderRadius: "5px", height: "82px" }}
            >
              <Image
                className="img-fluid w-100 h-100"
                style={{
                  objectFit: "cover",
                  objectPosition: "center", // ✅ ensures content is centered
                }}
                src="/images/observationImage.png"
                alt="observationImage"
                width={167}
                height={94}
              />
            </div>

            {/* Text overlay */}
            <div
              className="position-absolute text-white"
              style={{
                bottom: "5px",
                left: "0",
                textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                fontWeight: "600",
                zIndex: 2,
              }}
            >
              <p className="fw-normal fs5px m-0" style={{ paddingLeft: "6px" }}>
                Water Accumulation at Site
              </p>
            </div>

            {/* Gradient overlay */}
            <div
              className="position-absolute w-100 bottom-0"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
                borderBottomRightRadius: "5px",
                borderBottomLeftRadius: "5px",
                height: "28px",
              }}
            ></div>
          </div>
        </div>
        <div className="col p-0">
          <div className="position-relative">
            <div
              className="col-auto p-0 overflow-hidden"
              style={{ borderRadius: "5px", height: "82px" }}
            >
              <Image
                className="img-fluid w-100 h-100"
                style={{
                  objectFit: "cover",
                  objectPosition: "center", // ✅ ensures content is centered
                }}
                src="/images/observationImage.png"
                alt="observationImage"
                width={167}
                height={94}
              />
            </div>

            {/* Text overlay */}
            <div
              className="position-absolute text-white"
              style={{
                bottom: "5px",
                left: "0",
                textShadow: "0 2px 4px rgba(0,0,0,0.6)",
                fontWeight: "600",
                zIndex: 2,
              }}
            >
              <p className="fw-normal fs5px m-0" style={{ paddingLeft: "6px" }}>
                Water Accumulation at Site
              </p>
            </div>

            {/* Gradient overlay */}
            <div
              className="position-absolute w-100 bottom-0"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))",
                borderBottomRightRadius: "5px",
                borderBottomLeftRadius: "5px",
                height: "28px",
              }}
            ></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WorkInProgress;
