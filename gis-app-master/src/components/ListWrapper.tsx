import { PropsWithChildren } from "react";

const ListWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={`container-fluid bg-white`}
      style={{
        border: "1.08px solid #CBD5E1",
        borderRadius: "15px",
      }}
    >
      {children}
    </div>
  );
};

export default ListWrapper;
