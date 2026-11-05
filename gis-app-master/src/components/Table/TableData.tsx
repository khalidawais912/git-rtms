import { CSSProperties, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  className?: string;
  colSpan?: number;
  style?: CSSProperties;
}

const TableData = ({ children, className, colSpan, style }: Props) => {
  const defaultStyle: CSSProperties = {
    padding: "8px 15px 8px 20px",
    color: "#475569",
  };
  return (
    <td
      className={`fs15px fw-5 align-middle ${className || ""}`}
      style={{ ...defaultStyle, ...style }}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
};
export default TableData;
