import { LabelHTMLAttributes, ReactNode } from "react";

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  inputNode?: ReactNode;
}

const CustomLabel = ({ children, inputNode, ...rest }: Props) => {
  return (
    <label
      {...rest}
      className="form-label form-label-color-black fw-5 fs14px w-100"
      style={{ marginBottom: inputNode ? "0px" : "6px" }}
    >
      {inputNode ? (
        <span style={{ marginBottom: "6px", display: "inline-block" }}>
          {children}
        </span>
      ) : (
        children
      )}
      {inputNode && inputNode}
    </label>
  );
};

// 💡 Add this line to resolve the lint error
CustomLabel.displayName = "CustomLabel";

export default CustomLabel;
