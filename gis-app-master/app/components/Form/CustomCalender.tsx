import { getFormattedDate, fromLocalDateString } from "@/app/utils";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Calendar, CalendarProps } from "react-date-range";
import { createPortal } from "react-dom";
import { MdOutlineDateRange } from "react-icons/md";
import CustomInput from "./CustomInput";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Props extends Omit<CalendarProps, "date" | "onChange"> {
  value?: string | Date | null;
  onChange: (date: Date) => void;
}

const CustomCalendar = forwardRef<HTMLDivElement, Props>(
  ({ value, onChange, ...rest }, ref) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);

    // ✅ FIX: Handle undefined in parseValue
    const parseValue = (val: string | Date | null | undefined): Date | null => {
      if (!val) return null; // This handles null, undefined, and empty string
      if (val instanceof Date) return val;

      // If it's a YYYY-MM-DD string, create date at local midnight
      if (typeof val === "string") {
        return fromLocalDateString(val);
      }

      return null;
    };

    const selectedDate = parseValue(value);

    // Close on outside click
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          popupRef.current &&
          !popupRef.current.contains(e.target as Node) &&
          !inputRef.current?.contains(e.target as Node)
        ) {
          setShowCalendar(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    // Positioning for portal popup
    const getPopupStyle = () => {
      if (!inputRef.current) return {};
      const rect = inputRef.current.getBoundingClientRect();
      return {
        position: "absolute" as const,
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        zIndex: 99999,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      };
    };

    return (
      <div className="position-relative" ref={ref}>
        <CustomInput
          ref={inputRef}
          type="text"
          readOnly
          value={selectedDate ? getFormattedDate(selectedDate) : ""}
          onClick={() => setShowCalendar(!showCalendar)}
        />
        <div
          className="btn position-absolute rounded-3"
          style={{ top: 0, zIndex: 3, right: 5 }}
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <MdOutlineDateRange style={{ color: "#545861" }} />
        </div>
        {showCalendar &&
          createPortal(
            <div ref={popupRef} style={getPopupStyle()}>
              <Calendar
                date={selectedDate || new Date()}
                onChange={(date) => {
                  onChange(date);
                  setShowCalendar(false);
                }}
                {...rest}
              />
            </div>,
            document.body
          )}
      </div>
    );
  }
);

CustomCalendar.displayName = "CustomCalendar";

export default CustomCalendar;
