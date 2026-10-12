import { Manrope } from "next/font/google";
import { ReactNode } from "react";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const FormWrapper = ({
  heading,
  children,
}: {
  heading?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={`container-fluid ${manrope.className}`}
      style={{
        background: "#F1F6F7",
        borderRadius: "15px",
        padding: "25px 0px",
      }}
    >
      {heading && (
        <p
          className="text-center color-evaluation-dark-blue fw-bold py-2 fs24px"
          style={{
            background: "#E4EDEC",
            marginBottom: "25px",
          }}
        >
          {heading}
        </p>
      )}
      <div
        style={{
          padding: "0px 30px",
          margin: "0px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default FormWrapper;
