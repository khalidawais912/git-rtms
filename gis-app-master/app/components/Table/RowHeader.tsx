import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  colSpan?: number;
}

const RowHeader = ({ children, className, colSpan }: Props) => {
  return (
    <th
      className={className + " align-middle"}
      scope="row"
      style={{
        padding: "7px 15px 7px 20px",
        color: "#475569",
      }}
      colSpan={colSpan}
    >
      {children}
    </th>
  );
};

export default RowHeader;
