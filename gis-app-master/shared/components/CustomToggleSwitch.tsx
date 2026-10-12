import { useMemo } from "react";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  onColor?: string; // background color
  offColor?: string; // background color
  onHandleColor?: string; //thumb color
  offHandleColor?: string; //thumb color
  handleDiameter?: number; //thumb size
  id: string;
  width?: number; // optional width, defaults to calculated based on handleDiameter
  height?: number; // optional height, defaults to calculated based on handleDiameter
  disabled?: boolean;
}

const CustomToggleSwitch = ({
  checked,
  onChange,
  onColor = "rgba(12, 140, 233, 0.4)",
  offColor = "#BBC5CB",
  onHandleColor = "linear-gradient(to right, #0C8CE9 , #074F83)",
  offHandleColor = "#83898C",
  handleDiameter = 20,
  id,
  width = 40,
  height = 20,
  disabled = false,
}: Props) => {
  // Calculate dimensions based on handle diameter if not provided
  const switchWidth = width || handleDiameter * 2.2;
  const switchHeight = height || handleDiameter * 1.3;
  const handleOffset = (switchHeight - handleDiameter) / 2;
  const translateDistance = switchWidth - handleDiameter - handleOffset * 2;

  // Helper function to detect if a color is a gradient
  const isGradient = (color: string) => {
    return (
      color.includes("gradient") ||
      color.includes("linear-gradient") ||
      color.includes("radial-gradient")
    );
  };

  // Generate unique class names to avoid conflicts
  const uniqueId = `toggle-${id}`;

  const toggleStyles = useMemo(
    () => `
    .${uniqueId} {
      position: relative;
      display: inline-block;
      width: ${switchWidth}px;
      height: ${switchHeight}px;
    }

    .${uniqueId} .custom-toggle-input {
      opacity: 0;
      width: 0;
      height: 0;
      position: absolute;
    }

    .${uniqueId} .custom-toggle-slider {
      position: absolute;
      cursor: ${disabled ? "not-allowed" : "pointer"};
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${isGradient(offColor) ? offColor : `${offColor}`};
      transition: background 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: ${switchHeight}px;
      opacity: ${disabled ? 0.6 : 1};
    }

    /* OFF state thumb */
    .${uniqueId} .custom-toggle-slider:before {
      position: absolute;
      content: "";
      height: ${handleDiameter}px;
      width: ${handleDiameter}px;
      left: ${handleOffset}px;
      bottom: ${handleOffset}px;
      background: ${
        isGradient(offHandleColor) ? offHandleColor : `${offHandleColor}`
      };
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 50%;
      opacity: 1;
      z-index: 2;
    }

    /* ON state thumb */
    .${uniqueId} .custom-toggle-slider:after {
      position: absolute;
      content: "";
      height: ${handleDiameter}px;
      width: ${handleDiameter}px;
      left: ${handleOffset}px;
      bottom: ${handleOffset}px;
      background: ${
        isGradient(onHandleColor) ? onHandleColor : `${onHandleColor}`
      };
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 50%;
      opacity: 0;
      z-index: 1;
    }

    /* When checked - change background */
    .${uniqueId} .custom-toggle-input:checked + .custom-toggle-slider {
      background: ${isGradient(onColor) ? onColor : `${onColor}`};
    }

    /* When checked - move both thumbs and toggle their opacity */
    .${uniqueId} .custom-toggle-input:checked + .custom-toggle-slider:before {
      transform: translateX(${translateDistance}px);
      opacity: 0;
    }

    .${uniqueId} .custom-toggle-input:checked + .custom-toggle-slider:after {
      transform: translateX(${translateDistance}px);
      opacity: 1;
    }

    .${uniqueId} .custom-toggle-slider:hover:not(.disabled) {
      // box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .${uniqueId} .custom-toggle-input:focus + .custom-toggle-slider:not(.disabled) {
      // box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(59, 130, 246, 0.2);
      outline: none;
    }

    .${uniqueId} .custom-toggle-input:checked + .custom-toggle-slider:hover:not(.disabled) {
      // box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .${uniqueId} .custom-toggle-input:checked:focus + .custom-toggle-slider:not(.disabled) {
      // box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(16, 185, 129, 0.2);
    }

    /* Disabled state */
    .${uniqueId} .custom-toggle-slider.disabled {
      cursor: not-allowed;
    }
  `,
    [
      switchWidth,
      switchHeight,
      handleDiameter,
      handleOffset,
      translateDistance,
      offColor,
      onColor,
      offHandleColor,
      onHandleColor,
      disabled,
      uniqueId,
    ],
  );

  return (
    <>
      <style>{toggleStyles}</style>
      <label className={uniqueId} htmlFor={id}>
        <input
          className="custom-toggle-input"
          type="checkbox"
          id={id}
          name={id}
          checked={checked}
          onChange={(e) => {
            if (disabled) return;
            onChange(e.target.checked);
          }}
          disabled={disabled}
        />
        <span
          className={`custom-toggle-slider ${disabled ? "disabled" : ""}`}
        ></span>
      </label>
    </>
  );
};

export default CustomToggleSwitch;

