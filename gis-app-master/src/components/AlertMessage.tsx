import { PropsWithChildren } from "react";
import { BsExclamationTriangleFill } from "react-icons/bs";

interface Props {
  variant: "warning" | "danger";
}

const defaultMessages: Record<Props["variant"], string> = {
  warning: "No reports found.",
  danger: "Something went wrong, Please Try Again!",
};

const AlertMessage = ({ variant, children }: PropsWithChildren<Props>) => (
  <div
    className={`alert alert-${variant} d-flex align-items-center`}
    role="alert"
  >
    <BsExclamationTriangleFill size={24} className="me-2" />
    <div>{children ?? defaultMessages[variant]}</div>
  </div>
);

export default AlertMessage;
