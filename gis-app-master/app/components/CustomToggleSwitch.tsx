import { useMemo } from "react";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  // onChange: () => void;
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

// Demo component to showcase the reusable toggle
// const ToggleDemo = () => {
//   const [toggle1, setToggle1] = useState(false);
//   const [toggle2, setToggle2] = useState(true);
//   const [toggle3, setToggle3] = useState(false);
//   const [toggle4, setToggle4] = useState(true);
//   const [toggle5, setToggle5] = useState(false);
//   const [toggle6, setToggle6] = useState(false);

//   return (
//     <div className="container p-4">
//       <h4 className="mb-4">Reusable Custom Toggle Switch Component</h4>

//       <div className="row g-4">
//         {/* Basic hex colors */}
//         <div className="col-md-6">
//           <div className="card p-3">
//             <h6>Basic Hex Colors</h6>
//             <div className="d-flex align-items-center gap-3">
//               <label className="form-label mb-0">Enable Feature:</label>
//               <CustomToggleSwitch
//                 id="toggle1"
//                 checked={toggle1}
//                 onChange={() => setToggle1(!toggle1)}
//                 onColor="#10b981"
//                 offColor="#e5e7eb"
//                 onHandleColor="#ffffff"
//                 offHandleColor="#6b7280"
//                 handleDiameter={20}
//               />
//             </div>
//           </div>
//         </div>

//         {/* RGBA colors */}
//         <div className="col-md-6">
//           <div className="card p-3">
//             <h6>RGBA Colors</h6>
//             <div className="d-flex align-items-center gap-3">
//               <label className="form-label mb-0">Dark Mode:</label>
//               <CustomToggleSwitch
//                 id="toggle2"
//                 checked={toggle2}
//                 onChange={() => setToggle2(!toggle2)}
//                 onColor="rgba(59, 130, 246, 0.9)"
//                 offColor="rgba(156, 163, 175, 0.5)"
//                 onHandleColor="rgba(255, 255, 255, 1)"
//                 offHandleColor="rgba(75, 85, 99, 1)"
//                 handleDiameter={18}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Linear gradients */}
//         <div className="col-md-6">
//           <div className="card p-3">
//             <h6>Linear Gradient Background</h6>
//             <div className="d-flex align-items-center gap-3">
//               <label className="form-label mb-0">Notifications:</label>
//               <CustomToggleSwitch
//                 id="toggle3"
//                 checked={toggle3}
//                 onChange={() => setToggle3(!toggle3)}
//                 onColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//                 offColor="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
//                 onHandleColor="#ffffff"
//                 offHandleColor="#ffffff"
//                 handleDiameter={22}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Gradient handles */}
//         <div className="col-md-6">
//           <div className="card p-3">
//             <h6>Gradient Handles</h6>
//             <div className="d-flex align-items-center gap-3">
//               <label className="form-label mb-0">Privacy:</label>
//               <CustomToggleSwitch
//                 id="toggle4"
//                 checked={toggle4}
//                 onChange={() => setToggle4(!toggle4)}
//                 onColor="#10b981"
//                 offColor="#ef4444"
//                 onHandleColor="linear-gradient(135deg, #fbbf24, #f59e0b)"
//                 offHandleColor="linear-gradient(135deg, #8b5cf6, #7c3aed)"
//                 handleDiameter={24}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Large size */}
//         <div className="col-md-6">
//           <div className="card p-3">
//             <h6>Large Size</h6>
//             <div className="d-flex align-items-center gap-3">
//               <label className="form-label mb-0">Auto Save:</label>
//               <CustomToggleSwitch
//                 id="toggle5"
//                 checked={toggle5}
//                 onChange={() => setToggle5(!toggle5)}
//                 onColor="linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
//                 offColor="#d1d5db"
//                 onHandleColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//                 offHandleColor="#9ca3af"
//                 handleDiameter={30}
//                 width={70}
//                 height={38}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Disabled state */}
//         <div className="col-md-6">
//           <div className="card p-3">
//             <h6>Disabled State</h6>
//             <div className="d-flex align-items-center gap-3">
//               <label className="form-label mb-0">Locked Feature:</label>
//               <CustomToggleSwitch
//                 id="toggle6"
//                 checked={toggle6}
//                 onChange={() => setToggle6(!toggle6)}
//                 onColor="#10b981"
//                 offColor="#e5e7eb"
//                 onHandleColor="#ffffff"
//                 offHandleColor="#6b7280"
//                 handleDiameter={20}
//                 disabled={true}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Usage Example */}
//       <div className="mt-4 p-3 bg-light rounded">
//         <h6>Usage Example:</h6>
//         <pre className="mb-0" style={{ fontSize: "12px" }}>
//           {`<CustomToggleSwitch
//   id="myToggle"
//   checked={isEnabled}
//   onChange={() => setIsEnabled(!isEnabled)}
//   onColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
//   offColor="#e5e7eb"
//   onHandleColor="#ffffff"
//   offHandleColor="linear-gradient(135deg, #8b5cf6, #7c3aed)"
//   handleDiameter={24}
//   width={60}  // optional
//   height={32} // optional
//   disabled={false} // optional
// />`}
//         </pre>
//       </div>
//     </div>
//   );
// };

