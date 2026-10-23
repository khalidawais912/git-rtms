import React, { useState } from "react";

const CustomToggleSwitchSample = () => {
  const [isMultiSelect, setMultiSelect] = useState(false);

  const toggleStyles = `
    .custom-toggle-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .custom-toggle-wrapper {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 28px;
    }

    .custom-toggle-input {
      opacity: 0;
      width: 0;
      height: 0;
      position: absolute;
    }

    .custom-toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
      transition: all 0.3s ease;
      border-radius: 28px;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .custom-toggle-slider:before {
      position: absolute;
      content: "";
      height: 22px;
      width: 22px;
      left: 3px;
      bottom: 3px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8, #1e40af);
      transition: all 0.3s ease;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .custom-toggle-input:checked + .custom-toggle-slider {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .custom-toggle-input:checked + .custom-toggle-slider:before {
      transform: translateX(32px);
      background: linear-gradient(135deg, #ffffff, #f8fafc);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25), 0 1px 4px rgba(0, 0, 0, 0.15);
    }

    .custom-toggle-slider:hover {
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .custom-toggle-input:focus + .custom-toggle-slider {
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(59, 130, 246, 0.2);
    }

    .custom-toggle-input:checked + .custom-toggle-slider:hover {
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .custom-toggle-input:checked:focus + .custom-toggle-slider {
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(16, 185, 129, 0.2);
    }

    /* Animation enhancement */
    .custom-toggle-slider:before {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .custom-toggle-input:checked + .custom-toggle-slider:before {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Label styling to match your existing design */
    .form-label-color-black {
      color: #000;
    }

    .fw-5 {
      font-weight: 500;
    }

    .fs14px {
      font-size: 14px;
    }
  `;

  return (
    <div className="p-4">
      <style>{toggleStyles}</style>

      <div className="custom-toggle-container">
        <label
          className="form-label form-label-color-black fw-5 fs14px"
          htmlFor="multiselect"
        >
          Is Multi Select
        </label>

        <label className="custom-toggle-wrapper" htmlFor="multiselect">
          <input
            className="custom-toggle-input"
            type="checkbox"
            id="multiselect"
            name="multiselect"
            checked={isMultiSelect}
            onChange={() => setMultiSelect(!isMultiSelect)}
          />
          <span className="custom-toggle-slider"></span>
        </label>
      </div>

      {/* Demo section to show different states */}
      <div className="mt-4">
        <h5>Current State: {isMultiSelect ? "ON" : "OFF"}</h5>
        <p className="text-muted">
          Click the toggle to see the gradient animation!
        </p>
      </div>

      {/* Additional toggle examples with different colors */}
      <div className="mt-4">
        <h6>Color Variations:</h6>
        <div className="d-flex gap-3 align-items-center flex-wrap">
          {/* Purple variant */}
          <div>
            <style>{`
              .purple-toggle .custom-toggle-slider:before {
                background: linear-gradient(135deg, #8b5cf6, #7c3aed, #6d28d9);
              }
              .purple-toggle .custom-toggle-input:checked + .custom-toggle-slider {
                background: linear-gradient(135deg, #a855f7, #9333ea);
              }
            `}</style>
            <div className="purple-toggle">
              <label className="custom-toggle-wrapper">
                <input className="custom-toggle-input" type="checkbox" />
                <span className="custom-toggle-slider"></span>
              </label>
            </div>
            <small className="d-block text-center mt-1">Purple</small>
          </div>

          {/* Orange variant */}
          <div>
            <style>{`
              .orange-toggle .custom-toggle-slider:before {
                background: linear-gradient(135deg, #f97316, #ea580c, #dc2626);
              }
              .orange-toggle .custom-toggle-input:checked + .custom-toggle-slider {
                background: linear-gradient(135deg, #fb923c, #f97316);
              }
            `}</style>
            <div className="orange-toggle">
              <label className="custom-toggle-wrapper">
                <input className="custom-toggle-input" type="checkbox" />
                <span className="custom-toggle-slider"></span>
              </label>
            </div>
            <small className="d-block text-center mt-1">Orange</small>
          </div>

          {/* Pink variant */}
          <div>
            <style>{`
              .pink-toggle .custom-toggle-slider:before {
                background: linear-gradient(135deg, #ec4899, #db2777, #be185d);
              }
              .pink-toggle .custom-toggle-input:checked + .custom-toggle-slider {
                background: linear-gradient(135deg, #f472b6, #ec4899);
              }
            `}</style>
            <div className="pink-toggle">
              <label className="custom-toggle-wrapper">
                <input className="custom-toggle-input" type="checkbox" />
                <span className="custom-toggle-slider"></span>
              </label>
            </div>
            <small className="d-block text-center mt-1">Pink</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomToggleSwitchSample;
