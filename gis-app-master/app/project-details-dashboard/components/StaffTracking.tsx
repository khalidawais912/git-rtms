import Image from "next/image";
// import profilePic3 from "../../../public/images/profilePic3.png";
import Button from "@/app/components/Button";
import { addDayToFormattedDate, getFormattedDate } from "@/app/utils";
import locationBlueMini from "@/public/icons/locationBlueMini.svg";
import profilePic3 from "@/public/icons/profilePic3.svg";
import Link from "next/link";
import { StaffTrackings } from "./ProjectDetailsDashboard";

interface Props {
  data: StaffTrackings[];
}

const StaffTracking = ({ data }: Props) => {
  // const items = ["a", "a", "a", "a", "a", "a"];
  // const items2 = ["a", "a", "a", "a", "a", "a"];

  // const refContainer1 = useRef<HTMLDivElement>(null);
  // const refContent1 = useRef<HTMLDivElement>(null);
  // const [constraints1, setConstraints1] = useState({});

  // useEffect(() => {
  //   // Wait until both container and content are rendered
  //   if (refContainer1.current && refContent1.current) {
  //     // Calculate the width difference between container and content
  //     const containerHeight = refContainer1.current.offsetHeight;
  //     const contentHeight = refContent1.current.scrollHeight;
  //     // Set drag constraints dynamically based on the difference
  //     setConstraints1({ bottom: 0, top: -(contentHeight - containerHeight) });
  //   }
  // }, []); // Recalculate if the items change

  // const refContainer2 = useRef<HTMLDivElement>(null);
  // const refContent2 = useRef<HTMLDivElement>(null);
  // const [constraints2, setConstraints2] = useState({});

  // useEffect(() => {
  //   // Wait until both container and content are rendered
  //   if (refContainer2.current && refContent2.current) {
  //     // Calculate the width difference between container and content
  //     const containerHeight = refContainer2.current.offsetHeight;
  //     const contentHeight = refContent2.current.scrollHeight;
  //     // Set drag constraints dynamically based on the difference
  //     setConstraints2({ bottom: 0, top: -(contentHeight - containerHeight) });
  //   }
  // }, []); // Recalculate if the items change

  return (
    <div
      className="col shadow-sm mb-3 ms-2 me-2"
      style={{ background: "#C6D9F1", borderRadius: "15px", fontSize: ".9rem" }}
    >
      <div
        className="col"
        style={{
          borderBottom: "1px dashed #97ABBD",
          marginRight: "35px",
          marginLeft: "35px",
          marginBottom: "15px",
          paddingTop: "20px",
        }}
      >
        <div className="row d-flex mb-1">
          <div className="col">
            <h4 className="fw-bold mt-2">Staff Tracking</h4>
          </div>
          <div className="col text-end">
            <Link href="/staff-tracking" className="btn p-0">
              <img
                src="/icons/linkArrowBlack.svg"
                className="img-fluid"
                style={{ width: "15px", height: "15px" }}
                alt="linkArrowBlack"
              />
            </Link>
          </div>
        </div>
      </div>
      <div
        className="col p-4 pt-0 pb-2 text-nowrap"
        style={{
          overflow: "hidden",
          overflowX: "scroll",
        }}
      >
        {data.map((d) => (
          <Button
            key={d.userId}
            className="col w-100 btn p-2 shadow me-2"
            style={{
              borderRadius: "5px",
              border: "1px solid #fff",
              background: "rgba(255, 255, 255, 0.62)",
            }}
          >
            <div className="col">
              <div className="row d-flex">
                <div className="col-auto">
                  {d.userPicture && d.userPicture.length > 0 ? (
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
                <div className="col ps-0">
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
                    <Image src={locationBlueMini} alt="locationBlueMini" />
                  </p>
                  <p className="m-0 fs11px text-wrap text-break">
                    {d?.phoneNumber} <img src="/icons/phone3.svg" alt="phone" />
                  </p>
                </div>
              </div>
              <p
                className="fs-6 m-0 fw-bold text-center"
                style={{ color: "#7A889C" }}
              >
                Visit Plan
              </p>
              <div className="row d-flex justify-content-between m-0">
                <div className="col">
                  <p className="fs14px m-0 fw-normal">
                    <span className="fw-bold">From:</span>{" "}
                    {new Date(d.planStartDate).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="col p-0">
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
                    {new Date(d.planEndDate).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default StaffTracking;
