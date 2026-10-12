"use client";
import {
  animate,
  KeyframeOptions,
  useInView,
  useIsomorphicLayoutEffect,
} from "framer-motion";
import { useRef } from "react";

interface Props {
  from: number;
  to: number;
  animationOptions?: KeyframeOptions;
  showValueInDecimal?: boolean;
}

const AnimatedCounter = ({
  from,
  to,
  animationOptions,
  showValueInDecimal = false,
}: Props) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useIsomorphicLayoutEffect(() => {
    const element = ref.current;

    if (!element) return;
    if (!inView) return;

    if (window.matchMedia("(prefers-reduced-motion)").matches) {
      element.textContent = String(to);
      return;
    }

    element.textContent = String(from);

    const controls = animate(from, to, {
      duration: 2,
      ease: "easeOut",
      ...animationOptions,
      onUpdate(value) {
        element.textContent = value
          ? value?.toFixed(showValueInDecimal ? 2 : 0)
          : "0";
      },
    });
    return () => {
      controls.stop();
    };
  }, [ref, from, to, inView]);

  return <span ref={ref} />;
};

export default AnimatedCounter;
