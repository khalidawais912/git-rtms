import { TextareaHTMLAttributes, forwardRef } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

const CustomTextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ className, style, ...rest }, ref) => {
    return (
      <textarea
        {...rest}
        className={`custom-input form-control form-control-sm border-0 fs14px ${
          className || ""
        }`}
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          padding: "10px 12px",
          borderRadius: "7px",
          color: "#545861",
          fontWeight: 500,
          boxShadow: "0 0 0 1.5px #eff0f2",
          ...style,
        }}
      />
    );
  }
);

CustomTextArea.displayName = "CustomTextArea";

export default CustomTextArea;
