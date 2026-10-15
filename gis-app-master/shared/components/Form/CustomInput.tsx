"use client";
import { forwardRef, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const CustomInput = forwardRef<HTMLInputElement, Props>(
  ({ className, style, ...rest }, ref) => {
    return (
      <input
        {...rest}
        ref={ref}
        className={`${
          className
            ? className
            : "custom-input form-control form-control-sm border-0 fs14px"
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

// 💡 Add this line to resolve the lint error
CustomInput.displayName = "CustomInput";

export default CustomInput;
