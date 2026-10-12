import { PropsWithChildren } from "react";

const Card = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="col"
      style={{
        background: "#1D1F25",
        padding: "7px 14px",
        borderRadius: "9px",
      }}
    >
      {children}
    </div>
  );
};

export default Card;
