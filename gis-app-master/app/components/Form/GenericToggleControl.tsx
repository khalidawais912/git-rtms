"use client";

import AnimatedSwap from "@/app/components/AnimatedSwap";
import Spinner from "@/app/components/Spinner";
import { useId, useState } from "react";

export type ControlType = "switch" | "checkbox" | "radio";

interface BaseProps {
  title?: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => Promise<void>;
  controlType?: ControlType;
  /** Required for radio groups to bind option values */
  name?: string;
  /** Optional custom CSS classes for the container */
  className?: string;
  disabled?: boolean;
}

const GenericToggleControl = ({
  title,
  description,
  checked,
  onCheckedChange,
  controlType = "switch",
  name,
  className = "",
  disabled,
}: BaseProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const elementId = useId();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isSubmitting) return;

    const nextChecked = e.target.checked;

    try {
      setIsSubmitting(true);
      await onCheckedChange(nextChecked);
    } catch (error) {
      console.error("Toggle action failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to render the appropriate Bootstrap markup
  const renderControlElement = () => {
    switch (controlType) {
      case "switch":
        return (
          <div className="">
            <input
              id={elementId}
              className="form-check-input ms-0 cursor-pointer"
              type="checkbox"
              role="switch"
              checked={checked}
              onChange={handleChange}
              disabled={isSubmitting || disabled}
            />
          </div>
        );

      case "radio":
        return (
          <div className="">
            <input
              id={elementId}
              name={name}
              className="form-check-input ms-0 cursor-pointer"
              type="radio"
              checked={checked}
              onChange={handleChange}
              disabled={isSubmitting || disabled}
            />
          </div>
        );

      case "checkbox":
      default:
        return (
          <div className="">
            <input
              id={elementId}
              className="form-check-input ms-0 cursor-pointer"
              type="checkbox"
              checked={checked}
              onChange={handleChange}
              disabled={isSubmitting || disabled}
            />
          </div>
        );
    }
  };

  return (
    <div
      className={`d-flex justify-content-between align-items-center flex-wrap gap-2 ${className}`}
    >
      <div>
        <label
          htmlFor={elementId}
          className="fw-semibold mb-0 d-block cursor-pointer user-select-none"
        >
          {title}
        </label>

        {description && (
          <small className="text-muted d-block user-select-none">
            {description}
          </small>
        )}
      </div>

      <AnimatedSwap
        isLoading={isSubmitting}
        loadingContent={<Spinner />}
        content={renderControlElement()}
      />
    </div>
  );
};

export default GenericToggleControl;
