import { ReactNode } from "react";

interface Props {
  head: ReactNode;
  children: ReactNode;
}

const Card = ({ head, children }: Props) => {
  return (
    <div
      className="bg-white"
      style={{
        borderRadius: "15px",
        boxShadow: "0px 0px 0px 1px #E5E7EB",
      }}
    >
      <div style={{ padding: "15px 20px" }}>{head}</div>
      <div style={{ padding: "8px 10px" }}>{children}</div>
    </div>
  );
};

export default Card;