// export default ToggleDemo;

// backup
// interface Props {
//   checked: boolean;
//   onChange: () => void;
//   onColor?: string; // background color
//   offColor?: string; // background color
//   onHandleColor?: string; //thumb color
//   offHandleColor?: string; //thumb color
//   handleDiameter?: number; //thumb size
//   id: string;
//   width?: number; // optional width, defaults to calculated based on handleDiameter
//   height?: number; // optional height, defaults to calculated based on handleDiameter
//   disabled?: boolean;
// }

// const CustomToggleSwitch = ({
//   checked,
//   onChange,
//   onColor = "rgba(12, 140, 233, 0.4)",
//   offColor = "#BBC5CB",
//   onHandleColor = "linear-gradient(to right, #0C8CE9 , #074F83)",
//   offHandleColor = "#83898C",
//   handleDiameter = 20,
//   id,
//   width = 40,
//   height = 20,
//   disabled = false,
// }: Props) => {
//   // Calculate dimensions based on handle diameter if not provided
//   const switchWidth = width || handleDiameter * 2.2;
//   const switchHeight = height || handleDiameter * 1.3;
//   const handleOffset = (switchHeight - handleDiameter) / 2;
//   const translateDistance = switchWidth - handleDiameter - handleOffset * 2;

//   // Helper function to detect if a color is a gradient
//   const isGradient = (color: string) => {
//     return (
//       color.includes("gradient") ||
//       color.includes("linear-gradient") ||
//       color.includes("radial-gradient")
//     );
//   };

//   // Generate unique class names to avoid conflicts
//   const uniqueId = `toggle-${id}`;

//   const toggleStyles = useMemo(
//     () => `
//     .${uniqueId} {
//       position: relative;
//       display: inline-block;
//       width: ${switchWidth}px;
//       height: ${switchHeight}px;
//     }

//     .${uniqueId} .custom-toggle-input {
//       opacity: 0;
//       width: 0;
//       height: 0;
//       position: absolute;
//     }

//     .${uniqueId} .custom-toggle-slider {
//       position: absolute;
//       cursor: ${disabled ? "not-allowed" : "pointer"};
//       top: 0;
//       left: 0;
//       right: 0;
//       bottom: 0;
//       background: ${isGradient(offColor) ? offColor : `${offColor}`};
//       transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//       border-radius: ${switchHeight}px;
//       // box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
//       opacity: ${disabled ? 0.6 : 1};
//     }

//     .${uniqueId} .custom-toggle-slider:before {
//       position: absolute;
//       content: "";
//       height: ${handleDiameter}px;
//       width: ${handleDiameter}px;
//       left: ${handleOffset}px;
//       bottom: ${handleOffset}px;
//       background: ${
//         isGradient(offHandleColor) ? offHandleColor : `${offHandleColor}`
//       };
//       transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//       border-radius: 50%;
//       // box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1);
//     }

//     .${uniqueId} .custom-toggle-input:checked + .custom-toggle-slider {
//       background: ${isGradient(onColor) ? onColor : `${onColor}`};
//     }

//     .${uniqueId} .custom-toggle-input:checked + .custom-toggle-slider:before {
//       transform: translateX(${translateDistance}px);
//       background: ${
//         isGradient(onHandleColor) ? onHandleColor : `${onHandleColor}`
//       };
//       // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25), 0 1px 4px rgba(0, 0, 0, 0.15);
//     }

//     .${uniqueId} .custom-toggle-slider:hover:not(.disabled) {
//       // box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(59, 130, 246, 0.1);
//     }

//     .${uniqueId} .custom-toggle-input:focus + .custom-toggle-slider:not(.disabled) {
//       // box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(59, 130, 246, 0.2);
//       outline: none;
//     }

//     .${uniqueId} .custom-toggle-input:checked + .custom-toggle-slider:hover:not(.disabled) {
//       // box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(16, 185, 129, 0.1);
//     }

//     .${uniqueId} .custom-toggle-input:checked:focus + .custom-toggle-slider:not(.disabled) {
//       // box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(16, 185, 129, 0.2);
//     }

//     /* Disabled state */
//     .${uniqueId} .custom-toggle-slider.disabled {
//       cursor: not-allowed;
//     }
//   `,
//     [
//       switchWidth,
//       switchHeight,
//       handleDiameter,
//       handleOffset,
//       translateDistance,
//       offColor,
//       onColor,
//       offHandleColor,
//       onHandleColor,
//       disabled,
//       uniqueId,
//     ]
//   );

//   return (
//     <>
//       <style>{toggleStyles}</style>
//       <label className={uniqueId} htmlFor={id}>
//         <input
//           className="custom-toggle-input"
//           type="checkbox"
//           id={id}
//           name={id}
//           checked={checked}
//           onChange={disabled ? undefined : onChange}
//           disabled={disabled}
//         />
//         <span
//           className={`custom-toggle-slider ${disabled ? "disabled" : ""}`}
//         ></span>
//       </label>
//     </>
//   );
// };

// export default CustomToggleSwitch;
