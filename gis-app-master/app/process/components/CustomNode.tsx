import { HiOutlineTrash } from "react-icons/hi";

const CustomNode = ({
  id,
  roleId,
  index,
  onDelete,
  roleName,
}: {
  id: string;
  roleId: number;
  index: number;
  onDelete: (id: string) => void;
  roleName: string;
}) => {
  return (
    <div className="position-relative">
      <button
        onClick={() => onDelete(id)}
        style={{
          position: "absolute",
          top: 0,
          right: -30,
          border: "none",
          borderRadius: "50%",
          background: "transparent",
          width: 20,
          height: 20,
          fontSize: 12,
          cursor: "pointer",
          lineHeight: 0,
        }}
      >
        <HiOutlineTrash style={{ color: "#8E9296" }} size={21} />
      </button>

      <div className="row p-3">
        <div
          className="col-auto fw-bold fs12px rounded-circle d-flex justify-content-center align-items-center text-dark"
          style={{ width: "40px", height: "40px", background: "#F2F7FA" }}
        >
          {index + 1}
        </div>
        <div className="col">
          <p className="mb-2 text-decoration-underline fw-normal text-start">
            {roleName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomNode;
