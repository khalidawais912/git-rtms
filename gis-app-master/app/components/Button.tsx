"use client";
import { motion } from "framer-motion";
import { CSSProperties, MouseEventHandler, ReactNode } from "react";

interface Props {
  type?: "button" | "submit" | "reset";
  style?: CSSProperties;
  className: string;
  onClick?: () => void;
  children?: ReactNode;
  id?: string;
  role?: string;
  disabled?: boolean;
  "data-bs-toggle"?: string;
  "data-bs-target"?: string;
  "data-bs-dismiss"?: string;
  "aria-label"?: string;
  "data-bs-placement"?: string;
  title?: string;
  onMouseEnter?: MouseEventHandler<HTMLButtonElement> | undefined;
  onMouseLeave?: MouseEventHandler<HTMLButtonElement> | undefined;
  onMouseDown?: MouseEventHandler<HTMLButtonElement> | undefined;
  onMouseUp?: MouseEventHandler<HTMLButtonElement> | undefined;
}

const Button = ({
  type = "button",
  style,
  className,
  onClick = () => {},
  children,
  id,
  role,
  disabled,
  "data-bs-toggle": dataBsToggle,
  "data-bs-target": dataBsTarget,
  "data-bs-dismiss": dataBsDismiss,
  "aria-label": ariaLabel,
  "data-bs-placement": dataBsPlacement,
  title,
  onMouseEnter = () => {},
  onMouseLeave = () => {},
}: Props) => {
  return (
    <motion.button
      whileTap={{ scale: 0.9, opacity: 1 }}
      whileHover={{ opacity: 0.9, transition: { duration: 0.3 } }}
      type={type}
      style={style}
      className={className}
      onClick={onClick}
      id={id}
      role={role}
      disabled={disabled}
      data-bs-toggle={dataBsToggle}
      data-bs-target={dataBsTarget}
      data-bs-dismiss={dataBsDismiss}
      aria-label={ariaLabel}
      data-bs-placement={dataBsPlacement}
      title={title}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.button>
  );
};

export default Button;
