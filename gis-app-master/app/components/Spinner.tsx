import React from "react";

interface Props {
  color?:
    | "text-primary"
    | "text-secondary"
    | "text-success"
    | "text-danger"
    | "text-warning"
    | "text-info"
    | "text-light"
    | "text-dark";
}

const Spinner = ({ color = "text-primary" }: Props) => {
  return (
    <div
      className={`spinner-border ${color} border-2`}
      style={{ width: "18px", height: "18px" }}
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Spinner;
