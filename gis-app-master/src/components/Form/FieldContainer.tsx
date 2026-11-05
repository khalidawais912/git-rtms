import { PropsWithChildren } from "react";

const FieldContainer = ({ children }: PropsWithChildren) => {
  return (
    <div
      className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 text-start mt-0"
      style={{ marginBottom: "10px", padding: "0px 10px" }}
    >
      {children}
    </div>
  );
};

export default FieldContainer;
