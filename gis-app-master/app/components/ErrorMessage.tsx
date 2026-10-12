import { PropsWithChildren } from "react";
import { IoTriangleSharp } from "react-icons/io5";
// import { MdErrorOutline } from "react-icons/md";

const ErrorMessage = ({ children }: PropsWithChildren) => {
  if (!children) return null;
  return (
    <>
      <IoTriangleSharp className="ms-3 text-danger" />
      <p
        className="bg-danger text-light rounded-3 text-center mb-0"
        style={{ marginTop: "-6px" }}
      >
        {children}
      </p>
    </>
  );
};

export default ErrorMessage;
