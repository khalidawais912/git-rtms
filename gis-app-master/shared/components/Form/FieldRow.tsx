import { PropsWithChildren } from "react";

const FieldRow = ({ children }: PropsWithChildren) => {
  return (
    <div className="row g-2 g-lg-3 mt-0" style={{ marginBottom: "5px" }}>
      {children}
    </div>
  );
};

export default FieldRow;
