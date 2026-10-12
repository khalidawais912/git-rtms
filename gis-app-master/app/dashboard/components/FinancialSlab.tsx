import AnimatedCounter from "@/app/components/AnimatedCounter";

interface Props {
  projectCategory: string;
  initialLimitLabel: string;
  endLimitLabel: string;
  value: number;
}
const FinancialSlab = ({
  projectCategory,
  initialLimitLabel,
  endLimitLabel,
  value,
}: Props) => {
  return (
    <div className="table-responsive">
      <table
        className="table table-borderless mb-1 fs14px fw-normal"
        style={{
          background: "rgba(235, 239, 253, 0.33)",
          borderRadius: "6px",
        }}
      >
        <tbody>
          <tr>
            <td
              className="text-start"
              style={{
                background: "rgba(235, 239, 253, 0.33)",
                borderTopRightRadius: "6px",
                borderBottomRightRadius: "6px",
                width: "20%",
              }}
            >
              {projectCategory}
            </td>
            <td
              style={{
                background: "#EBEFFD",
                borderTopLeftRadius: "6px",
                borderBottomLeftRadius: "6px",
                width: "27%",
              }}
            >
              {initialLimitLabel}
            </td>
            <td
              style={{
                background: "#EBEFFD",
                width: "5%",
              }}
            >
              -
            </td>
            <td
              style={{
                background: "#EBEFFD",
                borderTopRightRadius: "6px",
                borderBottomRightRadius: "6px",
                width: "28%",
              }}
            >
              {endLimitLabel}
            </td>
            <td
              className="text-end"
              style={{
                background: "rgba(235, 239, 253, 0.33)",
                borderTopRightRadius: "6px",
                borderBottomRightRadius: "6px",
                width: "20%",
              }}
            >
              <AnimatedCounter from={0} to={value} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FinancialSlab;
