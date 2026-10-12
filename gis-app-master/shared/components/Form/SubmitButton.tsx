import { PropsWithChildren, ReactNode } from "react";
import Button from "../Button";

interface Props {
  children: ReactNode;
  disabled?: boolean;
}

const SubmitButton = ({ children, disabled }: Props) => {
  return (
    <div className="col-lg-5 col-md-6 col-sm-4 mx-auto mt-3">
      <Button
        className="btn text-white w-100 border-0 fw-bold fs14px text-nowrap"
        style={{
          background: `${
            disabled
              ? "linear-gradient(to bottom, #8cbbde , #6e8799)"
              : "linear-gradient(to bottom, #0C8CE9 ,#074F83)"
          }`,
          borderRadius: "10px",
          padding: "11px 16px",
        }}
        disabled={disabled}
        type="submit"
      >
        {children}
      </Button>
    </div>
  );
};

export default SubmitButton;
