import { format } from "date-fns";
import { useState } from "react";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css"; // Main style file
import "react-date-range/dist/theme/default.css"; // Theme CSS

// Define the type of the range state
interface RangeType {
  startDate: Date | undefined;
  endDate: Date | undefined;
  key: string;
}

const DateRangeFilter = () => {
  const [state, setState] = useState<RangeType[]>([
    {
      startDate: undefined, // Initially no start date selected
      endDate: undefined, // Initially no end date selected
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: RangeKeyDict) => {
    const { selection } = ranges;
    console.log(selection.startDate);
    console.log(selection.endDate);
    setState([
      {
        startDate: selection.startDate, // Assign directly; already Date | undefined
        endDate: selection.endDate, // Assign directly; already Date | undefined
        key: selection.key || "selection",
      },
    ]);
  };

  const clearDateSelection = () => {
    setState([
      {
        startDate: undefined,
        endDate: undefined,
        key: "selection",
      },
    ]);
  };

  return (
    <div>
      <DateRange
        ranges={state}
        onChange={handleSelect}
        moveRangeOnFirstSelection={false}
        maxDate={new Date()} // Optional: Restrict future dates
        dateDisplayFormat="dd/MM/yyyy"
      />
      <p>
        Selected Range:{" "}
        {state[0].startDate
          ? format(state[0].startDate, "EEE-d-MMM-yyyy")
          : "No start date"}{" "}
        to{" "}
        {state[0].endDate
          ? format(state[0].endDate, "EEE-d-MMM-yyyy")
          : "No end date"}
      </p>
      <button
        onClick={clearDateSelection}
        style={{
          padding: "10px 15px",
          background: "#ff5c5c",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Clear Dates
      </button>
    </div>
  );
};

export default DateRangeFilter;
