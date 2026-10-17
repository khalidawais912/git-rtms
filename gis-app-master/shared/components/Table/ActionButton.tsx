import { FiPlus } from "react-icons/fi";
import Button from "../Button";
import { HiOutlineDotsVertical } from "react-icons/hi";

interface Props {
  method?: "POST" | "PUT" | "PATCH";
  onClick: () => void;
  name: string;
}

const ActionButton = ({ method, onClick, name }: Props) => {
  return (
    <Button
      type="button"
      className={`btn ${
        method === "POST"
          ? "rounded-pill text-white fs15px fw-bold"
          : "rounded-pill ps-3 pe-3 pt-1 pb-1"
      }`}
      onClick={onClick}
      style={{
        background: method === "POST" ? "#1C6BA6" : "rgba(255, 255, 255,.5)",
      }}
    >
      {method === "POST" ? (
        <div className="col">
          <div className="row align-items-center">
            <div className="col pe-0" style={{ paddingBottom: "2px" }}>
              <FiPlus size={21.6} />
            </div>
            <div className="col ps-1 text-nowrap">{name}</div>
          </div>
        </div>
      ) : (
        <HiOutlineDotsVertical size={26} style={{ color: "#475569" }} />
      )}
    </Button>
  );
};

export default ActionButton;
