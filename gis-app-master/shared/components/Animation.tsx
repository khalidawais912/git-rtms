"use client";
import { motion, useAnimation, useInView, Variants } from "framer-motion";
import { CSSProperties, ReactNode, useEffect, useRef } from "react";

interface Props {
  initialXPosition?: number;
  initialYPosition?: number;
  className?: string;
  children: ReactNode;
  animationType?:
    | "linear"
    | "easeIn"
    | "easeOut"
    | "circIn"
    | "circOut"
    | "circInOut"
    | "backIn"
    | "backOut"
    | "backInOut"
    | "anticipate"
    | [number, number, number, number];
  style?: CSSProperties;
  duration?: number;
  delay?: number;
  isBubble?: boolean;
  repeatOnView?: boolean;
  trigger?: boolean; // 👈 NEW
}

const Animation = ({
  initialXPosition = 0,
  initialYPosition = 0,
  className,
  children,
  animationType = "easeIn",
  style,
  duration = 0.8,
  delay = 0,
  isBubble = false,
  repeatOnView = false,
  trigger,
}: Props) => {
  const ref = useRef(null);
  const controls = useAnimation();
  const inView = useInView(ref, { amount: 0.2, once: !repeatOnView });

  useEffect(() => {
    if (trigger) {
      controls.start("visible");
    } else if (repeatOnView) {
      controls.start("hidden");
    }
  }, [trigger, controls, repeatOnView]);

  useEffect(() => {
    if (inView && !trigger) controls.start("visible");
  }, [inView, controls, trigger]);

  const boxVariant: Variants = {
    hidden: { opacity: 0, x: initialXPosition, y: initialYPosition },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: animationType },
    },
  };

  const bubbleVariant: Variants = {
    hidden: { opacity: 0, scale: 1 },
    visible: {
      opacity: 1,
      scale: [0.7, 1, 0.9, 1],
      transition: { duration, delay, ease: "easeOut" },
    },
  };

  return (
    <div
      style={{
        overflow: "hidden",
        display: "inline-block",
        width: "100%",
      }}
    >
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={isBubble ? bubbleVariant : boxVariant}
        className={className}
        style={{
          ...style,
          willChange: "transform, opacity",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Animation;
